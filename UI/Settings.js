/**
UI for displaying mailing settings
*/

const UIsettings = new Lang.Class ({
  Name: 'UIsettings',
  // Implements: [Signals.WithSignals],

  _init: function() {

    // Signals.addSignalMethods(this);
  },

  _updateUI() {
  print('Updating UI');
    try {
      this.userField.set_text(USER);
      this.passField.set_text(PASS);
      this.smtpField.set_text(HOST);
      this.subjectField.set_text(SUBJECT);
      this.fromField.set_text(FROM);
    } catch (err) {
      print (err);
    }
  },

  _buildUI: function () {
    // this.parent();
    const vBox = new Gtk.VBox({spacing: 6});

    const fromBox = new Gtk.HBox({spacing: 6});
    const smtpBox = new Gtk.HBox({spacing: 6});
    const userBox = new Gtk.HBox({spacing: 6});
    const passBox = new Gtk.HBox({spacing: 6});
    const subjectBox = new Gtk.HBox({spacing: 6});
    const buttonBox = new Gtk.HBox({spacing: 6});

    this.fromField = new Gtk.Entry({placeholder_text: Gettext.gettext('From e-mail')});
    this.smtpField = new Gtk.Entry({placeholder_text: Gettext.gettext('Smtp host')});
    this.userField = new Gtk.Entry({placeholder_text: Gettext.gettext('Smtp user')});
    this.passField = new Gtk.Entry({placeholder_text: Gettext.gettext('Smtp password'), visibility: false, input_purpose: "password"});
    this.subjectField = new Gtk.Entry({placeholder_text: Gettext.gettext('E-mail subject')});
    const saveButton = new Gtk.Button({label: Gettext.gettext('Save')});

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
      USER = this.userField.get_text();
      PASS = this.passField.get_text();
      HOST = this.smtpField.get_text();
      SUBJECT = this.subjectField.get_text();
      FROM = this.fromField.get_text();
      const str = ` >>> SETTINGS: "${USER}", "${HOST}", "${SUBJECT}", "${FROM}"...`;

      app.ui.results._LOG(str);
      // Signals.addSignalMethods(this);
      // this.emit('Log', str);
      // print(str);
    })

    return vBox;
  }
});
