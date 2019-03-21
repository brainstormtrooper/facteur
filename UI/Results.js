const myTemplate = imports.object.Template;
const myMessage = imports.object.Message;
const Template = new myTemplate.Template();
const Message = new myMessage.Message();
// this.mailing = new Mailing.UImailing();

const UIresults = new Lang.Class ({
  Name: 'UIhtml',

  _buildUI: function () {
    const vBox = new Gtk.VBox({spacing: 6});
    const checkboxRow = new Gtk.HBox();
    const SendbuttonRow = new Gtk.HBox();
    // const checkbutton = new Gtk.CheckButton({label: "Use HTML"});
    const sendButton = new Gtk.Button({label: "Send"});

    // checkboxRow.pack_start(checkbutton, false, false, 0);
    SendbuttonRow.pack_end(sendButton, false, false, 0);
    vBox.pack_start(checkboxRow, false, false, 0);
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
});
