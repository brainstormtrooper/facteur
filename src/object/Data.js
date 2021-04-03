

/**
Data object.

Handle CSV data for mailings.
*/
const Lang = imports.lang;
const Signals = imports.signals;
const myFile = imports.lib.file;

var Data = new Lang.Class({
  Name: 'objectData',

  //
  // VARS
  //

  // data stuff from the cvs file... will need to be cleaned up...
  csvstr: '', // if (str.length == 0)
  csva: [],
  csvj: "",
  res: "",

  Updated: false,
  fileData: "",

  //the headers for the UI and to be used as template variables...
  colcount: 0,
  headers: [],

  // the variables (array) to be used in the mailing
  mailingvars: [],

  //
  // METHODS
  //

  /**
  only used to get signals to work...
  */
  _init: function () {
    Signals.addSignalMethods(Data.prototype);
    this.parent();


    this.emit('bob', false);
  },

  emit_updated: function () {
    this.emit('Updated_sig');
  },

  verify: function(csva) {
    let res = true;
    if (csva[0][0] != 'address') {
      res = false;
    }

    return res;
  },

  /**
   * Imports a new CSV file
   * @param {string} path 
   */
  Import: async function (path) {
    const str = await myFile.Import(path);
    this.csva = this.CSVToArray(str);
    if (!this.verify(this.csva)) {
      this.emit('Import_error_sig');
    } else {
    this.dataHeadings();
    this.trimData();
    app.Data.CSVA = this.csva;
    app.Data.TO = this.csva.map(x => x[0]);
    this.emit_updated();
    }
  },

  /**
  Sets the data for the gtk listview column count and headings
  based on first row of the CSV data array.
  */
  dataHeadings: function () {
    this.headers = this.csva[0];
    app.Data.VARS = this.headers;
    this.colcount = Object.keys(this.headers).length;

  },

  /**
  Removes empty rows from the csv data array.
  http://www.electrictoolbox.com/loop-key-value-pairs-associative-array-javascript/
  Also removes the first row since it is only used for headers and vars...
  */
  trimData: function () {
    this.csva.shift();
    for (var k = 0; k < this.csva.length; k++) {
      app.ui.results._LOG('Trimming... : ' + this.csva[k]);
      if (this.csva[k] == [] || this.csva[k] == null) {
        delete (this.csva[k]);
      }
    }
  },


  CSVToArray: (data) => {
    const re = /(,|\r?\n|\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^,\r\n]*))/gi
    const result = [[]]
    let matches
    while ((matches = re.exec(data))) {
      if (matches[1].length && matches[1] !== ',') result.push([])
      result[result.length - 1].push(
        matches[2] !== undefined ? matches[2].replace(/""/g, '"') : matches[3]
      )
    }
    return result
  },

  CSV2JSON: function (csv) {
    this.csva = this.CSVToArray(csv);
    var objArray = [];
    for (var i = 1; i < this.csva.length; i++) {
      objArray[i - 1] = {};
      for (var k = 0; k < this.csva[0].length && k < this.csva[i].length; k++) {
        var key = this.csva[0][k];
        objArray[i - 1][key] = this.csva[i][k]
      }
    }

    var json = JSON.stringify(objArray);
    var str = json.replace(/},/g, "},\r\n");

    return str;
  },


  Clear: function () {

    return true;

  },

  GetRow: function () {

    return true;

  },



});
