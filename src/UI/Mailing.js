/**
UI for displaying mailing list data
*/
const Gtk = imports.gi.Gtk;
const Gio = imports.gi.Gio;
const Gettext = imports.gettext;
const GObject = imports.gi.GObject;
const Pango = imports.gi.Pango;
const Lang = imports.lang;
const myList = imports.object.List;
const Modal = imports.UI.Modal;
const Data = imports.object.Data;
const myFile = imports.lib.file;
const appData = new Data.Data();


// const mailingfile = Gio.File.new_for_path('data/mailingMain.ui');
// const [, mailingemplate] = mailingfile.load_contents(null);

var mailingMain = GObject.registerClass( // eslint-disable-line
{
  GTypeName: 'mailingMain',
  Template: 'resource:///com/github/brainstormtrooper/facteur/mailingMain.ui',
  // Children: [],
  InternalChildren: ['mnewButton', 'mScrolledWindow', 'mTreeView']
},
class mailingMain extends Gtk.Box {
  _init () {
    super._init();
    
  }
});


var UImailing = GObject.registerClass( // eslint-disable-line
    {
      GTypeName: 'UImailing',
      Signals: {
        'Logger': {
          param_types: [GObject.TYPE_STRING],
        },
        'Updated_sig': {
          param_types: [GObject.TYPE_BOOLEAN],
        },
      },
    },
    class UImailing extends GObject.Object {
      _init () {
        super._init();
      }

      // Build the application's UI
      _buildUI () {
        this.App = Gio.Application.get_default();


        this.mailingMain = new mailingMain();

        const mnewButton = this.mailingMain._mnewButton;
        const mScrolledWindow = this.mailingMain._mScrolledWindow;

        this.mTreeView = this.mailingMain._mTreeView;

        /* eslint-disable no-invalid-this */
        this.list = new myList.List();


        mnewButton.connect('clicked', () => {
          const props = {
            title: 'Select A Mailing List'
          }
          try {
        
            myFile.fileOpen(props, (res) => {
              appData.set('FILENAME', res.get_basename());
              // appData.set('FILENAME', 'test');
              const td = new TextDecoder();
              const [, contents] = res.load_contents(null);
              const myList = td.decode(contents);
              try { 
                this.list.import(myList);
              } catch (error) {
                logError(error);
              }
              this.App.emit('Logger', 'CSV File is : ' + res.get_basename());
              this.App.emit('update_ui', true);
              // eslint-disable-next-line max-len
              this.App.emit('Logger', `Opened file : ${appData.get('FILENAME')}.`);
            });
            
          } catch (error) {
            log(error);
            throw(error);
          }
        });

        this.list.connect('Import_error_sig', Lang.bind(this, function () {
          const myModal = new Modal.UImodal();
          myModal.showOpenModal(
              'Error',
              Gettext.gettext(
                  'Error importing file. Not a valid mailing list',
              ),
          );
        }));

        this.list.connect('Updated_sig', Lang.bind(this, function () {
          // app.ui.results._LOG('imported.');
          this.emit('Logger', 'imported...');

          // Data to go in the phonebook
          this.updateTable();
        }));

        this._listStore = new Gtk.ListStore();

        const coltypes = [GObject.TYPE_STRING];
        const bold = new Gtk.CellRendererText({
          weight: Pango.Weight.BOLD,
        });

        this._listStore.set_column_types(coltypes);

        this.mTreeView.set_model(this._listStore);

        const defCol = new Gtk.TreeViewColumn({
          title: Gettext.gettext('No data'),
        });
        defCol.pack_start(bold, true);
        defCol.add_attribute(bold, 'text', 0);

        this.mTreeView.insert_column(defCol, 0);



        return this.mailingMain;
      }

      
      _updateUI () {
        this.list.csva = appData.get('CSVA');
        this.list.headers = appData.get('VARS');
        this.updateTable();
      }

      updateTable () {
        let k;
        delete (this._listStore);
        this._listStore = new Gtk.ListStore();

        const coltypes = [];

        for (let index = 0; index < this.list.headers.length; index++) {
          coltypes.push(GObject.TYPE_STRING);
        }

        this._listStore.set_column_types(coltypes);

        // Replace the treeview
        this.mTreeView.get_columns().forEach((col) => {
          this.mTreeView.remove_column(col);
        });
        this.mTreeView.set_model(this._listStore);
        // Create cell renderers
        const normal = new Gtk.CellRendererText();

        // Create the columns for the address book

        for (k = 0; k < this.list.headers.length; k++) {
          this[`col_${k}`] = new Gtk.TreeViewColumn({
            title: this.list.headers[k],
          });
          this[`col_${k}`].pack_start(normal, true);
          if (k == 0) {
            this[`col_${k}`].add_attribute(normal, 'text', k);
          } else {
            this[`col_${k}`].add_attribute(normal, 'text', k);
          }
          try {
            this.mTreeView.insert_column(this[`col_${k}`], k);
          } catch (err) {
            log(err);
          }
        }

        // Put the data in the table
        let i;
        for (i = 0; i < this.list.csva.length; i++) {
          const row = this.list.csva[i];
          const iter = this._listStore.append();


          this._listStore.set(iter, Object.keys(this.list.headers), row);
        }
      }
    },
);
