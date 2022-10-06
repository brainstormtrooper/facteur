const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const secret = imports.lib.secret;
const base64 = imports.lib.base64;
const Data = imports.object.Data;

const appData = new Data.Data();

/* eslint-disable no-unused-vars */

function fopen (path) {
  return new Promise((resolve, reject) => {
    const file = Gio.File.new_for_path(path);
    // asynchronous file loading...
    file.load_contents_async(null, (file, res) => {
      try {
        // read the file into a variable...
        const contents = file.load_contents_finish(res)[1];
        const decoder = new TextDecoder('utf-8');
        const dataString = decoder.decode(contents);

        resolve(dataString);
      } catch (e) {
        logError(e, 'File error');

        reject(e);
      }
    });
  });
}

function save (path, data) {
  const dataStr = JSON.stringify(data, null, '\t');
  GLib.file_set_contents(path, dataStr);
}

function rollConn (conn, savePW) {
  if (savePW) {
    conn.PASS = secret.connPasswordGet(conn.ID);
  }

  return conn;
}

function rollUp () {
  secret.passwordSet(appData.get('PASS'));
  const roll = {
    FROM: appData.get('FROM'),
    USER: appData.get('USER'),
    HOST: appData.get('HOST'),
    SUBJECT: appData.get('SUBJECT'),
    HTML: appData.get('HTML'),
    TEXT: appData.get('TEXT'),
    TO: appData.get('TO'),
    CSVA: base64.encode64(JSON.stringify(appData.get('CSVA'))),
    VARS: appData.get('VARS'),
    DELAY: appData.get('DELAY'),
    FILEID: appData.get('FILEID'),
    SENT: appData.get('SENT'),
  };

  return roll;
}

function verify (data) {
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

  // fix legacy files

  if(typeof data.CSVA == 'object') {

    data.CSVA = base64.encode64(JSON.stringify(data.CSVA));
  }

  /*
  Object.keys(data).forEach((key) => {
    if (!required.includes(key)) {
      valid = false;
    }
  });
  */

  return valid;
}

function unRoll (data) {

// console.log(JSON.parse(data));

  if (!verify(data)) {
    const bfe = new Error('Bad file');
    throw bfe;
  }
  appData.set('FROM', data.FROM);
  appData.set('USER', data.USER);
  appData.set('HOST', data.HOST);
  appData.set('SUBJECT', data.SUBJECT);
  appData.set('HTML', data.HTML);
  appData.set('TEXT', data.TEXT);
  appData.set('TO', data.TO);
  appData.set('CSVA', JSON.parse(base64.decode64(data.CSVA)));
  appData.set('VARS', data.VARS);
  appData.set('DELAY', data.DELAY);
  appData.set('FILEID', data.FILEID);
  appData.set('SENT', data.SENT);
  secret.passwordGet();
}

async function open (path) {
  const contents = await fopen(path);
  
  return JSON.parse(contents);
}

function nameFromPath (path) {
  return path.split('/')[-1];
}
