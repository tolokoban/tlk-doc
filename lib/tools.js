"use strict";

var FS = require("fs");


exports.extractComments = function(args) {
    return new Promise(function (resolve, reject) {
        var openingComments = args.commentsSyntax.map(x => x[0]);
        var closingComments = args.commentsSyntax.map(x => x[1]);
        var pattern = openingComments.map(function(openingComment) {
            var result = '';
            for( var i=0; i<openingComment.length; i++ ) {
                result += '\\' + openingComment.charAt(i);
            }
            return result;
        }).join('|');
        pattern += "|[";
        for( var i=0; i<args.stringQuotes.length; i++ ) {
            pattern += '\\' + args.stringQuotes.charAt(i);
        }
        pattern += ']';

        var rx = new RegExp( pattern, 'g' );
        FS.readFile( args.src, 'utf8', function(err, data) {
            if( err ) reject( err );
            else {
                var content = data.toString();
                var comments = [];
                var lastComment = null;
                var end = content.length;
                var commentType;
                var cursor = 0;
                var nextCursor;
                var matcher, matchString;
                while( cursor < end ) {
                    matcher = rx.exec( content );
                    if( !matcher ) break;
                    matchString = matcher[0];
                    if( args.stringQuotes.indexOf( matchString ) > -1 ) {
                        cursor = skipQuote( content, matcher.index + 1, matchString );
                        rx.lastIndex = cursor;
                    }
                    else {
                        commentType = openingComments.indexOf( matchString );
                        if( lastComment && hasCodeBetween( content, cursor, matcher.index ) ) {
                            comments.push( lastComment );
                            lastComment = '';
                        } else {
                            if( lastComment ) lastComment += '\n';
                            else lastComment = '';
                        }
                        cursor = matcher.index;
                        nextCursor = content.indexOf( closingComments[commentType], cursor );
                        if( nextCursor < 0 ) nextCursor = end;
                        lastComment += content.substr(
                            cursor + matchString.length,
                            nextCursor - cursor - matchString.length );
                    }
                }
                if( lastComment ) comments.push( lastComment );

console.log(content);

                resolve( comments );
            }
        });
    });
};


function skipQuote( content, cursor, quote ) {
    var end = content.length;
    var character;
    var escape = false;
    while( cursor < end ) {
        character = content.charAt( cursor++ );
        if( escape ) {
            escape = false;
            continue;
        }
        if( character == quote ) return cursor;
        if( character == '\\' ) escape = true;
    }
    return cursor;
}


function hasCodeBetween( content, begin, end ) {
    while( begin < end ) {
        var c = content.charAt( begin++ );
        if( " \n\t\r".indexOf( c ) == -1 ) return true;
    }
    return false;
}
