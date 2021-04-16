/**
Template object.

Handle templates for mailings.
*/
const myTemplate = imports.lib.template;
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

    Compile() {
      return new Promise((resolve, reject) => {
        const res = myTemplate.iterRows(appData);
        if (res) {
          resolve(res);
        } else {
          reject('Failed to iterate over rows.');
        }
      });
    }

  }
);
