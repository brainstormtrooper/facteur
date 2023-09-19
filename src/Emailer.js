/* eslint-disable camelcase */
imports.gi.versions.Gtk = '4.0';
const Adw = imports.gi.Adw;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const Gdk = imports.gi.Gdk;
const GObject = imports.gi.GObject;
const Gettext = imports.gettext;
const time = imports.lib.time;
// import the panels
const Menubar = new imports.UI.Menubar.Menubar();
const Results = new imports.UI.Results.UIresults();
const Settings = new imports.UI.Settings.UIsettings();
const Mailing = new imports.UI.Mailing.UImailing();
const Contents = new imports.UI.Contents.UIcontents();

// import the app data singleton to hold persitant data
const appData = new imports.object.Data.Data();

var Facteur = GObject.registerClass( // eslint-disable-line
    {
      GTypeName: 'Facteur',
      Signals: {
        'Logger': {
          param_types: [GObject.TYPE_STRING],
        },
        'update_ui': {
          param_types: [GObject.TYPE_BOOLEAN],
        },
        'update_attachments': {
          param_types: [GObject.TYPE_BOOLEAN],
        },
        'filename_changed': {
          param_types: [GObject.TYPE_BOOLEAN],
        },
        'Sent': {
          param_types: [GObject.TYPE_BOOLEAN],
        },
        'dataChanged': {
          param_types: [GObject.TYPE_BOOLEAN],
        },
      },
    },
    class Facteur extends Adw.Application {
      _init () {
        this.ID = 'io.github.brainstormtrooper.facteur';
        super._init({
          application_id: this.ID,
          flags: Gio.ApplicationFlags.HANDLES_OPEN,
        });
        GLib.set_prgname(this.application_id);
        GLib.set_application_name('Facteur');
        
        /*
        Signals
        */

        this.connect('update_ui', () => {
          try {
            this.updateUI();
          } catch (e) {
            logError(e);
          }
        });
        this.connect('update_attachments', () => {
          Contents.updateAttachments();
        });
        this.connect('filename_changed', () => {
          try {
            let path = appData.get('FILENAME');
            if (path.length > 32) {
              path = '...' + path.slice(-32);
            }
            const widget = this._window.get_titlebar().get_title_widget().get_first_child().get_next_sibling();
            widget.set_label(path);
          } catch (e) {
            logError(e);
          }
        });

        this.connect('Logger', (obj, msg) => {
          Results._LOG(msg);
        });

        this.connect('Sent', () => {
          Results.sendButton.set_sensitive(false);
          // eslint-disable-next-line max-len
          const labelStr = Gettext.gettext('Sent on') + ': ' + time.humanDate(appData.get('SENT'));
          Results.sentLabel.set_text(labelStr);
        });

        this.connect('dataChanged', () => {
          if (Results.sentLabel) {
            Results.sentLabel.set_text(Results.defSentStr);
            Results.sendButton.set_sensitive(true);
          }
        });
      }


      vfunc_activate () {
        // Create the application window
        
        this._window.present();
      }

      vfunc_startup () {
        super.vfunc_startup();
        appData.set('ID', this.ID);
        this._buildUI();
      }

      vfunc_shutdown () {
        // this._destroyUI();
        // TODO: see what cleanup needs to be done and create function
        super.vfunc_shutdown();
      }

      updateUI () {
        Settings._updateUI();
        Mailing._updateUI();
        Contents._updateUI();
        Menubar._updateUI();
      }

      // Build the application's UI
      _buildUI () {
        this._window = new Gtk.ApplicationWindow({
          application: this,
          title: 'Facteur',
          default_height: 400,
          default_width: 600
        });
        

        //
        // CSS
        //
        try {
          
          let css_provider = Gtk.CssProvider.new();
          css_provider.load_from_resource('/io/github/brainstormtrooper/facteur/facteur.css');
          // const context = new Gtk.StyleContext();
          const display = Gdk.Display.get_default();
          Gtk.StyleContext.add_provider_for_display(display, css_provider, Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION);

        } catch (error) {
          log(error);
        }

        //
        // menu bar
        //

        this._window.set_titlebar(Menubar.getHeader(this));


        /*
        CONTENT PANELS
        */

        this._Stack = new Gtk.Stack();

        // eslint-disable-next-line max-len
        this._Stack.set_transition_type(Gtk.StackTransitionType.SLIDE_LEFT_RIGHT);
        this._Stack.set_transition_duration(1000);

        //
        // 1. Settings
        //

        // eslint-disable-next-line max-len
        this._Stack.add_titled(Settings._buildUI(), 'settings', Gettext.gettext('Settings'));

        //
        // 2. Recipients
        //

        // eslint-disable-next-line max-len
        this._Stack.add_titled(Mailing._buildUI(), 'recipients', Gettext.gettext('Recipients'));


        //
        // 3. Contents
        //

        // eslint-disable-next-line max-len
        this._Stack.add_titled(Contents._buildUI(), 'contents', Gettext.gettext('Contents'));


        //
        // 4. Results...
        //

        // eslint-disable-next-line max-len
        this._Stack.add_titled(Results._buildUI(), 'Results', Gettext.gettext('Results'));


        /*
        SWITCHER
        */

        this._stack_switcher = new Gtk.StackSwitcher();
        this._stack_switcher.set_stack(this._Stack);


        // Vbox to hold the switcher and stack.
        this._Vbox = new Gtk.Box(
            { orientation: Gtk.Orientation.VERTICAL, spacing: 6 },
        );
        this._Hbox = new Gtk.Box(
            // eslint-disable-next-line max-len
            { orientation: Gtk.Orientation.HORIZONTAL, spacing: 6, homogeneous: true },
        );

        // UI._buildStack();

        this._Hbox.prepend(this._stack_switcher);
        this._Vbox.prepend(this._Hbox);
        this._Vbox.prepend(this._Stack);

        // Show the vbox widget
        this._window.set_child(this._Vbox);

        // Show the window and all child widgets
        this._window.present();
      }
    },
);
