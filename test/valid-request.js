var test = require( 'tape' )
var request = require( 'request' )
var requestOptions = require( './request-options' )

var env = require( '../env.js' )().asObject()
var server = require( '../server.js' )
var routes = require( '../routes.js' )( env.routes )
server( Object.assign( { routes: routes }, env.server ) )

test( 'valid-request', function ( t ) {
  t.plan( 2 )

  request( requestOptions, function ( error, response ) {
    t.assert( error === null, "Valid request completed without error." )
    t.assert( response.statusCode === 200, "Valid request procuded appropriate status code." )
  } )
} )
