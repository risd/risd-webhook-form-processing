var debug = require( 'debug' )( 'firebase-user' )
var firebase = require( 'firebase-admin' )

module.exports = FirebaseUser

function FirebaseUser ( options ) {
  if ( ! ( this instanceof FirebaseUser ) ) return new FirebaseUser( options )

  if ( firebase.apps.length === 0 ) {
    firebase.initializeApp( {
      credential: firebase.credential.cert( options.credential ),
      databaseURL: `https:://${ options.project }.firebaseio.com`,
    } )
  }

  return {
    create: createUser,
    updatePassword: updatePassword,
    delete: deleteUser,
  }

  // { email, password } => Promise( user )
  function createUser ( options ) {
    return firebase.auth().createUser( options )
  }

  // { email, newPassword } => Promise( void )
  function updatePassword ( options ) {
    var email = options.email
    var newPassword = options.newPassword

    return firebase.auth().getUserByEmail( email )
      .then( function ( user ) {
        firebase.auth().updateUser( user.toJSON().uid, {
          email: email,
          password: newPassword,
        } )
      } )
  }

  // { email} => Promise( void )
  function deleteUser ( options ) {
    var email = options.email

    return firebase.auth().getUserByEmail( email )
      .then( function ( user ) {
        return firebase.auth().deleteUser( user.toJSON().uid )
      } )
  }
}
