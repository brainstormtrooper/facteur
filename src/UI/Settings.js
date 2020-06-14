/**
UI for displaying mailing settings
*/
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;
const Gettext = imports.gettext;

var UIsettings = new Lang.Class({
  Name: 'UIsettings',
  // Implements: [Signals.WithSignals],

  _init: function () {

    // Signals.addSignalMethods(this);
  },

  _updateUI() {
    // log('Updating UI (settings)');
    try {
      this.userField.set_text(app.Data.USER);
      this.passField.set_text(app.Data.PASS);
      this.smtpField.set_text(app.Data.HOST);
      this.subjectField.set_text(app.Data.SUBJECT);
      this.fromField.set_text(app.Data.FROM);
    } catch (err) {
      log(err);
    }
  },

  _buildUI: function () {
    // this.parent();
    // https://developer.gnome.org/gtk3/stable/GtkEntry.html
    const vBox = new Gtk.VBox({ spacing: 6 });

    const fromBox = new Gtk.HBox({ spacing: 6 });
    const smtpBox = new Gtk.HBox({ spacing: 6 });
    const userBox = new Gtk.HBox({ spacing: 6 });
    const passBox = new Gtk.HBox({ spacing: 6 });
    const subjectBox = new Gtk.HBox({ spacing: 6 });
    const buttonBox = new Gtk.HBox({ spacing: 6 });

    this.fromField = new Gtk.Entry({ placeholder_text: Gettext.gettext('From e-mail') });
    this.smtpField = new Gtk.Entry({ placeholder_text: Gettext.gettext('Smtp host') });
    this.userField = new Gtk.Entry({ placeholder_text: Gettext.gettext('Smtp user') });
    this.passField = new Gtk.Entry({ placeholder_text: Gettext.gettext('Smtp password'), visibility: false, input_purpose: "password" });
    this.subjectField = new Gtk.Entry({ placeholder_text: Gettext.gettext('E-mail subject') });
    const saveButton = new Gtk.Button({ label: Gettext.gettext('Save') });

    fromBox.pack_start(this.fromField, false, false, 0);
    smtpBox.pack_start(this.smtpField, false, false, 0);
    userBox.pack_start(this.userField, false, false, 0);
    passBox.pack_start(this.passField, false, false, 0);
    subjectBox.pack_start(this.subjectField, false, false, 0);
    buttonBox.pack_end(saveButton, false, false, 0);

    vBox.pack_start(fromBox, false, false, 0);
    vBox.pack_start(smtpBox, false, false, 0);
    vBox.pack_start(userBox, false, false, 0);
    vBox.pack_start(passBox, false, false, 0);
    vBox.pack_start(subjectBox, false, false, 0);
    vBox.pack_end(buttonBox, false, false, 0);

    saveButton.connect('clicked', () => {
      app.Data.USER = this.userField.get_text();
      app.Data.PASS = this.passField.get_text();
      app.Data.HOST = this.smtpField.get_text();
      app.Data.SUBJECT = this.subjectField.get_text();
      app.Data.FROM = this.fromField.get_text();
      const str = ` >>> SETTINGS: "${app.Data.USER}", "${app.Data.HOST}", "${app.Data.SUBJECT}", "${app.Data.FROM}"...`;

      app.ui.results._LOG(str);
      // Signals.addSignalMethods(this);
      // this.emit('Log', str);
      // print(str);
    })

    return vBox;
  },

  _buildModal: function () {
    const vBox = new Gtk.VBox({ spacing: 6 });

    const hashBox = new Gtk.HBox({ spacing: 6 });
    const ipv4Box = new Gtk.HBox({ spacing: 6 });
    // const buttonBox = new Gtk.HBox({spacing: 6});

    this.hashField = new Gtk.Entry({ placeholder_text: Gettext.gettext('Password Hash') });
    this.ipv4Field = new Gtk.CheckButton({ label: Gettext.gettext('Force ipv4') });
    // const saveButton = new Gtk.Button({label: Gettext.gettext('Save')});
    // const cancelButton = new Gtk.Button({label: Gettext.gettext('Cancel')});

    hashBox.pack_start(this.hashField, false, false, 0);
    ipv4Box.pack_start(this.ipv4Field, false, false, 0);
    // buttonBox.pack_start(cancelButton, false, false, 0);
    // buttonBox.pack_end(saveButton, false, false, 0);

    vBox.pack_start(hashBox, false, false, 0);
    vBox.pack_start(ipv4Box, false, false, 0);
    // vBox.pack_end(buttonBox, false, false, 0);

    return vBox;
  }
});
