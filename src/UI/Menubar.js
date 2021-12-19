
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const Gettext = imports.gettext;
const GObject = imports.gi.GObject;

const Data = imports.object.Data;
const appData = new Data.Data().data;

const File = imports.lib.file;
const Modal = imports.UI.Modal;
const myModal = new Modal.UImodal();

var Menubar = GObject.registerClass( // eslint-disable-line
    {
      GTypeName: 'Menubar',
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
      },
    },
    class Menubar extends GObject.Object {
      _init() {
        super._init();
      }

      PopWidget(properties) {
        const label = new Gtk.Label({ label: properties.label });
        const image = new Gtk.Image(
            {
              icon_name: 'document-save-symbolic',
              icon_size: Gtk.IconSize.SMALL_TOOLBAR,
            },
        );
        const widget = new Gtk.Grid();
        widget.attach(label, 0, 0, 1, 1);
        widget.attach(image, 1, 0, 1, 1);

        this.pop = new Gtk.Popover();
        this.button = new Gtk.ToggleButton();
        this.button.add(widget);
        this.button.connect('clicked', () => {
          if (this.button.get_active()) {
            this.pop.show_all();
          }
        });
        this.pop.connect('closed', () => {
          if (this.button.get_active()) {
            this.button.set_active(false);
          }
        });
        this.pop.set_relative_to(this.button);
        this.pop.set_size_request(-1, -1);
        this.pop.set_border_width(8);
        this.pop.add(properties.widget);
      }

      getHeader(app) {
        const headerBar = new Gtk.HeaderBar();
        this.App = Gio.Application.get_default();
        headerBar.set_title('Facteur (Gnome Emailer)');
        // https://tecnocode.co.uk/misc/platform-demos/tooltip.js.xhtml
        headerBar.set_subtitle('Untitled Mailing');
        headerBar.set_show_close_button(true);

        const headerStart = new Gtk.Grid({ column_spacing: headerBar.spacing });


        const imageNew = new Gtk.Image(
            {
              icon_name: 'document-open-symbolic',
              icon_size: Gtk.IconSize.SMALL_TOOLBAR,
            },
        );
        const buttonNew = new Gtk.Button({ image: imageNew });
        buttonNew.connect('clicked', () => {
          const opener = new Gtk.FileChooserDialog({ title: 'Select a file' });
          opener.set_action(Gtk.FileChooserAction.OPEN);
          opener.add_button('open', Gtk.ResponseType.ACCEPT);
          opener.add_button('cancel', Gtk.ResponseType.CANCEL);
          const res = opener.run();

          if (res == Gtk.ResponseType.ACCEPT) {
            appData.FILENAME = opener.get_filename();
            const promise = File.open(appData.FILENAME);
            promise.then((fileData) => {
              try {
                File.unRoll(fileData);
                this.App.emit('update_ui', true);
                this.App.emit('Logger', `Opened file : ${appData.FILENAME}.`);
                this.App.emit('filename_changed', true);
              } catch (error) {
                logError(error);
                // const myModal = new Modal.UImodal();
                myModal.showOpenModal(
                    'Error',
                    Gettext.gettext(
                        'Error opening file. Not a valid emailer file',
                    ),
                    app,
                );
              }
            })
                .catch((error) => {
                  logError(error);
                  // const myModal = new Modal.UImodal();
                  myModal.showOpenModal(
                      'Error',
                      Gettext.gettext(
                          'Error opening file. Not a valid emailer file',
                      ),
                      app,
                  );
                });
          }
          opener.destroy();
        });

        headerStart.attach(buttonNew, 1, 0, 1, 1);
        headerBar.pack_start(headerStart);

        const popMenu = new Gtk.Popover();
        const imageMenu = new Gtk.Image(
            {
              icon_name: 'document-save-symbolic',
              icon_size: Gtk.IconSize.SMALL_TOOLBAR,
            },
        );
        const buttonMenu = new Gtk.MenuButton({ image: imageMenu });
        buttonMenu.set_popover(popMenu);
        popMenu.set_size_request(-1, -1);
        buttonMenu.set_menu_model(this.getFileMenu(app));


        const configMenu = new Gtk.Popover();
        const imageConfig = new Gtk.Image(
            {
              icon_name: 'open-menu-symbolic',
              icon_size: Gtk.IconSize.SMALL_TOOLBAR,
            },
        );
        const buttonConfig = new Gtk.MenuButton({ image: imageConfig });
        buttonConfig.set_popover(configMenu);
        configMenu.set_size_request(-1, -1);
        buttonConfig.set_menu_model(this.getSettingsMenu(app));

        headerBar.pack_end(buttonConfig);
        headerBar.pack_end(buttonMenu);

        return headerBar;
      }

      getPopOpen() { // Widget popover
        const widget = new Gtk.Grid();
        const label = new Gtk.Label({ label: 'Label 1' });
        const button = new Gtk.Button({ label: 'Other Documents ...' });

        button.connect('clicked', () => {
          this.widgetOpen.pop.hide();
          this.printText('Open other documents');
        });
        button.set_size_request(200, -1);

        widget.attach(label, 0, 0, 1, 1);
        widget.attach(button, 0, 1, 1, 1);
        widget.set_halign(Gtk.Align.CENTER);

        return widget;
      }

      saveAs() {
        const saver = new Gtk.FileChooserDialog(
            { title: 'Select a destination' },
        );
        saver.set_action(Gtk.FileChooserAction.SAVE);
        const WP = appData.FILENAME.split('/');
        const filename = WP.pop();
        saver.set_current_name(filename);
        try {
          const foldername = `/${WP.join('/')}`;
          saver.set_current_folder(foldername);
        } catch (e) {
          logError(e);
        }

        saver.add_button('save', Gtk.ResponseType.ACCEPT);
        saver.add_button('cancel', Gtk.ResponseType.CANCEL);
        const res = saver.run();
        if (res == Gtk.ResponseType.ACCEPT) {
          appData.FILENAME = saver.get_filename();

          const data = File.rollUp();
          File.save(appData.FILENAME, data);
        }
        saver.destroy();
      }


      getSettingsMenu(app) {
        const menu = new Gio.Menu();
        const section = new Gio.Menu();
        section.append('Preferences', 'app.preferences');
        section.append('About', 'app.about');
        menu.append_section(null, section);

        // Set menu actions
        const actionConfig = new Gio.SimpleAction({ name: 'preferences' });
        actionConfig.connect('activate', () => {
          myModal.config(app);
        });
        const actionAbout = new Gio.SimpleAction({ name: 'about' });
        actionAbout.connect('activate', () => {
          myModal.about(app);
        });
        app.add_action(actionConfig);
        app.add_action(actionAbout);

        return menu;
      }

      getFileMenu(app) { // GMenu popover
        const menu = new Gio.Menu();

        const section = new Gio.Menu();
        section.append('Save As...', 'app.saveAs');
        section.append('Save', 'app.save');
        menu.append_section(null, section);

        // Set menu actions
        const actionSaveAs = new Gio.SimpleAction({ name: 'saveAs' });
        actionSaveAs.connect('activate', () => {
          this.saveAs();
          this.emit('filename_changed', true);
        });
        app.add_action(actionSaveAs);

        const actionSave = new Gio.SimpleAction({ name: 'save' });
        actionSave.connect('activate', () => {
          if (appData.FILENAME !== null) {
            const data = File.rollUp();
            File.save(appData.FILENAME, data);
          } else {
            this.saveAs();
            try {
              this.emit('filename_changed', true);
            } catch (e) {
              logError(e);
            }
          }
        });
        app.add_action(actionSave);

        return menu;
      }
    },
);
