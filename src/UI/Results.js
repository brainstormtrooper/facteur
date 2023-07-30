const Gtk = imports.gi.Gtk;
const Gio = imports.gi.Gio;
const Gettext = imports.gettext;
const myMessage = imports.object.Message;
const myFile = imports.lib.file;
const GObject = imports.gi.GObject;

const Message = new myMessage.Message();

// const resultsfile = Gio.File.new_for_path('data/resultsMain.ui');
// const [, resultstemplate] = resultsfile.load_contents(null);

var resultsMain = GObject.registerClass( // eslint-disable-line
{
  GTypeName: 'resultsMain',
  Template: 'resource:///io/github/brainstormtrooper/facteur/resultsMain.ui',
  // Children: [],
  InternalChildren: ['textView', 'mTreeView', 'sentLabel', 'sendButton', 'saveButton']
},
class resultsMain extends Gtk.Box {
  _init () {
    super._init();
    
  }
});

var UIresults = GObject.registerClass( // eslint-disable-line
    {
      GTypeName: 'UIresults',
    },
    class UIresults extends GObject.Object {
      _init () {
        super._init();
        this.textBuffer = new Gtk.TextBuffer();
        this.defSentStr = Gettext.gettext('Not yet sent');
      }

      report () {
        this._listStore = new Gtk.ListStore();
        const coltypes = [GObject.TYPE_STRING, GObject.TYPE_STRING];
        this._listStore.set_column_types(coltypes);
        this.mTreeView.set_model(this._listStore);
        const normal = new Gtk.CellRendererText();
        const colTo = new Gtk.TreeViewColumn({
          title: 'To'
        });
        colTo.pack_start(normal, true);
        colTo.add_attribute(normal, 'text', 0);
        this.mTreeView.insert_column(colTo, 0);
        const colRes = new Gtk.TreeViewColumn({
          title: 'Result'
        });
        
        colRes.pack_start(normal, true);
        colRes.add_attribute(normal, 'text', 1);
        this.mTreeView.insert_column(colRes, 1);

        let i;
        for (i = 0; i < Message.results.length; i++) {
          const row = Message.results[i];
          const iter = this._listStore.append();

          this._listStore.set(iter, [0, 1], row);
        }
      }

      _buildUI () {

        this.resultsMain = new resultsMain();

        // this.textBuffer = '';
        this.textView = this.resultsMain._textView;
        this.mTreeView = this.resultsMain._mTreeView;
        this.sentLabel = this.resultsMain._sentLabel;
        this.sendButton = this.resultsMain._sendButton;
        this.saveButton = this.resultsMain._saveButton;

        this.textView.set_buffer(this.textBuffer);

        this.saveButton.connect('clicked', () => {
          const data = myFile.csvFromArray(Message.results);
          const props = { 
            title: 'Save Send Report',
            data
          };
    
          myFile.fileSave(props, (res) => {
            return res;
          });
        });

        this.sendButton.connect('clicked', async () => {
          try {
            const res = await Message.compile();
            if (res) {
              const r = Message.sendAll();
              Promise.all(r).then(() => {
                this.report();
              }).catch((r) => {
                log(r);
              });
            } else {
              const e = new Error('Failed to compile template');
              log(e);
            }
          } catch (error) {
            log(error);
          }
          
        });



        return this.resultsMain;
      }

      _LOG (string, level = 'INFO') {
        const entry = `[${level}] ${string} \r\n`;
        const len = encodeURI(entry).split(/%..|./).length - 1;
        this.textBuffer.insert(this.textBuffer.get_end_iter(), entry, len);
      }
    },
);
