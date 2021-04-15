/**
Html message object.

Handle message contents for mailings.
*/
const myFile = imports.lib.file;

var Content = class Content{ // jshint ignore:line

  async Import(path) {
    const str = await myFile.Import(path);
    return str;
  }

};
