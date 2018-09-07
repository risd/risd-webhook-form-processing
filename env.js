var debug = require( 'debug' )( 'env' )
var dotenv = require( 'dotenv-safe' )

module.exports = Env;

function Env ( options ) {
  if ( ! ( this instanceof Env ) ) return new Env( options );
  if ( !options  ) options = {}

  var defaultOptions = {
    path: '.env',
    allowEmptyValues: false,
    sample: '.env.example',
  }
  
  try {
    var environment = dotenv.load( Object.assign( defaultOptions, options ) ).required;
  } catch ( error ) {
    // These are expected as process.env variables if there is no `.env` file
    debug( 'loading-from-process.env' )
    var environment = Object.assign( {}, process.env );
    debug( environment )
  }

  var configuration = {
    server: {
      port: environment.SERVER_PORT,
    },
    routes: {
      slate: {
        account: {
          user: environment.ROUTES_SLATE_ACCOUNT_USER,
          password: environment.ROUTES_SLATE_ACCOUNT_PASSWORD,
        },
      },
    },
  }

  return {
    asObject: createConfiguration,
    asString: asString,
  }

  function createConfiguration () {
    return Object.create( {}, configuration )
  }

  function asString () {
    var str = '';
    for ( var key in environment ) {
      str = [ str, key, '=', environment[ key ], ' ' ].join( '' )
    }
    return str;
  }
}