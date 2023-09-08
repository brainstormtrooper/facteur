const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;
const GObject = imports.gi.GObject;

function getCurrentFile() {
  const stack = (new Error()).stack;

  const stackLine = stack.split('\n')[1];
  if (!stackLine) {
    throw new Error('Could not find current file');
  }

  const match = new RegExp('@(.+):\\d+').exec(stackLine);
  if (!match) {
    throw new Error('Could not find current file');
  }

  const path = match[1];
  const file = Gio.File.new_for_path(path);

  return [file.get_path(), file.get_parent().get_path(), file.get_basename()];
}

const fileInfo = getCurrentFile();
const SRC_PATH = fileInfo[1] + '/../src';
imports.searchPath.unshift(SRC_PATH);
imports.searchPath.unshift(fileInfo[1]);

const {
  environment,
  retval,
  errorsOutput,
  mainloop,
  mainloopLock,
} = imports.minijasmine;

const testRecipients = imports.test_recipients;
const testContents = imports.test_contents;
const testMessages = imports.test_message;
const testFiles = imports.test_files;

const testConnections = imports.test_connections;


const Facteur = GObject.registerClass( // eslint-disable-line
{
  GTypeName: 'Facteur',
  Signals: {
    'Logger': {
      param_types: [GObject.TYPE_STRING],
    },
    'update_ui': {
      param_types: [GObject.TYPE_BOOLEAN],
    },
    'filename_changed': {
      param_types: [GObject.TYPE_BOOLEAN],
    },
    'Sent': {
      param_types: [GObject.TYPE_BOOLEAN],
    },
    'dataChanged': {
      param_types: [GObject.TYPE_BOOLEAN],
    },
  },
},
class Facteur extends Gtk.Application {
  _init() {
    this.ID = 'io.github.brainstormtrooper.facteur';
    super._init({
      application_id: this.ID,
      flags: Gio.ApplicationFlags.HANDLES_OPEN,
    });
    GLib.set_prgname(this.application_id);
    GLib.set_application_name('Facteur');
  }
});


testRecipients.testConvert();
testContents.testContent();
testConnections.tests(fileInfo[1], Facteur);
testMessages.testMessage(fileInfo[1], Facteur);
testFiles.testUnrollFile(fileInfo[1]);

GLib.idle_add(GLib.PRIORITY_DEFAULT, function () {
  try {
    log('executing env');
      environment.execute();
  } catch (e) {
      print('Bail out! Exception occurred inside Jasmine:', e);

      mainloop.quit();

      system.exit(1);
  }

  return GLib.SOURCE_REMOVE;  
});

mainloop.runAsync();


if (retval !== 0) {
  printerr(errorsOutput.join('\n'));
  print('# Test script failed; see test log for assertions');
  system.exit(retval);
}
