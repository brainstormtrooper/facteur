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


// const conxfile = Gio.File.new_for_path('data/settingsConx.ui');
// const [, conxtemplate] = conxfile.load_contents(null);

var settingsConx = GObject.registerClass( // eslint-disable-line
{
  GTypeName: 'settingsConx',
  Template: 'resource:///com/github/brainstormtrooper/facteur/settingsConx.ui',
  // Children: [],
  InternalChildren: [
    'form_area', 'cImportButton', 'conxNameEntry', 
    'conxFromEntry', 'conxHostEntry', 'conxUserEntry',
    'conxPassEntry', 'conxDelayEntry', 'conxHeadersEntry',
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
  Template: 'resource:///com/github/brainstormtrooper/facteur/settingsMain.ui',
  // Children: [],
  InternalChildren: [
    'form_area', 'sselectCombo', 'snewButton', 
    'subjectField', 'saveButton'
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
  Template: 'resource:///com/github/brainstormtrooper/facteur/settingsApp.ui',
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

          if (connId || obj.ID) {
            const conn = (obj.ID ? obj.ID : Config.getConnection(connId));
            const name = (obj.NAME ? obj.NAME : conn.NAME);
            const from = (obj.FROM ? obj.FROM : conn.FROM);
            const host = (obj.HOST ? obj.HOST : conn.HOST);
            const user = (obj.USER ? obj.USER : conn.USER);

            const pass = (obj.PASS ? obj.PASS : secret.connPasswordGet(connId));
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
          if (this.sselectCombo) {
            this.resetConSelect(this.sselectCombo, connId);
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

        
        // const css = '#formbox { background-color: #f00; }';
        

        this.settingsMain = new settingsMain();

        this.subjectField = this.settingsMain._subjectField
        this.snewButton = this.settingsMain._snewButton;
        this.sselectCombo = this.settingsMain._sselectCombo;
        const saveButton = this.settingsMain._saveButton;

        this.resetConSelect(this.sselectCombo);

        this.snewButton.connect('clicked', () => {
          myModal.newConnection(this);
        });

        saveButton.connect('clicked', () => {
          appData.set('SUBJECT', this.subjectField.get_text());
          appData.set('CONN', this.sselectCombo.get_active_id());
          // eslint-disable-next-line max-len
          const str = ` >>> Started Mailing "${this.subjectField.get_text()}"...`;
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
            // this._updateUI(myConn);
          }
          if (ipv4) {
            this.conxIPv4Entry.set_active(true);
          }
          

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
                this.App.emit('update_ui', true);
                // eslint-disable-next-line max-len
                this.App.emit('Logger', `Opened file : ${appData.get('FILENAME')}.`);
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
        const ipv4 = Config.getIpv4();
        

        this.settingsForm = new settingsApp();

        // const cExportButton = this.settingsForm.get_template_child(Gtk.Box, 'cExportButton');

        this.mainSelectCombo = this.settingsForm._cSelectField;
        const ipv4Field = this.settingsForm._defIpv4Field;
        const cExportPasswords = this.settingsForm._cExportPasswords;
        const delayField = this.settingsForm._delayField;
        // log(cExportButton);

        this.resetConSelect(this.mainSelectCombo);

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

        this.settingsForm._cEditButton.connect('clicked', () => {
          // const conn = Config.getConnection(this.mainSelectCombo.get_active_id());
          myModal.editConnection(this, this.mainSelectCombo.get_active_id());
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
