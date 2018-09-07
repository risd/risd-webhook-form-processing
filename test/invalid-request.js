var test = require( 'tape' )
var request = require( 'request' )
var requestOptions = require( './request-options' )

var env = require( '../env.js' )().asObject()
var server = require( '../server.js' )
var routes = require( '../routes.js' )( env.routes )
server( Object.assign( { routes: routes }, env.server ) )

test( 'invalid-request', function ( t ) {
  t.plan( 2 )

  Object.assign( requestOptions, {
    body: false,
  } )

  request( requestOptions, function ( error, response ) {
    t.assert( error === null, "Invalid request completed without error." )
    t.assert( response.statusCode === 422, "Invalid request procuded appropriate status code." )
  } )
} )