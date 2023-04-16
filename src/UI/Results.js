const Gtk = imports.gi.Gtk;
const Gio = imports.gi.Gio;
const Gettext = imports.gettext;
const myMessage = imports.object.Message;
const GObject = imports.gi.GObject;

const Message = new myMessage.Message();

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
        const vBox = new Gtk.Box({
          orientation: Gtk.Orientation.VERTICAL, spacing: 6,
        });
        const checkboxRow = new Gtk.Box({
          orientation: Gtk.Orientation.HORIZONTAL,
        });
        const SendbuttonRow = new Gtk.Box({
          orientation: Gtk.Orientation.HORIZONTAL,
        });
        const logWindow = new Gtk.ScrolledWindow({ vexpand: true });
        const logText = new Gtk.TextView({
          buffer: this.textBuffer, editable: false,
        });
        this.sentLabel = new Gtk.Label(
            { halign: Gtk.Align.END, label: this.defSentStr },
        );
        this.sendButton = new Gtk.Button({ label: Gettext.gettext('Send') });

        logWindow.set_child(logText);
        SendbuttonRow.append(this.sendButton);
        SendbuttonRow.append(this.sentLabel);
        vBox.prepend(checkboxRow);
        vBox.prepend(logWindow);
        vBox.append(SendbuttonRow);


        this.sendButton.connect('clicked', async () => {
          try {
            const res = await Message.compile();
            if (res) {
              Message.sendAll();
            } else {
              const e = new Error('Failed to compile template');
              logError(e);
            }
          } catch (error) {
            logError(error);
          }
          
        });

        return vBox;
      }

      _LOG (string, level = 'INFO') {
        const entry = `[${level}] ${string} \r\n`;
        const len = encodeURI(entry).split(/%..|./).length - 1;
        this.textBuffer.insert(this.textBuffer.get_end_iter(), entry, len);
      }
    },
);
