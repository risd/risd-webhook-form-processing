var debug = require( 'debug' )( 'routes' )
var moment = require( 'moment-timezone' )
var formidable = require( 'formidable' )
var async = require( 'async' )

var FirebaseDatabaseInterface = require( './firebase.js' )
var originHostMap = require( './origin-host-map.js' )
var pushSlate = require( './push-slate.js' )

module.exports = Routes;

/**
 * Produce routes to be consumed by an HTTP server to handle
 * request/response cycle.
 * 
 * @param {object} options
 * @param {object} options.slate
 * @param {object} options.firebase
 * @return {object} routes
 */
function Routes ( options ) {
  if ( ! ( this instanceof Routes ) ) return new Routes( options )
debug( options )
  var firebaseDatabaseInterface = FirebaseDatabaseInterface( options.firebase )
  
  return {
    'POST': {
      'graduatestudy.risd.systems': {
        '/express-program-interest/': configureProgramInterestFormHandler(),
      },
      'graduatestudy.risd.edu': {
        '/express-program-interest/': configureProgramInterestFormHandler(),
      },
      'localhost': {
        '/express-program-interest/': configureProgramInterestFormHandler(),
      },
    },
  }
  function configureProgramInterestFormHandler () {
    var webhookSiteName = 'graduatestudy.risd.systems'
    var formName = 'express-program-interest'

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
        validateProgramInterestForm(),
        pushFirebase( {
          origin: request._router.hostname,
          siteName: webhookSiteName,
          formName: formName,
        } ),
      ]

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
              _form_submission_time: moment().tz( 'America/New_York' ).format(),
              _form_submission_origin: origin,
            }, formData ),
          }

          firebaseDatabaseInterface.saveFormSubmission( saveFormSubmissionOptions, complete )
        }
      }
    } 
  }
}

function parseForm ( request ) {
  var form = new formidable.IncomingForm()
  return function pushForm ( complete ) {
    var formData = {}

    form
      .on( 'field', handleField )
      .on( 'error', handleError )
      .on( 'end', handleEnd )

    form.parse( request )

    function handleField ( field, value ) {
      formData[ field ] = value
    }

    function handleError ( error ) {
      complete( error )
    }

    function handleEnd () {
      debug( 'form-data' )
      debug( formData )
      complete( null, formData )
    }
  }
}

function validateProgramInterestForm () {
  var validationSets = {
    common: [
      'first_name',
      'last_name',
      'email',
      'program_of_interest',
      'country',
    ],
  }
  validationSets.international = validationSets.common.slice( 0 )
  validationSets.inTheUSNoViewbook = validationSets.common.concat( [
    'receive_viewbook',
  ] )
  validationSets.inTheUSYesViewbook = validationSets.inTheUSNoViewbook.concat( [
    'street_address',
    'city',
    'state',
    'postal_code',
  ] )

  return function validateIncomingForm ( formData, complete ) {
    debug( 'validate-form' )
    if ( typeof formData !== 'object' ) return complete( new Error( 'Invalid data request.' ) )

    // this field is hidden. if populated, the data is likely from a bot
    if ( formData[ 'honey_pot' ] ) {
      return complete( new Error( 'Could not process request. Smells like a bot.' ) )
    }

    Object.keys( formData ).forEach( function removeEmptyKeys ( formKey ) {
      if ( formData[ formKey ] === '' ) delete formData[ formKey ]
    } )

    var validationSet = false;
    if ( formData.country === 'US' ) {
      try {
        var receiveViewbook = JSON.parse( formData[ 'receive_viewbook' ] )
      } catch ( error ) {
        return complete( new Error( 'Invalid data request.' ) )
      }
      if ( receiveViewbook ) {
        validationSet = validationSets.inTheUSYesViewbook
      }
      else {
        validationSet = validationSets.inTheUSNoViewbook
      }
    }
    else {
      validationSet = validationSets.international
    }

    if ( ! validateDataWithSet( validationSet, formData ) ) {
      return complete( new Error( 'Invalid data request.' ) )
    }

    complete( null, formData )
  }

  function validateDataWithSet ( setToValidate, dataToValidate ) {
    // remove keys that are not in the validate sets
    debug( 'set' )
    debug( setToValidate )
    Object.keys( dataToValidate ).forEach( removeKeyNotInSet )

    var validKeys = setToValidate.filter( dataHasValidKey )
    return validKeys.length === setToValidate.length

    function dataHasValidKey ( setKey ) {
      return dataToValidate[ setKey ]
    }

    function removeKeyNotInSet ( dataKey ) {
      debug( 'key' )
      debug( dataKey )
      if ( setToValidate.indexOf( dataKey ) === -1 ) {
        delete dataToValidate[ dataKey ]
      }
    }
  }
}

function prepForSlate ( origin ) {
  function transformForSlate ( formData, complete ) {
    debug( 'transform-for-slate' )
    complete( null, { data: formData, origin: orign } )  
  }
}
