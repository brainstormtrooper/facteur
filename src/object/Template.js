/**
Template object.

Handle templates for mailings.
*/
const myTemplate = imports.lib.template;
const myFile = imports.lib.file;
const Data = imports.object.Data;
const GObject = imports.gi.GObject;
const appData = new Data.Data().data;

var Template = GObject.registerClass( // eslint-disable-line
    {
      GTypeName: 'Template',
    },
    class Template extends GObject.Object {
      _init() {
        super._init();
      }
      // METHODS

      compile() {
        return new Promise((resolve, reject) => {
          const res = myTemplate.iterRows(appData);
          if (res) {
            resolve(res);
          } else {
            const e = new Error('Failed to iterate over rows.');
            reject(e);
          }
        });
      }
      /**
       * opens or imports a file
       * @param {string} path
       * @return {string} file contents
       */
      async import(path) {
        const str = await myFile.fopen(path);

        return str;
      }
    },
);
