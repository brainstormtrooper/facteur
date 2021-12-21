const uuid = imports.lib.uuid;

var Data = class Data { // eslint-disable-line

  constructor() {
    if (Data._instance) {
      return Data._instance;
    }
    Data._instance = this;

    this._data = {
      FROM: '',
      USER: '',
      PASS: '',
      HOST: '',

      SUBJECT: '',
      HTML: '',
      TEXT: '',
      DELAY: '',

      TO: [],
      CSVA: [],
      VARS: [],
      MAILINGS: [],

      FILEID: uuid.uuid(),
      FILENAME: 'untitled',
      ID: '',
      SENT: '',
    };
  }

  set(key, value) {
    if (this._data[key] != value) {
      // changed
    }
    this._data[key] = value;
  }

  get(key) {
    return this._data[key];
  }

  push(arrayKey, value) {
    this._data[arrayKey].push(value);
  }
};
