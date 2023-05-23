const Gtk = imports.gi.Gtk;
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const secret = imports.lib.secret;
const base64 = imports.lib.base64;
const Data = imports.object.Data;

const appData = new Data.Data();

/* eslint-disable no-unused-vars */


function fileSave(props, ret) {
  // const parent = props.parent ? props.parent : null;
  const title = props.title ? props.title : 'Save a file';
  const data = props.data;
  const filename = props.filename;
  const foldername = props.foldername;


  const saver = new Gtk.FileDialog({ title });

  if (filename) {
    saver.set_initial_name(filename);
  }
  if (foldername) {
    saver.set_initial_folder(Gio.File.new_for_path(foldername));
  }
  saver.save(null, null, async (o, r) => {
  
    try {
      const dest = await o.save_finish(r);
      dest.replace_contents(JSON.stringify(data, null, '\t'), null, false,
        Gio.FileCreateFlags.REPLACE_DESTINATION, null);
      ret(dest.get_basename());
    } catch (e) {
      log(e)
      throw e;
    }

  });

}

function fileOpen(props, ret) {
  
  // const parent = props.parent ? props.parent : null;
  const title = props.title ? props.title : 'Select a file';
  const foldername = props.foldername ? props.foldername : '/home';
  const decoder = new TextDecoder('utf-8');
  const opener = new Gtk.FileDialog({ title });
  opener.set_initial_folder(Gio.File.new_for_path(foldername));

  try {

    opener.open(null, null, (o, r) => {
      ret(o.open_finish(r));
    });
  } catch (error) {
    log(error);
    throw(error);
  }
}

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
  // secret.passwordSet(appData.get('PASS'));
  const roll = {
    // FROM: appData.get('FROM'),
    // USER: appData.get('USER'),
    // HOST: appData.get('HOST'),
    CONN: appData.get('CONN'),
    SUBJECT: appData.get('SUBJECT'),
    HTML: appData.get('HTML'),
    TEXT: appData.get('TEXT'),
    TO: appData.get('TO'),
    CSVA: appData.get('CSVA'),
    VARS: appData.get('VARS'),
    ATTS: appData.get('ATTACHMENTS'),
    // DELAY: appData.get('DELAY'),
    FILEID: appData.get('FILEID'),
    SENT: appData.get('SENT'),
  };

  return roll;
}

function verify (data) {
  const required = [
    'CONN', 'SUBJECT',
    'FILEID', 'HTML', 'TEXT', 'TO', 'CSVA', 'VARS',
  ];
  let valid = true;
/*
  const legacy = ['HOST', 'USER', 'FROM', 'SUBJECT',
  'FILEID', 'HTML', 'TEXT', 'TO', 'CSVA', 'VARS',];
*/
  

  required.forEach((key) => {
    // eslint-disable-next-line no-prototype-builtins
    if (!data.hasOwnProperty(key)) {
      valid = false;
    }
  });

  // fix legacy files
/*
  if(typeof data.CSVA == 'object') {

    data.CSVA = base64.encode64(JSON.stringify(data.CSVA));
  }
*/
  /*
  Object.keys(data).forEach((key) => {
    if (!required.includes(key)) {
      valid = false;
    }
  });
  */

  return valid;
}

function unRoll (str) {
  const data = JSON.parse(str);
  // console.log(JSON.parse(data));

  if (!verify(data)) {
    const bfe = new Error('Bad file');
    throw bfe;
  }



  appData.set('CONN', data.CONN);
  appData.set('SUBJECT', data.SUBJECT);
  appData.set('HTML', data.HTML);
  appData.set('TEXT', data.TEXT);
  appData.set('TO', data.TO);
  appData.set('CSVA', data.CSVA);
  appData.set('VARS', data.VARS);
  appData.set('FILEID', data.FILEID);
  appData.set('SENT', data.SENT);
  if (data.ATTS) {
    appData.set('ATTACHMENTS', data.ATTS);
  }
  
}

async function open (path) {
  const contents = await fopen(path);
  
  return JSON.parse(contents);
}

function nameFromPath (path) {
  return path.split('/')[-1];
}
