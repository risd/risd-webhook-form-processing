var test = require( 'tape' )
var request = require( 'request' )

var env = require( '../env.js' )().asObject()
var Server = require( '../server.js' )
var routes = require( '../routes.js' )( env.routes )

var submitFormRequest = require( './request-options.js' ).submitForm

// set up server once, then close it at the end
var server

test( 'start-server', function ( t ) {
  t.plan( 1 )

  try {
    server = Server( Object.assign( { routes: routes }, env.server ) )
    t.ok( true, 'Server started')
  }
  catch( error ) {
    t.ok( false, 'Server not started')
  }
} )

test( 'empty-form-request', function ( t ) {
  t.plan( 2 )

  var requestOptions = submitFormRequest( {
    path: '/express-program-interest/',
    formFields: [],
  } )

  request( requestOptions, function ( error, response ) {
    t.assert( error === null, "Invalid request completed without error." )
    t.assert( response.statusCode === 422, "Invalid request procuded appropriate status code." )
  } )
} )

test( 'honey-pot-triggered', function ( t ) {
  t.plan( 2 )

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
      value: 'bot filled it out, oops.',
    } ],
  } )

  request( requestOptions, function ( error, response ) {
    t.assert( error === null, "Invalid request completed without error." )
    t.assert( response.statusCode === 422, "Invalid request procuded appropriate status code." )
  } )
} )

test( 'closer-server', function ( t ) {
  t.plan( 1 )

  server.close( function () {
    t.ok( true, 'server closed' )
  } )
} )
