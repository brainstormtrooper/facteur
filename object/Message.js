/**
Message object.

Create and send a compiled message.
*/

const Message = new Lang.Class ({

    // VARS

    Name: 'Message',
    boundary: "qeq65er15v61e6qr156ve1",


    // METHODS

    Message: function() {
      return true;
    },

    SendAll: function() {
      MAILINGS.forEach((mailing) => {
        const mobj = this.Build(mailing.text, mailing.html);
        this.Send(mobj, mailing.to);
      });
    },

    Build: function(t, h) {
        // SUBJECT="$SUBJECT\nMIME-Version: 1.0\nContent-Type: multipart/alternative; boundary=$BOUNDRY\n\n"
        const subBlock = `${SUBJECT}\nMIME-Version: 1.0\nContent-Type: multipart/alternative; boundary=${this.boundary}\n\n`;
        // "--$BOUNDRY\nContent-Type: text/plain; charset=utf-8\n\n$t\n--$BOUNDRY\nContent-Type: text/html; charset=utf-8\n$h\n--$BOUNDRY--"
        const msgBlock = `--${this.boundary}\nContent-Type: text/plain; charset=utf-8\n\n${t}\n--${this.boundary}\nContent-Type: text/html; charset=utf-8\n${h}\n--${this.boundary}--"`;
        // this.msgcompiled = "--" + this.boundary + this.txt + "--" + this.boundary + this.html;
        const res = { subBlock, msgBlock };
        return res;

    },

    Preview: function ( ) {

        return true;

    },

    Send : async function (msgObj, to) {
        // cat fifo | mail -s "$(echo -e $SUBJECT)" -r $FROM$SMTPs$SMTPu$SMTPp$i
        let res = false;
        const cmdstr = `SUBJECT=${msgObj.subBlock}
        FROM=${FROM}
        SMTPs=${HOST}
        SMTPu=${USER}
        SMTPp=${PASS}
        TO=${to}
        "$(echo -e ${msgObj.msgBlock})" | mail -s "$(echo -e $SUBJECT)" -r $FROM$SMTPs$SMTPu$SMTPp$TO`;
        try {
            GLib.spawn_command_line_async( cmdstr );
            res = true;
            return res;
        } catch ( e ) {
            print(e);
            throw e;
        }
    }

});
