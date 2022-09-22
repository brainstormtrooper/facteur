const Gio = imports.gi.Gio;
const Data = imports.object.Data;
const appData = new Data.Data();

/* eslint-disable no-unused-vars */

function getSettings(schemaId, path) {
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

function getIpv4() {
  const config = getSettings(appData.get('ID'));

  return config.get_boolean('force-ipv4');
}

function setIpv4(val) {
  const config = getSettings(appData.get('ID'));

  config.set_boolean('force-ipv4', val);
}

function setDelay(delay) {
  const config = getSettings(appData.get('ID'));
  config.set_int('delay', delay);
}

function getDelay() {
  const config = getSettings(appData.get('ID'));

  return config.get_int('delay');
}
