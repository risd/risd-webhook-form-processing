var env = require( '../env.js' )()
var configuration = env.asObject()

var testEnv = require( './env.js' )()
var testConfiguration = testEnv.asObject()

var requestData = '' +
  '-----------------------------1864885661968700961703604290\r\n' +
  'Content-Disposition: form-data; name="first_name"\r\n' +
  '\r\n' +
  'automated test first\r\n' +
  '-----------------------------1864885661968700961703604290\r\n' +
  'Content-Disposition: form-data; name="last_name"\r\n' +
  '\r\n' +
  'autoamted test second\r\n' +
  '-----------------------------1864885661968700961703604290\r\n' +
  'Content-Disposition: form-data; name="email"\r\n' +
  '\r\n' +
  'mail@domain.com\r\n' +
  '-----------------------------1864885661968700961703604290\r\n' +
  'Content-Disposition: form-data; name="program_of_interest"\r\n' +
  '\r\n' +
  'Architecture\r\n' +
  '-----------------------------1864885661968700961703604290\r\n' +
  'Content-Disposition: form-data; name="country"\r\n' +
  '\r\n' +
  'US\r\n' +
  '-----------------------------1864885661968700961703604290\r\n' +
  'Content-Disposition: form-data; name="receive_viewbook"\r\n' +
  '\r\n' +
  'false\r\n' +
  '-----------------------------1864885661968700961703604290\r\n' +
  'Content-Disposition: form-data; name="street_address"\r\n' +
  '\r\n' +
  '\r\n' +
  '-----------------------------1864885661968700961703604290\r\n' +
  'Content-Disposition: form-data; name="city"\r\n' +
  '\r\n' +
  '\r\n' +
  '-----------------------------1864885661968700961703604290\r\n' +
  'Content-Disposition: form-data; name="state"\r\n' +
  '\r\n' +
  '\r\n' +
  '-----------------------------1864885661968700961703604290\r\n' +
  'Content-Disposition: form-data; name="postal_code"\r\n' +
  '\r\n' +
  '\r\n' +
  '-----------------------------1864885661968700961703604290\r\n' +
  'Content-Disposition: form-data; name="honey_pot"\r\n' +
  '\r\n' +
  '\r\n' +
  '-----------------------------1864885661968700961703604290--\r\n'

var options = {
  method: 'POST',
  url: `http://localhost:${ configuration.server.port }/express-program-interest/`,
  headers: {
    'Content-Type': 'multipart/form-data; boundary=---------------------------1864885661968700961703604290',
    'Content-Length': requestData.length,
    'Referer': `http://${ testConfiguration.validDomain }/program-interest-form/`,
  },
  body: requestData,
}

module.exports = Object.assign( {}, options )
