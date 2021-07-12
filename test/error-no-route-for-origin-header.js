var test = require( 'tape' )
var request = require( 'request' )
var requestOptions = require( './request-options' )

var env = require( '../env.js' )().asObject()
var Server = require( '../server.js' )
var routes = require( '../routes.js' )( env.routes )

test( 'error-no-origin-header-request', function ( t ) {
  t.plan( 3 )

  var server = Server( Object.assign( { routes: routes }, env.server ) )

  requestOptions = Object.assign(
    {},
    requestOptions,
    { 
      headers: Object.assign(
        {},
        requestOptions.headers,
        { 'Referer': `https://no-such-domain-in-routes.com/any-form/` }
      )
    }
  )

  request( requestOptions, function ( error, response ) {
    t.assert( error === null, "Error request completed without error." )
    t.assert( response.statusCode === 403, "Error request procuded appropriate status code." )
    server.close( function () {
      t.ok( true, 'server cloesd' )
    } )
  } )
} )