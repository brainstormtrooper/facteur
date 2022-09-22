const JsUnit = imports.jsUnit;
const myMessage = new imports.object.Message.Message();
const strings = imports.fixtures.strings;

const myData = new imports.object.Data.Data();
const myList = new imports.object.List.List();

/* eslint-disable no-unused-vars */

function testMessage(path) {
  myData.set('ID', 'com.github.brainstormtrooper.facteur');
  imports.package.init({
    name: 'com.github.brainstormtrooper.facteur',
    version: '0.3.0',
    prefix: `${path}/fixtures`,
    libdir: 'lib',
  });
  myMessage.App = { emit: ()=> {
    return true;
  } };
  myMessage.boundary = 'BOUNDARY';
  myMessage.send = async (msgObj, to, cancellable = null) => {
    return new Promise((resolve, reject) => {
      resolve('250 OK');
    });
  };
  myData.set('SUBJECT', 'test');

  const res = myMessage.build(strings.msgTxt, strings.msgHtml);
  JsUnit.assertEquals('type is object', 'object', typeof res);
  // eslint-disable-next-line max-len
  JsUnit.assertEquals('has correct subject block', strings.subBlock, res.subBlock);
  // eslint-disable-next-line max-len
  JsUnit.assertEquals('has correct content block', strings.msgBlock, res.msgBlock);
  //
  // CSV to Send
  //
  myList.csva = myList.csvToArray(strings.testCsv2);
  myList.dataHeadings();
  myList.trimData();
  myData.set('CSVA', myList.csva);
  myData.set('TO', myList.csva.map((x) => x[0]));
  myMessage.sendAll();
  JsUnit.assertNotEquals('send time has been set', '', myData.get('SENT'));

}
