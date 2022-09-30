const Gtk = imports.gi.Gtk;
const Settings = imports.UI.Settings;
// const Config = imports.lib.settings;
const Connection = imports.object.Settings;
const Gettext = imports.gettext;
const GObject = imports.gi.GObject;
const Config = new imports.object.Settings.Settings();



var UImodal = GObject.registerClass( // eslint-disable-line
    {
      GTypeName: 'UImodal',
    },
    class UImodal extends GObject.Object {
      _init() {
        super._init();
        // this.settings = new Settings.UIsettings();
      }

      newConnection(settings) {
        const window = settings.App._window;
        // Create the dialog
        this._dialog = new Gtk.Dialog({
          transient_for: window,
          modal: true,
          title: 'New connection',
        });
        // Create the dialog's content area, which contains a message
        this._contentArea = this._dialog.get_content_area();
        this._message = new Gtk.Label(
            // eslint-disable-next-line max-len
            { label: 'Please configure your connectoin here.' },
        );
        // this.settings = new Settings.UIsettings();
        this.configFields = settings._buildNewConnection();
        
        this._contentArea.add(this._message);
        this._contentArea.add(this.configFields);
        // Handlers for button actions
        const _OKHandler = () => {
          // Destroy the dialog
          this._dialog.destroy();
        };

        const _saveHandler = () => {
          const myConnection = new Connection.Settings();
          const CONN = myConnection.saveConnection(settings);
          
          settings.sselectCombo.insert(0, CONN, settings.nameField.get_text());

          settings._updateUI({ CONN });
          // let ipv4 = false;
          // ipv4 = this.settings.ipv4Field.get_active();
          // Config.setIpv4(ipv4);
          // Config.setDelay(this.settings.delayField.get_text());
          // Destroy the dialog

          this._dialog.destroy();
        };

        // Create the dialog's action area, which contains a stock OK button
        this._actionArea = this._dialog.get_action_area();
        this.cancelButton = Gtk.Button.new_from_stock(Gtk.STOCK_CANCEL);
        this._actionArea.add(this.cancelButton);
        this.saveButton = new Gtk.Button({ label: Gettext.gettext('Save') });
        this._actionArea.add(this.saveButton);

        // Connect the button to the function that handles what it does
        this.cancelButton.connect('clicked', _OKHandler.bind(this));
        this.saveButton.connect('clicked', _saveHandler.bind(this));

        this._dialog.show_all();

      }

      showOpenModal(title, message, app = null) {
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

        modal.connect('response', function() {
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

      config(app) {
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
        const ipv4 = Config.getIpv4();
        if (ipv4) {
          this.settings.ipv4Field.set_active(true);
        }
        this.settings.delayField.set_text(Config.getDelay().toString());
        this._contentArea.add(this._message);
        this._contentArea.add(this.configFields);
        // Handlers for button actions
        const _OKHandler = () => {
          // Destroy the dialog
          this._dialog.destroy();
        };

        const _saveHandler = () => {
          let ipv4 = false;
          ipv4 = this.settings.ipv4Field.get_active();
          Config.setIpv4(ipv4);
          Config.setDelay(this.settings.delayField.get_text());
          // Destroy the dialog
          this._dialog.destroy();
        };

        // Create the dialog's action area, which contains a stock OK button
        this._actionArea = this._dialog.get_action_area();
        this.cancelButton = Gtk.Button.new_from_stock(Gtk.STOCK_CANCEL);
        this._actionArea.add(this.cancelButton);
        this.saveButton = new Gtk.Button({ label: Gettext.gettext('Save') });
        this._actionArea.add(this.saveButton);

        // Connect the button to the function that handles what it does
        this.cancelButton.connect('clicked', _OKHandler.bind(this));
        this.saveButton.connect('clicked', _saveHandler.bind(this));

        this._dialog.show_all();
      }

      about(app) {
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
              logo_icon_name: 'com.github.brainstormtrooper.facteur',
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
