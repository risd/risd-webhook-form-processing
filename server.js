var debug = require( 'debug' )( 'server' )
var url = require( 'url' )
var http = require( 'http' )

module.exports = Server;

function Server ( options ) {
  if ( ! ( this instanceof Server ) ) return new Server( options )
  return createServer( {
    routes: options.routes,
    port: options.port || 9000,
  } )
}

function createServer ( options ) {
  var port = options.port
  var routes = options.routes
  var server = http.createServer( handleRequests )
  server.listen( port )
  debug( 'listening on port ' + port)
  return server;

  function handleRequests ( request, response ) {
    var methods = Object.keys( routes )
    var handler = methods.map( handleMethod ).reduce( function ( previous, current ) { return current }, undefined )

    if ( handler ) return handler( request, response )
    else return errorResponse( 400 );

    function handleMethod ( method ) {
      var hostsForMethod = routes[ method ]
      var hosts = Object.keys( hostsForMethod )
      try {
        var parsedUrl = url.parse( request.headers.referer )
        var hostname = parsedUrl.hostname
      } catch ( error ) {
        return errorResponse( 400 )
      }
      if ( hosts.indexOf( hostname ) > -1 ) {
        var paths = Object.keys( routes[ method ][ hostname ] )
        if ( paths.indexOf( request.url ) > -1 ) {
          // pass the request resolutions variables into a local object
          request._router = {
            method: 'POST',
            hostname: hostname,
            url: request.url,
          }
          
          // setup cors for the response, based on the router variables
          response.setHeader( 'Access-Control-Allow-Origin', `${ parsedUrl.protocol }//${ parsedUrl.host }` )
          response.setHeader( 'Vary', 'Origin' )
          return routes[ method ][ hostname ][ request.url ]
        }
        else {
          return errorResponse( 403 )
        }
      }
      else {
        // method is not supported for host
        return errorResponse( 403 )
      }
    }

    function errorResponse ( code ) {
      return function errorHandler ( request, response ) {
        response.statusCode = code;
        response.end()
      }
    }
  }
}
