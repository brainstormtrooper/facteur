const Gtk = imports.gi.Gtk;
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Soup = imports.gi.Soup;
const secret = imports.lib.secret;
const base64 = imports.lib.base64;
const Data = imports.object.Data;

const appData = new Data.Data();

/* eslint-disable no-unused-vars */

function decompress(data) {
  const td = new TextDecoder('utf-8');
  let decompressed = Gio.MemoryOutputStream.new_resizable();
  let output = new Gio.ConverterOutputStream({
    base_stream: decompressed,
    converter: new Gio.ZlibDecompressor({
      format: Gio.ZlibCompressorFormat.GZIP,
    }), 
  });
  try {
    output.splice(Gio.MemoryInputStream.new_from_bytes(data),
                  Gio.OutputStreamSpliceFlags.CLOSE_SOURCE,
                  null);
    output.flush(null);
    output.close(null);
  } catch (error) {
    throw error;
  }
  
  return td.decode(decompressed.steal_as_bytes().get_data());

}

function compress(data) {
  const te = new TextEncoder('utf-8');
  let compressed = Gio.MemoryOutputStream.new_resizable();
  let output = new Gio.ConverterOutputStream({
    base_stream: compressed,
    converter: new Gio.ZlibCompressor({
      format: Gio.ZlibCompressorFormat.GZIP,
    }), 
  });
  output.splice(Gio.MemoryInputStream.new_from_bytes(te.encode(data)),
                  Gio.OutputStreamSpliceFlags.CLOSE_SOURCE,
                  null);
  output.flush(null);
  output.close(null);

  
  return compressed.steal_as_bytes().get_data();
}

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
      dest.replace_contents(data, null, false,
        Gio.FileCreateFlags.REPLACE_DESTINATION, null);
      ret(dest.get_parse_name());
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

function fopen (path, decode = true) {
  return new Promise((resolve, reject) => {
    const file = Gio.File.new_for_path(path);
    // asynchronous file loading...
    file.load_contents_async(null, (file, res) => {
      try {
        // read the file into a variable...
        const contents = file.load_contents_finish(res)[1];
        let dataString = contents;
        if (decode) {
          const decoder = new TextDecoder('utf-8');
          dataString = decoder.decode(contents);
        }
        
        resolve(dataString);
      } catch (e) {
        logError(e, 'File error');
        reject(e);
      }
    });
  });
}

function save (path, data) {
  const dataStr = data;
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
    FROM: appData.get('FROM'),
    NAME: appData.get('NAME'),
    REPLY: appData.get('REPLY'),
    CC: appData.get('CC'),
    BCC: appData.get('BCC'),
    HTML: appData.get('HTML'),
    TEXT: appData.get('TEXT'),
    TO: appData.get('TO'),
    CSVA: appData.get('CSVA'),
    VARS: appData.get('VARS'),
    ATTS: appData.get('ATTACHMENTS'),
    LINKS: appData.get('LINKS'),
    // DELAY: appData.get('DELAY'),
    FILEID: appData.get('FILEID'),
    SENT: appData.get('SENT'),
  };
  
  return JSON.stringify(roll, null, '\t');
}

function verify (data) {
  const required = [
    'CONN', 'SUBJECT',
    'FILEID', 'HTML', 'TEXT', 'TO', 'CSVA', 'VARS',
  ];
  let valid = true;

  required.forEach((key) => {
    // eslint-disable-next-line no-prototype-builtins
    if (!data.hasOwnProperty(key)) {
      valid = false;
    }
  });

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

  appData.set('FROM', (data.FROM ? data.FROM : ''));
  appData.set('NAME', (data.NAME ? data.NAME : ''));
  appData.set('REPLY', (data.REPLY ? data.REPLY : ''));
  appData.set('CC', (data.CC ? data.CC : ''));
  appData.set('BCC', (data.BCC ? data.BCC : ''));

  appData.set('SENT', data.SENT);
  if (data.ATTS) {
    appData.set('ATTACHMENTS', data.ATTS);
  }
  if (data.LINKS) {
    appData.set('LINKS', data.LINKS);
  }
}

async function open (path) {
  const contents = await fopen(path);
  
  return JSON.parse(contents);
}

function nameFromPath (path) {
  const n = path.split('/').pop();
  return n;
}

function csvFromArray (rows = []) {
  let work = [];
  rows.forEach((row) => {
    work.push(row.map((cell) => `"${cell.replace('"', '\"')}"`).join(','));
  });
  const res = work.join('\n');
  return res;
}


function getOpen (url, decode = false) {
  return new Promise((resolve, reject) => {
    const session = new Soup.Session();
    const msg = Soup.Message.new('GET', url);
    const bytes = session.send_and_read(msg, null);

    const code = msg.status_code;
    if (code >= 400) {
      reject(msg.reason_phrase);
    }

    if (decode) {
      const decoder = new TextDecoder('utf-8');
      resolve(decoder.decode(bytes.get_data()));
    }
    resolve(bytes.get_data());
    
  });
}

function isremote (link) {
  return link.split('/').shift().includes('http');
}

/**
 * Checks if a remote resource exists and does not return an error code
 * Error codes are anything starting with 400 and over.
 * 
 * @param {String} url
 * @returns {Boolean}
 */
function remoteExists(url){
  const session = new Soup.Session();
  let res = false;
  try {
    const msg = Soup.Message.new('HEAD', url);
    session.send(msg, null);
    res = msg.status_code < 400;
  } catch (error) {
    res = false;
  }

  return res;
}


/**
 * Checks if local type path can lead to a file.
 * Several possible scenarios are checked
 * Returns an array [exists(bool), full path(string or undefined)]
 * 
 * @param {String} path 
 * @param {String} root 
 * @returns {Array}
 */
function localExists (path, root = null) {
  let tmpfile;
  let fullpath;
  let exists = false;
  const isfullpath = path.startsWith('/');
  const filename = nameFromPath(path);
  if (!isfullpath) {
    if (root) {
      tmpfile = Gio.File.new_for_path(`${root}/${path}`);
      exists = tmpfile.query_exists(null);
    } 
    if (root && !exists) {
      tmpfile = Gio.File.new_for_path(`${root}/${filename}`);
      exists = tmpfile.query_exists(null);
    }
    if (!root && !exists) {
      tmpfile = Gio.File.new_for_path(`~/${path}`);
      exists = tmpfile.query_exists(null);
    }
  } else {
    if (root) {
      tmpfile = Gio.File.new_for_path(`${root}/${filename}`);
      exists = tmpfile.query_exists(null);
    } 
    if (!exists) {
      tmpfile = Gio.File.new_for_path(path);
      exists = tmpfile.query_exists(null);
    }
  }

  if (exists) {
    fullpath = tmpfile.get_path();
  }
  return [exists, fullpath];
}
