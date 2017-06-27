/**
 * Created by Deepak Kumar Susarla.
 */
const fs = require('fs');
const path = require('path');


/*
 * returns data in the specified file
 * @param : filepath
 * @param : filename
 * @return : data
 */

exports.readfile = function (file_path, filename) {

    // let FilePath = path.join( file_path, filename );
    return fs.readFileSync(path.join(file_path, filename));
};


/*
 * appends data to the specified file
 * @param : filepath
 * @param : filename
 * @param : text
 */

exports.appendata = function (filepath, filename, text) {

    let status = fs.appendFilesync(path.join(filepath, filename), text);


};

/*
 * returns true when specified file exists
 * @param : filepath
 * @param : filename
 * @return : boolean value
 */


exports.isFileExists = function (filepath, filename) {
    let status = false;


    if (fs.existsSync(path.join(filepath, filename))) {
        status = true;
    }
    else {
        console.error("File not found");
        status = false;
    }

    return status;
};

/*
 * Writes data to the specified file
 * @param : filepath
 * @param : filename
 * @param : text
 * @return : boolean value
 */


exports.writeFile = function (filepath, filename, text) {
    let status = false;
    try {
        require("mkdirp").sync(filepath);
        status = fs.writeFileSync(path.join(filepath, filename), text);
        return status;
    } catch (e) {
        console.log("Exception in write file method :" + e.stack);
    }

}

/*
 * Creates image from base64 to png
 * @param : filepath
 * @param : filename
 * @param : text
 * @return : boolean value
 */


exports.writeFileForScreenshot = function (filepath, filename, png) {
    let status = false;
    try {
        require("mkdirp").sync(filepath);
        status = fs.writeFileSync(path.join(filepath, filename), png, 'base64');

        return status;
    }
    catch (e) {
        console.error("error. unable to create file" + e);
    }
}