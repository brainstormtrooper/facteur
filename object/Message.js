/**
Message object.

Create and send a compiled message.
*/
// const Spawn = imports.assets.spawn;


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
        const msgBlock = `--${this.boundary}\nContent-Type: text/plain; charset=utf-8\n\n${t}\n--${this.boundary}\nContent-Type: text/html; charset=utf-8\n${h}\n--${this.boundary}--`;
        const res = { subBlock, msgBlock };
        return res;

    },

    Preview: function ( ) {

        return true;

    },
    //
    // https://stackoverflow.com/questions/47533683/writing-a-native-messaging-host-in-gjs
    //
    Send : async function (msgObj, to) {
        // cat fifo | mail -s "$(echo -e $SUBJECT)" -r $FROM$SMTPs$SMTPu$SMTPp$i
        const cmdstr = `mail -V \
        -s \"$(echo -e ${msgObj.subBlock})\" \
        -r${to} \
        -S smtp=${HOST} \
        -S smtp-use-starttls \
        -S smtp-auth=login \
        -S smtp-auth-user=${USER} \
        -S smtp-auth-password=${PASS} \
        ${FROM} <<< "${msgObj.msgBlock}"`;
        try {
          print('---');
          /*
          const reader = new Spawn.SpawnReader();
          reader.spawn('./', [cmdstr], (res) => {
            print(`res = "${res}"`);
          });
          */

          const [res, pid, in_fd, out_fd, err_fd] = await GLib.spawn_async_with_pipes('/bin',
                                                  ['mail',
                                                  '-V',
                                                  `-s"${msgObj.subBlock}"`,
                                                  `-r${to}`,
                                                  `-S smtp=${HOST}`,
                                                  '-S smtp-use-starttls',
                                                  '-S smtp-auth=login',
                                                  `-S smtp-auth-user=${USER}`,
                                                  `-S smtp-auth-password=${PASS}`,
                                                  FROM,
                                                  ], null, 0, null);
          const in_reader = new Gio.DataOutputStream({
            base_stream: new Gio.UnixOutputStream({fd: in_fd})
          });
          var feedRes = in_reader.put_string(msgObj.msgBlock, null);
          const out_reader = new Gio.DataInputStream({
            base_stream: new Gio.UnixInputStream({fd: out_fd})
          });
          const err_reader = new Gio.DataInputStream({
            base_stream: new Gio.UnixInputStream({fd: err_fd})
          });
          var out = out_reader.read_until("", null);
          var err = err_reader.read_until("", null);

          print(` > out : "${out}"`);
          print(` > res : "${res}"`);
          print(` > feedRes : "${feedRes}"`);
          print(` > err : "${feedRes}"`);
          print('---');
        } catch ( e ) {
          print('ERROR : ');
          print(e);
          throw e;
        }
    }

});
