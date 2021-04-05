const Gio = imports.gi.Gio;
const System = imports.system;

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

  let schemaObj = schemaSource.lookup(schemaId, true);
  if (!schemaObj) {
    log('Missing GSettings schema ' + schemaId);
    System.exit(1);
  }


  if (path === undefined)

    return new Gio.Settings({ settings_schema: schemaObj });
  else

    return new Gio.Settings({
      settings_schema: schemaObj,
      path: path
    });

}

function getHash() {
  const config = getSettings(app.ID);

  return config.get_string('password-hash');
}

function setHash(hash) {
  const config = getSettings(app.ID);
  config.set_string('password-hash', hash);
}

function getIpv4() {
  const config = getSettings(app.ID);

  return config.get_boolean('force-ipv4');
}

function setIpv4(val) {
  const config = getSettings(app.ID);

  config.set_boolean('force-ipv4', val);
}

function setDelay(delay){
  const config = getSettings(app.ID);
  config.set_int('delay', delay);
}

function getDelay() {
  const config = getSettings(app.ID);

  return config.get_int('delay');
}