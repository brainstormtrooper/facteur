const Config = imports.lib.settings;
const uuid = imports.lib.uuid;
const secret = imports.lib.secret;

var Settings = class Settings { // eslint-disable-line

  getConnections () {
    const cns = Config.getString('connections');
    
    return cns;
  }

  getConnection (id) {
    const cns = JSON.parse(this.getConnections());
    
    return cns.find((c) => c.ID === id);
  }

  setConnections (cnsstr) {
    Config.setString('connections', cnsstr);
  }

  deleteConnection(id) {
    let cns = JSON.parse(this.getConnections());
    cns = cns.filter( el => el.ID !== id );
    this.setConnections(JSON.stringify(cns));
  }

  updateConnection(cobj) {
    let cns = JSON.parse(this.getConnections());
    // cconn = cns.find((c) => c.ID === cobj.ID);
    cns = cns.filter(el => el.ID !== cobj.ID);
    cns.push(cobj);
    this.setConnections(JSON.stringify(cns));
  }

  addConnection (cobj) {
    const cns = JSON.parse(this.getConnections());
    cns.push(cobj);
    const cnsstr = JSON.stringify(cns);
    this.setConnections(cnsstr);
  }

  saveConnection (obj, id) {

    const ID = (id ? id : uuid.uuid());

    let IPv4 = 0;
    if (obj.ipv4Field.get_active()) {
      IPv4 = 1;
    }

    const connection = {
        ID,
        NAME: obj.nameField.get_text(),
        FROM: obj.fromField.get_text(),
        USER: obj.userField.get_text(),
        HOST: obj.smtpField.get_text(),
        DELAY: obj.delayField.get_text(),
        IPv4,
        HEADERS: obj.headersField.get_text()
    }

    if (obj.passField.get_text() != '') {
      secret.connPasswordSet(ID, obj.passField.get_text());
    }

    if (id) {
      this.updateConnection(connection);
    } else {
      this.addConnection(connection);
    }
    

    return ID;
  }

  getIpv4 () {
    return Config.getBoolean('force-ipv4');
  }
  
  setIpv4 (val) {
    Config.setBoolean('force-ipv4', val);
  }
  
  setDelay (delay) {
    Config.setInt('delay', delay);
  }
  
  getDelay () {
    return Config.getInt('delay');
  }
}