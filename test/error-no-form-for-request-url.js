var test = require( 'tape' )
var request = require( 'request' )
var env = require( '../env.js' )()
var configuration = env.asObject()

var env = require( '../env.js' )().asObject()
var Server = require( '../server.js' )
var routes = require( '../routes.js' )( env.routes )

var submitFormRequest = require( './request-options.js' ).submitForm

test( 'error-no-firebase-site-for-origin-header', function ( t ) {
  t.plan( 3 )

  var server = Server( Object.assign( { routes: routes }, env.server ) )

  var requestOptions = submitFormRequest( {
    path: '/non-existent-path/',
    formFields: [ {
      key: 'honey_pot',
      value: ''
    } ],
  } )

  request( requestOptions, function ( error, response ) {
    t.assert( error === null, "Error request completed without error." )
    t.assert( response.statusCode === 403, "Error request procuded appropriate status code." )
    server.close( function () {
      t.ok( true, 'server cloesd' )
    } )
  } )
} )