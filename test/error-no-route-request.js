var test = require( 'tape' )
var request = require( 'request' )
var requestOptions = require( './request-options' )

var env = require( '../env.js' )().asObject()
var server = require( '../server.js' )
var routes = require( '../routes.js' )( env.routes )
server( Object.assign( { routes: routes }, env.server ) )

test( 'error-request', function ( t ) {
  t.plan( 2 )

  Object.assign( requestOptions, {
    url: 'http://localhost:9000/no-such-route/'
  } )

  request( requestOptions, function ( error, response ) {
    console.log( error )
    t.assert( error === null, "Error request completed without error." )
    t.assert( response.statusCode === 403, "Error request procuded appropriate status code." )
  } )
} )