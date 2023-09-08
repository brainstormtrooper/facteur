const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;
const GObject = imports.gi.GObject;
const strings = imports.fixtures.strings;
const Data = imports.object.Data;
const appData = new Data.Data();


function tests(path, Facteur) {

 

  const APP = new Facteur();
  appData.set('ID', 'io.github.brainstormtrooper.facteur');
  imports.package.init({
    name: 'io.github.brainstormtrooper.facteur',
    version: '0.3.0',
    prefix: `${path}/fixtures`,
    libdir: 'lib',
  });
  appData.connections = strings.connsStr;
  const Settings = imports.object.Settings;
  const mySettings = new Settings.Settings();

  mySettings.getConnections = () => {
    return appData.connections;
  }

  mySettings.setConnections = (cnsstr) => {
    appData.connections = cnsstr;
  }


  describe('Storing conections', () => {
    let res = mySettings.getConnection('abc123');
    it('Should contain correct connection.', () => {
      
      expect(res.ID).toBe('abc123');
    });

    res.USER = 'user';
    mySettings.updateConnection(res);

    it('Should update a connection.', () => {
      expect(mySettings.getConnection('abc123').USER).toBe('user');
    });
  });

}