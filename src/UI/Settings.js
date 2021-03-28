/**
UI for displaying mailing settings
*/
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;
const Gettext = imports.gettext;
const Signals = imports.signals;

var UIsettings = new Lang.Class({
  Name: 'UIsettings',
  Implements: [Signals.WithSignals],

  _init: function () {

    this.emit('bob', false);
  },

  _updateUI() {
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
    // https://developer.gnome.org/gtk3/stable/GtkEntry.html
    this.emit('Log', '>>> building UI...');
    const vBox = new Gtk.VBox({ spacing: 6 });

    const fromlabelBox = new Gtk.HBox({ spacing: 6 });
    const fromBox = new Gtk.HBox({ spacing: 6 });
    const smtplabelBox = new Gtk.HBox({ spacing: 6 });
    const smtpBox = new Gtk.HBox({ spacing: 6 });
    const userlabelBox = new Gtk.HBox({ spacing: 6 });
    const userBox = new Gtk.HBox({ spacing: 6 });
    const passlabelBox = new Gtk.HBox({ spacing: 6 });
    const passBox = new Gtk.HBox({ spacing: 6 });
    const subjectlabelBox = new Gtk.HBox({ spacing: 6 });
    const subjectBox = new Gtk.HBox({ spacing: 6 });
    const buttonBox = new Gtk.HBox({ spacing: 6 });

    const fromlabel = new Gtk.Label({ halign: Gtk.Align.START, label: Gettext.gettext('From e-mail') });
    const smtplabel = new Gtk.Label({ halign: Gtk.Align.START, label: Gettext.gettext('Smtp host') });
    const userlabel = new Gtk.Label({ halign: Gtk.Align.START, label: Gettext.gettext('Smtp user') });
    const passlabel = new Gtk.Label({ halign: Gtk.Align.START, label: Gettext.gettext('Smtp password') });
    const subjectlabel = new Gtk.Label({ halign: Gtk.Align.START, label: Gettext.gettext('E-mail subject') });

    this.fromField = new Gtk.Entry({ placeholder_text: Gettext.gettext('me@domain.ext') });
    this.smtpField = new Gtk.Entry({ placeholder_text: Gettext.gettext('smtp(s)://sub.domain.ext:123') });
    this.userField = new Gtk.Entry({ placeholder_text: Gettext.gettext('Username') });
    this.passField = new Gtk.Entry({ placeholder_text: Gettext.gettext('Password'), visibility: false, input_purpose: "password" });
    this.subjectField = new Gtk.Entry({ placeholder_text: Gettext.gettext('Subject') });
    const saveButton = new Gtk.Button({ label: Gettext.gettext('Save') });
    const imagePass = new Gtk.Image({ icon_name: 'dialog-password-symbolic', icon_size: Gtk.IconSize.SMALL_TOOLBAR });
    const passButton = new Gtk.Button({ image: imagePass });

    fromlabelBox.pack_start(fromlabel, false, false, 0);
    fromBox.pack_start(this.fromField, false, false, 0);
    smtplabelBox.pack_start(smtplabel, false, false, 0);
    smtpBox.pack_start(this.smtpField, false, false, 0);
    userlabelBox.pack_start(userlabel, false, false, 0);
    userBox.pack_start(this.userField, false, false, 0);
    passlabelBox.pack_start(passlabel, false, false, 0);
    passBox.pack_start(this.passField, false, false, 0);
    passBox.pack_start(passButton, false, false, 0);
    subjectlabelBox.pack_start(subjectlabel, false, false, 0);
    subjectBox.pack_start(this.subjectField, false, false, 0);
    buttonBox.pack_end(saveButton, false, false, 0);

    vBox.pack_start(fromlabelBox, false, false, 0);
    vBox.pack_start(fromBox, false, false, 0);
    vBox.pack_start(smtplabelBox, false, false, 0);
    vBox.pack_start(smtpBox, false, false, 0);
    vBox.pack_start(userlabelBox, false, false, 0);
    vBox.pack_start(userBox, false, false, 0);
    vBox.pack_start(passlabelBox, false, false, 0);
    vBox.pack_start(passBox, false, false, 0);
    vBox.pack_start(subjectlabelBox, false, false, 0);
    vBox.pack_start(subjectBox, false, false, 0);
    vBox.pack_end(buttonBox, false, false, 0);

    passButton.connect('enter-notify-event', () => {
      this.passField.set_visibility(true);
    });
    passButton.connect('leave-notify-event', () => {
      this.passField.set_visibility(false);
    });

    saveButton.connect('clicked', () => {
      app.Data.USER = this.userField.get_text();
      app.Data.PASS = this.passField.get_text();
      app.Data.HOST = this.smtpField.get_text();
      app.Data.SUBJECT = this.subjectField.get_text();
      app.Data.FROM = this.fromField.get_text();
      const str = ` >>> SETTINGS: "${app.Data.USER}", "${app.Data.HOST}", "${app.Data.SUBJECT}", "${app.Data.FROM}"...`;

      app.ui.results._LOG(str);
    })

    return vBox;
  },

  _buildModal: function () {
    const vBox = new Gtk.VBox({ spacing: 6 });

    const hashBox = new Gtk.HBox({ spacing: 6 });
    const ipv4Box = new Gtk.HBox({ spacing: 6 });

    this.hashField = new Gtk.Entry({ placeholder_text: Gettext.gettext('Password Hash'), visibility: false, input_purpose: "password" });
    this.ipv4Field = new Gtk.CheckButton({ label: Gettext.gettext('Force ipv4') });
    const imagePass = new Gtk.Image({ icon_name: 'dialog-password-symbolic', icon_size: Gtk.IconSize.SMALL_TOOLBAR });
    const passButton = new Gtk.Button({ image: imagePass });

    hashBox.pack_start(this.hashField, false, false, 0);
    hashBox.pack_start(passButton, false, false, 0);
    ipv4Box.pack_start(this.ipv4Field, false, false, 0);

    vBox.pack_start(hashBox, false, false, 0);
    vBox.pack_start(ipv4Box, false, false, 0);

    passButton.connect('enter-notify-event', () => {
      this.hashField.set_visibility(true);
    });
    passButton.connect('leave-notify-event', () => {
      this.hashField.set_visibility(false);
    });

    return vBox;
  }
});
