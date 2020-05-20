#!/usr/bin/gjs


Gio = imports.gi.Gio;
GLib = imports.gi.GLib;
Gtk = imports.gi.Gtk;
Lang = imports.lang;
Webkit = imports.gi.WebKit2;
Signals = imports.signals;
GObject = imports.gi.GObject;
Pango = imports.gi.Pango;
Gettext = imports.gettext;
imports.package.init({
  name: 'com.github.brainstormtrooper.gnome-emailer',
  version: '0.1.2',
  prefix: '/usr/local',
  libdir: 'lib',
});

FROM = '';
USER = '';
PASS = '';
HOST = '';

SUBJECT = '';
HTML = '';
TEXT = '';

TO = [];
CSVA = [];
VARS = [];
MAILINGS = [];

HASH = 'bobhash1';
FILENAME = null;
APP = new Gtk.Application ();

stdout = new Gio.DataOutputStream({
    base_stream: new Gio.UnixOutputStream({ fd: 1 })
});

Gettext.bindtextdomain('gnome-emailer-0.1', '/usr/share/locale');
Gettext.textdomain('gnome-emailer-0.1');


//
// add app folder to path
//

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


const GNOMEeMailer = new Lang.Class ({
    Name: 'GNOME Emailer Application',
    ID: 'com.github.brainstormtrooper.gnome-emailer',

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
        this._window.present ();
    },

    // Callback function for 'startup' signal builds the UI
    _onStartup: function () {
        this._buildUI ();
    },

    // Build the application's UI
    _buildUI: function () {

        // Create the application window
        this._window = new Gtk.ApplicationWindow  ({
            application: this.application,
            title: "GNOME Emailer",
            default_height: 200,
            default_width: 400,
            window_position: Gtk.WindowPosition.CENTER });

  //
  // Settings
  //
  const mySettings = imports.lib.settings;
  //const config = mySettings.getSettings(this.ID);
  print('hash : ');
  print(mySettings.getHash());

  //
  // menu bar
  //
  const Menubar = imports.UI.menubar;
  this._window.set_titlebar(Menubar.getHeader());

    Signals.addSignalMethods(Menubar);
    Menubar.connect('update_ui',() => {
      try {
        print('>>> updating UI');
        this.ui.updateUI();
      } catch (e) {
        print(e);
      }
    });
    Menubar.connect('filename_changed',() => {
      print('>>> filename_changed');
      try {
        this._window.get_titlebar().set_subtitle(FILENAME);
      } catch (e) {
        print(e);
      }
    });
    Menubar.connect('Log', (msg) => {
      print('>>> Log Entry');
      //  const iter = this.textBuffer.get_end_iter();
      // this.textBuffer.insert(iter, msg);
    });


	// Vbox to hold the switcher and stack.
	this._Vbox = new Gtk.VBox({spacing: 6});
  this._Hbox = new Gtk.HBox({spacing: 6, homogeneous: true});

	const UI = imports.UI.UI; // import awesome.js from current directory
	this.ui = new UI.UIstack();
	this.ui._buildStack();

        this._Hbox.pack_start(this.ui._stack_switcher, true, true, 0);
        this._Vbox.pack_start(this._Hbox, false, false, 0);
        this._Vbox.pack_start(this.ui._Stack, true, true, 0);

	// Show the vbox widget
	this._window.add (this._Vbox);

        // Show the window and all child widgets
        this._window.show_all();

    },


});


// Run the application
app = new GNOMEeMailer ();
app.application.run (ARGV);

// changes? in cola?... nope...

