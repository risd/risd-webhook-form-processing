var formValidateHoneyPot = require( './form-validation-honey-pot.js' )
var debug = require( 'debug' )( 'form-to-firebase' )
var parseForm = require( './form-parse.js' )
var now = require( './util/now.js' )
var async = require( 'async' )

module.exports = FormToFirebase;

function FormToFirebase ( options ) {
  var webhookSiteName = options.webhookSiteName
  var formName = options.formName
  var validationPipeline = options.validation
  var saveFormSubmission = options.saveFormSubmission

  /**
   * Handle the Program Interest form request
   * 
   * @param  {object}   request
   * @param  {object}   response
   * @return {undefined}
   */
  return function handleProgramInterestForm ( request, response ) {
    var pipeline = [
        parseForm( request ),
        formValidateHoneyPot()
      ]
      .concat( validationPipeline )
      .concat( [
        pushFirebase( {
          origin: request._router.hostname,
          siteName: webhookSiteName,
          formName: formName,
        } )
      ] )

    async.waterfall( pipeline, handlePipeline )

    function handlePipeline ( error ) {
      if ( error ) {
        response.statusCode = 422;
        if ( error.hasOwnProperty( 'message' ) ) {
          var responseMessage = { error: error.message }
        }
        else {
          var responseMessage = { error: 'Could not process form.' }
        }
      }
      else {
        response.statusCode = 200;
        var responseMessage = { error: false }
      }
      debug( 'response-end' )
      debug( response.statusCode )
      debug( responseMessage )
      response.setHeader( 'Content-Type', 'application/json' )
      response.end( JSON.stringify( responseMessage ) )
    }

    function pushFirebase ( options ) {
      var origin = options.origin
      var siteName = options.siteName
      var formName = options.formName

      return function ( formData, complete ) {
        debug( 'transform-for-firebase' )

        var saveFormSubmissionOptions = {
          siteName: siteName,
          formName: formName,
          formData: Object.assign( {
            _form_submission_time: now(),
            _form_submission_origin: origin,
          }, formData ),
        }

        saveFormSubmission( saveFormSubmissionOptions, complete )
      }
    }
  }
}