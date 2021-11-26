const Secret = imports.gi.Secret;
const Data = imports.object.Data;
const appData = new Data.Data().data;

/* eslint-disable no-unused-vars */

/* This schema is usually defined once globally */
// eslint-disable-next-line new-cap
const mySchema = Secret.Schema.new(appData.ID,
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

/*
* The attributes used to later lookup the password. These
* attributes should conform to the schema.
*/
const attributes = {
  'type': 'emailing',
  'file': appData.FILEID,
};


function passwordSet(password) {
  Secret.password_store(
      mySchema,
      attributes,
      Secret.COLLECTION_DEFAULT,
      'password',
      password,
      null,
      onPasswordStored,
  );
}

function passwordGet() {
  const password = Secret.password_lookup_sync(
      mySchema,
      { 'type': 'emailing', 'file': appData.FILEID },
      null,
  );
  log(password);
  appData.PASS = password;
}

