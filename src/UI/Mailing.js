/**
UI for displaying mailing list data
*/
const Gtk = imports.gi.Gtk;
const Gettext = imports.gettext;
const GObject = imports.gi.GObject;
const Pango = imports.gi.Pango;
const Lang = imports.lang;
const myList = imports.object.List; 
const Modal = imports.UI.Modal;
const Data = imports.object.Data;
const appData = new Data.Data().data;

var UImailing = GObject.registerClass( // eslint-disable-line
  {
    GTypeName: 'UImailing',
    Signals: {
      'Logger': {
        param_types: [GObject.TYPE_STRING]
      },      
      'Updated_sig': {
        param_types: [GObject.TYPE_BOOLEAN]
      }
    }
  }, 
  class UImailing extends GObject.Object {
    _init() {
      super._init();           
    }

    // Build the application's UI
    _buildUI() {

      this.vBox = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL, 
        spacing: 6
      });
      this.hBox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL });
      this.scrollView = new Gtk.ScrolledWindow({ vexpand: true });

      //
      // choose the csv file for recipients and variables
      //

      this.list = new myList.List();

      this.choosebutton = new Gtk.FileChooserButton({
        title: Gettext.gettext('Select a file')
      });
      this.choosebutton.set_action(Gtk.FileChooserAction.OPEN);

      this.choosebutton.connect('file-set', Lang.bind(this, function () {
        let path = this.choosebutton.get_file().get_path();
        // do something with path
        this.list.Import(path);
        // app.ui.results._LOG('CSV File path is : ' + path);
        try {
          this.emit('Logger', 'CSV File path is : ' + path);
        } catch (error) {
          log(error);
        }
        
      
      }));

      this.list.connect('Import_error_sig', Lang.bind(this, function () {
        const myModal = new Modal.UImodal();
        myModal.showOpenModal('Error', Gettext.gettext('Error importing file. Not a valid mailing list'));

      }));

      this.list.connect('Updated_sig', Lang.bind(this, function () {

        // app.ui.results._LOG('imported.');
        try {
          this.emit('Logger', 'imported...');
        } catch (error) {
          log(error);
        }
        
        // Data to go in the phonebook
        this.updateTable();

      }));

      this.chooselabel = new Gtk.Label({
        halign: Gtk.Align.START,
        label: Gettext.gettext('Open a file')
      });

      // Create the underlying liststore for the table

      this._listStore = new Gtk.ListStore();

      let coltypes = [GObject.TYPE_STRING];
      this._listStore.set_column_types(coltypes);

      // Create the treeview
      this._treeView = new Gtk.TreeView({
        expand: true
      });

      this._treeView.set_model(this._listStore);
      // Create a cell renderer for when bold text is needed
      let bold = new Gtk.CellRendererText({
        weight: Pango.Weight.BOLD
      });

      // Create a cell renderer for normal text
      // let normal = new Gtk.CellRendererText();

      // Create the columns for the address book
      let defCol = new Gtk.TreeViewColumn({
        title: Gettext.gettext('No data')
      });

      // Pack the cell renderers into the columns
      defCol.pack_start(bold, true);

      // Set each column to pull text from the TreeView's model
      defCol.add_attribute(bold, "text", 0);

      // Insert the columns into the treeview
      this._treeView.insert_column(defCol, 0);

      // Create the label that shows details for the name you select
      this._label = new Gtk.Label({
        label: ""
      });

      // Get which item is selected
      this.selection = this._treeView.get_selection();

      // Create a grid to organize everything in
      this._grid = new Gtk.Grid();

      // Attach the treeview and label to the grid
      this._grid.attach(this._treeView, 0, 0, 1, 1);
      this._grid.attach(this._label, 0, 1, 1, 1);
      this.scrollView.add(this._grid);
      this.hBox.pack_start(this.chooselabel, false, false, 0);
      this.hBox.pack_start(this.choosebutton, false, false, 0);
      this.vBox.pack_start(this.hBox, false, false, 0);
      this.vBox.pack_start(this.scrollView, true, true, 0);

      
      if (this.choosebutton.selection_changed) {
        log('You selected : ' + this.choosebutton.selection_changed);
      }


      return this.vBox;
    }
    _updateUI() {
      this.list.csva = appData.CSVA;
      this.list.headers = appData.VARS;
      this.updateTable();
    }

    updateTable() {
      
      let k;
      delete (this._listStore);
      this._listStore = new Gtk.ListStore();

      let coltypes = [];

      for (let index = 0; index < this.list.headers.length; index++) {
        coltypes.push(GObject.TYPE_STRING);
        
      }

      this._listStore.set_column_types(coltypes);

      // Replace the treeview
      this._treeView.get_columns().forEach(col => {
        this._treeView.remove_column(col);
      });
      this._treeView.set_model(this._listStore);
      
      // Create cell renderers
      let normal = new Gtk.CellRendererText();

      // Create the columns for the address book

      for (k = 0; k < this.list.headers.length; k++) {
        
        this[`col_${k}`] = new Gtk.TreeViewColumn({
          title: this.list.headers[k]
        });
        this[`col_${k}`].pack_start(normal, true);
        if (k == 0) {
          this[`col_${k}`].add_attribute(normal, "text", k);
        } else {
          this[`col_${k}`].add_attribute(normal, "text", k);
        }
        try {
          this._treeView.insert_column(this[`col_${k}`], k);
        } catch (err) {
          log(err);
        }

      }

      // Put the data in the table
      let i;
      for (i = 0; i < this.list.csva.length; i++) {

        let row = this.list.csva[i];
        let iter = this._listStore.append();


        this._listStore.set(iter, Object.keys(this.list.headers), row);

      }
    }
  }
);
