var env = require( '../env.js' )().asObject()

module.exports = {
  submitForm: configureFormSubmit,
}

// { path, formFields: [ { key, value } ], referer }
//   => { method, url, headers: { 'Content-Type', 'Content-Length', Referer } }
function configureFormSubmit ( options ) {
  var boundary = '--boundary'
  var path = options.path
  var formData = options.formFields
    .map( keyValueToFormData )
    .concat( [ '--' + boundary + '--\r\n' ] )
    .join( '' )
  var referer = options.referer || `http://localhost:${ env.server.port }/source-of-request/`

  return  {
    method: 'POST',
    url: `http://localhost:${ env.server.port }${ path }`,
    headers: {
      'Content-Type': `multipart/form-data; boundary=${ boundary }`,
      'Content-Length': formData.length,
      'Referer': referer,
    },
    body: formData,
  }

  function keyValueToFormData ( keyValue ) {
    return '--' + boundary + '\r\n' +
      'Content-Disposition: form-data; name="' + keyValue.key + '"\r\n' +
      '\r\n' +
      keyValue.value + '\r\n'
  }
}
