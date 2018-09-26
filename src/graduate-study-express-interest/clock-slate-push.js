var keyIsNotValue = require( '../util/key-is-not-value.js' )
var firebaseToSlate = require( '../firebase-to-slate.js' )
var keyIsValue = require( '../util/key-is-value.js' )
var names = require( './site-form-name.js' )

module.exports = ClockSlatePush;

/**
 * @param {object} options
 * @param {object} options.slate  Options for `src/slate-push`
 * @param {object} options.firebase  Options for `src/firebase-forms`
 * @param {Function} complete
 */
function ClockSlatePush ( options, complete ) {
  if ( ! ( this instanceof ClockSlatePush ) ) return new ClockSlatePush( options, complete )

  Object.assign( options, {
    siteName: names.site,
    formName: names.form,
    filterFns: filterFns(),
  } )
  
  Object.assign( options.slate, {
    file: {
      baseName: 'graduate-study--program-interest',
      extension: 'csv',
    },
  } )

  firebaseToSlate( options, complete )
}

function filterFns () {
  return [
    hasSubmissionOrigin( 'graduatestudy.risd.edu' ),
    doesNotUseTestEmail()
  ]
}

function hasSubmissionOrigin ( origin ) {
  return keyIsValue( '_form_submission_origin', origin )
}

function doesNotUseTestEmail () {
  return keyIsNotValue( 'email', 'test@risd.edu' )
}
