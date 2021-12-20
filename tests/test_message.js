const JsUnit = imports.jsUnit;
const myMessage = new imports.object.Message.Message();
const strings = imports.fixtures.strings;

const myData = new imports.object.Data.Data().data;


/* eslint-disable no-unused-vars */

function testMessage() {
  myMessage.boundary = 'BOUNDARY';
  myMessage.send = (msgObj, to, cancellable = null) => {
    return new Promise((resolve, reject) => {
      resolve('250 OK');
    });
  };
  myData.SUBJECT = 'test';

  const res = myMessage.build(strings.msgTxt, strings.msgHtml);
  JsUnit.assertEquals('type is object', 'object', typeof res);
  // eslint-disable-next-line max-len
  JsUnit.assertEquals('has correct subject block', strings.subBlock, res.subBlock);
  // eslint-disable-next-line max-len
  JsUnit.assertEquals('has correct content block', strings.msgBlock, res.msgBlock);
}
