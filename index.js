"use strict";

var Tools = require("./lib/tools");
var FS = require("fs");


/**
 * Ceci sera ignoré.
 * @exports function parse
 * @param {string} args - Source filename.
 * @param {string} args.src - Source filename.
 * @param {array} args.commentsSyntax - List of pairs of opener/closer syntax for comments.
 */

   
// Plus un petit bout...

exports.parse = function(args) {
    return new Promise(function (resolve, reject) {
        if( typeof args === 'undefined' ) throw "[tlk-doc.parse] Missing argument!";
        if( typeof args === 'string' ) args = { src: args };
        if( !Array.isArray(args.commentsSyntax) ) {
            args.commentsSyntax = [
                ['/*', '*/'],
                ['//', '\n']
            ];
        }
        if( typeof args.stringQuotes !== 'string' ) {
            args.stringQuotes = '"\'';
        }

        // Un mono commentaire.
        // Et une deuxième ligne qui devrait etre avec la precedente.
        FS.readFile( args.src, 'utf8', function(err, data) {
            if( err ) reject( err );
            args.content = data.toString();
            var comments = Tools.extractComments( args )
                    .map( Tools.keepOnlyDoc )
                    .filter( x => x.length > 0 );


            resolve( comments );  // @TODO
        });
        /* Le commentaire final*//* qui n'en ai pas vraiment un.*/
    });
};
