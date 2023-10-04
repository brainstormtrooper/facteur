const Gio = imports.gi.Gio;
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

  const fpath = `${path}/fixtures/unit_test_file`;

  const file = Gio.File.new_for_path(fpath);
  const [, contents] = file.load_contents(null);
  // const HASH = settings.getHash().toString();
  // myFile.unRoll(strings.fileWithConn);

  describe('Open and save a file', () => {
    
    
    
    it('Should have correct subject.', () => {
      myFile.unRoll(myFile.decompress(contents));
      expect(appData.get('SUBJECT')).toBe('subject');
    });

    it('Should create a CSV array.', () => {
      expect(typeof appData.get('CSVA')).toBe('object');
    });

    it('Should have correct first element.', () => {
      expect(appData.get('CSVA')[0][0]).toBe('bob@nowhere.ext');
    });

    it('Should have correct file contents.', () => {
      const data = myFile.compress(myFile.rollUp());
      expect(data).toEqual(contents);
    });
  });
  
  
}
