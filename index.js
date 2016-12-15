"use strict";

var Tools = require("./lib/tools");


/**
 * @exports function parse
 * @param {string} args - Source filename.
 * @param {string} args.src - Source filename.
 * @param {array} args.commentsSyntax - List of pairs of opener/closer syntax for comments.
 */
exports.parse = function(args) {
    if( typeof args === 'string' ) args = { src: args };
    
};
