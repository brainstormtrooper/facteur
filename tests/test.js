const Gio = imports.gi.Gio;
// const JsUnit = imports.jsUnit;

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

const testRecipients = imports.test_recipients;
const testContents = imports.test_contents;
const testMessages = imports.test_message;
const testFiles = imports.test_files;

const testConnections = imports.test_connections;

testRecipients.testConvert();
testContents.testContent();
testMessages.testMessage(fileInfo[1]);
testFiles.testUnrollFile(fileInfo[1]);
