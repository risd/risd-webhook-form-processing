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
  oldPassword: options.password,
  newPassword: 'password!1',
}

var deleteOptions = {
  email: options.email,
  password: updateOptions.newPassword,
}

// for some reason the user attempts to get deleted 2x.
// the first time it deletes successfully.
// the second time it throws an error.
// since its not coming from my first call directly,
// i can't catch the error. so this will catch it.
// if the error is that the user is not found,
// and our internal deleted user flag is already
// set to true, then we can just return.
var successfullyDeletedUser
process.on( 'uncaughtException', ( error ) => {
  if ( error.errorInfo.code === 'auth/user-not-found' &&
        successfullyDeletedUser === true ) {
    return
  }
  console.log( error )
} )

test( 'create-user', function ( t ) {
  t.plan( 1 )
  
  firebaseUser.create( options )
    .then( function ( user ) {
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
      successfullyDeletedUser = true
      t.ok( true, 'Deleted user' )
    } )
    .catch( function ( error ) {
      successfullyDeletedUser = false
      t.ok( false, 'Could not delete user' )
    } )
} )
