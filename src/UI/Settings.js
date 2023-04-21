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


const file = Gio.File.new_for_path('src/UI/settingsApp.ui');
const [, template] = file.load_contents(null);

var settingsApp = GObject.registerClass( // eslint-disable-line
{
  GTypeName: 'settingsApp',
  Template: template,
  // Children: [],
  InternalChildren: [
    'form_area', 'defIpv4Field', 'delayField', 
    'cSelectField', 'cNewButton', 'cEditButton', 
    'cExportButton', 'cDeleteButton', 'cExportAllButton', 
    'cPopDelete', 'cPopExport', 'cExportPasswords',
    'cExportSelButton', 'cDeleteConfirmButton'
  ]
},
class settingsApp extends Gtk.Box {
  _init () {
    super._init();
    
  }
});

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
          throw(err);
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
        


        sselectlabelBox.prepend(sselectlabel);
        sselectBox.prepend(this.sselectCombo);
        snewBox.append(this.snewButton);
        snewBox.append(snewlabel);


        subjectlabelBox.prepend(subjectlabel);
        subjectBox.prepend(this.subjectField);

        buttonBox.append(saveButton);

        formBox.prepend(sselectlabelBox);
        formBox.prepend(sselectBox);
        formBox.prepend(snewBox);


        formBox.prepend(subjectlabelBox);
        formBox.prepend(subjectBox);
        hBox.append(formBox);
        formBox.set_valign('GTK_ALIGN_CENTER'),
        // hBox.set_center_widget(formBox);
        vBox.prepend(hBox, true, true, 0);
        vBox.append(buttonBox);

        

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
        try {
          
        
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

          const opener = new Gtk.FileDialog({ title: Gettext.gettext('Import a connection') });
          const buttonNew = Gtk.Button.new_from_icon_name('document-open-symbolic');
          buttonNew.connect('clicked', async () => {
            try {

              opener.open(null, null, async (o, r) => {
            
              try {
                
                const res = await o.open_finish(r);
                const [, contents] = res.load_contents(null)
                // log(contents);
                this._updateUI(JSON.parse(contents));
                // eslint-disable-next-line max-len
                this.App.emit('Logger', `Opened file : ${appData.get('FILENAME')}.`);
              } catch (error) {
                logError(error);
                // const myModal = new Modal.UImodal();
                myModal.showOpenModal(
                    'Error',
                    Gettext.gettext(
                        'Error opening file. Not a valid emailer file',
                    ),
                    app,
                  );
                }
              });
            } catch (error) {
              logError(error);
              
            }
            
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
          
          const mask = new Gtk.EventControllerMotion();
          const passButton = Gtk.Button.new_from_icon_name('dialog-password-symbolic');
          passButton.add_controller(mask);
          
          mask.connect('enter', () => {
            this.passField.set_visibility(true);
          });
          mask.connect('leave', () => {
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

          chooseBox.append(buttonNew);
          // chooseBox.append(chooselabel);

          namelabelBox.append(namelabel);
          nameBox.append(this.nameField);
          fromlabelBox.append(fromlabel);
          fromBox.append(this.fromField);
          smtplabelBox.append(smtplabel);
          smtpBox.append(this.smtpField);
          userlabelBox.append(userlabel);
          userBox.append(this.userField);
          passlabelBox.append(passlabel);
          passBox.append(this.passField);
          passBox.append(passButton);
          delaylabelBox.append(delaylabel);
          delayBox.append(this.delayField);
          ipv4Box.append(this.ipv4Field);
          headerslabelBox.append(headerslabel);
          headersBox.append(this.headersField);

          if (!connId) {
            formBox.append(chooseBox);
          }
          formBox.append(namelabelBox);
          formBox.append(nameBox);
          formBox.append(fromlabelBox);
          formBox.append(fromBox);
          formBox.append(smtplabelBox);
          formBox.append(smtpBox);
          formBox.append(userlabelBox);
          formBox.append(userBox);
          formBox.append(passlabelBox);
          formBox.append(passBox);
          formBox.append(delaylabelBox);
          formBox.append(delayBox);
          formBox.append(ipv4Box);
          formBox.append(headerslabelBox);
          formBox.append(headersBox);

          hBox.append(formBox);
          vBox.append(hBox);

          if (myConn) {
            this._updateUI(myConn);
          }
          
          return vBox;
        } catch (error) {
          logError(error);
          throw(error);
        }
        
      }









      
      resetConSelect() {
        try {
          const availableCns = JSON.parse(Config.getConnections());
          this.sselectCombo.remove_all();
          if(availableCns.length >= 1) {
            availableCns.forEach((v, k) => {
              this.sselectCombo.insert(k, v.ID, v.NAME);
            });
          } else {
            this.sselectCombo.insert(0, "0", "No Connections Available");
          }
        } catch (error) {
          log(error);
        }
        
      }

      reallyDelete () {
        if (this.sselectCombo.get_active_id()) {
          Config.deleteConnection(this.sselectCombo.get_active_id());
          this.resetConSelect();
        }
      }

      appConfig () {
        this.App = Gio.Application.get_default();
        
        const ipv4 = Config.getIpv4();
        

        this.settingsForm = new settingsApp();

        // const cExportButton = this.settingsForm.get_template_child(Gtk.Box, 'cExportButton');

        this.sselectCombo = this.settingsForm._cSelectField;
        const ipv4Field = this.settingsForm._defIpv4Field;
        const cExportPasswords = this.settingsForm._cExportPasswords;
        const delayField = this.settingsForm._delayField;
        // log(cExportButton);

        this.resetConSelect();

        if (ipv4) {
          ipv4Field.set_active(true);
        }
        // Config.getDelay().toString()
        delayField.set_numeric(true);
        delayField.set_range(0, 5000);
        delayField.set_digits(0);
        delayField.set_increments(1, 1);
        delayField.set_snap_to_ticks(true);
        delayField.set_value(Config.getDelay().toString());

        delayField.connect('value-changed', ()=> {
          Config.setDelay(delayField.get_value_as_int());
        })
        ipv4Field.connect('toggled', () => {
          Config.setIpv4(ipv4Field.get_active());
        });

        this.settingsForm._cDeleteConfirmButton.connect('clicked', () => {
          this.reallyDelete();
          this.settingsForm._cPopDelete.hide();
        });

        this.settingsForm._cExportSelButton.connect('clicked', () => {
          const conn = Config.getConnection(this.sselectCombo.get_active_id());
          const savePW = cExportPasswords.get_active();
          const data = myFile.rollConn(conn, savePW);
          const props = {
            title: 'Export A Connection',
            data: JSON.stringify(data)
          };
          myFile.fileSave(props, (res) => {
            log(res);
          });

          this.settingsForm._cPopExport.hide();
        });

        this.settingsForm._cExportAllButton.connect('clicked', () => {
          
          const data = Config.getConnections();
          const props = {
            title: 'Export Connections',
            data: JSON.stringify(data)
          };
          myFile.fileSave(props, (res) => {
            log(res);
          });
          this.settingsForm._cPopExport.hide();
        });

       return this.settingsForm;
      }
    },
);
