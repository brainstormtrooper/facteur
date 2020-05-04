/**
Message object.

Create and send a compiled message.
*/



const Message = new Lang.Class ({

    // VARS

    Name: 'Message',
    boundary: [...Array(16)].map(() => Math.random().toString(36)[2]).join(''),


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
        const subBlock = `Subject: ${SUBJECT}\nMIME-Version: 1.0\nContent-Type: multipart/alternative; boundary=${this.boundary}\n\n`;
        // "--$BOUNDRY\nContent-Type: text/plain; charset=utf-8\n\n$t\n--$BOUNDRY\nContent-Type: text/html; charset=utf-8\n$h\n--$BOUNDRY--"
        const msgBlock = `--${this.boundary}\nContent-Type: text/plain; charset=utf-8\n${t}\n--${this.boundary}\nContent-Type: text/html; charset=utf-8\n${h}\n--${this.boundary}--`;
        // print(msgBlock);
        app.ui.results._LOG('Current message is : ' + msgBlock);
        const res = { subBlock, msgBlock };
        return res;

    },

    Preview: function ( ) {

        return true;

    },
    //
    // https://stackoverflow.com/questions/47533683/writing-a-native-messaging-host-in-gjs
    // https://www.mailjet.com/feature/smtp-relay/
    // https://stackoverflow.com/questions/44728855/curl-send-html-email-with-embedded-image-and-attachment
    //
    Send : async function (msgObj, to, cancellable = null) {
        // cat fifo | mail -s "$(echo -e $SUBJECT)" -r $FROM$SMTPs$SMTPu$SMTPp$i
         try {
        let proc = new Gio.Subprocess({
            argv: ['curl',
                   '-svk4',
                   '--ssl-reqd',
                   // Option switches and values are separate args
                   '--mail-from', FROM,
                   '--url', HOST,
                   '--mail-rcpt', to,
                   '-T', '-',
                   '--user', `${USER}:${PASS}`
            ],
            flags: Gio.SubprocessFlags.STDIN_PIPE |
                   Gio.SubprocessFlags.STDOUT_PIPE |
                   Gio.SubprocessFlags.STDERR_MERGE
        });
        // Classes that implement GInitable must be initialized before use, but
        // you could use Gio.Subprocess.new(argv, flags) which will call this for you
        proc.init(cancellable);

        // We're going to wrap a GLib async function in a Promise so we can
        // use it like a native JavaScript async function.
        //
        // You could alternatively return this Promise instead of awaiting it
        // here, but that's up to you.
        let stdout = await new Promise((resolve, reject) => {

            // communicate_utf8() returns a string, communicate() returns a
            // a GLib.Bytes and there are "headless" functions available as well
            proc.communicate_utf8_async(
                // This is your stdin, which can just be a JS string
                `${msgObj.subBlock} ${msgObj.msgBlock}`,
                // we've been passing this around from the function args; you can
                // create a Gio.Cancellable and call `cancellable.cancel()` to
                // stop the command or any other operation you've passed it to at
                // any time, which will throw an "Operation Cancelled" error.
                cancellable,

                // This is the GAsyncReady callback, which works like any other
                // callback, but we need to ensure we catch errors so we can
                // propagate them with `reject()` to make the Promise work
                // properly
                (proc, res) => {
                    try {
                        let [ok, stdout, stderr] = proc.communicate_utf8_finish(res);
                        // Because we used the STDERR_MERGE flag stderr will be
                        // included in stdout. Obviously you could also call
                        // `resolve([stdout, stderr])` if you wanted to keep both
                        // and separate them.
                        //
                        // This won't affect whether the proc actually return non-
                        // zero causing the Promise to reject()
                        resolve(stdout);
                    } catch (e) {
                        reject(e);
                    }
                }
            );
        });
        print (`>>> RES >>> : ${stdout}`);
        return stdout;
    } catch (e) {
        // This could be any number of errors, but probably it will be a GError
        // in which case it will have `code` property carrying a GIOErrorEnum
        // you could use to programmatically respond to, if desired.
        logError(e);
    }
    }
});
