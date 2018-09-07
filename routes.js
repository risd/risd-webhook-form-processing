var async = require( 'async' )
var debug = require( 'debug' )( 'routes' )
var formidable = require( 'formidable' )

var pushSlate = require( './push-slate.js' )
var originHostMap = require( './origin-host-map.js' )

module.exports = Routes;

/**
 * Produce routes to be consumed by an HTTP server to handle
 * request/response cycle.
 * 
 * @param {object} options
 * @param {object} options.slate
 * @return {object} routes
 */
function Routes ( options ) {
  if ( ! ( this instanceof Routes ) ) return new Routes( options )
  
  return {
    'POST': {
      'graudatestudy.risd.systems': {
        '/express-program-interest/': handleProgramInterestForm
      },
      'graudatestudy.risd.edu': {
        '/express-program-interest/': handleProgramInterestForm
      },
      'localhost': {
        '/express-program-interest/': handleProgramInterestForm
      },
    },
  }

  /**
   * Handle the Program Interest form request
   * 
   * @param  {object}   request
   * @param  {object}   response
   * @return {undefined}
   */
  function handleProgramInterestForm ( request, response ) {
    var pipeline = [ parseForm( request ), validateForm, transformForSlate /*, pushSlate*/ ]

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

    function validateForm ( formData, complete ) {
      debug( 'validate-form' )
      if ( formData[ 'honey_pot' ] ) {
        complete( new Error( 'Could not process request. Smells like a bot.' ) )
      }
      else {
        complete( null, formData )
      }
    }

    function transformForSlate ( formData, complete ) {
      debug( 'transform-for-slate' )
      complete( null, { data: formData, origin: request._router.hostname } )  
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
}
