var keyIsNotValue = require( './util/key-is-not-value.js' )
var debug = require( 'debug' )( 'firebase-to-slate' )
var FirebaseForms = require( './firebase-forms.js' )
var slatePush = require( './slate-push.js' )
var now = require( './util/now.js' )
var async = require( 'async' )

var IMPORTED = '_imported_into_slate'

module.exports = FirebaseToSlate;

/**
 * @param {object} options
 * @param {string} options.siteName
 * @param {string} options.formName
 * @param {object} options.firebase  Options for `src/firebase-forms`
 * @param {object} options.filterFns  Functions to filter firebase data for slate
 * @param {object} options.slate  Options for `src/slate-push`
 * @return {Function} complete
 */
function FirebaseToSlate ( options, complete ) {
  if ( ! ( this instanceof FirebaseToSlate ) ) return new FirebaseToSlate( options, complete )

  debug( 'options' )
  debug( options )

  var firebaseForms = FirebaseForms( options.firebase )
  var firebaseFormsOptions = { siteName: options.siteName, formName: options.formName }

  var pipeline = [
    firebaseForms.fetchSubmissions.bind( null, firebaseFormsOptions ),
    filterSubmissions( options.filterFns ),
    importIntoSlate( options.slate ),
    updateFirebaseSubmissions( firebaseFormsOptions ),
  ]

  async.waterfall( pipeline, complete )

  function updateFirebaseSubmissions ( options ) {
    var timestamp = now()
    return function ( submissions, complete ) {
      if ( submissions.length === 0 ) return complete()
      var updateOptions = Object.assign( {}, options, { updateKeyValues: submissions.reduce( markAsImported, {} ) } )
      firebaseForms.updateSubmissions( updateOptions, complete )
    }

    function markAsImported ( keyValueObject, submission ) {
      keyValueObject[ `${ submission.key }/${ IMPORTED }` ] = timestamp;
      return keyValueObject
    }
  }
}

function filterSubmissions( filterFns ) {
  filterFns = [ hasNotBeenImported() ].concat( filterFns )
  return function ( submissionsObject, complete ) {
    var submissions = Object.keys( submissionsObject ).reduce( toKeyValueArray, [] )
    filterFns.forEach( applyFilter )
    return complete( null, submissions )

    function applyFilter ( filterFn ) {
      submissions = submissions.filter( function ( submission ) {
        return filterFn( submission.value )
      } )
    }

    function toKeyValueArray ( previousArray, currentKey ) {
      return previousArray.concat( [ { key: currentKey, value: submissionsObject[ currentKey ] } ] )
    }
  }   
}

function importIntoSlate ( options ) {
  return function importIntoSlateTask ( submissions, complete ) {
    if ( submissions.length === 0 ) return complete( null, submissions )
    Object.assign( options.file, {
      data: { person: submissions.map( pluck( 'value' ) ) }
    } )
    slatePush( options, pushHandler )

    function pushHandler ( error ) {
      if ( error ) return complete( error )
      complete( null, submissions )
    }
  }
}

/* helpers */

function hasNotBeenImported () {
  return function isNotString ( obj ) {
    return typeof obj[ IMPORTED ] !== 'string';
  }
}

function pluck ( key ) {
  return function pluckKey ( obj ) {
    return obj[ key ]
  }
}