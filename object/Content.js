/**
Html message object.

Handle message contents for mailings.
*/
const myFile = imports.lib.file;

const Content = new Lang.Class ({
  Name: 'objectContent',

  Import: async function (path) {
    const str = await myFile.Import(path);
    return str;
  },

});
