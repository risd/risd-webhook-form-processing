var debug = require( 'debug' )( 'firebase-user-routes' )
var FirebaseUser = require( './firebase-interface' )
var formValidateHoneyPot = require( '../form-validation-honey-pot.js' )
var parseForm = require( '../form-parse.js' )
var async = require( 'async' )

module.exports = FirebaseUserRoutes

/**
 * Routes to create/update/delete user
 * 
 * @param {object} options
 * @param {string} options.project      name of the project
 * @param {string} options.credential  certificate for the project
 */
function FirebaseUserRoutes ( options ) {
  if ( ! ( this instanceof FirebaseUserRoutes ) ) return new FirebaseUserRoutes( options )

  var firebaseUser = FirebaseUser( options )

  return {
    create: baseUserRoute( {
      validationPipeline: [
        validateFieldsHaveValue( [ 'email', 'password' ] ),
      ],
      postValidationPipeline: [
        createUser(),
      ],
    } ),
    update: baseUserRoute( {
      validationPipeline: [
        validateFieldsHaveValue( [ 'email', 'newPassword' ] ),
      ],
      postValidationPipeline: [
        updateUser(),
      ],
    } ),
    delete: baseUserRoute( {
      validationPipeline: [
        validateFieldsHaveValue( [ 'email' ] ),
      ],
      postValidationPipeline: [
        deleteUser(),
      ],
    } ),
  }

  function baseUserRoute ( options ) {
    if ( ! options ) options = {}
    var validationPipeline = options.validation || []
    var postValidationPipeline = options.postValidation || []

    return function userRouteHandler ( request, response ) {
      var pipeline = [
        parseForm( request ),
        formValidateHoneyPot(),
      ].concat( validationPipeline )
       .concat( postValidationPipeline )

      async.waterfall( pipeline, handlePipeline )

      function handlePipeline ( error ) {
        if ( error ) {
          response.statusCode = 422
          if ( error.hasOwnProperty( 'message' ) ) {
            var responseMessage = { error: error.message }
          }
          else {
            var responseMessage = { error: 'Could not process form.' }
          }
        }
        else {
          response.statusCode = 200
          var responseMessage = { error: false }
        }
        debug( 'response-end' )
        debug( response.statusCode )
        debug( responseMessage )

        response.setHeader( 'Content-Type', 'application/json' )
        response.end( JSON.stringify( responseMessage ) )
      }
    }
  }

  function validateFieldsHaveValue ( verify ) {
    return function ( formData, complete ) {
      var verified = verify.map( trueIfExists ).filter( removeFalseValues )

      if ( verified.length === verify.length ) {
        return complete( null, formData )
      }
      else {
        return complete( new Error( 'Invalid form data.' ) )
      }

      function trueIfExists ( key ) {
        if ( formData[ key ] && formData[ key ].length > 0 ) return true
        return false
      }

      function removeFalseValues ( value ) {
        return value === false ? false : true
      }
    }
  }

  function createUser () {
    return function createUserFn ( formData, complete ) {
      firebaseUser.create( formData )
        .then( complete )
        .catch( complete )
    }
  }

  function updateUser () {
    return function updateUserFn ( formData, complete ) {
      firebaseUser.updatePassword( formData )
        .then( complete )
        .catch( complete )
    }
  }

  function deleteUser () {
    return function deleteUserFn ( formData, complete ) {
      firebaseUser.delete( formData )
        .then( complete )
        .catch( complete )
    }
  }
}
