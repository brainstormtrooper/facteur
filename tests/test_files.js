const JsUnit = imports.jsUnit;

const myFile = imports.lib.file;

const strings = imports.fixtures.strings;
const appData = new imports.object.Data.Data().data;

/* eslint-disable no-unused-vars */

function testUnrollFile(path) {
  appData.ID = 'com.github.brainstormtrooper.facteur';
  imports.package.init({
    name: 'com.github.brainstormtrooper.facteur',
    version: '0.3.0',
    prefix: `${path}/fixtures`,
    libdir: 'lib',
  });

  const data = JSON.parse(strings.fileStr);
  // const HASH = settings.getHash().toString();
  myFile.unRoll(data);
  JsUnit.assertEquals('SUBJECT is test', 'test', appData.SUBJECT);
  // eslint-disable-next-line max-len
  JsUnit.assertEquals('FROM is sender@email.com', 'sender@email.com', appData.FROM);
  JsUnit.assertEquals('CSVA is object', 'object', typeof appData.CSVA);

  // eslint-disable-next-line max-len
  JsUnit.assertEquals('correct first element', 'recipient1@email.com', appData.CSVA[0][0]);
}
