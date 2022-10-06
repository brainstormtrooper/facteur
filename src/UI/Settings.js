/**
UI for displaying mailing settings
*/
const Gtk = imports.gi.Gtk;
const Gio = imports.gi.Gio;
const Gettext = imports.gettext;
const Settings = imports.object.Settings;
const GObject = imports.gi.GObject;
const Pango = imports.gi.Pango;

const Data = imports.object.Data;
const Config = new Settings.Settings();
const appData = new Data.Data();
const Modal = imports.UI.Modal;
const myFile = imports.lib.file;

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
      _init () {
        super._init();
      }

      _updateUI (obj) {
        try {
          if (!obj) {
            obj = {};
          }
          const sub = (obj.SUBJECT ? obj.SUBJECT : appData.get('SUBJECT'));
          const connId = (obj.CONN ? obj.CONN : appData.get('CONN'));

          if (connId || obj.ID) {
            const conn = (obj.ID ? obj : Config.getConnection(connId));
            const name = (obj.NAME ? obj.NAME : conn.NAME);
            const from = (obj.FROM ? obj.FROM : conn.FROM);
            const host = (obj.HOST ? obj.HOST : conn.HOST);
            const user = (obj.USER ? obj.USER : conn.USER);
            const pass = (obj.PASS ? obj.PASS : false);
            const delay = (obj.DELAY ? obj.DELAY : conn.DELAY);
            const ipv4 = (obj.IPv4 ? obj.IPv4 : conn.IPv4);
            const headers = (obj.HEADERS ? obj.HEADERS : conn.HEADERS);
            if (this.nameField) {
              this.nameField.set_text(name);
              this.fromField.set_text(from);
              this.smtpField.set_text(host);
              this.userField.set_text(user);
              if (pass) {
                this.passField.set_text(pass);
              }
              this.delayField.set_text(delay);
              if (ipv4) {
                this.ipv4Field.set_active(true);
              }
              this.headersField.set_text(headers);
            }
            
            
          }
          
          this.sselectCombo.remove_all();

          const availableCns = JSON.parse(Config.getConnections());

          if(availableCns.length >= 1) {
            availableCns.forEach((v, k) => {
              this.sselectCombo.insert(k, v.ID, v.NAME);
            });
            this.sselectCombo.set_active_id(connId);
          } else {
            this.sselectCombo.insert(0, "0", "No Connections Available");
          }
          if (sub) {
            this.subjectField.set_text(sub);
          }
        } catch (err) {
          logError(err);
        }
      }

      _buildUI () {
        // https://developer.gnome.org/gtk3/stable/GtkEntry.html
        const myModal = new Modal.UImodal();
        this.App = Gio.Application.get_default();
        this.App.emit('Logger', '>>> building UI...');

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

        // Connection selection

        const sselectlabelBox = new Gtk.Box({
          orientation: Gtk.Orientation.HORIZONTAL,
          spacing: 6,
        });
        const sselectBox = new Gtk.Box({
          orientation: Gtk.Orientation.HORIZONTAL,
          spacing: 6,
        });
        const snewBox = new Gtk.Box({
          orientation: Gtk.Orientation.HORIZONTAL,
          spacing: 6,
        });

        // /Selection

        const subjectlabelBox = new Gtk.Box({
          orientation: Gtk.Orientation.HORIZONTAL,
          spacing: 6,
        });
        const subjectBox = new Gtk.Box({
          orientation: Gtk.Orientation.HORIZONTAL,
          spacing: 6,
        });

        const buttonBox = new Gtk.Box({
          orientation: Gtk.Orientation.HORIZONTAL,
          spacing: 6,
        });


        const sselectlabel = new Gtk.Label(
          { halign: Gtk.Align.START, label: Gettext.gettext('Select a server connection') },
        );
        const snewlabel = new Gtk.Label(
            { halign: Gtk.Align.START, label: Gettext.gettext('Create a new connection') },
        );


        const subjectlabel = new Gtk.Label(
            // eslint-disable-next-line max-len
            { halign: Gtk.Align.START, label: Gettext.gettext('E-mail subject') },
        );
        
        const availableCns = JSON.parse(Config.getConnections());
        
        this.sselectCombo = new Gtk.ComboBoxText();

        if(availableCns.length >= 1) {
          availableCns.forEach((v, k) => {
            this.sselectCombo.insert(k, v.ID, v.NAME);
          });
        } else {
          this.sselectCombo.insert(0, "0", "No Connections Available");
        }
        

        this.snewButton = new Gtk.Button({ label: Gettext.gettext('New') });
        this.snewButton.connect('clicked', () => {
          myModal.newConnection(this);
        });


        this.subjectField = new Gtk.Entry(
            { placeholder_text: Gettext.gettext('Subject'), width_chars: 32 },
        );
        
        const saveButton = new Gtk.Button({ label: Gettext.gettext('Save') });
        


        sselectlabelBox.pack_start(sselectlabel, false, false, 0);
        sselectBox.pack_start(this.sselectCombo, false, false, 0);
        snewBox.pack_end(this.snewButton, false, false, 0);
        snewBox.pack_end(snewlabel, false, false, 0);


        subjectlabelBox.pack_start(subjectlabel, false, false, 0);
        subjectBox.pack_start(this.subjectField, false, false, 0);

        buttonBox.pack_end(saveButton, false, false, 0);

        formBox.pack_start(sselectlabelBox, false, false, 0);
        formBox.pack_start(sselectBox, false, false, 0);
        formBox.pack_start(snewBox, false, false, 0);


        formBox.pack_start(subjectlabelBox, false, false, 0);
        formBox.pack_start(subjectBox, false, false, 0);
        
        hBox.set_center_widget(formBox);
        vBox.pack_start(hBox, true, true, 0);
        vBox.pack_end(buttonBox, false, false, 0);

        

        saveButton.connect('clicked', () => {
          appData.set('SUBJECT', this.subjectField.get_text());
          appData.set('CONN', this.sselectCombo.get_active_id());
          // eslint-disable-next-line max-len
          const str = ` >>> Started Mailing "${this.subjectField.get_text()}"...`;
          this.App.emit('Logger', str);
        });

        return vBox;
      }

      _buildNewConnection (connId = null) {
        let myConn = null;
        let ipv4 = Config.getIpv4();
        if (connId != null) {
          myConn = Config.getConnection(connId);
          // ipv4 = (myConn.ipv4 == 1 ? true : false);
          ipv4 = myConn.ipv4;
        } 

        const vBox = new Gtk.Box(
          { orientation: Gtk.Orientation.VERTICAL, spacing: 6 },
        );
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

        const chooseBox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 6 });
        const choosebutton = new Gtk.FileChooserButton(
          { title: Gettext.gettext('Import a connection') },
        );
        const chooselabel = new Gtk.Label(
            { halign: Gtk.Align.START, label: Gettext.gettext('Open a file') },
        );
        choosebutton.set_action(Gtk.FileChooserAction.OPEN);
        choosebutton.connect('file-set', async () => {
          const path = choosebutton.get_file().get_path();
          // do something with path
          this.App.emit('Logger', `Importing connection from : ${path}`);
          const promise = myFile.open(path);
          promise.then((content) => {
            this._updateUI(content);
          }).catch((e) => {
            console.log(e);
          });
          
        });
        const namelabelBox = new Gtk.Box({
          orientation: Gtk.Orientation.HORIZONTAL,
          spacing: 6,
        });
        const nameBox = new Gtk.Box({
          orientation: Gtk.Orientation.HORIZONTAL,
          spacing: 6,
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
        const delaylabelBox = new Gtk.Box({
          orientation: Gtk.Orientation.HORIZONTAL,
          spacing: 6,
        });
        const delayBox = new Gtk.Box({
          orientation: Gtk.Orientation.HORIZONTAL,
          spacing: 6,
        });
        const ipv4Box = new Gtk.Box(
          { orientation: Gtk.Orientation.HORIZONTAL, spacing: 6 },
        );
        const headerslabelBox = new Gtk.Box({
          orientation: Gtk.Orientation.HORIZONTAL,
          spacing: 6,
        });
        const headersBox = new Gtk.Box(
          { orientation: Gtk.Orientation.HORIZONTAL, spacing: 6 },
        );

        const namelabel = new Gtk.Label(
          { halign: Gtk.Align.START, label: Gettext.gettext('Connection name') },
        );
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
        const delaylabel = new Gtk.Label(
          // eslint-disable-next-line max-len
          { halign: Gtk.Align.START, label: Gettext.gettext('Delay between sending emails (in millisaconds)') },
        );
        const headerslabel = new Gtk.Label(
          // eslint-disable-next-line max-len
          { halign: Gtk.Align.START, label: Gettext.gettext('Extra headers to send with requests') },
        );

        this.nameField = new Gtk.Entry(
          // eslint-disable-next-line max-len
          { placeholder_text: Gettext.gettext('My Connection'), width_chars: 32 },
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
        const imagePass = new Gtk.Image(
          // eslint-disable-next-line max-len
          { icon_name: 'dialog-password-symbolic', icon_size: Gtk.IconSize.SMALL_TOOLBAR },
        );
        const passButton = new Gtk.Button({ image: imagePass });
        passButton.connect('enter-notify-event', () => {
          this.passField.set_visibility(true);
        });
        passButton.connect('leave-notify-event', () => {
          this.passField.set_visibility(false);
        });
        this.passField = new Gtk.Entry({
          placeholder_text: Gettext.gettext('Password'),
          visibility: false,
          input_purpose: 'password',
          width_chars: 32,
        });
        this.delayField = new Gtk.Entry(
          // eslint-disable-next-line max-len
          { placeholder_text: '1000', width_chars: 32, text: Config.getDelay().toString() },
        );
        this.ipv4Field = new Gtk.CheckButton(
          { label: Gettext.gettext('Force ipv4') },
        );
        this.headersField = new Gtk.Entry(
          { placeholder_text: '[]', width_chars: 32 },
        );

        if (ipv4) {
          this.ipv4Field.set_active(true);
        }

        console.log('myConn : ', myConn);

        /*
        if (myConn) {
          this.nameField.set_text(myConn.NAME);
          this.fromField.set_text(myConn.FROM);
          this.smtpField.set_text(myConn.HOST);
          this.userField.set_text(myConn.USER);
          this.delayField.set_text(myConn.DELAY);
          this.headersField.set_text(myConn.HEADERS);
        }
        */

        chooseBox.pack_end(choosebutton, false, false, 0);
        chooseBox.pack_end(chooselabel, false, false, 0);

        namelabelBox.pack_start(namelabel, false, false, 0);
        nameBox.pack_start(this.nameField, false, false, 0);
        fromlabelBox.pack_start(fromlabel, false, false, 0);
        fromBox.pack_start(this.fromField, false, false, 0);
        smtplabelBox.pack_start(smtplabel, false, false, 0);
        smtpBox.pack_start(this.smtpField, false, false, 0);
        userlabelBox.pack_start(userlabel, false, false, 0);
        userBox.pack_start(this.userField, false, false, 0);
        passlabelBox.pack_start(passlabel, false, false, 0);
        passBox.pack_start(this.passField, false, false, 0);
        passBox.pack_start(passButton, false, false, 0);
        delaylabelBox.pack_start(delaylabel, false, false, 0);
        delayBox.pack_start(this.delayField, false, false, 0);
        ipv4Box.pack_start(this.ipv4Field, false, false, 0);
        headerslabelBox.pack_start(headerslabel, false, false, 0);
        headersBox.pack_start(this.headersField, false, false, 0);

        if (!connId) {
          formBox.pack_start(chooseBox, false, false, 0);
        }
        formBox.pack_start(namelabelBox, false, false, 0);
        formBox.pack_start(nameBox, false, false, 0);
        formBox.pack_start(fromlabelBox, false, false, 0);
        formBox.pack_start(fromBox, false, false, 0);
        formBox.pack_start(smtplabelBox, false, false, 0);
        formBox.pack_start(smtpBox, false, false, 0);
        formBox.pack_start(userlabelBox, false, false, 0);
        formBox.pack_start(userBox, false, false, 0);
        formBox.pack_start(passlabelBox, false, false, 0);
        formBox.pack_start(passBox, false, false, 0);
        formBox.pack_start(delaylabelBox, false, false, 0);
        formBox.pack_start(delayBox, false, false, 0);
        formBox.pack_start(ipv4Box, false, false, 0);
        formBox.pack_start(headerslabelBox, false, false, 0);
        formBox.pack_start(headersBox, false, false, 0);

        hBox.set_center_widget(formBox);
        vBox.pack_start(hBox, true, true, 0);

        if (myConn) {
          this._updateUI(myConn);
        }

        return vBox;
      }

      exportConnection() {
        const saver = new Gtk.FileChooserDialog(
          { title: 'Select a destination' },
        );
        saver.set_action(Gtk.FileChooserAction.SAVE);
        const WP = appData.get('FILENAME').split('/');
        const filename = WP.pop();
        saver.set_current_name(filename);
        try {
          const foldername = `/${WP.join('/')}`;
          saver.set_current_folder(foldername);
        } catch (e) {
          logError(e);
        }

        saver.add_button('save', Gtk.ResponseType.ACCEPT);
        saver.add_button('cancel', Gtk.ResponseType.CANCEL);
        const res = saver.run();
        if (res == Gtk.ResponseType.ACCEPT) {
          const savePW = this.exportPasswordField.get_active();
          const conn = Config.getConnection(this.sselectCombo.get_active_id());
          const data = myFile.rollConn(conn, savePW);
          myFile.save(saver.get_filename(), data);
        }
        saver.destroy();
      }

      reallyDelete() {
        Config.deleteConnection(this.sselectCombo.get_active_id());
        this.sselectCombo.remove_all();

        const availableCns = JSON.parse(Config.getConnections());

        if(availableCns.length >= 1) {
          availableCns.forEach((v, k) => {
            this.sselectCombo.insert(k, v.ID, v.NAME);
          });
        } else {
          this.sselectCombo.insert(0, "0", "No Connections Available");
        }
      }

      _buildModal () {
        this.App = Gio.Application.get_default();
        const myModal = new Modal.UImodal();

        /*
        // Set menu actions
        const actionConnDelete = new Gio.SimpleAction({ name: 'deleteConnection' });
        actionConnDelete.connect('activate', () => {
          this.reallyDelete();
          
        });
        this.App.add_action(actionConnDelete);

        const deleteConfirm = new Gio.Menu();
        // const section = new Gio.Menu();
        deleteConfirm.append(Gettext.gettext('Confirm Delete'), 'app.deleteConnection');
        // deleteConfirm.append_section(null, section);
        */
        const vBox = new Gtk.Box(
            { orientation: Gtk.Orientation.VERTICAL, spacing: 6 },
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


        // Connection selection

        const sselectlabelBox = new Gtk.Box({
          orientation: Gtk.Orientation.HORIZONTAL,
          spacing: 6,
        });
        const sselectBox = new Gtk.Box({
          orientation: Gtk.Orientation.HORIZONTAL,
          spacing: 6,
        });
        const sButtonBox = new Gtk.ButtonBox({
          orientation: Gtk.Orientation.HORIZONTAL,
          layout_style: Gtk.ButtonBoxStyle.START,
          spacing: 6,
        });

        // /Selection

        this.defIpv4Field = new Gtk.CheckButton(
            { label: Gettext.gettext('Force ipv4') },
        );
        this.delayLabel = new Gtk.Label(
            // eslint-disable-next-line max-len
            { halign: Gtk.Align.START, label: Gettext.gettext('sending delay in milliseconds') },
        );
        this.defDelayField = new Gtk.Entry({ placeholder_text: '1000' });
        const cfgSselectlabel = new Gtk.Label(
          { halign: Gtk.Align.START, label: Gettext.gettext('Select a server connection') },
        );

        const availableCns = JSON.parse(Config.getConnections());
        
        this.sselectCombo = new Gtk.ComboBoxText();

        if(availableCns.length >= 1) {
          availableCns.forEach((v, k) => {
            this.sselectCombo.insert(k, v.ID, v.NAME);
          });
        } else {
          this.sselectCombo.insert(0, "0", "No Connections Available");
        }
        
        this.cfgSdeleteButton = new Gtk.MenuButton({ label: Gettext.gettext('Delete') });
        
        this.cfgSeditButton = new Gtk.Button({ label: Gettext.gettext('Edit') });
        this.cfgSeditButton.connect('clicked', () => {
          console.log('EDIT pressed', this.sselectCombo.get_active_id());
          myModal.editConnection(this, this.sselectCombo.get_active_id())
        });
        this.cfgSexportButton = new Gtk.MenuButton({ label: Gettext.gettext('Export') });
        this.cfgSexportButton.connect('clicked', () => {
          console.log('EXPORT pressed');
        });
        this.cfgSnewButton = new Gtk.Button({ label: Gettext.gettext('New') });
        this.cfgSnewButton.connect('clicked', () => {
          myModal.newConnection(this);
        });

        this.reallyExportButton = new Gtk.Button({ label: Gettext.gettext('Save As') });
        this.reallyExportButton.connect('clicked', () => {

          const savePW = this.exportPasswordField.get_active();
          this.exportConnection(savePW);
          this.popExport.hide();
        });
        this.exportPasswordField = new Gtk.CheckButton(
            { label: Gettext.gettext('Export password') },
        );
        
        const exportConfirm = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 6 });
        exportConfirm.pack_start(this.exportPasswordField, false, false, 0);
        exportConfirm.pack_start(this.reallyExportButton, false, false, 0);
        // deleteConfirm.append_section(null, section);
        exportConfirm.show_all();
        this.popExport = new Gtk.Popover();
        this.cfgSexportButton.set_popover(this.popExport);
        this.popExport.set_size_request(-1, -1);

        this.popExport.add(exportConfirm);



        this.reallyDeleteButton = new Gtk.Button({ label: Gettext.gettext('Confirm Delete') });
        this.reallyDeleteButton.connect('clicked', () => {
          this.reallyDelete();
          this.popDelete.hide();
        });
        
        const deleteConfirm = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 6 });
        // const section = new Gio.Menu();
        deleteConfirm.pack_start(this.reallyDeleteButton, false, false, 0);
        // deleteConfirm.append_section(null, section);
        deleteConfirm.show_all();
        this.popDelete = new Gtk.Popover();
        this.cfgSdeleteButton.set_popover(this.popDelete);
        this.popDelete.set_size_request(-1, -1);

        this.popDelete.add(deleteConfirm);



        ipv4Box.pack_start(this.defIpv4Field, false, false, 0);
        delayLabelBox.pack_start(this.delayLabel, false, false, 0);
        delayBox.pack_start(this.defDelayField, false, false, 0);
        sselectlabelBox.pack_start(cfgSselectlabel, false, false, 0);
        sselectBox.pack_start(this.sselectCombo, false, false, 0);
        sButtonBox.pack_start(this.cfgSdeleteButton, false, false, 0);
        sButtonBox.pack_start(this.cfgSeditButton, false, false, 0);
        sButtonBox.pack_start(this.cfgSexportButton, false, false, 0);
        sButtonBox.pack_start(this.cfgSnewButton, false, false, 0);

        vBox.pack_start(ipv4Box, false, false, 0);
        vBox.pack_start(delayLabelBox, false, false, 0);
        vBox.pack_start(delayBox, false, false, 0);
        vBox.pack_start(sselectlabelBox, false, false, 0);
        vBox.pack_start(sselectBox, false, false, 0);
        vBox.pack_start(sButtonBox, false, false, 0);

        return vBox;
      }
    },
);
