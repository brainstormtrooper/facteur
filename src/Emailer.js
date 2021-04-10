const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;
const Signals = imports.signals;
const Menubar = imports.UI.menubar;
const UI = imports.UI.UI;
const Data = imports.object.Data;
const Lang = imports.lang;

const appData = new Data.Data();


var GNOMEeMailer = class GNOMeMailer{
    Name = 'GNOME Emailer Application';
    ID = 'com.github.brainstormtrooper.gnome-emailer';
  
    // Create the application itself
    constructor() {
      
      this.application = new Gtk.Application();
      
      appData.data.ID = this.ID;

      // this.parent({ application_id: pkg.name }); // ? wrong inheritance ?
      GLib.set_application_name(pkg.name);
  
      // Connect 'activate' and 'startup' signals to the callback functions
      this.application.connect('activate', Lang.bind(this, this._onActivate));
      this.application.connect('startup', Lang.bind(this, this._onStartup));
    };
  
    // Callback function for 'activate' signal presents windows when active
    _onActivate() {
      this._window.present();
    };
  
    // Callback function for 'startup' signal builds the UI
    _onStartup() {
      this._buildUI();
    };
  
    // Build the application's UI
    _buildUI() {
  
      // Create the application window
      this._window = new Gtk.ApplicationWindow({
        application: this.application,
        title: "GNOME Emailer",
        default_height: 200,
        default_width: 400,
        window_position: Gtk.WindowPosition.CENTER
      });
  
      this._window.set_events('GDK_ENTER_NOTIFY_MASK');
      this._window.add_events('GDK_LEAVE_NOTIFY_MASK');
  
      //
      // menu bar
      //
      
      this._window.set_titlebar(Menubar.getHeader(this.application));
  
      Signals.addSignalMethods(Menubar);
      Menubar.connect('update_ui', () => {
        try {
          log('>>> updating UI');
          this.ui.updateUI();
        } catch (e) {
          log(e);
        }
      });
      Menubar.connect('filename_changed', () => {
        log('>>> filename_changed');
        try {
          this._window.get_titlebar().set_subtitle(appData.data.FILENAME);
        } catch (e) {
          log(e);
        }
      });
      Menubar.connect('Log', (msg) => {
        log(msg);
      });
  
      // Vbox to hold the switcher and stack.
      this._Vbox = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 6 });
      this._Hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 6, homogeneous: true });
  
      this.ui = new UI.UIstack();
      this.ui._buildStack();
  
      this._Hbox.pack_start(this.ui._stack_switcher, true, true, 0);
      this._Vbox.pack_start(this._Hbox, false, false, 0);
      this._Vbox.pack_start(this.ui._Stack, true, true, 0);
  
      // Show the vbox widget
      this._window.add(this._Vbox);
  
      // Show the window and all child widgets
      this._window.show_all();
  
    };
  };
  