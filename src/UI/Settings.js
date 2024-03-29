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
const secret = imports.lib.secret;
const valid = imports.lib.valid;
const uuid = imports.lib.uuid;


// const conxfile = Gio.File.new_for_path('data/settingsConx.ui');
// const [, conxtemplate] = conxfile.load_contents(null);

var settingsConx = GObject.registerClass( // eslint-disable-line
{
  GTypeName: 'settingsConx',
  Template: 'resource:///io/github/brainstormtrooper/facteur/settingsConx.ui',
  // Children: [],
  InternalChildren: [
    'form_area', 'cImportButton', 'conxNameEntry', 
    'conxFromEntry', 'conxHostEntry', 'conxUserEntry',
    'conxPassEntry', 'cShowPassButton', 'conxDelayEntry', 'conxHeadersEntry',
    'conxIPv4Entry'
  ]
},
class settingsConx extends Gtk.Box {
  _init () {
    super._init();
    
  }
});

// const mainfile = Gio.File.new_for_path('data/settingsMain.ui');
// const [, maintemplate] = mainfile.load_contents(null);

var settingsMain = GObject.registerClass( // eslint-disable-line
{
  GTypeName: 'settingsMain',
  Template: 'resource:///io/github/brainstormtrooper/facteur/settingsMain.ui',
  // Children: [],
  InternalChildren: [
    'form_area', 'sselectCombo', 'snewButton', 'mailingReplyEntry',
    'subjectField', 'saveButton', 'mailingFromEntry', 'mailingNameEntry',
    'mailingCCEntry', 'mailingBCCEntry'
  ]
},
class settingsMain extends Gtk.Box {
  _init () {
    super._init();
    
  }
});

// const appfile = Gio.File.new_for_path('data/settingsApp.ui');
// const [, apptemplate] = appfile.load_contents(null);

var settingsApp = GObject.registerClass( // eslint-disable-line
{
  GTypeName: 'settingsApp',
  Template: 'resource:///io/github/brainstormtrooper/facteur/settingsApp.ui',
  // Children: [],
  InternalChildren: [
    'form_area',  
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
        'update_ui': {
          param_types: [GObject.TYPE_BOOLEAN],
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
          const sfrom = (obj.FROM ? obj.FROM : appData.get('FROM'));
          const fname = (obj.NAME ? obj.NAME : appData.get('NAME'));
          const reply = (obj.REPLY ? obj.REPLY : appData.get('REPLY'));
          const cc = (obj.CC ? obj.CC : appData.get('CC'));
          const bcc = (obj.BCC ? obj.BCC : appData.get('BCC'));

          if (connId || obj.ID) {
            let cname, from, host, user, pass, delay, ipv4, headers;
            const conn = (obj.ID ? obj.ID : Config.getConnection(connId));
            if (conn) {
              cname = (obj.NAME ? obj.NAME : conn.NAME);
              from = (obj.FROM ? obj.FROM : conn.FROM);
              host = (obj.HOST ? obj.HOST : conn.HOST);
              user = (obj.USER ? obj.USER : conn.USER);

              pass = (obj.PASS ? obj.PASS : secret.connPasswordGet(connId));
              delay = (obj.DELAY ? obj.DELAY : conn.DELAY);
              ipv4 = (obj.IPv4 ? obj.IPv4 : conn.IPv4);
              headers = (obj.HEADERS ? obj.HEADERS : conn.HEADERS);
            }
            
            if (this.nameField) {
              this.nameField.set_text(cname);
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
          if (this.sselectCombo) {
            this.resetConSelect(this.sselectCombo, connId);
          }

          if (sub) {
            this.subjectField.set_text(sub);
          }
          if (sfrom) {
            this.mailingFromEntry.set_text(sfrom);
          }
          if (fname) {
            this.mailingNameEntry.set_text(fname);
          }
          if (reply) {
            this.mailingReplyEntry.set_text(reply);
          }
          if (cc) {
            this.mailingCCEntry.set_text(cc);
          }
          if (bcc) {
            this.mailingBCCEntry.set_text(bcc);
          }
          this.saveButton.remove_css_class('suggested-action');
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
        let vreply, vfrom, vcc, vbcc;
        
        // const css = '#formbox { background-color: #f00; }';
        

        this.settingsMain = new settingsMain();

        this.subjectField = this.settingsMain._subjectField
        this.snewButton = this.settingsMain._snewButton;
        this.sselectCombo = this.settingsMain._sselectCombo;
        this.saveButton = this.settingsMain._saveButton;
        this.mailingReplyEntry = this.settingsMain._mailingReplyEntry;
        this.mailingFromEntry = this.settingsMain._mailingFromEntry;
        this.mailingNameEntry = this.settingsMain._mailingNameEntry;
        this.mailingCCEntry = this.settingsMain._mailingCCEntry;
        this.mailingBCCEntry = this.settingsMain._mailingBCCEntry;

        this.resetConSelect(this.sselectCombo);

        this.snewButton.connect('clicked', () => {
          const _saveHandler = () => {
            
            let IPv4 = 0;
            if (this.conxIPv4Entry.get_active()) {
              IPv4 = 1;
            }

            const connection = {
              ID: uuid.uuid(),
              NAME: this.conxNameEntry.get_text(),
              FROM: this.conxFromEntry.get_text(),
              USER: this.conxUserEntry.get_text(),
              PASS: this.conxPassEntry.get_text(),
              HOST: this.conxHostEntry.get_text(),
              DELAY: this.conxDelayEntry.get_text(),
              IPv4,
              HEADERS: this.conxHeadersEntry.get_text()
            }
            
            const CONN = Config.saveConnection(connection);
            
            this.App.emit('update_ui', true);
          };

          

          const props = {
            title: 'New Connection',
            label: 'Please configure your connectoin here.',
            content: this._buildNewConnection(),
            saveHandler: _saveHandler
          };
          myModal.doModal(props);
        });

        this.subjectField.connect('changed', () => {
          this.saveButton.add_css_class('suggested-action');
        });
        this.sselectCombo.connect('changed', () => {
          this.saveButton.add_css_class('suggested-action');
        });

        this.mailingReplyEntry.connect('changed', () => {
          vreply = valid.validateEmail(this.mailingReplyEntry.get_text());
          if (vreply != null) {
            this.mailingReplyEntry.remove_css_class('error');
            this.mailingReplyEntry.add_css_class('success');
            this.saveButton.add_css_class('suggested-action');
          } else {
            if (this.mailingReplyEntry.get_text() == '') {
              this.mailingReplyEntry.remove_css_class('error');
              this.saveButton.add_css_class('suggested-action');
            } else {
              this.mailingReplyEntry.remove_css_class('success');
              this.mailingReplyEntry.add_css_class('error');
            }
          }
          
        });
        this.mailingFromEntry.connect('changed', () => {
          vfrom = valid.validateEmail(this.mailingFromEntry.get_text());
          if (vfrom != null) {
            this.mailingFromEntry.remove_css_class('error');
            this.mailingFromEntry.add_css_class('success');
            this.saveButton.add_css_class('suggested-action');
          } else {
            if (this.mailingFromEntry.get_text() == '') {
              this.mailingFromEntry.remove_css_class('error');
              this.saveButton.add_css_class('suggested-action');
            } else {
              this.mailingFromEntry.remove_css_class('success');
              this.mailingFromEntry.add_css_class('error');
            }
          }
        });
        this.mailingNameEntry.connect('changed', () => {
          this.saveButton.add_css_class('suggested-action');
        });
        this.mailingCCEntry.connect('changed', () => {
          vcc = valid.validateEmail(this.mailingCCEntry.get_text());
          if (vcc != null) {
            this.mailingCCEntry.remove_css_class('error');
            this.mailingCCEntry.add_css_class('success');
            this.saveButton.add_css_class('suggested-action');
          } else {
            if (this.mailingCCEntry.get_text() == '') {
              this.mailingCCEntry.remove_css_class('error');
              this.saveButton.add_css_class('suggested-action');
            } else {
              this.mailingCCEntry.remove_css_class('success');
              this.mailingCCEntry.add_css_class('error');
            }
          }
        });
        this.mailingBCCEntry.connect('changed', () => {
          vbcc = valid.validateEmail(this.mailingBCCEntry.get_text());
          if (vbcc != null) {
            this.mailingBCCEntry.remove_css_class('error');
            this.mailingBCCEntry.add_css_class('success');
            this.saveButton.add_css_class('suggested-action');
          } else {
            if (this.mailingBCCEntry.get_text() == '') {
              this.mailingBCCEntry.remove_css_class('error');
              this.saveButton.add_css_class('suggested-action');
            } else {
              this.mailingBCCEntry.remove_css_class('success');
              this.mailingBCCEntry.add_css_class('error');
            }
          }
        });

        this.saveButton.connect('clicked', () => {
          if ((appData.get('SUBJECT') != this.subjectField.get_text()) && (appData.get('SENT') != '')) {
            appData.set('SENT', '');
          }
          appData.set('SUBJECT', this.subjectField.get_text());
          appData.set('CONN', this.sselectCombo.get_active_id());
          appData.set('NAME', this.mailingNameEntry.get_text());
          if (vfrom || this.mailingFromEntry.get_text() == '') {
            appData.set('FROM', this.mailingFromEntry.get_text());
          }
          if (vreply || this.mailingReplyEntry.get_text() == '') {
            appData.set('REPLY', this.mailingReplyEntry.get_text());
          }
          if (vcc || this.mailingCCEntry.get_text() == '') {
            appData.set('CC', this.mailingCCEntry.get_text());
          }
          if (vbcc || this.mailingBCCEntry.get_text() == '') {
            appData.set('BCC', this.mailingBCCEntry.get_text());
          }
          
          // eslint-disable-next-line max-len
          const str = ` >>> Started Mailing "${this.subjectField.get_text()}"...`;
          this.saveButton.remove_css_class('suggested-action');
          this.App.emit('Logger', str);
        });
        
        return this.settingsMain;
        
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
          this.settingsConx = new settingsConx();


          this.cImportButton = this.settingsConx._cImportButton;
          this.conxNameEntry = this.settingsConx._conxNameEntry;
          this.conxFromEntry = this.settingsConx._conxFromEntry;
          this.conxHostEntry = this.settingsConx._conxHostEntry;
          this.conxUserEntry = this.settingsConx._conxUserEntry;
          this.conxPassEntry = this.settingsConx._conxPassEntry;
          this.cShowPassButton = this.settingsConx._cShowPassButton;
          this.conxDelayEntry = this.settingsConx._conxDelayEntry;
          this.conxHeadersEntry = this.settingsConx._conxHeadersEntry;
          this.conxIPv4Entry = this.settingsConx._conxIPv4Entry;

          if (myConn) {
            this.conxNameEntry.set_text(myConn.NAME);
            this.conxFromEntry.set_text(myConn.FROM);
            this.conxHostEntry.set_text(myConn.HOST);
            this.conxUserEntry.set_text(myConn.USER);
            this.conxDelayEntry.set_text(myConn.DELAY);
            this.conxHeadersEntry.set_text(myConn.HEADERS);
            const pass = (secret.connPasswordGet(connId) ? secret.connPasswordGet(connId): '');
            this.conxPassEntry.set_text(pass);
            // this._updateUI(myConn);
          }
          if (ipv4) {
            this.conxIPv4Entry.set_active(true);
          }

          const ctl = new Gtk.EventControllerMotion();
          this.cShowPassButton.add_controller(ctl);
          ctl.connect('enter', () => { this.conxPassEntry.set_visibility(true) });
          ctl.connect('leave', () => { this.conxPassEntry.set_visibility(false) });

          let vs;
          this.conxHostEntry.connect('changed', () => {
            vs = valid.validateServer(this.conxHostEntry.get_text());
            if (vs != null) {
              this.conxHostEntry.remove_css_class('error');
              this.conxHostEntry.add_css_class('success');
            } else {
              this.conxHostEntry.remove_css_class('success');
              this.conxHostEntry.add_css_class('error');
            }
          });

          let ve;
          this.conxFromEntry.connect('changed', () => {
            ve = valid.validateEmail(this.conxFromEntry.get_text());
            if (ve != null) {
              this.conxFromEntry.remove_css_class('error');
              this.conxFromEntry.add_css_class('success');
            } else {
              this.conxFromEntry.remove_css_class('success');
              this.conxFromEntry.add_css_class('error');
            }
          });

          this.cImportButton.connect('clicked', () => {
            const props = {
              title: 'Select A Connection'
            }
            try {
          
              myFile.fileOpen(props, (res) => {
                // appData.set('FILENAME', res.get_basename());
                const td = new TextDecoder();
                const [, contents] = res.load_contents(null);
                const myConn = JSON.parse(td.decode(contents));
                this.conxNameEntry.set_text(myConn.NAME);
                this.conxFromEntry.set_text(myConn.FROM);
                this.conxHostEntry.set_text(myConn.HOST);
                this.conxUserEntry.set_text(myConn.USER);
                this.conxDelayEntry.set_text(myConn.DELAY);
                this.conxHeadersEntry.set_text(myConn.HEADERS);
                if (myConn.PASS) {
                  this.conxPassEntry.set_text(myConn.PASS);
                }
                this.App.emit('update_ui', true);
                // eslint-disable-next-line max-len
                this.App.emit('Logger', `Opened file : ${res.get_parse_name()}.`);
              });
              
              // TODO : Import connection (save to settings) here
              
              
            } catch (error) {
              log(error);
              throw(error);
            }

          });

          return this.settingsConx;
        } catch (error) {
          log(error);
          throw(error);
        }
        
      }

      
      resetConSelect(combo, connId = null) {
        // const fields = [this.mainSelectCombo, this.sselectCombo];
        const availableCns = JSON.parse(Config.getConnections());
        try {
            
          combo.remove_all();
          if(availableCns.length >= 1) {
            availableCns.forEach((v, k) => {
              combo.insert(k, v.ID, v.NAME);
            });
          } else {
            combo.insert(0, "0", "No Connections Available");
          }
          // this.A.emit('update_ui', true);
          if (connId) {
            combo.set_active_id(connId);
          }
          
        } catch (error) {
          log(`[settings] ${error}`);
          throw(error);
        }
       }

      reallyDelete () {
        if (this.mainSelectCombo.get_active_id()) {
          Config.deleteConnection(this.mainSelectCombo.get_active_id());
          // this.resetConSelect();
          this.App.emit('update_ui', true);
        }
      }

      appConfig () {
        this.App = Gio.Application.get_default();
        const myModal = new Modal.UImodal();
        

        this.settingsForm = new settingsApp();

        // const cExportButton = this.settingsForm.get_template_child(Gtk.Box, 'cExportButton');

        this.mainSelectCombo = this.settingsForm._cSelectField;
        const cExportPasswords = this.settingsForm._cExportPasswords;
        // log(cExportButton);

        this.resetConSelect(this.mainSelectCombo);

        

        this.settingsForm._cDeleteConfirmButton.connect('clicked', () => {
          this.reallyDelete();
          this.settingsForm._cPopDelete.hide();
        });

        this.settingsForm._cEditButton.connect('clicked', () => {

          const _saveHandler = () => {
            let IPv4 = 0;
            if (this.conxIPv4Entry.get_active()) {
              IPv4 = 1;
            }

            const connection = {
              ID: this.mainSelectCombo.get_active_id(),
              NAME: this.conxNameEntry.get_text(),
              FROM: this.conxFromEntry.get_text(),
              USER: this.conxUserEntry.get_text(),
              PASS: this.conxPassEntry.get_text(),
              HOST: this.conxHostEntry.get_text(),
              DELAY: this.conxDelayEntry.get_text(),
              IPv4,
              HEADERS: this.conxHeadersEntry.get_text()
            }
            
            const CONN = Config.saveConnection(connection, true);
            this.resetConSelect(this.mainSelectCombo);
            this.App.emit('update_ui', true);
          };

          

          const props = {
            title: 'New Connection',
            label: 'Please configure your connectoin here.',
            content: this._buildNewConnection(this.mainSelectCombo.get_active_id()),
            saveHandler: _saveHandler
          };
          myModal.doModal(props);

        });

        this.settingsForm._cExportSelButton.connect('clicked', () => {
          const conn = Config.getConnection(this.mainSelectCombo.get_active_id());
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
