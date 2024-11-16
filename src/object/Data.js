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
      FROM: '',
      NAME: '',
      REPLY: '',
      CC: '',
      BCC: '',
      HTML: '',
      TEXT: '',

      TO: [],
      CSVA: [],
      VARS: [],
      MAILINGS: [],
      ATTACHMENTS: [],
      LINKS: [],

      FILEID: uuid.uuid(),
      FILENAME: 'untitled',
      APP: 'io.github.brainstormtrooper.facteur',
      ID: '',
      SENT: '',
    };
  }

  set (key, value) {
    let changed = false;
    if (this._data[key] != value && Gio.Application.get_default()) {
      changed = true
    }
    this._data[key] = value;
    if (changed) {
      Gio.Application.get_default().emit('dataChanged', true);
    }
  }

  get (key) {
    return this._data[key];
  }

  push (arrayKey, value) {
    this._data[arrayKey].push(value);
  }

  addLink (path) {
    this._data.LINKS.push(path);
  }

  deleteLink (path) {
    this._data.LINKS = this._data.LINKS.filter( el => el !== path );
  }

  addAttachment (obj) {
    this._data.ATTACHMENTS.push(obj);
  }
  deleteAttachment (aid) {
    this._data.ATTACHMENTS = this._data.ATTACHMENTS.filter( el => el.id !== aid );
  }
  setInlineAttachment (aid, isInline) {
    // log(this._data.ATTACHMENTS);
    
    for (let i in this._data.ATTACHMENTS) {
      
      if (this._data.ATTACHMENTS[i].id == aid) {
        log(`setting active to ${isInline} for ${aid}`);
        this._data.ATTACHMENTS[i].inline = isInline;
        break;
      }
    }
    return aid;
  }

  doAttachmentId(fileName) {
    const rid = Math.random().toString(36).slice(2, 7);
    return `${fileName.replace(/\s/g, '_')}@${rid}`;
  }
};
