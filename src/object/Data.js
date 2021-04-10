
var Data = class Data {
  Name = 'objectData';
  
  data = {
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
    ID: ''
  };

  constructor() {
    if (Data._instance) {
      return Data._instance
    }
    Data._instance = this;

  };

};