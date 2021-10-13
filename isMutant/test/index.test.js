'use strict';

var expect = require('chai').expect;

var isMutantLambda = require('../index');

describe('isMutantLambda', function() {
    [
        ["ATGCGA","CAGTGC","TTATGT","AAAAGG","CCCCTA","TCCCTGS"]
    ].forEach( function( validADN ) {
        it(`is mutant validation: dna=${validADN}`, function(done) {
            var context = {
                succeed: function( result ) {
                    expect( result.isMutant ).to.be.true;
                    done();
                },

                fail: function() {
                    done( new Error( 'never context.fail' ) );
                }
            }

            isMutantLambda.handler( { adn: validADN }, { /* context */ }, (err, result) => {
                try {
                    expect(err).to.not.exist;
                    expect(result).to.exist;
                    expect(result.isMutant).to.be.true;
                    
                    done();
                }
                catch( error ) {
                    done( error );
                }
            });
        });
    });
    [
        ["TTGCGA","CACTGC","XXATTT","ABACGG","ADCCTA","TCATGS"]
    ].forEach( function( invalidADN ) {
        it( `fail: when adn is invalid: adn=${invalidADN}`, function( done ) {
            isMutantLambda.handler( { adn: invalidADN }, { /* context */ }, (err,result) => {
                try {
                    expect( err ).to.exist;
                    expect( err.message ).to.equal( 'unknown adn' );
                    expect( result ).to.not.exist;
                    done();
                }
                catch( error ) {
                    done( eror );
                }
            });
        });
    });
});
