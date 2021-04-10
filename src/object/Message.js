/**
Message object.

Create and send a compiled message.
*/
const Gio = imports.gi.Gio;
const Config = imports.lib.settings;
const Data = imports.object.Data;
const appData = new Data.Data().data;

var Message = class Message{

	// VARS

	Name = 'Message';
	boundary = [...Array(16)].map(() => Math.random().toString(36)[2]).join('');


	// METHODS

	Message() {
		return true;
	};

  sleep(milliseconds) {
    let timeStart = new Date().getTime();
    while (true) {
      let elapsedTime = new Date().getTime() - timeStart;
      if (elapsedTime > milliseconds) {
          break;
      }
    }
  };

	SendAll() {
    let delay = Config.getDelay();
    if (appData.DELAY != delay) {
      delay = appData.DELAY;
    }
    appData.MAILINGS.forEach((mailing) => {
      const mobj = this.Build(mailing.text, mailing.html.replace(/(\r\n|\n|\r)/gm, ''));
      this.Send(mobj, mailing.to);
			this.sleep(delay);
		});
	};

	Build(t, h) {
		const subBlock = `Subject: ${appData.SUBJECT}\nMIME-Version: 1.0\nContent-Type: multipart/alternative; boundary=${this.boundary}\n\n`;
		const msgBlock = `--${this.boundary}\nContent-Type: text/plain; charset=utf-8\n${t}\n--${this.boundary}\nContent-Type: text/html; charset=utf-8\n${h}\n--${this.boundary}--`;	
		const res = { subBlock, msgBlock };

		return res;

	};

	Preview() {

		return true;

	};
	//
	// https://stackoverflow.com/questions/47533683/writing-a-native-messaging-host-in-gjs
	// https://www.mailjet.com/feature/smtp-relay/
	// https://stackoverflow.com/questions/44728855/curl-send-html-email-with-embedded-image-and-attachment
	//
	async Send (msgObj, to, cancellable = null) {
		const ipv4 = Config.getIpv4();
		let flagStr = '-svk';
		if (ipv4) {
			flagStr = '-svk4';
		}
		
    const argv = ['curl',
      flagStr,
      // Option switches and values are separate args
      '--mail-from', appData.FROM,
      '--url', appData.HOST,
      '--mail-rcpt', to,
      '-T', '-',
      '--user', `${appData.USER}:${appData.PASS}`
    ];
    if (appData.HOST.toLowerCase().includes('https')) {
			argv.push('--ssl-reqd');
		}
		try {
			let proc = new Gio.Subprocess({
				argv,
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
							app.ui.results._LOG(`>>> ERR >>> : ${e}`);
							reject(e);
						}
					}
				);
			});
			log(`>>> RES >>> : ${stdout}`);
			app.ui.results._LOG(`>>> RES >>> : ${stdout}`);
			// return stdout;
		} catch (e) {
			// This could be any number of errors, but probably it will be a GError
			// in which case it will have `code` property carrying a GIOErrorEnum
			// you could use to programmatically respond to, if desired.
			log(e);
		}
	}
};
