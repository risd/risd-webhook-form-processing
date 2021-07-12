var test = require( 'tape' )
var firebase = require( 'firebase-admin' )

test( 'close-firebase', function ( t ) {
  t.plan( 1 )

  if ( firebase.apps.length === 0 ) {
    t.ok( true, 'No firebase to close' )
  }
  else {
    var closers = firebase.apps.map( function ( app ) {
      return new Promise( function ( resolve, reject ) {
        app.delete()
          .then( resolve )
          .catch( reject )
      } )
    } )

    Promise.all( closers )
      .then( function () {
        t.ok( true, 'Closed all firebase apps' )
      } )
      .catch( function () {
        t.error( error, 'Failed to close all firebase apps.' )
      } )
  }
} )
