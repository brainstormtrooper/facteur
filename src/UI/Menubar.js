
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const Gettext = imports.gettext;
const GObject = imports.gi.GObject;

const Data = imports.object.Data;
const oSettings = imports.object.Settings;
const appData = new Data.Data();
const Config = new oSettings.Settings();

const myFile = imports.lib.file;
const Modal = imports.UI.Modal;
const Settings = imports.UI.Settings;
const mySettings = new Settings.UIsettings();
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
      'update_attachments': {
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

    _updateUI() {
      const availableCns = JSON.parse(Config.getConnections());
      try {
          
        mySettings.mainSelectCombo.remove_all();
        if(availableCns.length >= 1) {
          availableCns.forEach((v, k) => {
            mySettings.mainSelectCombo.insert(k, v.ID, v.NAME);
          });
        } else {
          mySettings.mainSelectCombo.insert(0, "0", "No Connections Available");
        }
        // this.A.emit('update_ui', true);
      } catch (error) {
        log(`[menubar] ${error}`);
      }
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

      headerBar.set_show_title_buttons(true)

      const ttlWidget = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL });
      const appTtl = new Gtk.Label( { label: 'Facteur' } );
      const appSubTtl = new Gtk.Label( { name: 'appSubTtl', label: 'Untitled Mailing' } );

      appTtl.get_style_context().add_class('title');
      appSubTtl.get_style_context().add_class('subtitle');

      ttlWidget.append(appTtl);
      ttlWidget.append(appSubTtl);
      headerBar.set_title_widget(ttlWidget);

      const headerStart = new Gtk.Grid({ column_spacing: 6 });

      
      const buttonNew = Gtk.Button.new_from_icon_name('document-open-symbolic');
      buttonNew.connect('clicked', async () => {
        const props = {
          title: Gettext.gettext('Select A Mailing')
        }
        try {
          
          myFile.fileOpen(props, (res) => {
            appData.set('FILENAME', res.get_parse_name());
            // appData.set('FILENAME', 'test');
            const [, contents] = res.load_contents(null);
            const td = new TextDecoder();
            // myFile.unRoll(td.decode(contents));
            try {
              myFile.unRoll(myFile.decompress(contents));
              this.App.emit('update_ui', true);
              this.App.emit('update_attachments', true);
              // eslint-disable-next-line max-len
              this.App.emit('Logger', `Opened file : ${appData.get('FILENAME')}.`);
              this.App.emit('filename_changed', true);
            } catch (error) {
              console.error(error);
              myModal.showOpenModal('Error', error.message, this.App);
            }          
            
          });
          
        } catch (error) {
          log(error);
          myModal.showOpenModal('Error', error.message, this.App);
        }
      });

      headerStart.attach(buttonNew, 1, 0, 1, 1);
      headerBar.pack_start(headerStart);



      const popMenu = new Gtk.Popover();

      const buttonMenu = new Gtk.MenuButton({ 'icon-name': 'document-save-symbolic' });
      // const buttonMenu = new Gtk.MenuButton({ image: imageMenu });
      buttonMenu.set_popover(popMenu);
      popMenu.set_size_request(-1, -1);
      buttonMenu.set_menu_model(this.getFileMenu(app));


      const configMenu = new Gtk.Popover();
      configMenu.set_child(this.getSettingsMenu(app));
      configMenu.set_autohide(true);

      const buttonConfig = new Gtk.MenuButton({ 'icon-name': 'open-menu-symbolic' });
      buttonConfig.set_popover(configMenu);
      configMenu.set_size_request(-1, -1);
      // buttonConfig.set_menu_model(this.getSettingsMenu(app));

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
      const data = myFile.compress(myFile.rollUp());
      const WP = appData.get('FILENAME').split('/');
      const filename = WP.pop();
      const foldername = `/${WP.join('/')}`;
      const props = { 
        title: 'Save a mailing',
        filename,
        foldername,
        data
      };

      myFile.fileSave(props, (res) => {
        appData.set('FILENAME', res);
        this.App.emit('filename_changed', true);
      });
    }


    getSettingsMenu(app) {
      const menuBox = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 6 })
      const aboutBtn = new Gtk.Button({ label: 'About' });
      aboutBtn.connect('clicked', () => {
        // this.widgetOpen.pop.hide();
        myModal.about(app);
      });
      menuBox.append(mySettings.appConfig());
      menuBox.append(aboutBtn);

      return menuBox;
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
        // this.emit('filename_changed', true);
        this.App.emit('filename_changed', true);
      });
      app.add_action(actionSaveAs);

      const actionSave = new Gio.SimpleAction({ name: 'save' });
      actionSave.connect('activate', () => {
        if (appData.get('FILENAME') != null && appData.get('FILENAME') != 'untitled') {
          const data = myFile.compress(myFile.rollUp());
          myFile.save(appData.get('FILENAME'), data);
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
