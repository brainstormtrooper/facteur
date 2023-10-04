const JsUnit = imports.jsUnit;
const myList = new imports.object.List.List();
const Data = imports.object.Data;
const appData = new Data.Data();
const strings = imports.fixtures.strings;

/* eslint-disable no-unused-vars */
function testConvert() {
  const res = myList.csvToArray(strings.testCsv2);

  describe('Convert CSV to array', () => {
    it('Should create arrays.', () => {
      expect(typeof res).toBe('object');
    });

    it('Should have correct length.', () => {
      expect(res.length).toBe(4);
    });

    myList.csva = res;
    myList.dataHeadings();

    it('Should have correct column count.', () => {
      expect(myList.colcount).toBe(3);
    });
  });



  describe('Import CSV data', () => {
    
    it('read CSV data.', () => {
      myList.import(strings.testCsv); 
      expect(typeof appData.get('CSVA')).toBe('object');
    });

    it('Should have correct length.', () => {
      expect(appData.get('CSVA').length).toBe(3);
    });

    it('Should have correct column count.', () => {
      expect(myList.colcount).toBe(3);
    });
  });

}
