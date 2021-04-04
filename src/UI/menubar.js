
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const Gettext = imports.gettext;
const Signals = imports.signals;

const File = imports.lib.file;
// const Settings = imports.UI.Settings;
const Modal = imports.UI.Modal;
// const Config = imports.lib.settings;
const myModal = new Modal.UImodal();

const PopWidget = function (properties) {
  let label = new Gtk.Label({ label: properties.label });
  let image = new Gtk.Image({ icon_name: 'document-save-symbolic', icon_size: Gtk.IconSize.SMALL_TOOLBAR });
  let widget = new Gtk.Grid();
  widget.attach(label, 0, 0, 1, 1);
  widget.attach(image, 1, 0, 1, 1);

  this.pop = new Gtk.Popover();
  this.button = new Gtk.ToggleButton();
  this.button.add(widget);
  this.button.connect('clicked', () => {
    if (this.button.get_active()) { this.pop.show_all(); }
  });
  this.pop.connect('closed', () => {
    if (this.button.get_active()) { this.button.set_active(false); }
  });
  this.pop.set_relative_to(this.button);
  this.pop.set_size_request(-1, -1);
  this.pop.set_border_width(8);
  this.pop.add(properties.widget);
};

var getHeader = function () {

  let headerBar, headerStart, imageNew, buttonNew, popMenu, imageMenu, buttonMenu;

  Signals.addSignalMethods(this);

  headerBar = new Gtk.HeaderBar();
  headerBar.set_title("Gnome Emailer");
  headerBar.set_subtitle("Untitled Mailing");
  headerBar.set_show_close_button(true);

  headerStart = new Gtk.Grid({ column_spacing: headerBar.spacing });


  imageNew = new Gtk.Image({ icon_name: 'document-open-symbolic', icon_size: Gtk.IconSize.SMALL_TOOLBAR });
  buttonNew = new Gtk.Button({ image: imageNew });
  buttonNew.connect('clicked', () => {
    const opener = new Gtk.FileChooserDialog({ title: 'Select a file' });
    opener.set_action(Gtk.FileChooserAction.OPEN);
    opener.add_button('open', Gtk.ResponseType.ACCEPT);
    opener.add_button('cancel', Gtk.ResponseType.CANCEL);
    const res = opener.run();
    if (res == Gtk.ResponseType.ACCEPT) {
      
      app.Data.FILENAME = opener.get_filename();
      const promise = File.open(app.Data.FILENAME);
      promise.then(fileData => {
        try {
          File.unRoll(fileData);
          this.emit('update_ui', true);
          log(app.Data.FILENAME);
          this.emit('filename_changed', true);
        } catch (error) {
          log(error);
          // const myModal = new Modal.UImodal();
          myModal.showOpenModal('Error', Gettext.gettext('Error opening file. Not a valid emailer file'));
        }
        
      })
      .catch(error => {
        log(error);
        // const myModal = new Modal.UImodal();
        myModal.showOpenModal('Error', Gettext.gettext('Error opening file. Not a valid emailer file'));
      });

    }
    opener.destroy();
  });

  headerStart.attach(buttonNew, 1, 0, 1, 1);
  headerBar.pack_start(headerStart);

  popMenu = new Gtk.Popover();
  imageMenu = new Gtk.Image({ icon_name: 'document-save-symbolic', icon_size: Gtk.IconSize.SMALL_TOOLBAR });
  buttonMenu = new Gtk.MenuButton({ image: imageMenu });
  buttonMenu.set_popover(popMenu);
  popMenu.set_size_request(-1, -1);
  buttonMenu.set_menu_model(this.getFileMenu());


  var configMenu = new Gtk.Popover();
  var imageConfig = new Gtk.Image({ icon_name: 'open-menu-symbolic', icon_size: Gtk.IconSize.SMALL_TOOLBAR });
  var buttonConfig = new Gtk.MenuButton({ image: imageConfig });
  buttonConfig.set_popover(configMenu);
  configMenu.set_size_request(-1, -1);
  buttonConfig.set_menu_model(this.getSettingsMenu());

  headerBar.pack_end(buttonConfig);
  headerBar.pack_end(buttonMenu);

  return headerBar;
};



const getPopOpen = function () { /* Widget popover */

  let widget = new Gtk.Grid(),
    label = new Gtk.Label({ label: "Label 1" }),
    button = new Gtk.Button({ label: "Other Documents ..." });

  button.connect('clicked', () => {
    this.widgetOpen.pop.hide();
    this.printText('Open other documents');
  });
  button.set_size_request(200, -1);

  widget.attach(label, 0, 0, 1, 1);
  widget.attach(button, 0, 1, 1, 1);
  widget.set_halign(Gtk.Align.CENTER);

  return widget;
};


const saveAs = function () {
  const saver = new Gtk.FileChooserDialog({ title: 'Select a destination' });
  saver.set_action(Gtk.FileChooserAction.SAVE);
  const WP = app.Data.FILENAME.split('/');
  const filename = WP.pop();
  saver.set_current_name(filename);
  try {
    const foldername = `/${WP.join('/')}`;
    saver.set_current_folder(foldername);
  } catch (e) {
    log(e);
  }

  saver.add_button('save', Gtk.ResponseType.ACCEPT);
  saver.add_button('cancel', Gtk.ResponseType.CANCEL);
  const res = saver.run();
  if (res == Gtk.ResponseType.ACCEPT) {
    app.Data.FILENAME = saver.get_filename();
    log(app.Data.FILENAME);

    const data = File.rollUp();
    File.save(app.Data.FILENAME, data);
  }
  saver.destroy();
}







var getSettingsMenu = function () {
  let menu, section;
  menu = new Gio.Menu();
  section = new Gio.Menu();
  section.append("Preferences", 'app.preferences');
  section.append("About", 'app.about');
  menu.append_section(null, section);

  // Set menu actions
  let actionConfig = new Gio.SimpleAction({ name: 'preferences' });
  actionConfig.connect('activate', () => {

    myModal.config();
  });
  let actionAbout = new Gio.SimpleAction({ name: 'about' });
  actionAbout.connect('activate', () => {
    myModal.about();
  });
  app.application.add_action(actionConfig);
  app.application.add_action(actionAbout);

  return menu;
}

var getFileMenu = function () { /* GMenu popover */

  let menu, section, submenu;

  menu = new Gio.Menu();

  section = new Gio.Menu();
  section.append("Save As...", 'app.saveAs');
  section.append("Save", 'app.save');
  menu.append_section(null, section);

  // Set menu actions
  let actionSaveAs = new Gio.SimpleAction({ name: 'saveAs' });
  actionSaveAs.connect('activate', () => {
    saveAs();
    this.emit('filename_changed', true);
  });
  app.application.add_action(actionSaveAs);


  let actionSave = new Gio.SimpleAction({ name: 'save' });
  actionSave.connect('activate', () => {
    if (app.Data.FILENAME !== null) {
      const data = File.rollUp();
      File.save(app.Data.FILENAME, data);
    } else {
      saveAs();
      try {
        this.emit('filename_changed', true);
      } catch (e) {
        log(e);
      }
    }
  });
  app.application.add_action(actionSave);

  return menu;
};
