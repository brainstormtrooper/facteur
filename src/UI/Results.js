const Gtk = imports.gi.Gtk;
const Gio = imports.gi.Gio;
const Gettext = imports.gettext;
const myMessage = imports.object.Message;
const myFile = imports.lib.file;
const GObject = imports.gi.GObject;
const myTemplate = imports.object.Template;
const Template = new myTemplate.Template();

const Message = new myMessage.Message();

// const resultsfile = Gio.File.new_for_path('data/resultsMain.ui');
// const [, resultstemplate] = resultsfile.load_contents(null);
var rprtRow = GObject.registerClass(
  {
    GTypeName: 'rprtRow',
  },
  class rprtRow extends GObject.Object {
    _init(to, res) {
      super._init();
      this.to = to;
      this.res = res;
    }
  }
);


var resultsMain = GObject.registerClass( // eslint-disable-line
{
  GTypeName: 'resultsMain',
  Template: 'resource:///io/github/brainstormtrooper/facteur/resultsMain.ui',
  // Children: [],
  InternalChildren: ['textView', 'scrollText2', 'mTreeView', 'sentLabel', 'sendButton', 'saveButton']
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
        delete (this.rTreeView);
        const listStore = new Gio.ListStore(rprtRow);
        const selection = new Gtk.MultiSelection();
        selection.set_model(listStore);
        this.rTreeView = Gtk.ColumnView.new(selection);
        this.rScrolledWindow.set_child(this.rTreeView);
        this.rTreeView.set_model(selection);

        const toFact = new Gtk.SignalListItemFactory();
        toFact.connect("setup", (widget, item) => {
          const label = new Gtk.Label();
          item.set_child(label);
        });
        toFact.connect("bind", (widget, item) => {
          const label = item.get_child();

          const obj = item.get_item();
          label.set_text(obj.to);
        });
        const resFact = new Gtk.SignalListItemFactory();
        resFact.connect("setup", (widget, item) => {
          const label = new Gtk.Label();
          item.set_child(label);
        });
        resFact.connect("bind", (widget, item) => {
          const label = item.get_child();

          const obj = item.get_item();
          label.set_text(obj.res);
        });

        const toCol = new Gtk.ColumnViewColumn({
          title: 'To',
          factory: toFact
        });

        const resCol = new Gtk.ColumnViewColumn({
          title: 'Result',
          factory: resFact
        });

        this.rTreeView.append_column(toCol);
        this.rTreeView.append_column(resCol);
        for (let i = 0; i < Message.results.length; i++) {
          const row = Message.results[i];
          const trow = new rprtRow(row[0], row[1]);
          listStore.append(trow);
        }
      }

      _buildUI () {

        this.resultsMain = new resultsMain();

        // this.textBuffer = '';
        this.textView = this.resultsMain._textView;
        this.rScrolledWindow = this.resultsMain._scrollText2;
        this.rTreeView = this.resultsMain._mTreeView;
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
            const res = await Template.compile();
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
