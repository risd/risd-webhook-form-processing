var predicateForKeyValue = require( './predicate-for-key-value.js' )
var notEqual = require( './not-equal.js' )

module.exports = keyIsNotValue;

function keyIsNotValue ( key, value ) {
  return predicateForKeyValue( notEqual, key, value )
}
