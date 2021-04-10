/**
Template object.

Handle templates for mailings.
*/
const Signals = imports.signals;
const myTemplate = imports.lib.template;
const Data = imports.object.Data;
const appData = new Data.Data().data;

var Template = class Template {
  Name = 'Template Class';


  // METHODS

  Template() {

    Signals.addSignalMethods(Template.prototype);
    this.parent();

    this.emit('bob', false);

  };

  Compile() {
    return new Promise((resolve, reject) => {
      const res = myTemplate.iterRows(appData);
      if (res) {
        resolve(res);
      } else {
        reject('Failed to iterate over rows.');
      }
    });
  };

};
