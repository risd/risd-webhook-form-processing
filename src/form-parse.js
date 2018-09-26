var debug = require( 'debug' )( 'form-parse' )
var formidable = require( 'formidable' )

module.exports = FormParse;

function FormParse ( request ) {
  if ( ! ( this instanceof FormParse ) ) return new FormParse( request )
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
