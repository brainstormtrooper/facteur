/**
Template object.

Handle templates for mailings.
*/
const myTemplate = imports.lib.template;
const myFile = imports.lib.file;
const myBase64 = imports.lib.base64;
const Data = imports.object.Data;
const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Gettext = imports.gettext;
const appData = new Data.Data();



var Template = GObject.registerClass( // eslint-disable-line
    {
      GTypeName: 'Template',
      Signals: {
        'update_attachments': {
          param_types: [GObject.TYPE_BOOLEAN],
        },
      }
    },
    class Template extends GObject.Object {
      _init () {
        super._init();
      }
      // METHODS

      compile () {
        return new Promise((resolve, reject) => {
          const res = myTemplate.iterRows(appData);
          if (res) {
            resolve(res);
          } else {
            const e = new Error(Gettext.gettext('Failed to iterate over rows.'));
            reject(e);
          }
        });
      }

      addLink(path) {
        let valid = false;
        const file = Gio.File.new_for_path(path);
        if (file.query_exists(null)) {
          const info = file.query_info('standard::*', null, null);
          const size = info.get_size();
          if (size > 20971520) {
            const se = new Error(Gettext.gettext('Cannot attach file greater than 20MB'));
            throw se;
          }
          valid = true;
        }
        if (!file.query_exists(null) && path.includes('{{')) {
          valid = true;
        }
        if (valid) {
          appData.addLink(path);
        }
        
      }

      addAttachment (file) {
        const aObj = {};
        const info = file.query_info('standard::*', null, null);
        const size = info.get_size();
        if (size > 20971520) {
          const se = new Error(Gettext.gettext('Cannot attach file greater than 20MB'));
          throw se;
        }
        // 20MB = 20971520
        const [, contents] = file.load_contents(null);
        // const td = new TextDecoder();
        aObj.contents = GLib.base64_encode(contents);
        aObj.fileName = file.get_basename();
        // const fExt = aObj.fileName.split('.')[1];
        const [type, uncertain] = Gio.content_type_guess(aObj.fileName, null);
        
        aObj.type = type;
        aObj.inline = false;
        aObj.id = '';
        appData.addAttachment(aObj);
        
      }
    },
);
