
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
	// 1. Mailing Settings
	//

    const Mailing = imports.UI.Mailing; // import awesome.js from current directory
	this.mailing = new Mailing.UImailing();
    this._Stack.add_titled(this.mailing._buildUI(), "setup", "Mailing Settings");


	//
	// 2. Template Settings
	//

	this._checkbutton = new Gtk.CheckButton({label: "Template!"});
    this._Stack.add_titled(this._checkbutton, "template", "Template Settings");




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
