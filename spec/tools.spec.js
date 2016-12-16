var Tools = require("../lib/tools");
var Kod = Tools.keepOnlyDoc;

describe('keepOnlyDoc', function() {
    it('should mwork with empty strings', function() {
        expect( Kod('') ).toEqual( '' );
    });

    it('should skip text before tag', function() {
        expect( Kod('  \t  *** / /  **  @module Joe') ).toEqual( '@module Joe' );
    });

    it('should skip text before tag on multiple lines', function() {
        expect( Kod(`
*
 * Ceci sera ignoré.
 * @exports function parse
 * Rest of comment (line 1).
 * Rest of comment (line 2).
`) ).toEqual(`@exports function parse
Rest of comment (line 1).
Rest of comment (line 2).
`);
    });

    it('should work with null margin', function() {
        expect( Kod(`
@module
First line
Second line`)).toEqual(`@module
First line
Second line`);
    });


});
