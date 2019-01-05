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

    Build: function(t, h) {
        // SUBJECT="$SUBJECT\nMIME-Version: 1.0\nContent-Type: multipart/alternative; boundary=$BOUNDRY\n\n"
        const subBlock = `${SUBJECT}\nMIME-Version: 1.0\nContent-Type: multipart/alternative; boundary=${this.boundary}\n\n`;
        // "--$BOUNDRY\nContent-Type: text/plain; charset=utf-8\n\n$t\n--$BOUNDRY\nContent-Type: text/html; charset=utf-8\n$h\n--$BOUNDRY--"
        const msgBlock = `--${this.boundary}\nContent-Type: text/plain; charset=utf-8\n\n${t}\n--${this.boundary}\nContent-Type: text/html; charset=utf-8\n${h}\n--${this.boundary}--"`;
        this.msgcompiled = "--" + this.boundary + this.txt + "--" + this.boundary + this.html;
        return this.msgcompiled;

    },

    Preview: function ( ) {

        return true;

    },

    Send : function (compiled) {

        try {
            GLib.spawn_command_line_async( cmdstr, e );
        } catch ( e ) {
            throw e;
        }

    }

};
