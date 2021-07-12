var test = require( 'tape' )
var request = require( 'request' )
var requestOptions = require( './request-options' )

var env = require( '../env.js' )().asObject()
var Server = require( '../server.js' )
var routes = require( '../routes.js' )( env.routes )

test( 'valid-request', function ( t ) {
  t.plan( 3 )

  var server = Server( Object.assign( { routes: routes }, env.server ) )

  request( requestOptions, function ( error, response ) {

    t.assert( error === null, "Valid request completed without error." )
    t.assert( response.statusCode === 200, "Valid request procuded appropriate status code." )

    server.close( function () {
      t.ok( true, 'server cloesd' )
    } )
  } )
} )
