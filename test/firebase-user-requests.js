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

test( 'create-user', function ( t ) {
  t.plan( 2 )

  var createRequestOptions = submitFormRequest( {
    path: '/firebase-user/create/',
    formFields: [ {
      key: 'email',
      value: 'mgdevelopers+automated-test-creation@risd.edu',
    }, {
      key: 'password',
      value: 'password!',
    }, {
      key: 'honey_pot',
      value: ''
    } ],
  } )

  request( createRequestOptions, function ( error, response ) {

    t.assert( error === null, "Valid request completed without error." )
    t.assert( response.statusCode === 200, "Valid request procuded appropriate status code." )
  } )
} )

test( 'update-user', function ( t ) {
  t.plan( 2 )

  var updateRequestOptions = submitFormRequest( {
    path: '/firebase-user/update/',
    formFields: [ {
      key: 'email',
      value: 'mgdevelopers+automated-test-creation@risd.edu'
    }, {
      key: 'oldPassword',
      value: 'password!',
    }, {
      key: 'newPassword',
      value: 'password!1',
    }, {
      key: 'honeypot',
      value: ''
    } ],
  } )

  request( updateRequestOptions, function ( error, response ) {

    t.assert( error === null, "Valid request completed without error." )
    t.assert( response.statusCode === 200, "Valid request procuded appropriate status code." )
  } )
} )

test( 'delete-user', function ( t ) {
  t.plan( 2 )

  var deleteRequestOptions = submitFormRequest( {
    path: '/firebase-user/delete/',
    formFields: [ {
      key: 'email',
      value: 'mgdevelopers+automated-test-creation@risd.edu'
    }, {
      key: 'password',
      value: 'password!1',
    }, {
      key: 'honeypot',
      value: ''
    } ],
  } )

  request( deleteRequestOptions, function ( error, response ) {

    t.assert( error === null, "Valid request completed without error." )
    t.assert( response.statusCode === 200, "Valid request procuded appropriate status code." )
  } )
} )

test( 'closer-server', function ( t ) {
  t.plan( 1 )

  server.close( function () {
    t.ok( true, 'server closed' )
  } )
} )
