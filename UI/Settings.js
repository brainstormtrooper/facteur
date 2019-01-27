/**
UI for displaying mailing settings
*/

const UIsettings = new Lang.Class ({
  Name: 'UImailing',

  _buildUI: function () {
    const vBox = new Gtk.VBox({spacing: 6});

    const fromBox = new Gtk.HBox({spacing: 6});
    const smtpBox = new Gtk.HBox({spacing: 6});
    const userBox = new Gtk.HBox({spacing: 6});
    const passBox = new Gtk.HBox({spacing: 6});
    const subjectBox = new Gtk.HBox({spacing: 6});
    const buttonBox = new Gtk.HBox({spacing: 6});

    const fromField = new Gtk.Entry({placeholder_text: "From email"});
    const smtpField = new Gtk.Entry({placeholder_text: "smtp host"});
    const userField = new Gtk.Entry({placeholder_text: "smtp user"});
    const passField = new Gtk.Entry({placeholder_text: "smtp password", visibility: false, input_purpose: "password"});
    const subjectField = new Gtk.Entry({placeholder_text: "email subject"});
    const saveButton = new Gtk.Button({label: "Save"});

    fromBox.pack_start(fromField, false, false, 0);
    smtpBox.pack_start(smtpField, false, false, 0);
    userBox.pack_start(userField, false, false, 0);
    passBox.pack_start(passField, false, false, 0);
    subjectBox.pack_start(subjectField, false, false, 0);
    buttonBox.pack_end(saveButton, false, false, 0);

    vBox.pack_start(fromBox, false, false, 0);
    vBox.pack_start(smtpBox, false, false, 0);
    vBox.pack_start(userBox, false, false, 0);
    vBox.pack_start(passBox, false, false, 0);
    vBox.pack_start(subjectBox, false, false, 0);
    vBox.pack_end(buttonBox, false, false, 0);

    saveButton.connect('clicked', () => {
      USER = userField.get_text();
      PASS = passField.get_text();
      HOST = smtpField.get_text();
      SUBJECT = subjectField.get_text();
      FROM = fromField.get_text();
      print(` >>> VARS : "${USER}", "${HOST}", "${SUBJECT}", "${FROM}"...`);
    })

    return vBox;
  }
});
