const Gtk = imports.gi.Gtk;
const Gio = imports.gi.Gio;
const Settings = imports.UI.Settings;
// const Config = imports.lib.settings;
const Connection = imports.object.Settings;
const Gettext = imports.gettext;
const GObject = imports.gi.GObject;
const Config = new imports.object.Settings.Settings();

// const file = Gio.File.new_for_path('data/simpleModal.ui');
// const [, template] = file.load_contents(null);

var SimpleModal = GObject.registerClass( // eslint-disable-line
{
  GTypeName: 'SimpleModal',
  Template: 'resource:///io/github/brainstormtrooper/facteur/simpleModal.ui',
  // Children: [],
  InternalChildren: ['dialog_content_area', 'dialog_action_area']
},
class SimpleModal extends Gtk.Window {
  _init (props) {
    super._init();
    // this.settings = new Settings.UIsettings();
    try {
      this.set_transient_for(props.transient_for);
      // this._dialog_box.append(new Gtk.Label({label: 'Here'}));
      this._dialog_action_area.default_height = 24;
      // this._dialog_box.visible = true;
    } catch (error) {
      throw (error);
    }
    
  }
});

var UImodal = GObject.registerClass( // eslint-disable-line
    {
      GTypeName: 'UImodal',
    },
    class UImodal extends GObject.Object {
      _init () {
        super._init();
        // this.settings = new Settings.UIsettings();
      }

      doModal(props) {
        try {
          this._dialog = new SimpleModal({
            transient_for: props.window,
            modal: true,
            title: props.title,
          });
          const _contentArea = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 6 });
          this._message = new Gtk.Label(
              // eslint-disable-next-line max-len
              { label: props.label },
          );
          // _contentArea.append(props.content);
          
          const _OKHandler = () => {
            // Destroy the dialog
            this._dialog.destroy();
          };
  
          this._saveHandler = props.saveHandler;
  
          if (this._saveHandler) {
            this.saveButton = new Gtk.Button({ label: Gettext.gettext('Save'), hexpand: true });
            this.saveButton.connect('clicked', this._saveHandler.bind(this));
            this._dialog._dialog_action_area.append(this.saveButton);
          }
  
          this.cancelButton = new Gtk.Button({ label: Gettext.gettext('cancel'), hexpand: true  });
          
          this._dialog._dialog_action_area.append(this.cancelButton);

          // log(this._dialog._dialog_contet_area.get_first_child());

          this.cancelButton.connect('clicked', _OKHandler.bind(this));
          this._dialog._dialog_content_area.append(props.content);
          // this._dialog._dialog_box.get_first_child().show();
          this._dialog.present();
          
        } catch (error) {
          logError(error);
          throw(error);
        }
        

      }

      editConnection(settings, connId) {


        const _saveHandler = () => {
          const myConnection = new Connection.Settings();
          const CONN = myConnection.saveConnection(settings, connId);
          
          settings.App.emit('update_ui', true);
          this._dialog.destroy()
        };


        const props = {
          title: 'Edit Connection',
          label: 'Please configure your connectoin here.',
          content: settings._buildNewConnection(connId),
          window: settings.App._window,
          saveHandler: _saveHandler
        };

        this.doModal(props);
        
      }

      newConnection (settings) {
        try {

          const _saveHandler = () => {
            const myConnection = new Connection.Settings();
            const CONN = myConnection.saveConnection(settings);
            
            settings.App.emit('update_ui', true);
            this._dialog.destroy()
          };

          const props = {
            title: 'New Connection',
            label: 'Please configure your connectoin here.',
            content: settings._buildNewConnection(),
            window: settings.App._window,
            saveHandler: _saveHandler
          };
  
          this.doModal(props);
          
        } catch (error) {
          logError(error);
          throw(error);
        }
        
      };



      showOpenModal (title, message, app = null) {
        const window = (app ? app._window : null);

        const label = new Gtk.Label({
          label: message,
          vexpand: true,
        });

        const modal = new Gtk.Dialog({
          default_height: 150,
          default_width: 200,
          modal: true,
          transient_for: window,
          title,
          use_header_bar: false,
        });

        modal.connect('response', function () {
          modal.destroy();
        });

        const contentArea = modal.get_content_area();
        contentArea.add(label);

        const button = Gtk.Button.new_with_label('OK');
        button.connect('clicked', () => {
          modal.destroy();
        });

        const actionArea = modal.get_action_area();
        actionArea.add(button);

        modal.show_all();
      }

      /*
      config (app) {
        const window = (app ? app._window : null);
        // Create the dialog
        this._dialog = new Gtk.Dialog({
          transient_for: window,
          modal: true,
          title: 'App settings',
        });

        // Create the dialog's content area, which contains a message
        this._contentArea = this._dialog.get_content_area();
        this._message = new Gtk.Label(
            // eslint-disable-next-line max-len
            { label: 'Please configure your preferences here.' },
        );
        this.settings = new Settings.UIsettings();

        this.configFields = this.settings._buildModal();
        
        
        this._contentArea.append(this._message);
        this._contentArea.append(this.configFields);
        // Handlers for button actions
        const _OKHandler = () => {
          app.emit('update_ui', true);
          // Destroy the dialog
          this._dialog.destroy();
        };

        const _saveHandler = () => {
          let ipv4 = false;
          ipv4 = this.settings.defIpv4Field.get_active();
          Config.setIpv4(ipv4);
          Config.setDelay(this.settings.defDelayField.get_text());
          app.emit('update_ui', true);
          // Destroy the dialog
          this._dialog.destroy();
        };

        // Create the dialog's action area, which contains a stock OK button
        // this._actionArea = this._dialog.action_area;
        this.cancelButton = new Gtk.Button({ label: Gettext.gettext('Cancel') });
        this._dialog.add_action_widget(this.cancelButton, 'GTK_RESPONSE_CANCEL_EVENT');
        this.saveButton = new Gtk.Button({ label: Gettext.gettext('Save') });
        // this._actionArea.add(this.saveButton);

        // Connect the button to the function that handles what it does
        // this.cancelButton.connect('clicked', _OKHandler.bind(this));
        this.saveButton.connect('clicked', _saveHandler.bind(this));

        this._dialog.present();
      }
      */
      about (app) {
        const window = (app ? app._window : null);
        const aboutDialog = new Gtk.AboutDialog(
            {
              authors: [
                'Rick Opper <brainstormtrooper@free.fr>',
                'Special thanks to Andy Holmes',
              ],
              // translator_credits: _("translator-credits"),
              program_name: 'Facteur',
              comments: Gettext.gettext(
                  'Application for sending template based emails',
              ),
              copyright: 'Copyright 2015 Rick Opper',
              license_type: Gtk.License.GPL_2_0,
              logo_icon_name: 'io.github.brainstormtrooper.facteur',
              version: pkg.version,
              website: 'https://github.com/brainstormtrooper/facteur/wiki',
              wrap_license: true,
              modal: true,
              transient_for: window,
            },
        );

        aboutDialog.show();
        aboutDialog.connect('response', () => {
          aboutDialog.destroy();
        });
      }
    },
);
