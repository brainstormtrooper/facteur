const Gio = imports.gi.Gio;
const Data = imports.object.Data;
const appData = new Data.Data();

const gConfig = getSettings(appData.get('APP'));

/* eslint-disable no-unused-vars */

function getSettings (schemaId, path) {
  const GioSSS = Gio.SettingsSchemaSource;
  let schemaSource;

  if (!pkg.moduledir.startsWith('resource://')) {
    // Running from the source tree
    log('running from source tree');
    schemaSource = GioSSS.new_from_directory(pkg.pkgdatadir,
        GioSSS.get_default(),
        false);
  } else {
    schemaSource = GioSSS.get_default();
  }

  const schemaObj = schemaSource.lookup(schemaId, true);
  if (!schemaObj) {
    const e = new Error('Missing GSettings schema ' + schemaId);
    logError(e);
  }

  const cnfblk = { settings_schema: schemaObj };
  if (path !== undefined) {
    cnfblk.path = path;
  }
  
return new Gio.Settings(cnfblk);
}

function getBoolean (key) {
  return gConfig.get_boolean(key);
}

function setBoolean (key, val) {
  gConfig.set_boolean(key, val);
}

function getInt (key) {
  return gConfig.get_int(key);
}

function setInt (key, val) {
  gConfig.set_int(key, val);
}

function getString (key) {
  return gConfig.get_string(key);
}

function setString (key, val) {
  gConfig.set_string(key, val);
}