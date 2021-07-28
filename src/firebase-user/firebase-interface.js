var debug = require( 'debug' )( 'firebase-user' )
var admin = require( 'firebase-admin' )
var client = require( 'firebase' )

module.exports = FirebaseUser

function FirebaseUser ( options ) {
  if ( ! ( this instanceof FirebaseUser ) ) return new FirebaseUser( options )

  if ( admin.apps.length === 0 ) {
    admin.initializeApp( {
      projectId: options.project,
      credential: admin.credential.cert( options.credential ),
      databaseURL: `https://${ options.project }.firebaseio.com`,
    } )
  }

  if ( client.apps.length === 0 ) {
    client.initializeApp( {
      apiKey: options.apiKey,
      projectId: options.project,
      databaseURL: `https://${ options.project }.firebaseio.com`,
    } )
  }

  return {
    create: createUser,
    updatePassword: updatePassword,
    delete: deleteUser,
  }

  // { email, password } => Promise( userRecord )
  function createUser ( options ) {
    return admin.auth().createUser( options )
  }

  // { email, oldPassword, newPassword } => Promise( void )
  function updatePassword ( options ) {
    var email = options.email
    var oldPassword = options.oldPassword
    var newPassword = options.newPassword

    return client.auth().signInWithEmailAndPassword( email, oldPassword )
      .then( function ( userCredential ) {
        return admin.auth().getUserByEmail( email )
      } )
      .then( function ( userRecord ) {
        return admin.auth().updateUser( userRecord.toJSON().uid, {
          email: email,
          password: newPassword
        } )
      } )
  }

  // { email, password } => Promise( void )
  function deleteUser ( options ) {
    var email = options.email
    var password = options.password

    return client.auth().signInWithEmailAndPassword( email, password )
      .then( function ( userCredential ) {
        return admin.auth().getUserByEmail( email )
      } )
      .then( function ( userRecord ) {
        return admin.auth().deleteUser( userRecord.toJSON().uid )
      } )
  }
}
