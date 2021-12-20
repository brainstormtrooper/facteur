const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const secret = imports.lib.secret;
const Data = imports.object.Data;

const appData = new Data.Data();

/* eslint-disable no-unused-vars */

function fopen(path) {
  return new Promise((resolve, reject) => {
    const file = Gio.File.new_for_path(path);
    // asynchronous file loading...
    file.load_contents_async(null, (file, res) => {
      try {
        // read the file into a variable...
        const contents = file.load_contents_finish(res)[1];
        const dataString = contents.toString();

        resolve(dataString);
      } catch (e) {
        logError(e, 'File error');

        reject(e);
      }
    });
  });
}

function save(path, data) {
  const dataStr = JSON.stringify(data, null, '\t');
  GLib.file_set_contents(path, dataStr);
}

function rollUp() {
  secret.passwordSet(appData.data.PASS);
  const roll = {
    FROM: appData.data.FROM,
    USER: appData.data.USER,
    HOST: appData.data.HOST,
    SUBJECT: appData.data.SUBJECT,
    HTML: appData.data.HTML,
    TEXT: appData.data.TEXT,
    TO: appData.data.TO,
    CSVA: appData.data.CSVA,
    VARS: appData.data.VARS,
    DELAY: appData.data.DELAY,
    FILEID: appData.data.FILEID,
    SENT: appData.data.SENT,
  };

  return roll;
}

function verify(data) {
  const required = [
    'FROM', 'USER', 'HOST', 'SUBJECT',
    'FILEID', 'HTML', 'TEXT', 'TO', 'CSVA', 'VARS', 'DELAY',
  ];
  let valid = true;
  required.forEach((key) => {
    // eslint-disable-next-line no-prototype-builtins
    if (!data.hasOwnProperty(key)) {
      valid = false;
    }
  });
  /*
  Object.keys(data).forEach((key) => {
    if (!required.includes(key)) {
      valid = false;
    }
  });
  */

  return valid;
}

function unRoll(data) {
  if (!verify(data)) {
    const bfe = new Error('Bad file');
    throw bfe;
  }
  appData.data.FROM = data.FROM;
  appData.data.USER = data.USER;
  appData.data.HOST = data.HOST;
  appData.data.SUBJECT = data.SUBJECT;
  appData.data.HTML = data.HTML;
  appData.data.TEXT = data.TEXT;
  appData.data.TO = data.TO;
  appData.data.CSVA = data.CSVA;
  appData.data.VARS = data.VARS;
  appData.data.DELAY = data.DELAY;
  appData.data.FILEID = data.FILEID;
  appData.data.SENT = data.SENT;
  secret.passwordGet();
}

async function open(path) {
  const contents = await fopen(path);

  return JSON.parse(contents);
}

function namrFromPath($path) {
  return $path.split('/')[-1];
}
