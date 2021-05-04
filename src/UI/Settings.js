/**
UI for displaying mailing settings
*/
const Gtk = imports.gi.Gtk;
const Gettext = imports.gettext;
const Config = imports.lib.settings;
const GObject = imports.gi.GObject;

const Data = imports.object.Data;
const appData = new Data.Data();


var UIsettings = GObject.registerClass( // eslint-disable-line
    {
      GTypeName: 'UIsettings',
      Signals: {
        'Logger': {
          param_types: [GObject.TYPE_STRING],
        },
      },
    },
    class UIsettings extends GObject.Object {
      _init() {
        super._init();
      }

      _updateUI() {
        try {
          this.userField.set_text(appData.data.USER);
          this.passField.set_text(appData.data.PASS);
          this.smtpField.set_text(appData.data.HOST);
          this.subjectField.set_text(appData.data.SUBJECT);
          this.fromField.set_text(appData.data.FROM);
          this.delayField.set_text(appData.data.DELAY);
        } catch (err) {
          logError(err);
        }
      }

      _buildUI() {
        // https://developer.gnome.org/gtk3/stable/GtkEntry.html
        this.emit('Logger', '>>> building UI...');

        /*
        const css = '#formbox { background-color: #f00; }';
        const css_provider = new Gtk.CssProvider();
        css_provider.load_from_data(css);
        // context = new Gtk.StyleContext();
        const screen = Gdk.Screen.get_default();
        Gtk.StyleContext.add_provider_for_screen(screen, css_provider,
                                      Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION);
        */
        const vBox = new Gtk.Box({
          orientation: Gtk.Orientation.VERTICAL,
          spacing: 6,
        });
        const hBox = new Gtk.Box({
          orientation: Gtk.Orientation.HORIZONTAL,
          spacing: 6,
          name: 'hbox',
          hexpand: true,
        });
        const formBox = new Gtk.Box({
          orientation: Gtk.Orientation.VERTICAL,
          spacing: 6,
          name: 'formbox',
          hexpand: false,
        });
        const fromlabelBox = new Gtk.Box({
          orientation: Gtk.Orientation.HORIZONTAL,
          spacing: 6,
        });
        const fromBox = new Gtk.Box({
          orientation: Gtk.Orientation.HORIZONTAL,
          spacing: 6,
        });
        const smtplabelBox = new Gtk.Box({
          orientation: Gtk.Orientation.HORIZONTAL,
          spacing: 6,
        });
        const smtpBox = new Gtk.Box({
          orientation: Gtk.Orientation.HORIZONTAL,
          spacing: 6,
        });
        const userlabelBox = new Gtk.Box({
          orientation: Gtk.Orientation.HORIZONTAL,
          spacing: 6,
        });
        const userBox = new Gtk.Box({
          orientation: Gtk.Orientation.HORIZONTAL,
          spacing: 6,
        });
        const passlabelBox = new Gtk.Box({
          orientation: Gtk.Orientation.HORIZONTAL,
          spacing: 6,
        });
        const passBox = new Gtk.Box({
          orientation: Gtk.Orientation.HORIZONTAL,
          spacing: 6,
        });
        const subjectlabelBox = new Gtk.Box({
          orientation: Gtk.Orientation.HORIZONTAL,
          spacing: 6,
        });
        const subjectBox = new Gtk.Box({
          orientation: Gtk.Orientation.HORIZONTAL,
          spacing: 6,
        });
        const delaylabelBox = new Gtk.Box({
          orientation: Gtk.Orientation.HORIZONTAL,
          spacing: 6,
        });
        const delayBox = new Gtk.Box({
          orientation: Gtk.Orientation.HORIZONTAL,
          spacing: 6,
        });
        const buttonBox = new Gtk.Box({
          orientation: Gtk.Orientation.HORIZONTAL,
          spacing: 6,
        });

        const fromlabel = new Gtk.Label(
            { halign: Gtk.Align.START, label: Gettext.gettext('From e-mail') },
        );
        const smtplabel = new Gtk.Label(
            { halign: Gtk.Align.START, label: Gettext.gettext('Smtp host') },
        );
        const userlabel = new Gtk.Label(
            { halign: Gtk.Align.START, label: Gettext.gettext('Smtp user') },
        );
        const passlabel = new Gtk.Label(
            // eslint-disable-next-line max-len
            { halign: Gtk.Align.START, label: Gettext.gettext('Smtp password') },
        );
        const subjectlabel = new Gtk.Label(
            // eslint-disable-next-line max-len
            { halign: Gtk.Align.START, label: Gettext.gettext('E-mail subject') },
        );
        const delaylabel = new Gtk.Label(
            // eslint-disable-next-line max-len
            { halign: Gtk.Align.START, label: Gettext.gettext('Delay between sending emails (in millisaconds)') },
        );

        this.fromField = new Gtk.Entry(
            // eslint-disable-next-line max-len
            { placeholder_text: Gettext.gettext('me@domain.ext'), width_chars: 32 },
        );
        this.smtpField = new Gtk.Entry(
            { placeholder_text: Gettext.gettext('smtp(s)://sub.domain.ext:123'), width_chars: 32 },
        );
        this.userField = new Gtk.Entry(
            { placeholder_text: Gettext.gettext('Username'), width_chars: 32 },
        );
        this.passField = new Gtk.Entry({
          placeholder_text: Gettext.gettext('Password'),
          visibility: false,
          input_purpose: 'password',
          width_chars: 32,
        });
        this.subjectField = new Gtk.Entry(
            { placeholder_text: Gettext.gettext('Subject'), width_chars: 32 },
        );
        this.delayField = new Gtk.Entry(
            // eslint-disable-next-line max-len
            { placeholder_text: '1000', width_chars: 32, text: Config.getDelay().toString() },
        );
        const saveButton = new Gtk.Button({ label: Gettext.gettext('Save') });
        const imagePass = new Gtk.Image(
            // eslint-disable-next-line max-len
            { icon_name: 'dialog-password-symbolic', icon_size: Gtk.IconSize.SMALL_TOOLBAR },
        );
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
        delaylabelBox.pack_start(delaylabel, false, false, 0);
        delayBox.pack_start(this.delayField, false, false, 0);

        buttonBox.pack_end(saveButton, false, false, 0);

        formBox.pack_start(fromlabelBox, false, false, 0);
        formBox.pack_start(fromBox, false, false, 0);
        formBox.pack_start(smtplabelBox, false, false, 0);
        formBox.pack_start(smtpBox, false, false, 0);
        formBox.pack_start(userlabelBox, false, false, 0);
        formBox.pack_start(userBox, false, false, 0);
        formBox.pack_start(passlabelBox, false, false, 0);
        formBox.pack_start(passBox, false, false, 0);
        formBox.pack_start(subjectlabelBox, false, false, 0);
        formBox.pack_start(subjectBox, false, false, 0);
        formBox.pack_start(delaylabelBox, false, false, 0);
        formBox.pack_start(delayBox, false, false, 0);
        hBox.set_center_widget(formBox);
        vBox.pack_start(hBox, true, true, 0);
        vBox.pack_end(buttonBox, false, false, 0);

        passButton.connect('enter-notify-event', () => {
          this.passField.set_visibility(true);
        });
        passButton.connect('leave-notify-event', () => {
          this.passField.set_visibility(false);
        });

        saveButton.connect('clicked', () => {
          appData.data.USER = this.userField.get_text();
          appData.data.PASS = this.passField.get_text();
          appData.data.HOST = this.smtpField.get_text();
          appData.data.SUBJECT = this.subjectField.get_text();
          appData.data.FROM = this.fromField.get_text();
          appData.data.DELAY = this.delayField.get_text();
          // eslint-disable-next-line max-len
          const str = ` >>> SETTINGS: "${appData.data.USER}", "${appData.data.HOST}", "${appData.data.SUBJECT}", "${appData.data.FROM}"...`;
          this.emit('Logger', str);
        });

        return vBox;
      }

      _buildModal() {
        const vBox = new Gtk.Box(
            { orientation: Gtk.Orientation.VERTICAL, spacing: 6 },
        );

        const hashBox = new Gtk.Box(
            { orientation: Gtk.Orientation.HORIZONTAL, spacing: 6 },
        );
        const ipv4Box = new Gtk.Box(
            { orientation: Gtk.Orientation.HORIZONTAL, spacing: 6 },
        );
        const delayLabelBox = new Gtk.Box(
            { orientation: Gtk.Orientation.HORIZONTAL, spacing: 6 },
        );
        const delayBox = new Gtk.Box(
            { orientation: Gtk.Orientation.HORIZONTAL, spacing: 6 },
        );

        this.hashField = new Gtk.Entry({
          placeholder_text: Gettext.gettext('Password Hash'),
          visibility: false,
          input_purpose: 'password',
        });
        this.ipv4Field = new Gtk.CheckButton(
            { label: Gettext.gettext('Force ipv4') },
        );
        this.delayLabel = new Gtk.Label(
            // eslint-disable-next-line max-len
            { halign: Gtk.Align.START, label: Gettext.gettext('sending delay in milliseconds') },
        );
        this.delayField = new Gtk.Entry({ placeholder_text: '1000' });
        const imagePass = new Gtk.Image(
            // eslint-disable-next-line max-len
            { icon_name: 'dialog-password-symbolic', icon_size: Gtk.IconSize.SMALL_TOOLBAR },
        );
        const passButton = new Gtk.Button({ image: imagePass });

        hashBox.pack_start(this.hashField, false, false, 0);
        hashBox.pack_start(passButton, false, false, 0);
        ipv4Box.pack_start(this.ipv4Field, false, false, 0);
        delayLabelBox.pack_start(this.delayLabel, false, false, 0);
        delayBox.pack_start(this.delayField, false, false, 0);

        vBox.pack_start(hashBox, false, false, 0);
        vBox.pack_start(ipv4Box, false, false, 0);
        vBox.pack_start(delayLabelBox, false, false, 0);
        vBox.pack_start(delayBox, false, false, 0);

        passButton.connect('enter-notify-event', () => {
          this.hashField.set_visibility(true);
        });
        passButton.connect('leave-notify-event', () => {
          this.hashField.set_visibility(false);
        });

        return vBox;
      }
    },
);
