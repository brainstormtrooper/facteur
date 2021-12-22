/* eslint-disable camelcase */
imports.gi.versions.Gtk = '3.0';
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
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
    class Facteur extends Gtk.Application {
      _init() {
        this.ID = 'com.github.brainstormtrooper.facteur';
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
        this.connect('filename_changed', () => {
          try {
            let path = appData.get('FILENAME');
            if (path.length > 32) {
              path = '...' + path.slice(-32);
            }
            this._window.get_titlebar().set_subtitle(path);
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
          Results.sentLabel.set_text(Results.defSentStr);
          Results.sendButton.set_sensitive(true);
        });
      }


      vfunc_activate() {
        this._window.present();
      }

      vfunc_startup() {
        super.vfunc_startup();
        appData.set('ID', this.ID);
        this._buildUI();
      }

      vfunc_shutdown() {
        // this._destroyUI();
        // TODO: see what cleanup needs to be done and create function
        super.vfunc_shutdown();
      }

      updateUI() {
        Settings._updateUI();
        Mailing._updateUI();
        Contents._updateUI();
      }

      // Build the application's UI
      _buildUI() {
        // Create the application window
        this._window = new Gtk.ApplicationWindow({
          application: this,
          title: 'Facteur',
          default_height: 200,
          default_width: 400,
          window_position: Gtk.WindowPosition.CENTER,
        });

        this._window.set_events('GDK_ENTER_NOTIFY_MASK');
        this._window.add_events('GDK_LEAVE_NOTIFY_MASK');

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

        this._Hbox.pack_start(this._stack_switcher, true, true, 0);
        this._Vbox.pack_start(this._Hbox, false, false, 0);
        this._Vbox.pack_start(this._Stack, true, true, 0);

        // Show the vbox widget
        this._window.add(this._Vbox);

        // Show the window and all child widgets
        this._window.show_all();
      }
    },
);
