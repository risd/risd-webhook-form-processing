var test = require( 'tape' )
var request = require( 'request' )

var env = require( '../env.js' )().asObject()
var Server = require( '../server.js' )
var routes = require( '../routes.js' )( env.routes )

var submitFormRequest = require( './request-options.js' ).submitForm

test( 'error-no-origin-header-request', function ( t ) {
  t.plan( 3 )

  var server = Server( Object.assign( { routes: routes }, env.server ) )

  var requestOptions = submitFormRequest( {
    path: '/will-not-reach-this/',
    formFields: [ {
      key: 'honey_pot',
      value: '',
    } ],
    referer: 'http://no-route-for-referrer.com/form/',
  } )

  request( requestOptions, function ( error, response ) {
    t.assert( error === null, "Error request completed without error." )
    t.assert( response.statusCode === 403, "Error request procuded appropriate status code." )
    server.close( function () {
      t.ok( true, 'server cloesd' )
    } )
  } )
} )