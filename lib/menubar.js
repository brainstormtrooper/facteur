
const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;

const PopWidget = function (properties) {

    let label = new Gtk.Label({ label: properties.label });
    let image = new Gtk.Image ({ icon_name: 'pan-down-symbolic', icon_size: Gtk.IconSize.SMALL_TOOLBAR });
    let widget = new Gtk.Grid();
    widget.attach(label, 0, 0, 1, 1);
    widget.attach(image, 1, 0, 1, 1);

    this.pop = new Gtk.Popover();
    this.button = new Gtk.ToggleButton();
    this.button.add(widget);
    this.button.connect ('clicked', () => {
        if (this.button.get_active()) { this.pop.show_all(); }
    });
    this.pop.connect ('closed', () => {
        if (this.button.get_active()) { this.button.set_active(false); }
    });
    this.pop.set_relative_to(this.button);
    this.pop.set_size_request(-1, -1);
    this.pop.set_border_width(8);
    this.pop.add(properties.widget);
};



 const getHeader = function () {

    let headerBar, headerStart, imageNew, buttonNew, popMenu, imageMenu, buttonMenu;

    headerBar = new Gtk.HeaderBar();
    headerBar.set_title("Gnome Emailer");
    headerBar.set_subtitle("Some subtitle text here");
    headerBar.set_show_close_button(true);

    headerStart = new Gtk.Grid({ column_spacing: headerBar.spacing });

    this.widgetOpen = new PopWidget({ label: "Open", widget: this.getPopOpen() });

    imageNew = new Gtk.Image ({ icon_name: 'tab-new-symbolic', icon_size: Gtk.IconSize.SMALL_TOOLBAR });
    buttonNew = new Gtk.Button({ image: imageNew });
    buttonNew.connect ('clicked', () => { this.printText('Button new'); });

    headerStart.attach(this.widgetOpen.button, 0, 0, 1, 1);
    headerStart.attach(buttonNew, 1, 0, 1, 1);
    headerBar.pack_start(headerStart);

    popMenu = new Gtk.Popover();
    imageMenu = new Gtk.Image ({ icon_name: 'open-menu-symbolic', icon_size: Gtk.IconSize.SMALL_TOOLBAR });
    buttonMenu = new Gtk.MenuButton({ image: imageMenu });
    buttonMenu.set_popover(popMenu);
    popMenu.set_size_request(-1, -1);
    buttonMenu.set_menu_model(this.getMenu());

    headerBar.pack_end(buttonMenu);

    return headerBar;
  };



const getPopOpen = function () { /* Widget popover */

    let widget = new Gtk.Grid(),
        label = new Gtk.Label({ label: "Label 1" }),
        button = new Gtk.Button({ label: "Other Documents ..." });

    button.connect ('clicked', () => {
        this.widgetOpen.pop.hide();
        this.printText('Open other documents');
    });
    button.set_size_request(200, -1);

    widget.attach(label, 0, 0, 1, 1);
    widget.attach(button, 0, 1, 1, 1);
    widget.set_halign(Gtk.Align.CENTER);

    return widget;
};

const getMenu = function () { /* GMenu popover */

    let menu, section, submenu;

    menu = new Gio.Menu();

    section = new Gio.Menu();
    section.append("Save As...", 'app.saveAs');
    section.append("Save All", 'app.saveAll');
    menu.append_section(null, section);

    section = new Gio.Menu();
    submenu = new Gio.Menu();
    section.append_submenu('View', submenu);
    submenu.append("View something", 'app.toggle');
    submenu = new Gio.Menu();
    section.append_submenu('Select', submenu);
    submenu.append("Selection 1", 'app.select::one');
    submenu.append("Selection 2", 'app.select::two');
    submenu.append("Selection 3", 'app.select::thr');
    menu.append_section(null, section);

    section = new Gio.Menu();
    section.append("Close All", 'app.close1');
    section.append("Close", 'app.close2');
    menu.append_section(null, section);

    // Set menu actions
    let actionSaveAs = new Gio.SimpleAction ({ name: 'saveAs' });
        actionSaveAs.connect('activate', () => {
                const saver = new Gtk.FileChooserDialog({title:'Select a destination'});
                saver.set_action(Gtk.FileChooserAction.SAVE);
                saver.add_button('save', Gtk.ResponseType.ACCEPT);
                saver.add_button('cancel', Gtk.ResponseType.CANCEL);
                const res = saver.run();
                if (res == Gtk.ResponseType.ACCEPT) {
                  const filename = saver.get_filename();
                  print(filename);
                  // let data = JSON.stringify(<FILE DATA>, null, '\t');
                  // GLib.file_set_contents(filename, data);
                }
                saver.destroy();
              });
        APP.add_action(actionSaveAs);


    let actionSaveAll = new Gio.SimpleAction ({ name: 'saveAll' });
        actionSaveAll.connect('activate', () => {
                Gtk.FileChooserAction.OPEN
            });
        APP.add_action(actionSaveAll);

    let actionClose1 = new Gio.SimpleAction ({ name: 'close1' });
        actionClose1.connect('activate', () => {
                this.printText('Action close all');
            });
        APP.add_action(actionClose1);

    let actionClose2 = new Gio.SimpleAction ({ name: 'close2' });
        actionClose2.connect('activate', () => {
                this.printText('Action close');
            });
        APP.add_action(actionClose2);

    let actionToggle = new Gio.SimpleAction ({ name: 'toggle', state: new GLib.Variant('b', true) });
        actionToggle.connect('activate', (action) => {
                let state = action.get_state().get_boolean();
                if (state) {
                    action.set_state(new GLib.Variant('b', false));
                } else {
                    action.set_state(new GLib.Variant('b', true));
                }
                this.printText('View ' + state);
            });
        APP.add_action(actionToggle);

    let variant = new GLib.Variant('s', 'one');
    let actionSelect = new Gio.SimpleAction ({ name: 'select', state: variant, parameter_type: variant.get_type() });
        actionSelect.connect('activate', (action, parameter) => {
                let str = parameter.get_string()[0];
                if (str === 'one') {
                    action.set_state(new GLib.Variant('s', 'one'));
                }
                if (str === 'two') {
                    action.set_state(new GLib.Variant('s', 'two'));
                }
                if (str === 'thr') {
                    action.set_state(new GLib.Variant('s', 'thr'));
                }
                this.printText('Selection ' + str);
            });
        APP.add_action(actionSelect);

    return menu;
 };
