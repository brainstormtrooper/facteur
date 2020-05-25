

/**
Data object.

Handle CSV data for mailings.
*/
const Lang = imports.lang;
const Signals = imports.signals;
const myFile = imports.lib.file;

var Data = new Lang.Class ({
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
        _init: function ( ) {
                Signals.addSignalMethods(Data.prototype);
                this.parent();


                //print('Methods in Data class : ' + this.getMethods(this).join("\n"));

                this.emit('bob', false);
        },

        emit_updated: function ( ) {
                // print('emitting signal...');
                this.emit('Updated_sig');
        },



        Import: async function (path) {
          const str = await myFile.Import(path);
          // print(`>>> str = ${str}`);
          this.csva = this.CSVToArray(str);
          this.dataHeadings();
          this.trimData();
          app.Data.CSVA = this.csva;
          app.Data.TO = this.csva.map(x => x[0]);
          this.emit_updated();
        },

        /**
        Sets the data for the gtk listview column count and headings
        based on first row of the CSV data array.
        */
        dataHeadings: function(){
          this.headers = this.csva[0];
          app.Data.VARS = this.headers;
          // VARS.shift();
          // print('headers are : ' + this.headers);
          this.colcount=Object.keys(this.headers).length;
          // print('got ' + this.colcount + ' keys.');

        },

        /**
        Removes empty rows from the csv data array.
        http://www.electrictoolbox.com/loop-key-value-pairs-associative-array-javascript/
        Also removes the first row since it is only used for headers and vars...
        */
        trimData: function(){
          this.csva.shift();
          for(var k=0; k<this.csva.length; k++){
            // print('Trimming... : ' + this.csva[k]);
            app.ui.results._LOG('Trimming... : ' + this.csva[k]);
            if(this.csva[k] == [] || this.csva[k] == null){
              // print('deleting row : ' + k);
              delete(this.csva[k]);
            }
          }
          // print('Trimmed data is now : ' + this.csva);
        },


        CSVToArray: function(strData, strDelimiter) {
                log('building array...');
                // Check to see if the delimiter is defined. If not,
                // then default to comma.
                strDelimiter = (strDelimiter || ",");
                // Create a regular expression to parse the CSV values.
                var objPattern = new RegExp((
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
                // Create an array to hold our data. Give the array
                // a default empty first row.
                var arrData = [[]];
                // Create an array to hold our individual pattern
                // matching groups.
                var arrMatches = null;
                // Keep looping over the regular expression matches
                // until we can no longer find a match.
                while (arrMatches == objPattern.exec(strData)) {
                        // Get the delimiter that was found.
                        var strMatchedDelimiter = arrMatches[1];
                        // Check to see if the given delimiter has a length
                        // (is not the start of string) and if it matches
                        // field delimiter. If id does not, then we know
                        // that this delimiter is a row delimiter.
                        if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
                                // Since we have reached a new row of data,
                                // add an empty row to our data array.
                                arrData.push([]);
                        }
                        // Now that we have our delimiter out of the way,
                        // let's check to see which kind of value we
                        // captured (quoted or unquoted).
                        if (arrMatches[2]) {
                                // We found a quoted value. When we capture
                                // this value, unescape any double quotes.
                                var strMatchedValue = arrMatches[2].replace(
                                new RegExp("\"\"", "g"), "\"");
                        } else {
                                // We found a non-quoted value.
                                var strMatchedValue = arrMatches[3];
                        }
                        // Now that we have our value string, let's add
                        // it to the data array.
                        arrData[arrData.length - 1].push(strMatchedValue);



                }
                // Return the parsed data.
                return (arrData);
        },

        CSV2JSON: function(csv) {
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


    Clear: function ( ) {

        return true;

    },

    GetRow: function ( ) {

        return true;

    },



});
