const GLib = imports.gi.GLib;
const Lang = imports.lang;
const Gio   = imports.gi.Gio;





/**
Data object.

Handle CSV data for mailings.
*/
const Data = new Lang.Class ({
        Name: 'objectData',

        //
        // VARS
        //

        // data stuff from the cvs file... will need to be cleaned up...
        csvstr: "", // if (str.length == 0)
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
        /*
        getMethods: function (obj) {
                var result = [];
                for (var id in obj) {
                        try {
                                if (typeof(obj[id]) == "function") {
                                        result.push(id + ": " + obj[id].toString());
                                }
                        } catch (err) {
                                result.push(id + ": inaccessible");
                        }
                }
                return result;
        },
        */
        emit_updated: function ( ) {
                print('emitting signal...');
                this.emit('Updated_sig');
        },


        Import: function( path ) {

        //this.csvstr="tom";
        //this.msgcompiled = "--" + this.boundary + this.txt + "--" + this.boundary + this.html;
        //return this.msgcompiled;
                let file;
                print('reading file from ' + path);
                file = Gio.File.new_for_path(path);


                // asynchronous file loading...
                file.load_contents_async(null, Lang.bind(this, function(file, res) {

                        try {
                                // read the file into a variable...
                                this.contents = file.load_contents_finish(res)[1];
                                this.csvstr = this.contents.toString();
                                // create an array...
                                this.csva = this.CSVToArray(this.csvstr);

                                this.dataHeadings();
                                this.trimData();

                                // print('csvstr is now : ' + this.csvstr);
                                this.emit_updated();

                        } catch (e) {
                                print('Error loading selected data file : ' + e);
                                return;
                        }

                }));



    this.file.query_info_async('standard::type,stand   ard::size',
        Gio.FileQueryInfoFlags.NONE, GLib.PRIORITY_LOW, null,
        Lang.bind(this, function(source, async) {

            let info, type, size, text;

            info = source.query_info_finish(async);
            type = info.get_file_type();
            size = info.get_size();

            text = 'File info type: ' + type + ', size: ' + size;
            this.fileData = text;
        }));

    },
        /**
        Sets the data for the gtk listview column count and headings
        based on first row of the CSV data array.
        */
        dataHeadings: function(){
                this.headers=this.csva[0];
                print('headers are : ' + this.headers);
                this.colcount=Object.keys(this.headers).length;
                print('got ' + this.colcount + ' keys.');
        },

        /**
        Removes empty rows from the csv data array.

        http://www.electrictoolbox.com/loop-key-value-pairs-associative-array-javascript/

        Also removes the first row since it is only used for headers...

        */
        trimData: function(){
                this.csva.shift();
                for(var k=0; k<this.csva.length; k++){
                        print('Trimming... : ' + this.csva[k]);
                        if(this.csva[k][0].length==0){
                                print('deleting row : ' + k); 
                                delete(this.csva[k]);
                        }
                }
                print('Trimmed data is now : ' + this.csva);
        },


        CSVToArray: function(strData, strDelimiter) {
                print('building array...');
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
                while (arrMatches = objPattern.exec(strData)) {
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
        /*
    GetVal : function () {

        try {
            GLib.spawn_command_line_async( cmdstr, e );
        } catch ( e ) {
            throw e;
        }

    }
    */

});
