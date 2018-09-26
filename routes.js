var debug = require( 'debug' )( 'routes' )
var async = require( 'async' )

var FirebaseForms = require( './src/firebase-forms.js' )
var gradstudyProgramInterestForm = require( './src/graduate-study-express-interest/route-save-form.js' )


module.exports = Routes;

/**
 * Produce routes to be consumed by an HTTP server to handle
 * request/response cycle.
 * 
 * @param {object} options
 * @param {object} options.firebase
 * @return {object} routes
 */
function Routes ( options ) {
  if ( ! ( this instanceof Routes ) ) return new Routes( options )

  var firebaseForms = FirebaseForms( options.firebase )
  var gradstudyFormSave = gradstudyProgramInterestForm( {
    saveFormSubmission: firebaseForms.saveSubmission,
  } )
  
  return {
    'POST': {
      'graduatestudy.risd.systems': {
        '/express-program-interest/': gradstudyFormSave,
      },
      'graduatestudy.risd.edu': {
        '/express-program-interest/': gradstudyFormSave,
      },
      'localhost': {
        '/express-program-interest/': gradstudyFormSave,
      },
    },
  }
}
