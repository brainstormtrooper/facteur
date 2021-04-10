/**
Html message object.

Handle message contents for mailings.
*/
const myFile = imports.lib.file;

var Content = class Content{
  Name = 'objectContent';

  async Import(path) {
    const str = await myFile.Import(path);
    return str;
  };

};
