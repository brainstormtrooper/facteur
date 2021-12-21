const JsUnit = imports.jsUnit;
const myList = new imports.object.List.List();
const strings = imports.fixtures.strings;

const myTemplate = new imports.object.Template.Template();
const myData = new imports.object.Data.Data();


/* eslint-disable no-unused-vars */

/**
 * Here we mock the behavior of the import()
 * function in List.js
 */
function testContent() {
  myData.set('HTML', strings.templateHtml);
  myData.set('TEXT', strings.templateTxt);
  const res = myList.csvToArray(strings.testCsv2);
  JsUnit.assertEquals('type is object', 'object', typeof res);
  myList.csva = res;
  myData.set('CSVA', res);
  myList.dataHeadings();
  myList.trimData();
  JsUnit.assertEquals('col count is 3', 3, myData.get('VARS').length);
  myData.set('TO', myData.get('CSVA').map((x) => x[0]));
  const p = myTemplate.compile();
  p.then((res) => {
    JsUnit.assertEquals('mailings count is 3', 3, res);
    JsUnit.assertEquals(
        'has correct recipient',
        'recipient1@email.com',
        myData.get('MAILINGS')[0]['to'],
    );
    JsUnit.assertEquals(
        'has correct html',
        '<h2>Bob,</h2><p>red cars</p>',
        myData.get('MAILINGS')[0]['html'],
    );
    JsUnit.assertEquals(
        'has correct text',
        'Bob, red cars',
        myData.get('MAILINGS')[0]['text'],
    );
  });
}
