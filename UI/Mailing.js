/**
UI for displaying mailing data
*/



const myData = imports.object.Data; // import awesome.js from current directory
	//this.mailing = new Mailing.UImailing();

const UImailing = new Lang.Class ({
    	Name: 'UImailing',

   // data: new myData(),


    openFile: function(fname) {


    },


    // Build the application's UI
    _buildUI: function () {

    let pname, fname, result, data;



    this.vBox = new Gtk.VBox({spacing: 6});
    this.hBox = new Gtk.HBox();

    //
    // choose the csv file for recipients and variables
    //

    this.data = new myData.Data();

    this.choosebutton = new Gtk.FileChooserButton({title:'Select a File'});
    this.choosebutton.set_action(Gtk.FileChooserAction.OPEN);

    this.choosebutton.connect('file-set', Lang.bind(this, function() {
        let path = this.choosebutton.get_file().get_path();
        // do something with path

        this.data.Import(path);
        print('Changed is : ' + path);
        //print('================= \n imported : \n' + data.csvstr );

    }));


this.data.connect('Updated_sig', Lang.bind(this, function() {

                print('================= \n imported : \n' + this.data.csva );
                // Data to go in the phonebook
                //this._listStore.clear();
                this.updateTable();

        }));

    this.chooselabel = new Gtk.Label({ halign: Gtk.Align.START, label: 'Open a file...'});

 // Create the underlying liststore for the phonebook


        this._listStore = new Gtk.ListStore ();


        let coltypes = [];
        for (heading in this.data.dataHeadings){
                coltypes.push(GObject.TYPE_STRING);
        }
        this._listStore.set_column_types (coltypes);

        // Data to go in the phonebook
        let phonebook = {"address":"No Data","name":"","likes":""};

        // Put the data in the phonebook
        for (let i = 0; i < phonebook.length; i++ ) {
            let contact = phonebook [i];
            this._listStore.set (this._listStore.append(), [0, 1, 2],
                [contact.address, contact.rname, contact.likes]);
        }

        // Create the treeview
        this._treeView = new Gtk.TreeView ({
            expand: true,
            model: this._listStore });

        // Create the columns for the address book
        let address = new Gtk.TreeViewColumn ({ title: "Address" });
        let rname = new Gtk.TreeViewColumn ({ title: "Name" });
        let likes = new Gtk.TreeViewColumn ({ title: "Likes" });

        // Create a cell renderer for when bold text is needed
        let bold = new Gtk.CellRendererText ({
            weight: Pango.Weight.BOLD });

        // Create a cell renderer for normal text
        let normal = new Gtk.CellRendererText ();

        // Pack the cell renderers into the columns
        address.pack_start (bold, true);
        rname.pack_start (normal, true);
        likes.pack_start (normal, true);

        // Set each column to pull text from the TreeView's model
        address.add_attribute (bold, "text", 0);
        rname.add_attribute (normal, "text", 1);
        likes.add_attribute (normal, "text", 2);

        // Insert the columns into the treeview
        this._treeView.insert_column (address, 0);
        this._treeView.insert_column (rname, 1);
        this._treeView.insert_column (likes, 2);

        // Create the label that shows details for the name you select
        this._label = new Gtk.Label ({ label: "" });

        // Get which item is selected
        this.selection = this._treeView.get_selection();

        // When something new is selected, call _on_changed
        this.selection.connect ('changed', Lang.bind (this, this._onSelectionChanged));

        // Create a grid to organize everything in
        this._grid = new Gtk.Grid;

        // Attach the treeview and label to the grid
        this._grid.attach (this._treeView, 0, 0, 1, 1);
        this._grid.attach (this._label, 0, 1, 1, 1);








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

    //
    // or type a list of addresses
    //

    //
    // type the txt message (main)
    //

    //
    // attach file(s)
    //

        return this.vBox;
},

        updateTable: function (){

                let phonebook = this.data.csva;
                let k;
                //this._listStore = new Gtk.ListStore ();


                let coltypes = [];
                for (k in this.data.headers){
                        coltypes.push(GObject.TYPE_STRING);
                }
                this._listStore.set_column_types (coltypes);

                // Create the treeview
                this._treeView = new Gtk.TreeView ({
                    expand: true,
                    model: this._listStore });
                // Create a cell renderer for normal text
                let normal = new Gtk.CellRendererText ();
                let bold = new Gtk.CellRendererText ({
                        weight: Pango.Weight.BOLD });

                // Create the columns for the address book
                for (k=0; k<this.data.headers.length; k++){
                        print('***key is : ' + k + ', val is : ' + this.data.headers[k] + ' of type : ' + typeof(this.data.headers[k]));

                        let col=k;
                        col = new Gtk.TreeViewColumn ({ title: this.data.headers[k] });
                        col.pack_start (normal, true);
                        if(k==0){
                                col.add_attribute (bold, "text", k);
                        }else{
                                col.add_attribute (normal, "text", k);
                        }

                        this._treeView.insert_column (col, k);
                }




                // Put the data in the phonebook
                let i;
                for (i = 0; i < this.data.csva.length; i++ ) {






                        let contact = this.data.csva[i];
                        print('trying to push : ' + contact[0].toString());
                        print('... the data is of type : ' + typeof(contact[1]));
                        let iter = this._listStore.append();
                        /*
                        this._listStore.set (k, [0, 1, 2],
                        [{contact[0].toString(), contact[1].toString(), contact[2].toString()}]);
                        */
                        this._listStore.set (iter, Object.keys(this.data.headers), contact);

                }

        },

   _onSelectionChanged: function () {

        // Grab a treeiter pointing to the current selection
        let [ isSelected, model, iter ] = this.selection.get_selected();

        // Set the label to read off the values stored in the current selection
        this._label.set_label ("\n" +
            this._listStore.get_value (iter, 0) + " " +
            this._listStore.get_value (iter, 1) + " " +
            this._listStore.get_value (iter, 2) + "\n" +
            this._listStore.get_value (iter, 3));

    },


});

