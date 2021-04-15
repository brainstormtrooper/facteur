const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const crypto = imports.lib.aes;
const settings = imports.lib.settings;
const Data = imports.object.Data;

const appData = new Data.Data();

// jshint unused:false

function Import(path) {
  return new Promise((resolve, reject) => {
    let file = Gio.File.new_for_path(path);
    log('reading file from ' + path);
    // asynchronous file loading...
    file.load_contents_async(null, (file, res) => {
      try {
        // read the file into a variable...
        const contents = file.load_contents_finish(res)[1];
        const dataString = contents.toString();

        resolve(dataString);

      } catch (e) {
        log('Error loading data file : ' + e);

        reject(e);
      }
    });
  });
}

function save(path, data) {
  let dataStr = JSON.stringify(data, null, '\t');
  GLib.file_set_contents(path, dataStr);
}

// https://stackoverflow.com/questions/18279141/javascript-string-encryption-and-decryption
// https://stackoverflow.com/questions/21291279/how-to-convert-to-string-and-back-again-with-cryptojs
// replace with : https://github.com/brix/crypto-js ?
function rollUp() {
  const HASH = settings.getHash().toString();
  const roll = {
    FROM: appData.data.FROM,
    USER: appData.data.USER,
    PASS: crypto.CryptoJS.AES.encrypt(appData.data.PASS, HASH).toString(),
    HOST: appData.data.HOST,
    SUBJECT: appData.data.SUBJECT,
    HTML: appData.data.HTML,
    TEXT: appData.data.TEXT,
    TO: appData.data.TO,
    CSVA: appData.data.CSVA,
    VARS: appData.data.VARS,
    DELAY: appData.data.DELAY
  };

  return roll;
}

function verify(data) {
  const required = ['FROM', 'USER', 'PASS', 'HOST', 'SUBJECT', 'HTML', 'TEXT', 'TO', 'CSVA', 'VARS', 'DELAY'];
  let valid = true;
  required.forEach(key => {
    if (!data.hasOwnProperty(key)) {
      valid = false;
    }
  });
  Object.keys(data).forEach(key => {
    if (!required.includes(key)) {
      valid = false;
    }
  });
  return valid;
}

function unRoll(data) {
  if (!verify(data)) {
    throw 'bad file';
  }
  const HASH = settings.getHash().toString();
  appData.data.FROM = data.FROM;
  appData.data.USER = data.USER;
  appData.data.PASS = (data.PASS ? crypto.CryptoJS.AES.decrypt(data.PASS, HASH).toString(crypto.CryptoJS.enc.Utf8) : '');
  appData.data.HOST = data.HOST;
  appData.data.SUBJECT = data.SUBJECT;
  appData.data.HTML = data.HTML;
  appData.data.TEXT = data.TEXT;
  appData.data.TO = data.TO;
  appData.data.CSVA = data.CSVA;
  appData.data.VARS = data.VARS;
  appData.data.DELAY = data.DELAY;
}

async function open(path) {
  // let [ok, contents] = GLib.file_get_contents(path);
  let res = {};
  try {
    const contents = await Import(path);
    res = JSON.parse(contents);
  } catch (error) {

    throw error;
  } 
  
  return res;
}

