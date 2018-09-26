var debug = require( 'debug' )( 'form-validation-honey-pot' )

module.exports = ValidateFormDataHoneyPot;

function ValidateFormDataHoneyPot () {
  if ( ! ( this instanceof ValidateFormDataHoneyPot ) ) return new ValidateFormDataHoneyPot()
  
  return validate;

  function validate ( formData, complete ) {
    debug( 'validate-form' )
    if ( typeof formData !== 'object' ) return complete( new Error( 'Invalid data request.' ) )

    // this field is hidden. if populated, the data is likely from a bot
    if ( formData[ 'honey_pot' ] ) {
      return complete( new Error( 'Could not process request. Smells like a bot.' ) )
    }

    return complete( null, formData )
  }
}
