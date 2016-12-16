"use strict";


exports.extractComments = function(args) {
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

    var ctx = {
        rx: new RegExp( pattern, 'g' ),
        content: args.content,
        comments: [],
        end: args.content.length,
        cursor: 0,
        openingComments: openingComments,
        closingComments: closingComments,
        stringQuotes: args.stringQuotes
    };

    var comments = [];
    var commentType;
    var comment;
    var nextCursor;
    var closingComment;

    while( ctx.cursor < ctx.end ) {
        if( !matchesOpening( ctx )) break;
        if( isQuote( ctx ) ) continue;
        comment = readComment( ctx );
        pushComment( ctx, comment );
    }
    if( ctx.lastComment ) ctx.comments.push( ctx.lastComment );
    console.log(ctx.content);

    return ctx.comments;
};

exports.keepOnlyDoc = function(comment) {
debugger;
    var ctx = { content: comment, cursor: 0, output: '' };
    findFirstTag( ctx );
    var end = ctx.content.length;
    while( ctx.cursor < end ) {
        addNextLineToOutput( ctx );
    }
    return ctx.output;
};

function addNextLineToOutput(ctx) {
    var pos = ctx.content.indexOf( '\n', ctx.cursor );
    if( pos < 0 ) pos = ctx.content.length;
    ctx.output += ctx.content.substr( ctx.cursor, pos - ctx.cursor + 1 );
    ctx.cursor = pos + ctx.margin + 1;
}

function findFirstTag(ctx) {
    var end = ctx.content.length;
    var startOfLine = ctx.cursor;
    var margin = 0;

    while( ctx.cursor < end ) {
        skipCharsToIgnore( ctx );
        margin = ctx.cursor - startOfLine;
        if( ctx.content.charAt( ctx.cursor ) == '@' ) break;
        skipRestOfLine( ctx );
        startOfLine = ctx.cursor;
    }
    ctx.margin = margin;
}

function skipRestOfLine(ctx) {
    var end = ctx.content.length;
    while( ctx.cursor < end && ctx.content.charAt( ctx.cursor ) != '\n' ) ctx.cursor++;
    ctx.cursor++;
}

function skipCharsToIgnore(ctx) {
    var end = ctx.content.length;
    var c = ctx.content.charAt(ctx.cursor);

    while( ctx.cursor < end ) {
        if( " \t/*\r".indexOf(c) == -1 ) return;
        ctx.cursor++;
        c = ctx.content.charAt(ctx.cursor);
    }
}

function pushComment( ctx, comment ) {
    if( !ctx.lastComment ) {
        ctx.lastComment = comment;
        ctx.hasCodeBefore = false;
        return;
    }
    if( ctx.hasCodeBefore ) {
        ctx.comments.push( ctx.lastComment );
        ctx.lastComment = comment;
        ctx.hasCodeBefore = false;
        return;
    }
    ctx.lastComment += "\n" + comment;
}

function readComment( ctx ) {
    var commentType = ctx.openingComments.indexOf( ctx.matcher[0] );
    var closingComment = ctx.closingComments[commentType];
    var nextCursor = ctx.content.indexOf( closingComment, ctx.cursor );
    var comment = ctx.content.substring( ctx.cursor, nextCursor );
    ctx.cursor = nextCursor + closingComment.length;
    ctx.rx.lastIndex = ctx.cursor;
    return comment;
}

function isQuote( ctx ) {
    var quote = ctx.matcher[0];
    if( ctx.stringQuotes.indexOf( quote ) == -1 ) return false;

    ctx.hasCodeBefore = true;
    var end = ctx.end;
    var character;
    var escape = false;
    while( ctx.cursor < end ) {
        character = ctx.content.charAt( ctx.cursor++ );
        if( escape ) {
            escape = false;
            continue;
        }
        if( character == quote ) {
            ctx.rx.lastIndex = ctx.cursor;
            return true;
        }
        if( character == '\\' ) escape = true;
    }
    return true;
}


function hasCodeBefore( content, begin, end ) {
    while( begin < end ) {
        var c = content.charAt( begin++ );
        if( " \n\t\r".indexOf( c ) == -1 ) return true;
    }
    return false;
}


function matchesOpening( ctx ) {
    ctx.matcher = ctx.rx.exec( ctx.content );
    if( !ctx.matcher ) return false;
    ctx.hasCodeBefore = hasCodeBefore( ctx.content, ctx.cursor, ctx.matcher.index );
    ctx.cursor = ctx.matcher.index + ctx.matcher[0].length;
    ctx.rx.lastIndex = ctx.cursor;
    return true;
}
