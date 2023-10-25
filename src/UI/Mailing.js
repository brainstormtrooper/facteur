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
const myModal = new imports.UI.Modal.UImodal();
const Data = imports.object.Data;
const myFile = imports.lib.file;
const appData = new Data.Data();


// const mailingfile = Gio.File.new_for_path('data/mailingMain.ui');
// const [, mailingemplate] = mailingfile.load_contents(null);


var dataRow = GObject.registerClass(
  {
    GTypeName: 'dataRow',
  },
  class dataRow extends GObject.Object {
    _init(keys, vals) {
      super._init();
      for (let i = 0; i < keys.length; i++) {
        this[keys[i]] = vals[i];
        
      }
    }
  }
);

var mailingMain = GObject.registerClass( // eslint-disable-line
{
  GTypeName: 'mailingMain',
  Template: 'resource:///io/github/brainstormtrooper/facteur/mailingMain.ui',
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
        this.mScrolledWindow = this.mailingMain._mScrolledWindow;

        this.mTreeView = this.mailingMain._mTreeView;

        /* eslint-disable no-invalid-this */
        this.list = new myList.List();


        mnewButton.connect('clicked', () => {
          const props = {
            title: Gettext.gettext('Select A Mailing List')
          }
          try {
        
            myFile.fileOpen(props, (res) => {
              const td = new TextDecoder();
              const [, contents] = res.load_contents(null);
              const myList = td.decode(contents);
              try { 
                this.list.import(myList);
                this.App.emit('Logger', 'CSV File is : ' + res.get_parse_name());
                this.App.emit('update_ui', true);
                // eslint-disable-next-line max-len
              } catch (error) {
                logError(error);
                myModal.showOpenModal('Error', error.message, this.App);
              }
              
            });
            
          } catch (error) {
            log(error);
            throw(error);
          }
        });

        this.list.connect('Import_error_sig', Lang.bind(this, function () {
          
          myModal.showOpenModal(
              'Error',
              Gettext.gettext(
                  'Error importing file. Not a valid mailing list',
              ),
              this.App
          );
        }));

        this.list.connect('Updated_sig', Lang.bind(this, function () {
          // app.ui.results._LOG('imported.');
          this.emit('Logger', 'imported...');

          this.updateTable();
        }));

        this.mTreeView.set_model(new Gtk.SingleSelection());

        const defCol = new Gtk.ColumnViewColumn({
          title: Gettext.gettext('No data'),
        });

        this.mTreeView.append_column(defCol);

        return this.mailingMain;
      }

      
      _updateUI () {
        this.list.csva = appData.get('CSVA');
        this.list.headers = appData.get('VARS');
        this.updateTable();
      }

      updateTable () {
        // delete (this._listStore);
        delete (this.mTreeView);
        this.cols = {};
        this.facts = {};
        
        const selection = new Gtk.MultiSelection();
        const listStore = new Gio.ListStore(dataRow);
        selection.set_model(listStore);
        this.mTreeView = new Gtk.ColumnView(selection);
        this.mScrolledWindow.set_child(this.mTreeView);
        this.mTreeView.set_model(selection);
        // Create cell renderers
        // const normal = new Gtk.CellRendererText();

        // Create the columns for the address book
        for (let k = 0; k < this.list.headers.length; k++) {
          // this[`_listStore_${k}`] = new Gio.ListStore(GObject.TYPE_STRING);
          try {
            this.facts[`factory_c${k}`] = new Gtk.SignalListItemFactory();
            this.facts[`factory_c${k}`].connect("setup", (widget, item) => {
              const label = new Gtk.Label();
              item.set_child(label);
            });
            this.facts[`factory_c${k}`].connect("bind", (widget, item) => {
              const label = item.get_child();
    
              const obj = item.get_item();
              label.set_text(obj[this.list.headers[k]]);
              // label.bind_property("text", obj, "text");
            });
            
            this.cols[`col_${k}`] = new Gtk.ColumnViewColumn({
              title: this.list.headers[k],
              factory: this.facts[`factory_c${k}`]
            });
            
            this.mTreeView.append_column(this.cols[`col_${k}`]);
          } catch (err) {
            console.error(err);
          }
        }
        
        // Put the data in the table
        for (let i = 0; i < this.list.csva.length; i++) {
          const row = this.list.csva[i];
          
          try {
            
            const trow = new dataRow(this.list.headers, row);
            
            if (trow.address) {
              listStore.append(trow);
            }
            
          } catch (error) {
            console.error(error);
          }
          
        }
      }
    },
);
