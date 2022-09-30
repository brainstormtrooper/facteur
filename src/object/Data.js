const uuid = imports.lib.uuid;
const Gio = imports.gi.Gio;

var Data = class Data { // eslint-disable-line

  constructor () {
    if (Data._instance) {
      return Data._instance;
    }
    Data._instance = this;

    this._data = {
      CONN: '',

      SUBJECT: '',
      HTML: '',
      TEXT: '',

      TO: [],
      CSVA: [],
      VARS: [],
      MAILINGS: [],

      FILEID: uuid.uuid(),
      FILENAME: 'untitled',
      APP: 'com.github.brainstormtrooper.facteur',
      ID: '',
      SENT: '',
    };
  }

  set (key, value) {
    if (this._data[key] != value && Gio.Application.get_default()) {
      Gio.Application.get_default().emit('dataChanged', true);
    }
    this._data[key] = value;
  }

  get (key) {
    return this._data[key];
  }

  push (arrayKey, value) {
    this._data[arrayKey].push(value);
  }
};
