/**
Template object.

Handle templates for mailings.
*/

const Template =  new Lang.Class ({
    Name: 'Template Class',

    // VARS

    key: 'foo',
    vala: [],

    tpltxt: 'bar',

    tplhtml: 'baz',

    stra: {},


    // METHODS

    Template: function () {

        Signals.addSignalMethods(Template.prototype);
        this.parent();


        //print('Methods in Data class : ' + this.getMethods(this).join("\n"));

        this.emit('bob', false);

    },

    Create: function (path) {

      return true;

    },

    Destroy: function () {

      return true;

    },

    Use: function () {

      return true;
    },

    Compile: function (row) {

      return true;
    },
});
