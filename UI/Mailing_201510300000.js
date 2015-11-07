/**
UI for displaying mailing data
*/

const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;
const Webkit = imports.gi.WebKit;



const UImailing = new Lang.Class ({
    	Name: 'UImailing',





        openDialog: function() {

        //let filter, chooser, store, combo, renderer, result, name, file, exit = false;

        this.filter = new Gtk.FileFilter();
        this.filter.add_mime_type('text/plain');

        this.chooser = new Gtk.FileChooserDialog({
                action: Gtk.FileChooserAction.OPEN,
                //filter: this.filter,
                select_multiple: false,
                transient_for: this.window,
                title: 'Open'
        });

    // Without setting a current folder, folders won't show its contents
    //
    // Example set home folder by default:
    this.chooser.set_current_folder(GLib.get_home_dir());
    //this.chooser.set_current_folder(path);

    // Add the buttons and its return values
    this.chooser.add_button('Cancel', Gtk.ResponseType.CANCEL);
    this.chooser.add_button('OK', Gtk.ResponseType.OK);

    // This is to add the 'combo' filtering options

    store = new Gtk.ListStore();
    store.set_column_types([GObj.TYPE_STRING, GObj.TYPE_STRING]);
    store.set(store.append(), [0, 1], ['text', 'text/plain']);
    store.set(store.append(), [0, 1], ['js', '*.js']);
    store.set(store.append(), [0, 1], ['md', '*.md']);

    combo = new Gtk.ComboBox({ model: store });
    renderer = new Gtk.CellRendererText();
    combo.pack_start(renderer, false);
    combo.add_attribute(renderer, "text", 1);
    combo.set_active(0);
    combo.connect ('changed', Lang.bind (this, function (widget) {

        let model, active, type, text, filter;

        model = widget.get_model();
        active = widget.get_active_iter()[1];

        type = model.get_value(active, 0);
        text = model.get_value(active, 1);

        if (type === 'text') {
            filter = new Gtk.FileFilter();
            filter.add_mime_type(text);
        } else {
            filter = new Gtk.FileFilter();
            filter.add_pattern(text);
        }

        this.chooser.set_filter(this.filter);
    }));
    this.chooser.set_extra_widget(combo);

    // Run the dialog

    this.result = this.chooser.run();
    fname = this.chooser.get_filename();

    if (this.result === Gtk.ResponseType.OK) {
        //this.openFile(fname);
    }
    this.chooser.destroy();

},

        openFile: function(fname) {

    //let file;

    this.file = Gio.File.new_for_path(fname);

    this.file.load_contents_async(null, Lang.bind(this, function(this.file, res) {
        //let contents;
        try {
            this.contents = this.file.load_contents_finish(res)[1];
            this.buffer.delete(this.buffer.get_iter_at_offset(0),
                               this.buffer.get_iter_at_offset(this.buffer.get_char_count()));
            this.buffer.insert_at_cursor(this.contents.toString() + '\n', -1);
        } catch (e) {
            return;
        }
    }));

    this.file.query_info_async('standard::type,standard::size',
        Gio.FileQueryInfoFlags.NONE, GLib.PRIORITY_LOW, null,
        Lang.bind(this, function(source, async) {

            let info, type, size, text;

            info = source.query_info_finish(async);
            type = info.get_file_type();
            size = info.get_size();

            text = 'File info type: ' + type + ', size: ' + size;
            this.label.set_text(text);
        }));

},

    // Build the application's UI
    _buildUI: function () {


    //
    // choose the csv file for recipients and variables
    //

    let content, scroll, view, label;

    this.content = new Gtk.Grid();
    scroll = new Gtk.ScrolledWindow({ hexpand: true, vexpand: true });
    this.buffer = new Gtk.TextBuffer();
    view = new Gtk.TextView();
    view.set_buffer(this.buffer);

    scroll.add(view);

    this.label = new Gtk.Label({ halign: Gtk.Align.START, label: 'Open a file...' });

    this.content.attach(scroll, 0, 0, 1, 1);
    this.content.attach(this.label, 0, 1, 1, 1);






    //
    // or type a list of addresses
    //

    //
    // type the txt message (main)
    //

    //
    // attach file(s)
    //

        return content;


    }

});

