var test = require( 'tape' )
var request = require( 'request' )
var requestOptions = require( './request-options' )

var env = require( '../env.js' )().asObject()
var server = require( '../server.js' )
var routes = require( '../routes.js' )( env.routes )
server( Object.assign( { routes: routes }, env.server ) )

test( 'error-no-origin-header-request', function ( t ) {
  t.plan( 2 )

  delete requestOptions.headers[ 'Referer' ]

  request( requestOptions, function ( error, response ) {
    console.log( error )
    t.assert( error === null, "Error request completed without error." )
    t.assert( response.statusCode === 400, "Error request procuded appropriate status code." )
  } )
} )