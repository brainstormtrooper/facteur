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

      /**
       * Attach a string of file contents to mailing
       * 
       * @param {string} filename 
       * @param {string} contents 
       */
      attachContents (filename, contents) {
        const aObj = {};
        const base64str = GLib.base64_encode(contents);
        const size = encodeURI(base64str).split(/%..|./).length - 1;
        if (size > 20971520) {
          const se = new Error(Gettext.gettext('Cannot attach file greater than 20MB'));
          throw se;
        }
        aObj.contents = base64str;
        aObj.fileName = filename;
        const [type, uncertain] = Gio.content_type_guess(aObj.fileName, null);
        
        aObj.type = type;
        aObj.inline = false;
        aObj.id = '';
        appData.addAttachment(aObj);

      }

      /**
       * Sets the attachment as inline 
       * returns the id of the attachment
       * 
       * @param {string} filename 
       * @returns string
       */
      setAttachmentInline(filename) {
        return appData.setInlineAttachment(filename, true);
      }

      /**
       * Replaces path with cid slug in template
       * 
       * @param {string} path 
       * @param {string} cid 
       */
      pathToCid (path, cid) {
        let tplstr = appData.get('HTML');
        const slug = `cid:${cid}`;
        tplstr = tplstr.replace(path, slug);
        appData.set('HTML', tplstr);
      }

      /**
       * Link images extracted from a mailing template
       * attach image
       * make inline
       * replace link with slug
       * 
       * @param {list} links 
       */
      doExtract (links) {
        const Ps = [];
        links.forEach((link) => {
          const myP = new Promise((resolve, reject) => {
            const decoder = new TextDecoder('utf-8');
            const lo = JSON.parse(decoder.decode(GLib.base64_decode(link)));
            const filename = lo.key.split('/').pop();
            if (lo.path.split('/').shift().includes('http')) {
              const datap = myFile.getOpen(lo.path);
              datap.then( datastr => {
                this.attachContents(filename, datastr);
                const aid = this.setAttachmentInline(filename);
                this.pathToCid(lo.key, aid);
                resolve(lo.key)
              }).catch(e => {
                console.log(e);
                reject(e);
                // throw e;
              });
            } else {
              // local file
              const datap = myFile.fopen(lo.path, false);
              datap.then( datastr => {
                this.attachContents(filename, datastr);
                const aid = this.setAttachmentInline(filename);
                this.pathToCid(lo.key, aid);
                resolve(lo.key);
              }).catch(e => {
                console.log(e);
                reject(e);
                // throw e;
              });
            }
          });
          Ps.push(myP);
        });
        return Ps;
      }

      /**
       * extract image links and paths from template.
       * 
       * @param {string} htmlStr 
       */
      extractImages (htmlStr) {
        const imgs = ['jpg', 'jpeg', 'webp', 'png'];
        const myImgs = [];
        const links = myTemplate._links(htmlStr);
        links.forEach(link => {
          const ext = link.split('.').pop();
          if (imgs.includes(ext)) {
            myImgs.push(link);
          }
        });

        return myImgs;
      }

    }
);
