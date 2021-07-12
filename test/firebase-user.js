var test = require( 'tape' )
var FirebaseUser = require( '../src/firebase-user/firebase-interface.js' )
var env = require( '../env.js' )().asObject()

var firebaseUser = FirebaseUser( env.routes.firebase )

var options = {
  email: 'mgdevelopers+automated-test-creation@risd.edu',
  password: 'password!',
}

var updateOptions = {
  email: options.email,
  newPassword: 'password!1',
}

var deleteOptions = {
  email: options.email,
}

test( 'create-user', function ( t ) {
  t.plan( 1 )
  
  firebaseUser.create( options )
    .then( function () {
      t.ok( true, 'Created user ')
    } )
    .catch( function () {
      t.ok( false, 'Could not create user' )
    } )
} )

test( 'update-password', function ( t ) {
  t.plan( 1 )

  firebaseUser.updatePassword( updateOptions )
    .then( function () {
      t.ok( true, 'Updated password')
    } )
    .catch( function () {
      t.ok( false, 'Could not update user password' )
    } )
} )

test( 'delete-user', function ( t ) {
  t.plan( 1 )

  firebaseUser.delete( deleteOptions )
    .then( function () {
      t.ok( true, 'Deleted user' )
    } )
    .catch( function ( error ) {
      console.log( error )
      t.ok( false, 'Could not delete user' )
    } )
} )
