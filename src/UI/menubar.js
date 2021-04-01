
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const Gettext = imports.gettext;
const Signals = imports.signals;

const File = imports.lib.file;
const Settings = imports.UI.Settings;
const Modal = imports.UI.Modal;
const Config = imports.lib.settings;

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
      
      try {
        app.Data.FILENAME = opener.get_filename();
        const fileData = File.open(app.Data.FILENAME);
        File.unRoll(fileData);
        
        this.emit('update_ui', true);
        
        log(app.Data.FILENAME);
        this.emit('filename_changed', true);
      } catch (error) {
        const myModal = new Modal.UImodal();
        myModal.showOpenModal(Gettext.gettext('Error opening file. Not a valid emailer file'));
      }
      


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

const _OKHandler = function (dialog, response_id) {

  // Destroy the dialog
  this._dialog.destroy();
}

const _saveHandler = function (dialog, response_id) {
  var ipv4 = false;
  Config.setHash(this.settings.hashField.get_text());
  ipv4 = this.settings.ipv4Field.get_active();
  Config.setIpv4(ipv4);
  // Destroy the dialog
  this._dialog.destroy();
}

const config = function () {
  // Create the dialog
  this._dialog = new Gtk.Dialog({
    transient_for: app._window,
    modal: true,
    title: "App settings"
  });

  // Create the dialog's content area, which contains a message
  this._contentArea = this._dialog.get_content_area();
  this._message = new Gtk.Label({ label: "Please configure your password hash and IPv4 preferences here." });
  this.settings = new Settings.UIsettings();

  this.configFields = this.settings._buildModal();
  this.settings.hashField.set_text(Config.getHash());
  const ipv4 = Config.getIpv4();
  if (ipv4) {
    this.settings.ipv4Field.set_active(true);
  }
  this._contentArea.add(this._message);
  this._contentArea.add(configFields);

  // Create the dialog's action area, which contains a stock OK button
  this._actionArea = this._dialog.get_action_area();
  this.cancelButton = Gtk.Button.new_from_stock(Gtk.STOCK_CANCEL);
  this._actionArea.add(this.cancelButton);
  this.saveButton = new Gtk.Button({ label: Gettext.gettext('Save') });
  this._actionArea.add(this.saveButton);

  // Connect the button to the function that handles what it does
  this.cancelButton.connect("clicked", _OKHandler.bind(this));
  this.saveButton.connect("clicked", _saveHandler.bind(this));

  this._dialog.show_all();
}

const about = function() {
  let aboutDialog = new Gtk.AboutDialog(
    { authors: [ 'Rick Opper <brainstormtrooper@free.fr>' ],
      // translator_credits: _("translator-credits"),
      program_name: "Gnome-emailer",
      comments: Gettext.gettext("Application for sending template based emails"),
      copyright: 'Copyright 2015 Rick Opper',
      license_type: Gtk.License.GPL_2_0,
      logo_icon_name: 'com.github.brainstormtrooper.gnome-emailer',
      version: pkg.version,
      website: 'http://www.brainstormtrooper.free.fr',
      wrap_license: true,
      modal: true,
      transient_for: app._window
    });

  aboutDialog.show();
  aboutDialog.connect('response', function() {
    aboutDialog.destroy();
  });
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
    config();
  });
  let actionAbout = new Gio.SimpleAction({ name: 'about' });
  actionAbout.connect('activate', () => {
    about();
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
