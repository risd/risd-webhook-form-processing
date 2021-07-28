var test = require( 'tape' )
var request = require( 'request' )

var env = require( '../env.js' )().asObject()
var Server = require( '../server.js' )
var routes = require( '../routes.js' )( env.routes )

var submitFormRequest = require( './request-options.js' ).submitForm

test( 'valid-request', function ( t ) {
  t.plan( 3 )

  var server = Server( Object.assign( { routes: routes }, env.server ) )

  var requestOptions = submitFormRequest( {
    path: '/express-program-interest/',
    formFields: [ {
      key: 'first_name',
      value: 'first'
    }, {
      key: 'last_name',
      value: 'last',
    }, {
      key: 'email',
      value: 'bot@domain.com',
    }, {
      key: 'program_of_interest',
      value: 'Architecture',
    }, {
      key: 'country',
      value: 'US',
    }, {
      key: 'receive_viewbook',
      value: false,
    }, {
      key: 'street_address',
      value: '',
    }, {
      key: 'city',
      value: '',
    }, {
      key: 'state',
      value: '',
    }, {
      key: 'postal_code',
      value: '',
    }, {
      key: 'honey_pot',
      value: '',
    } ],
  } )

  request( requestOptions, function ( error, response ) {

    t.assert( error === null, "Valid request completed without error." )
    t.assert( response.statusCode === 200, "Valid request procuded appropriate status code." )

    server.close( function () {
      t.ok( true, 'server cloesd' )
    } )
  } )
} )
