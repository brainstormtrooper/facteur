/**
UI for displaying mailing list data
*/
const myData = imports.object.Data; // import awesome.js from current directory
//this.mailing = new Mailing.UImailing();

const UImailing = new Lang.Class({
  Name: 'UImailing',

  // Build the application's UI
  _buildUI: function() {

    let pname, fname, result, data;

    this.vBox = new Gtk.VBox({
      spacing: 6
    });
    this.hBox = new Gtk.HBox();

    //
    // choose the csv file for recipients and variables
    //

    this.data = new myData.Data();

    this.choosebutton = new Gtk.FileChooserButton({
      title: 'Select a File'
    });
    this.choosebutton.set_action(Gtk.FileChooserAction.OPEN);

    this.choosebutton.connect('file-set', Lang.bind(this, function() {
      let path = this.choosebutton.get_file().get_path();
      // do something with path

      this.data.Import(path);
      print('Changed is : ' + path);
      //print('================= \n imported : \n' + data.csvstr );

    }));

    this.data.connect('Updated_sig', Lang.bind(this, function() {

      print('================= \n imported : \n' + this.data.csva);
      // Data to go in the phonebook
      //this._listStore.clear();
      this.updateTable();

    }));

    this.chooselabel = new Gtk.Label({
      halign: Gtk.Align.START,
      label: 'Open a file...'
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
    let normal = new Gtk.CellRendererText();

    // Create the columns for the address book
    let defCol = new Gtk.TreeViewColumn({
      title: "No Data"
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

    // When something new is selected, call _on_changed
    this.selection.connect('changed', Lang.bind(this, this._onSelectionChanged));

    // Create a grid to organize everything in
    this._grid = new Gtk.Grid;

    // Attach the treeview and label to the grid
    this._grid.attach(this._treeView, 0, 0, 1, 1);
    this._grid.attach(this._label, 0, 1, 1, 1);

    this.hBox.pack_start(this.chooselabel, false, false, 0);
    this.vBox.pack_start(this.hBox, false, false, 0);
    this.vBox.pack_start(this.choosebutton, false, false, 0);
    this.vBox.pack_start(this._grid, true, true, 0);

    /*
    this.choosebutton.selection_changed = function(){
        pname = this.choosebutton.get_filename();
        print('You picked : ' + pname);
    }
    */
    //pname = this.choosebutton.selection_changed;

    //fname = gtk_file_chooser_get_filename(GtkFileChooser, this.choosebutton);
    //fname = this.choosebutton.gtk_file_chooser_get_filename();
    print('Changed is : ' + this.choosebutton.selection_changed);
    //print('Filename is : ' + this.choosebutton.get_filename().get_path());

    return this.vBox;
  },
  _updateUI: function() {
    this.data.csva = CSVA;
    this.data.headers = VARS;
    this.updateTable();
  },
  updateTable: function() {
    // this._grid.remove(this._treeView);
    /*
    this._treeView = new Gtk.TreeView({
      expand: true
    });
    */
    // this.vBox.remove(this._grid);
    let phonebook = this.data.csva;
    let k;
    //this._treeView.remove(this._listStore);
    delete(this._listStore);
    this._listStore = new Gtk.ListStore();
    // this._treeView.add(this._listStore);

    let coltypes = [];
    this.data.headers.forEach((h) => {

      coltypes.push(GObject.TYPE_STRING);

    });

    print(coltypes);
    this._listStore.set_column_types(coltypes);

    // Replace the treeview
    this._treeView.get_columns().forEach(col => {
      this._treeView.remove_column(col);
    });
    this._treeView.set_model(this._listStore);
    /*
    this._treeView = new Gtk.TreeView ({
        expand: true,
        model: this._listStore });
       */
    // Create cell renderers
    let normal = new Gtk.CellRendererText();
    let bold = new Gtk.CellRendererText({
      weight: Pango.Weight.BOLD
    });

    // Create the columns for the address book

    for (k = 0; k < this.data.headers.length; k++) {
      print('***key is : ' + k + ', val is : ' + this.data.headers[k] + ' of type : ' + typeof(this.data.headers[k]));

      // let col=k;
      this[`col_${k}`] = new Gtk.TreeViewColumn({
        title: this.data.headers[k]
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
        print(err);
      }

    }

    // Put the data in the table
    let i;
    for (i = 0; i < this.data.csva.length; i++) {

      let row = this.data.csva[i];
      print('trying to push : ' + row[0].toString());
      print('... the data is of type : ' + typeof(row[1]));
      let iter = this._listStore.append();

      // this._listStore.set (iter, [0, 1, 2],
      // [contact[0].toString(), contact[1].toString(), contact[2].toString()]);

      this._listStore.set(iter, Object.keys(this.data.headers), row);

    }
    // this._treeView.add(this._listStore);
    // this._grid.attach (this._treeView, 0, 0, 1, 1);
    // this.vBox.pack_start(this._treeView, true, true, 0);
  },

  _onSelectionChanged: function() {

    // Grab a treeiter pointing to the current selection
    let [isSelected, model, iter] = this.selection.get_selected();

    // Set the label to read off the values stored in the current selection
    /*
        this._label.set_label ("\n"
            this._listStore.get_value (iter, 0) + " " +
            this._listStore.get_value (iter, 1) + " " +
            this._listStore.get_value (iter, 2) + "\n" +
            this._listStore.get_value (iter, 3));
*/
  },

});


