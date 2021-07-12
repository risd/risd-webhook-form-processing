var debug = require( 'debug' )( 'test-env' )
var dotenv = require( 'dotenv-safe' )

module.exports = TestEnv;

function TestEnv ( options ) {
  if ( ! ( this instanceof TestEnv ) ) return new TestEnv( options );
  if ( !options  ) options = {}

  var defaultOptions = {
    path: './.env.test',
    allowEmptyValues: false,
    sample: './.env.test.example',
  }
  
  try {
    var environment = dotenv.load( Object.assign( defaultOptions, options ) ).required;
  } catch ( error ) {
    throw error
  }

  debug( environment )

  var configuration = {
    validDomain: environment.VALID_DOMAIN,
  }

  return {
    asObject: createConfiguration,
    asString: asString,
    asStringArray: asStringArray,
  }

  function createConfiguration () {
    return Object.create( configuration )
  }

  function asString () {
    var str = '';
    for ( var key in environment ) {
      str = [ str, key, '=', environment[ key ], ' ' ].join( '' )
    }
    return str;
  }

  function asStringArray () {
    var arr = [];
    for ( var key in environment ) {
      arr.push( [ key, '=', environment[ key ] ].join( '' ) )
    }
    return arr; 
  }
}