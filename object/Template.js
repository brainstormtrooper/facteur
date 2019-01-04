/**
Template object.

Handle templates for mailings.
*/


const myTemplate = imports.lib.template;
const Template =  new Lang.Class ({
    Name: 'Template Class',


    // METHODS

    Template: function () {

        Signals.addSignalMethods(Template.prototype);
        this.parent();

        this.emit('bob', false);

    },

    Compile: function () {
      myTemplate.iterRows();
    },

    Run: function () {
       // myTemplate.Run();
    }
});
