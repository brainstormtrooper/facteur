const strings = imports.fixtures.strings;
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;
const GObject = imports.gi.GObject;

// const Settings = imports.object.Settings;
const myData = new imports.object.Data.Data();
const myList = new imports.object.List.List();
// const Config = new Settings.Settings();



/* eslint-disable no-unused-vars */

function testMessage(path, Facteur) {
  const APP = new Facteur();
  myData.set('ID', 'io.github.brainstormtrooper.facteur');
  imports.package.init({
    name: 'io.github.brainstormtrooper.facteur',
    version: '0.3.0',
    prefix: `${path}/fixtures`,
    libdir: 'lib',
  });





  const hold = imports.object.Settings;
  imports.object.Settings = {
    Settings: class Settings { // eslint-disable-line

      getConnection(id) {
        return JSON.parse(strings.connStr);
      }
    }
  };

  const myMessage = new imports.object.Message.Message();

  imports.object.Settings = hold;

  // myMessage.App = Gio.Application.get_default();

  myMessage.boundary = 'BOUNDARY';
  myMessage.send = async (msgObj, to, cancellable = null) => {
    return new Promise((resolve, reject) => {
      resolve('250 OK');
    });
  };



  myData.set('SUBJECT', 'test');

  const res = myMessage.build(strings.msgTxt, strings.msgHtml);

  describe('Message generation', () => {
    it('Should generate a string payload.', () => {
      expect(typeof res).toBe('string');
    });
  });

  // eslint-disable-next-line max-len
  // JsUnit.assertEquals('has correct subject block', strings.subBlock, res.subBlock);
  // eslint-disable-next-line max-len
  // JsUnit.assertEquals('has correct content block', strings.msgBlock, res.msgBlock);
  //
  // CSV to Send
  //
  myList.csva = myList.csvToArray(strings.testCsv2);
  myList.dataHeadings();
  myList.trimData();
  myData.set('CSVA', myList.csva);
  myData.set('TO', myList.csva.map((x) => x[0]));
  myMessage.sendAll();
  describe('Message sending', () => {
    it('Should set sending time.', () => {
      expect(typeof myData.get('SENT')).toBeTruthy();
    });
  });




}
