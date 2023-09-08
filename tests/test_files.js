const myFile = imports.lib.file;

const strings = imports.fixtures.strings;
const appData = new imports.object.Data.Data();

/* eslint-disable no-unused-vars */

function testUnrollFile(path) {
  appData.ID = 'io.github.brainstormtrooper.facteur';
  imports.package.init({
    name: 'io.github.brainstormtrooper.facteur',
    version: '0.3.0',
    prefix: `${path}/fixtures`,
    libdir: 'lib',
  });

  // const data = JSON.parse(strings.fileWithConn);
  const legacydata = JSON.parse(strings.fileStr);
  // const HASH = settings.getHash().toString();
  myFile.unRoll(strings.fileWithConn);

  describe('Open a file', () => {
    it('Should have correct subject.', () => {
      expect(appData.get('SUBJECT')).toBe('Test Mailing');
    });

    it('Should create a CSV array.', () => {
      expect(typeof appData.get('CSVA')).toBe('object');
    });

    it('Should have correct first element.', () => {
      expect(appData.get('CSVA')[0][0]).toBe('recipient1@email.com');
    });

  });

}
