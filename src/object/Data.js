
var Data = class Data { // eslint-disable-line

  constructor() {
    if (Data._instance) {
      return Data._instance;
    }
    Data._instance = this;

    this.data = {
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

      FILENAME: 'untitled',
      ID: '',
    };
  }
};
