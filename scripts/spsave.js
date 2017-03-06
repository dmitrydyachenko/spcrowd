#!/usr/bin/env node
'use strict';
var spsave = require("spsave").spsave;
var fs = require("fs");

var args = process.argv.slice(2);

var BASEPATH_SP_PATH = '/Style Library/dove/',
    BASEPATH_SP_JS = BASEPATH_SP_PATH + '_js',
    BASEPATH_SP_CSS = BASEPATH_SP_PATH + '_css',
    BASEPATH_SP_MASTER = '/_catalogs/masterpage';

switch (args[3]) {
    case 'js':
        saveToSp(BASEPATH_SP_JS, args[4], args[5]);
        break;
    case 'css':
        saveToSp(BASEPATH_SP_CSS, args[4], args[5]);
        break;
    case 'master':
        saveToSp(BASEPATH_SP_MASTER, args[4], args[5]);
        break;
    default:
        console.log('Sorry, that is not something I know how to do.');
 }

function saveToSp(BASEPATH_SP_FOLDER, BASEPATH_DEST_FILE, FILE) {
    console.log('File ' + FILE + ' is uploading...');

    var coreOptions = {
        siteUrl: args[0],
        notification: true,
        checkin: true,
        checkinType: 1
    };

    var creds = {
        username: args[1],
        password: args[2]
    };

    var fileOptions = {
        folder: BASEPATH_SP_FOLDER,
        fileName: FILE,
        fileContent: null
    };

    fileOptions.fileContent = fs.readFileSync(BASEPATH_DEST_FILE + "/" + FILE);

    spsave(coreOptions, creds, fileOptions)
    .then(function(data){
        console.log('File ' + FILE + ' uploaded!');
    })
    .catch(function(err){
        console.log(err);
    });
}
