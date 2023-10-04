const Gio = imports.gi.Gio;
const myList = new imports.object.List.List();
const strings = imports.fixtures.strings;

const myTemplate = new imports.object.Template.Template();
const myData = new imports.object.Data.Data();


/* eslint-disable no-unused-vars */

/**
 * Here we mock the behavior of the import()
 * function in List.js
 */
function testContent(path) {
  myData.set('HTML', strings.templateHtml);
  myData.set('TEXT', strings.templateTxt);
  const res = myList.csvToArray(strings.testCsv2);

  describe('Parse recipients and variables', () => {
    it('Should generate an array object.', () => {
      expect(typeof res).toBe('object');
    });
  });
  
  
  myList.csva = res;
  myData.set('CSVA', res);
  myList.dataHeadings();
  myList.trimData();

  describe('Store variables', () => {
    it('Should have 3 variables.', () => {
      expect(myData.get('VARS').length).toBe(3);
    });
  });


  const fpath = `${path}/fixtures/test_add_file.pdf`;

  const file = Gio.File.new_for_path(fpath);

  myTemplate.addAttachment(file);
  myTemplate.addLink(fpath);

  

  describe('attach files', () => {
    
    it('Should have attachments.', () => {
      expect(myData.get('ATTACHMENTS').length).toBe(2);
    });

    it('Should have a link.', () => {
      expect(myData.get('LINKS').length).toBe(1);
    });


  });

  myData.set('TO', myData.get('CSVA').map((x) => x[0]));
  const p = myTemplate.compile();
  p.then((res) => {

    describe('Compile mailings', () => {
      it('Should have 3 mailings.', () => {
        expect(res).toBe(3);
      });
    
      it('Should have correct recipient.', () => {
        expect(myData.get('MAILINGS')[0]['to']).toBe('recipient1@email.com');
      });
      
      it('Should have correct html.', () => {
        expect(myData.get('MAILINGS')[0]['html']).toBe('<h2>Bob,</h2><p>red cars</p>');
      });

      it('Should have correct text.', () => {
        expect(myData.get('MAILINGS')[0]['text']).toBe('Bob, red cars');
      });

    });

  });
}
