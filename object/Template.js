/**
Template object.

Handle templates for mailings.
*/

var Template = {

    // VARS

    key: "",
    vala: {},
    tpltxt: "",
    tplhtml: "";
    stra: {},


    // METHODS

    Template: function( ) {

        return true;

    },

    Create: function( path ) {

        this.msgcompiled = "--" + this.boundary + this.txt + "--" + this.boundary + this.html;
        return this.msgcompiled;

    },

    Destroy: function( ) {

        return true;

    },

    Use: function( ) {

        return true;
    },

    Compile: function( ) {

        return true;

    },
};
