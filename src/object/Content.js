/**
Html message object.

Handle message contents for mailings.
*/
const myFile = imports.lib.file;

var Content = class Content{ // eslint-disable-line
  /**
   * opens or imports a file
   * @param {string} path
   * @return {string} file contents
   */
  async import(path) {
    const str = await myFile.fopen(path);

    return str;
  }
};
