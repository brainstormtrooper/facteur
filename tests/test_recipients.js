const JsUnit = imports.jsUnit;
const myList = new imports.object.List.List();
const strings = imports.fixtures.strings;

/* eslint-disable no-unused-vars */
function testConvert() {
  const res = myList.csvToArray(strings.testCsv2);

  JsUnit.assertEquals('type is object', 'object', typeof res);
  JsUnit.assertEquals('Length is 4', 4, res.length);

  myList.csva = res;
  myList.dataHeadings();

  JsUnit.assertEquals('Col count is 3', 3, myList.colcount);
}
