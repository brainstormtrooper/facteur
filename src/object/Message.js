/**
Message object.

Create and send a compiled message.
*/
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Soup = imports.gi.Soup;
const Settings = imports.object.Settings;
const time = imports.lib.time;
const Data = imports.object.Data;
const myTemplate = imports.object.Template;
const secret = imports.lib.secret;
const tpllib = imports.lib.template;
const Template = new myTemplate.Template();
const GObject = imports.gi.GObject;
const appData = new Data.Data();
const Config = new Settings.Settings();

var Message = GObject.registerClass( // eslint-disable-line
    {
      GTypeName: 'Message',
      Signals: {
        'Logger': {
          param_types: [GObject.TYPE_STRING],
        },
        'Sent': {
          param_types: [GObject.TYPE_BOOLEAN],
        },
      },
    },
    class Message extends GObject.Object {
      _init () {
        super._init();
        // eslint-disable-next-line max-len
        this.mixedBoundary = [...Array(16)].map(() => Math.random().toString(36)[2]).join('');
        this.relatedBoundary = [...Array(16)].map(() => Math.random().toString(36)[2]).join('');
        this.alternativeBoundary = [...Array(16)].map(() => Math.random().toString(36)[2]).join('');
      }

      // METHODS

      async compile () {
        return await Template.compile();
      }

      rule79 (str) {
        return str.match(/.{1,72}/g).join("\n");

      }

      sleep (milliseconds) {
        const timeStart = new Date().getTime();
        // eslint-disable-next-line
        while (true) {
          const elapsedTime = new Date().getTime() - timeStart;
          if (elapsedTime > milliseconds) {
            break;
          }
        }
      }

      sendAll () {
        this.App = Gio.Application.get_default();
        this.curConn = Config.getConnection(appData.get('CONN'));
        const delay = this.curConn.DELAY;
        appData.get('MAILINGS').forEach((mailing) => {
          // eslint-disable-next-line max-len
          const mobj = this.build(mailing);
          try {
            this.send(mobj, mailing.to);
          } catch (error) {
            logError(error);
          }
          
          this.sleep(delay);
        });
        appData.set('SENT', time.now());
        this.App.emit('Sent', true);
      }

      build (mailing) {
        
        const inline = [];
        const attach = [];
        const blocks = [
          {
            type: 'plain',
            name: 'text',
            content: mailing.text,
            parent: 'message'
          },
          {
            type: 'html',
            name: 'html',
            content: mailing.html,
            parent: 'message'
          }
        ];

        // const mObj = {};

        let payload = tpllib.payload.replace('{{subject}}', appData.get('SUBJECT'));

        payload = payload.replace('{{to}}', mailing.to);
        payload = payload.replace('{{from}}', mailing.from);
        payload = payload.replace('{{date}}', GLib.DateTime.new_now_utc().format('%d %b %Y %H:%M:%S %:z'));
        payload = payload.replace(/{{mixedBoundary}}/g, this.mixedBoundary);
        payload = payload.replace(/{{relatedBoundary}}/g, this.relatedBoundary);
        payload = payload.replace(/{{alternativeBoundary}}/g, this.alternativeBoundary);

        blocks.forEach(block => {
          let str = tpllib.partBlock;
          // {{boundary}}, {{contentType}}, {{contentExtra}}, {{content}}, {{dispositionHeader}}
          // Content-Disposition: inline; filename="image001.png";
          str = str.replace('{{boundary}}', this.alternativeBoundary);
          str = str.replace('{{encoding}}', '7bit');
          str = str.replace('{{contentId}}', '');
          
          if (block.type == 'plain') {
            str = str.replace('{{contentType}}', 'text/plain');
            str = str.replace('{{contentExtra}}', 'charset="us-ascii"');
            str = str.replace('{{content}}', block.content);
            str = str.replace('{{dispositionHeader}}', '');
            payload = payload.replace('{{partText}}', str);
          }
          if (block.type == 'html') {
            str = str.replace('{{contentType}}', 'text/html');
            str = str.replace('{{contentExtra}}', 'charset="us-ascii"');
            str = str.replace('{{content}}', block.content);
            str = str.replace('{{dispositionHeader}}', '');
            payload = payload.replace('{{partHtml}}', str);
          }

        });

        const attachments = appData.get('ATTACHMENTS');

        attachments.forEach(attachment => {
          let str = tpllib.partBlock;
          // str = str.replace('{{contentType}}', attachment.type);
          
          str = str.replace('{{contentExtra}}', `name="${attachment.fileName}";`);
          str = str.replace('{{encoding}}', 'base64');
          if (attachment.inline) {
            str = str.replace('{{contentType}}', attachment.type);
            str = str.replace('{{boundary}}', this.relatedBoundary);
            str = str.replace('{{content}}', this.rule79(attachment.contents));
            str = str.replace('{{contentId}}', `Content-ID: <${attachment.id}>`);
            str = str.replace('{{dispositionHeader}}', `Content-Disposition: inline; filename="${attachment.fileName}";`);
            inline.push(str);
          } else {
            str = str.replace('{{contentType}}', 'application/octet-stream');
            str = str.replace('{{boundary}}', this.mixedBoundary);
            const rid = Math.random().toString(36).slice(2, 7);
            str = str.replace('{{contentId}}', `Content-ID: "${rid}"`);
            str = str.replace('{{content}}', this.rule79(attachment.contents));
            str = str.replace('{{dispositionHeader}}', `Content-Disposition: attachment; filename="${attachment.fileName}";`);
            attach.push(str);
          }

        });


        payload = payload.replace('{{partsInline}}', inline.join("\n\n"));
        payload = payload.replace('{{partsAttachment}}', attach.join("\n\n"));

        

        return payload;
      }

      preview () {
        return true;
      }


      async soupSend(msgObj, to) {
        this.App = Gio.Application.get_default();
        // const ipv4 = Config.getIpv4();
        let httpSession = new Soup.Session();
        // httpSession.user_agent = 'blah'
        let authUri = new Soup.URI(url);
        authUri.set_user(this.handle);
        authUri.set_password(this.token);
        let message = new Soup.Message({method: 'GET', uri: authUri});

        let authManager = new Soup.AuthManager();
        let auth = new Soup.AuthBasic({host: 'api.github.com', realm: 'Github Api'});

        Soup.Session.prototype.add_feature.call(httpSession, authManager);
        httpSession.queue_message(message, function() {});
      }

      //
      // https://stackoverflow.com/questions/47533683/writing-a-native-messaging-host-in-gjs
      // https://www.mailjet.com/feature/smtp-relay/
      // https://stackoverflow.com/questions/44728855/curl-send-html-email-with-embedded-image-and-attachment
      //
      async send (msgObj, to, cancellable = null) {
        this.App = Gio.Application.get_default();
        const ipv4 = Config.getIpv4();
        const pass = secret.connPasswordGet(this.curConn.ID);
        let flagStr = '-svk';
        if (ipv4) {
          flagStr = '-svk4';
        }

        const argv = ['curl',
          flagStr,
          // Option switches and values are separate args
          '--mail-from', this.curConn.FROM,
          '--url', this.curConn.HOST,
          '--mail-rcpt', to,
          '-T', '-',
          '--user', `${this.curConn.USER}:${pass}`,
        ];
        if (this.curConn.HOST.toLowerCase().includes('smtps')) {
          argv.push('--ssl-reqd');
        }
        try {

          const proc = new Gio.Subprocess({
            argv,
            flags: Gio.SubprocessFlags.STDIN_PIPE |
              Gio.SubprocessFlags.STDOUT_PIPE |
              Gio.SubprocessFlags.STDERR_MERGE,
          });
          // Classes that implement GInitable must be initialized before use,
          // but you could use Gio.Subprocess.new(argv, flags)
          // which will call this for you
          proc.init(cancellable);

          // We're going to wrap a GLib async function in a Promise so we can
          // use it like a native JavaScript async function.
          //
          // You could alternatively return this Promise instead of awaiting it
          // here, but that's up to you.
          const stdout = await new Promise((resolve, reject) => {


            // communicate_utf8() returns a string, communicate() returns a
            // a GLib.Bytes and there are "headless" functions available as well
            proc.communicate_utf8_async(
                // This is your stdin, which can just be a JS string
                msgObj,
                // we've been passing this around from the function args; you
                // can create a Gio.Cancellable and call `cancellable.cancel()`
                // to stop the command or any other operation you've passed it
                // to at any time, which will throw an
                // "Operation Cancelled" error.
                cancellable,

                // This is the GAsyncReady callback, which works like any other
                // callback, but we need to ensure we catch errors so we can
                // propagate them with `reject()` to make the Promise work
                // properly
                (proc, res) => {
                  try {
                    // eslint-disable-next-line
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
                    this.App.emit('Logger', `>>> ERR >>> : ${e}`);
                    reject(e);
                  }
                },
            );
          });
          // log(`>>> RES >>> : ${stdout}`);
          this.App.emit('Logger', `>>> RES >>> : ${stdout}`);
          // return stdout;
        } catch (e) {
          // This could be any number of errors, but probably it will be a
          // GError in which case it will have `code` property carrying a
          // GIOErrorEnum you could use to programmatically respond to.
          logError(e);
        }
      }
    },
);
