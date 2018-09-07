var requestData = `------WebKitFormBoundary6PamrbinRfQhMgIY
Content-Disposition: form-data; name="first_name"


------WebKitFormBoundary6PamrbinRfQhMgIY
Content-Disposition: form-data; name="last_name"


------WebKitFormBoundary6PamrbinRfQhMgIY
Content-Disposition: form-data; name="email"


------WebKitFormBoundary6PamrbinRfQhMgIY
Content-Disposition: form-data; name="program_of_interest"

graphic_design
------WebKitFormBoundary6PamrbinRfQhMgIY
Content-Disposition: form-data; name="country"


------WebKitFormBoundary6PamrbinRfQhMgIY
Content-Disposition: form-data; name="street_address"


------WebKitFormBoundary6PamrbinRfQhMgIY
Content-Disposition: form-data; name="city"


------WebKitFormBoundary6PamrbinRfQhMgIY
Content-Disposition: form-data; name="state"

washington
------WebKitFormBoundary6PamrbinRfQhMgIY
Content-Disposition: form-data; name="postal_code"


------WebKitFormBoundary6PamrbinRfQhMgIY
Content-Disposition: form-data; name="honey_pot"


------WebKitFormBoundary6PamrbinRfQhMgIY--`

var options = {
  method: 'POST',
  url: 'http://localhost:9000/express-program-interest/',
  headers: {
    'Content-Type': 'multipart/form-data; ; boundary=----WebKitFormBoundary6PamrbinRfQhMgIY',
    'Content-Length': Buffer.byteLength( requestData ),
    'Referer': 'http://localhost:8000/program-interest-form/',
  },
  body: requestData,
}

module.exports = Object.assign( {}, options )