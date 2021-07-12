var test = require( 'tape' )
var request = require( 'request' )

var env = require( '../env.js' )().asObject()
var Server = require( '../server.js' )
var routes = require( '../routes.js' )( env.routes )

// { operation, formFields: { key, value } }
//   => { method, url, headers: { 'Content-Type', 'Content-Length', Referer } }
var baseRequestOptions = function ( options ) {
  var boundary = '--boundary'
  var operation = options.operation
  var formData = options.formFields
    .concat( [ { key: 'honeypot', value: '' } ] )
    .map( keyValueToFormData )
    .concat( [ '--' + boundary + '--\r\n' ] )
    .join( '' )

  return  {
    method: 'POST',
    url: `http://localhost:${ env.server.port }/firebase-user/${ operation }/`,
    headers: {
      'Content-Type': `multipart/form-data; boundary=${ boundary }`,
      'Content-Length': formData.length,
      'Referer': `http://localhost:${ env.server.port }/firebase-user/${ operation }/`,
    },
    body: formData,
  }

  function keyValueToFormData ( keyValue ) {
    return '--' + boundary + '\r\n' +
      'Content-Disposition: form-data; name="' + keyValue.key + '"\r\n' +
      '\r\n' +
      keyValue.value + '\r\n'
  }
}

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

  var createRequestOptions = baseRequestOptions( {
    operation: 'create',
    formFields: [ {
      key: 'email',
      value: 'mgdevelopers+automated-test-creation@risd.edu',
    }, {
      key: 'password',
      value: 'password!',
    } ],
  } )

  request( createRequestOptions, function ( error, response ) {

    t.assert( error === null, "Valid request completed without error." )
    t.assert( response.statusCode === 200, "Valid request procuded appropriate status code." )
  } )
} )

test( 'update-user', function ( t ) {
  t.plan( 2 )

  var updateRequestOptions = baseRequestOptions( {
    operation: 'update',
    formFields: [ {
      key: 'email',
      value: 'mgdevelopers+automated-test-creation@risd.edu'
    }, {
      key: 'password',
      value: 'password!1',
    } ],
  } )

  request( updateRequestOptions, function ( error, response ) {

    t.assert( error === null, "Valid request completed without error." )
    t.assert( response.statusCode === 200, "Valid request procuded appropriate status code." )
  } )
} )

test( 'delete-user', function ( t ) {
  t.plan( 2 )

  var deleteRequestOptions = baseRequestOptions( {
    operation: 'update',
    formFields: [ {
      key: 'email',
      value: 'mgdevelopers+automated-test-creation@risd.edu'
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
