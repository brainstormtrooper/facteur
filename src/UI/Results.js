const Lang = imports.lang;
const Gtk = imports.gi.Gtk;
const Gettext = imports.gettext;

const myTemplate = imports.object.Template;
const myMessage = imports.object.Message;
const Template = new myTemplate.Template();
const Message = new myMessage.Message();
const Signals = imports.signals;

var UIresults = new Lang.Class({
  Name: 'UIresults',
  Implements: [Signals.WithSignals],

  _init: function () {

    this.emit('bob', false);
    
    this.connect('Log', (msg) => {
      log('>>> Log Entry from Results signal');
      this._LOG(msg);
    });
    
  },

  _buildUI: function () {

    const vBox = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 6 });
    const checkboxRow = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL });
    const SendbuttonRow = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL });
    const logWindow = new Gtk.ScrolledWindow({ vexpand: true });
    this.textBuffer = new Gtk.TextBuffer();
    const logText = new Gtk.TextView({ buffer: this.textBuffer, editable: false });
    const sendButton = new Gtk.Button({ label: Gettext.gettext('Send') });

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
        log('Failed...');
      }
     
    });

    return vBox;
  },

  _LOG: function (string, level = 'INFO') {
    const entry = `[${level}] ${string} \r\n`
    const len = encodeURI(entry).split(/%..|./).length - 1;
    this.textBuffer.insert(this.textBuffer.get_end_iter(), entry, len);
  }
});
