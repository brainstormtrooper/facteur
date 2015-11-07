/**
Message object.

Create and send a compiled message.
*/

var Message = {

    // VARS

    boundary: "qeq65er15v61e6qr156ve1",
    txt: "",
    html: "",
    dests: {},
    msgcompiled: "",
    cmdstr: "",


    // METHODS

    Message: function( ) {

        return true;

    },

    Build: function( ) {

        this.msgcompiled = "--" + this.boundary + this.txt + "--" + this.boundary + this.html;
        return this.msgcompiled;

    },

    Preview: function ( ) {

        return true;

    },

    Send : function () {

        try {
            GLib.spawn_command_line_async( cmdstr, e );
        } catch ( e ) {
            throw e;
        }

    }

};
