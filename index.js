"use strict";

var Tools = require("./lib/tools");


/**
 * @exports function parse
 * @param {string} args - Source filename.
 * @param {string} args.src - Source filename.
 * @param {array} args.commentsSyntax - List of pairs of opener/closer syntax for comments.
 */
exports.parse = function(args) {
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
    Tools.extractComments( args ).then(function( comments ) {
        comments.forEach(function (com, idx) {
            console.log('(', idx , ')');
            console.log(com);
        });
    }, function( err ) {
        console.info("[index] err=...", err);
    });
};
