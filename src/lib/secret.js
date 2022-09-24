const Secret = imports.gi.Secret;
const Data = imports.object.Data;
const appData = new Data.Data();

/* eslint-disable no-unused-vars */

/* This schema is usually defined once globally */
// eslint-disable-next-line new-cap
const mySchema = Secret.Schema.new(appData.get('ID'),
    Secret.SchemaFlags.NONE,
    {
      'type': Secret.SchemaAttributeType.STRING,
      'file': Secret.SchemaAttributeType.STRING,
    },
);

function onPasswordStored(source, result) {
  if (Secret.password_store_finish(result)) {
    log('stored password');
  } else {
    log('failed to store password');
  }
}

function passwordSet(password) {
  Secret.password_store(
      mySchema,
      {
        'type': 'emailing',
        'file': appData.get('FILEID'),
      },
      Secret.COLLECTION_DEFAULT,
      'Facteur password',
      password,
      null,
      onPasswordStored,
  );
}

function passwordGet() {
  const password = Secret.password_lookup_sync(
      mySchema,
      { 'type': 'emailing', 'file': appData.get('FILEID') },
      null,
  );
  appData.set('PASS', password);
}

