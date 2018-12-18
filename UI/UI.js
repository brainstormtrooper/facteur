
const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;
const Webkit = imports.gi.WebKit2;


const UIstack = new Lang.Class ({
    	Name: 'UIstack',


    // Build the application's UI
    _buildStack: function () {




	this._Stack = new Gtk.Stack();

    this._Stack.set_transition_type(Gtk.StackTransitionType.SLIDE_LEFT_RIGHT);
    this._Stack.set_transition_duration(1000);

	/*
	CONTENT PANELS
	*/

  //
  // 1. Settings ()
  //

  const Settings = imports.UI.Settings; // import awesome.js from current directory
	this.settings = new Settings.UIsettings();
  this._Stack.add_titled(this.settings._buildUI(), "settings", "Mailing Settings");

	//
	// 1. Mailing Settings
	//

  const Mailing = imports.UI.Mailing; // import awesome.js from current directory
	this.mailing = new Mailing.UImailing();
  this._Stack.add_titled(this.mailing._buildUI(), "setup", "Mailing Recipients");


	//
	// 2. HTML Settings
	//

  const Html = imports.UI.html;
	this.html = new Html.UIhtml();
    this._Stack.add_titled(this.html._buildUI(), "HTML", "HTML/Template Settings");




	//
	// 3. Results / reporting...
	//

	this._checkbutton = new Gtk.CheckButton({label: "Results"});
    this._Stack.add_titled(this._checkbutton, "results", "Mailing Results");


	/*
	SWITCHER
	*/

	this._stack_switcher = new Gtk.StackSwitcher();
        this._stack_switcher.set_stack(this._Stack);





    },


});
