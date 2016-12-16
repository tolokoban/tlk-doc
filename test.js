var FS = require("fs");
var Tools = require("./lib/tools");


var args = {
    content: FS.readFileSync( "./index.js", 'utf8' ).toString(),
    commentsSyntax: [['/*', '*/'], ['//', '\n']],
    stringQuotes: '"\''
};

var comments = Tools.extractComments( args );

console.log();
console.log("Comments: ", comments.length);
console.log();

function print( arr ) {
    arr.forEach(function (com, idx) {
        console.log("--------------------( " + idx + " )--------------------");
        console.log(com);
    });
}

print( comments );

comments = comments.map( Tools.keepOnlyDoc ).filter( x => x.length > 0 );

print( comments );
