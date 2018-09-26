var debug = require( 'debug' )( 'form-validation' )

module.exports = ValidateProgramInterestForm;

function ValidateProgramInterestForm () {
  if ( ! ( this instanceof ValidateProgramInterestForm ) ) return new ValidateProgramInterestForm()

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
