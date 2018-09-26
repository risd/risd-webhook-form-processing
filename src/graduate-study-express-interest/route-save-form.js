var formToFirebase = require( '../form-to-firebase.js' )
var formValidation = require( './form-validation.js' )
var names = require( './site-form-name.js' )

module.exports = GraduateStudySaveFormRoute;

/**
 * @param {object} options
 * @param {Function} options.saveFormSubmission
 * @return {Function} FormToFirebase
 */
function GraduateStudySaveFormRoute ( options ) {
  if ( ! ( this instanceof GraduateStudySaveFormRoute ) ) return new GraduateStudySaveFormRoute( options )
  
  return formToFirebase( Object.assign( options, {
    webhookSiteName: names.site,
    formName: names.form,
    validation: [ formValidation() ],
  } ) )
}
