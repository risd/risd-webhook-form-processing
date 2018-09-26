module.exports = predicateForKeyValue;

function predicateForKeyValue( predicate, key, value ) {
  return function ( obj ) {
    return predicate( obj[ key ], value )
  }
}
