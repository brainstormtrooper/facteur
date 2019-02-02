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
        print('Error loading  data file : ' + e);
        reject(e);
      }
    });
  });

  file.query_info_async('standard::type,standard::size',
    Gio.FileQueryInfoFlags.NONE, GLib.PRIORITY_LOW, null,
    Lang.bind(this, function(source, async) {

      let info, type, size, text;

      info = source.query_info_finish(async);
      type = info.get_file_type();
      size = info.get_size();

      text = 'File info type: ' + type + ', size: ' + size;
      // this.fileData = text;
    }));
}

const save = function(path, data) {
  GLib.file_set_contents(path, data);
}

const rollUp = function() {
  return { FROM, USER, HOST, SUBJECT, HTML, TEXT, TO };
}


