var crypto = imports.lib.aes;

const Import = function(path) {
  return new Promise((resolve, reject) => {
    let file = Gio.File.new_for_path(path);
    print('reading file from ' + path);
    // asynchronous file loading...
    file.load_contents_async(null, (file, res) => {

      try {
        // read the file into a variable...
        const contents = file.load_contents_finish(res)[1];

        const dataString = contents.toString();
        // print(dataString);
        resolve(dataString);

      } catch (e) {
        print('Error loading data file : ' + e);
        reject(e);
      }
    });
  });
}

const save = function(path, data) {
  let dataStr = JSON.stringify(data, null, '\t');
  GLib.file_set_contents(path, dataStr);
}

// https://stackoverflow.com/questions/18279141/javascript-string-encryption-and-decryption
// https://stackoverflow.com/questions/21291279/how-to-convert-to-string-and-back-again-with-cryptojs
// replace with : https://github.com/brix/crypto-js ?
const rollUp = function() {
  PASS = crypto.CryptoJS.AES.encrypt(PASS, HASH).toString();

  return { FROM, USER, PASS, HOST, SUBJECT, HTML, TEXT, TO, CSVA, VARS };
}

const unRoll = function(data) {
  try {
    const passwd = (data.PASS ? crypto.CryptoJS.AES.decrypt(data.PASS, HASH).toString(crypto.CryptoJS.enc.Utf8) : '');
    FROM = data.FROM;
    USER = data.USER;
    PASS = passwd;
    HOST = data.HOST;
    SUBJECT = data.SUBJECT;
    HTML = data.HTML;
    TEXT = data.TEXT;
    TO = data.TO;
    CSVA = data.CSVA;
    VARS = data.VARS;
  } catch (e) {
    print(e);
  }
}

const open = function(path) {
  let [ok, contents] = GLib.file_get_contents(path);
  if (ok) {
      let map = JSON.parse(contents);
      return map;
  } else {
    return {};
  }
}

