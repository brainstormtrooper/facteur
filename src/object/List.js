
/**
Data object.

Handle CSV data for mailings.
*/
const myFile = imports.lib.file;
const Data = imports.object.Data;
const GObject = imports.gi.GObject;
const Gettext = imports.gettext;
const appData = new Data.Data();

var List = GObject.registerClass( // eslint-disable-line
    {
      GTypeName: 'List',
      Signals: {
        'Logger': {
          param_types: [GObject.TYPE_STRING],
        },
        'Import_error_sig': {
          param_types: [GObject.TYPE_BOOLEAN],
        },
        'Updated_sig': {
          param_types: [GObject.TYPE_BOOLEAN],
        },
      },
    },
    class List extends GObject.Object {
      _init () {
        super._init();

        //
        // VARS
        //

        // data stuff from the cvs file... will need to be cleaned up...
        this.csvstr = '';
        this.csva = [];
        this.csvj = '';
        this.res = '';

        this.Updated = false;
        this.fileData = '';

        // the headers for the UI and to be used as template variables...
        this.colcount = 0;
        this.headers = [];

        // the variables (array) to be used in the mailing
        this.mailingvars = [];
      }


      //
      // METHODS
      //

      verify (csva) {
        let res = true;
        if (csva[0][0] != 'address') {
          res = false;
        }

        return res;
      }

      /**
       * Imports a new CSV file
       * @param {string} path
       */
      import (str) {
        this.csva = this.csvToArray(str);
        if (this.csva.length > 501) {
          const e = new Error(Gettext.gettext('Mailing lists are limited to 500 recipients.'));
          throw e;
        }
        if (!this.verify(this.csva)) {
          this.emit('Import_error_sig', true);
        } else {
          try {
            this.dataHeadings();
            this.trimData();
            appData.set('CSVA', this.csva);
            appData.set('TO', this.csva.map((x) => x[0]));
            this.emit('Updated_sig', true);
          } catch (error) {
            logError(error);
            throw error;
          }
        }
      }

      /**
      Sets the data for the gtk listview column count and headings
      based on first row of the CSV data array.
      */
      dataHeadings () {
        this.headers = this.csva[0];
        appData.set('VARS', this.headers);
        this.colcount = Object.keys(this.headers).length;
      }

      /**
      Removes empty rows from the csv data array.
      http://www.electrictoolbox.com/loop-key-value-pairs-associative-array-javascript/
      Also removes the first row since it is only used for headers and vars...
      */
      trimData () {
        this.csva.shift();
        for (let k = 0; k < this.csva.length; k++) {
          // app.ui.results._LOG('Trimming... : ' + this.csva[k]);
          // this.emit('Log', 'Trimming... : ' + this.csva[k]);
          if (this.csva[k] == [] || this.csva[k] == null) {
            delete (this.csva[k]);
          }
        }
      }


      csvToArray (data) {
        const re = /(,|\r?\n|\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^,\r\n]*))/gi;
        const result = [[]];
        let matches;
        while ((matches = re.exec(data))) {
          if (matches[1].length && matches[1] !== ',') result.push([]);
          result[result.length - 1].push(
            // eslint-disable-next-line max-len
            matches[2] !== undefined ? matches[2].replace(/""/g, '"') : matches[3],
          );
        }

        return result;
      }

      CSV2JSON (csv) {
        this.csva = this.csvToArray(csv);
        const objArray = [];
        for (let i = 1; i < this.csva.length; i++) {
          objArray[i - 1] = {};
          // eslint-disable-next-line max-len
          for (let k = 0; k < this.csva[0].length && k < this.csva[i].length; k++) {
            const key = this.csva[0][k];
            objArray[i - 1][key] = this.csva[i][k];
          }
        }

        const json = JSON.stringify(objArray);
        // eslint-disable-next-line quotes
        const str = json.replace(/};/g, "};\r\n");

        return str;
      }


      Clear () {
        return true;
      }

      GetRow () {
        return true;
      }
    },
);
