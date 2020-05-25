/**
Template object.

Handle templates for mailings.
*/
const Lang = imports.lang;
const Signals = imports.signals;
const myTemplate = imports.lib.template;

var Template =  new Lang.Class ({
    Name: 'Template Class',


    // METHODS

    Template: function () {

        Signals.addSignalMethods(Template.prototype);
        this.parent();

        this.emit('bob', false);

    },

    Compile: function () {
      return new Promise((resolve, reject) => {
        const res = myTemplate.iterRows();
        if (res) {
          resolve(res);
        } else {
          reject('Failed to iterate over rows.');
        }
      });
    },

    Run: function () {
       // myTemplate.Run();
    }
});
