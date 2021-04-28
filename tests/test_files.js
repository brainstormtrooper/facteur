const JsUnit = imports.jsUnit;

const myFile = imports.lib.file;

const settings = imports.lib.settings;
const crypto = imports.lib.aes;
const strings = imports.fixtures.strings;
const appData = new imports.object.Data.Data().data;

/* eslint-disable no-unused-vars */

function testUnrollFile(path) {
  appData.ID = 'com.github.brainstormtrooper.gnome-emailer';
  imports.package.init({
    name: 'com.github.brainstormtrooper.gnome-emailer',
    version: '0.3.0',
    prefix: `${path}/fixtures`,
    libdir: 'lib',
  });

  const data = JSON.parse(strings.fileStr);
  const HASH = settings.getHash().toString();
  myFile.unRoll(data);
  JsUnit.assertEquals('SUBJECT is test', 'test', appData.SUBJECT);
  // eslint-disable-next-line max-len
  JsUnit.assertEquals('FROM is sender@email.com', 'sender@email.com', appData.FROM);
  JsUnit.assertEquals('CSVA is object', 'object', typeof appData.CSVA);
  JsUnit.assertEquals('password is password', strings.password, appData.PASS);
  JsUnit.assertEquals('hash is gnome-emailer', strings.hash, HASH);

  const pwhash = crypto.CryptoJS.AES.encrypt(strings.password, HASH).toString();
  // eslint-disable-next-line max-len
  const repass = crypto.CryptoJS.AES.decrypt(pwhash, HASH).toString(crypto.CryptoJS.enc.Utf8);

  JsUnit.assertEquals('password is password again', strings.password, repass);
  // eslint-disable-next-line max-len
  JsUnit.assertEquals('correct first element', 'recipient1@email.com', appData.CSVA[0][0]);
  // eslint-disable-next-line max-len
  const roll = JSON.stringify(myFile.rollUp(), null, '\t').replace(/"PASS": "(.+)"/gm, '');
  const litmus = strings.fileStr.replace(/"PASS": "(.+)"/gm, '');
  // eslint-disable-next-line max-len
  JsUnit.assertEquals('file rolled up', litmus, roll);
}
