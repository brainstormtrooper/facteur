/**
Html message object.

Handle message contents for mailings.
*/
const Lang = imports.lang;

const myFile = imports.lib.file;

var Content = new Lang.Class ({
  Name: 'objectContent',

  Import: async function (path) {
    const str = await myFile.Import(path);
    return str;
  },

});
