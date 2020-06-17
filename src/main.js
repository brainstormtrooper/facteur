

imports.package.init({
  name: 'com.github.brainstormtrooper.gnome-emailer',
  version: '0.1.2',
  prefix: '/usr/local',
  libdir: 'lib',
});


const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;
// const GObject = imports.gi.GObject;
// Webkit = imports.gi.WebKit2;
const Signals = imports.signals;
// GObject = imports.gi.GObject;
// Pango = imports.gi.Pango;
const Gettext = imports.gettext;

const Menubar = imports.UI.menubar;
const UI = imports.UI.UI; 


var APP = new Gtk.Application();

/*
stdout = new Gio.DataOutputStream({
    base_stream: new Gio.UnixOutputStream({ fd: 1 })
});
*/
Gettext.bindtextdomain('gnome-emailer-0.1', '/usr/share/locale');
Gettext.textdomain('gnome-emailer-0.1');


//
// add app folder to path
//
/*
function getAppFileInfo() {
  let stack = (new Error()).stack,
    stackLine = stack.split('\n')[1],
    coincidence, path, file;

  if (!stackLine) throw new Error('Could not find current file (1)');

  coincidence = new RegExp('@(.+):\\d+').exec(stackLine);
  if (!coincidence) throw new Error('Could not find current file (2)');

  path = coincidence[1];
  file = Gio.File.new_for_path(path);
  return [file.get_path(), file.get_parent().get_path(), file.get_basename()];
}
const path = getAppFileInfo()[1];
imports.searchPath.push(path);
*/

const GNOMEeMailer = new Lang.Class({
  Name: 'GNOME Emailer Application',
  ID: 'com.github.brainstormtrooper.gnome-emailer',

  Data: {
    FROM: '',
    USER: '',
    PASS: '',
    HOST: '',

    SUBJECT: '',
    HTML: '',
    TEXT: '',

    TO: [],
    CSVA: [],
    VARS: [],
    MAILINGS: [],

    FILENAME: 'untitled',
  },

  // Create the application itself
  _init: function () {
    this.application = APP;

    this.parent({ application_id: pkg.name }); // ? wrong inheritance ?
    GLib.set_application_name(pkg.name);

    // Connect 'activate' and 'startup' signals to the callback functions
    this.application.connect('activate', Lang.bind(this, this._onActivate));
    this.application.connect('startup', Lang.bind(this, this._onStartup));
  },

  // Callback function for 'activate' signal presents windows when active
  _onActivate: function () {
    this._window.present();
  },

  // Callback function for 'startup' signal builds the UI
  _onStartup: function () {
    this._buildUI();
  },

  // Build the application's UI
  _buildUI: function () {

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
    
    this._window.set_titlebar(Menubar.getHeader());

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
        this._window.get_titlebar().set_subtitle(this.Data.FILENAME);
      } catch (e) {
        log(e);
      }
    });
    Menubar.connect('Log', (msg) => {
      log('>>> Log Entry');
      //  const iter = this.textBuffer.get_end_iter();
      // this.textBuffer.insert(iter, msg);
    });


    // Vbox to hold the switcher and stack.
    this._Vbox = new Gtk.VBox({ spacing: 6 });
    this._Hbox = new Gtk.HBox({ spacing: 6, homogeneous: true });

    this.ui = new UI.UIstack();
    this.ui._buildStack();

    this._Hbox.pack_start(this.ui._stack_switcher, true, true, 0);
    this._Vbox.pack_start(this._Hbox, false, false, 0);
    this._Vbox.pack_start(this.ui._Stack, true, true, 0);

    // Show the vbox widget
    this._window.add(this._Vbox);

    // Show the window and all child widgets
    this._window.show_all();

  },


});


// Run the application
window.app = new GNOMEeMailer();
// app.application.run(ARGV);
app.application.run(ARGV)([imports.system.programInvocationName].concat(ARGV));
// For technical reasons, this is the proper way you should start your application
// (new GNOMEeMailer()).application.run([imports.system.programInvocationName].concat(ARGV));

