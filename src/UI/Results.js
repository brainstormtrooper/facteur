const Gtk = imports.gi.Gtk;
const Gio = imports.gi.Gio;
const Gettext = imports.gettext;
const myMessage = imports.object.Message;
const GObject = imports.gi.GObject;

const Message = new myMessage.Message();

// const resultsfile = Gio.File.new_for_path('data/resultsMain.ui');
// const [, resultstemplate] = resultsfile.load_contents(null);

var resultsMain = GObject.registerClass( // eslint-disable-line
{
  GTypeName: 'resultsMain',
  Template: 'resource:///com/github/brainstormtrooper/facteur/resultsMain.ui',
  // Children: [],
  InternalChildren: ['textView', 'sentLabel', 'sendButton']
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

      _buildUI () {

        this.resultsMain = new resultsMain();

        // this.textBuffer = '';
        this.textView = this.resultsMain._textView;
        this.sentLabel = this.resultsMain._sentLabel;
        this.sendButton = this.resultsMain._sendButton;

        this.textView.set_buffer(this.textBuffer);


        this.sendButton.connect('clicked', async () => {
          try {
            const res = await Message.compile();
            if (res) {
              Message.sendAll();
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
