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

  deleteConnection (id) {
    let cns = JSON.parse(this.getConnections());
    cns = cns.filter( el => el.ID !== id );
    this.setConnections(JSON.stringify(cns));
    secret.connPasswordDelete(id);
  }

  updateConnection (cobj) {
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

  saveConnection (conn, update = false) {

    

    if (conn.PASS != '') {
      secret.connPasswordSet(conn.ID, conn.PASS);
    }

    if (update) {
      this.updateConnection(conn);
    } else {
      this.addConnection(conn);
    }
    

    return conn.ID;
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