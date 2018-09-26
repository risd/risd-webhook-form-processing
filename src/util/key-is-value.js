var predicateForKeyValue = require( './predicate-for-key-value.js' )
var equal = require( './equal.js' )

module.exports = keyIsValue;

function keyIsValue ( key, value ) {
  return predicateForKeyValue( equal, key, value )
}
