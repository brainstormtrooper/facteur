const myTemplate = imports.object.Template;
const myMessage = imports.object.Message;
const Template = new myTemplate.Template();
const Message = new myMessage.Message();
// this.mailing = new Mailing.UImailing();

const UIresults = new Lang.Class ({
  Name: 'UIresults',

  _buildUI: function () {

    const vBox = new Gtk.VBox({spacing: 6});
    const checkboxRow = new Gtk.HBox();
    const SendbuttonRow = new Gtk.HBox();
    const logWindow = new Gtk.ScrolledWindow({ vexpand: true });
    this.textBuffer = new Gtk.TextBuffer();
    const logText = new Gtk.TextView({ buffer: this.textBuffer, editable: false });
    // const checkbutton = new Gtk.CheckButton({label: "Use HTML"});
    const sendButton = new Gtk.Button({label: "Send"});

    // checkboxRow.pack_start(checkbutton, false, false, 0);
    logWindow.add(logText);
    SendbuttonRow.pack_end(sendButton, false, false, 0);
    vBox.pack_start(checkboxRow, false, false, 0);
    vBox.pack_start(logWindow, true, true, 0);
    vBox.pack_end(SendbuttonRow, false, false, 0);



    sendButton.connect('clicked', async () => {
      const res = await Template.Compile();
      if (res) {
        const sent = Message.SendAll();
      } else {
        print('Failed...');
      }
      // Message.SendAll();
    });

    return vBox;
  },

  _LOG: function(string, level = 'INFO') {
    const entry = `[${level}] ${string} \r\n`
    const len = encodeURI(entry).split(/%..|./).length - 1;
    this.textBuffer.insert(this.textBuffer.get_end_iter(), entry, len);
  }
});
