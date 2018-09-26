var debug = require( 'debug' )( 'slate-push' )
var request = require( 'request' )

module.exports = SlatePush;

/**
 * @param {object} options
 * @param {string} options.host
 * @param {string} options.formatId
 * @param {object} options.file
 * @param {object} options.file.data
 * @param {string} options.file.baseName
 * @param {string} options.file.extension
 * @param {object} options.account
 * @param {string} options.account.user
 * @param {string} options.account.password
 * @param {Function} complete
 */
function SlatePush ( options, complete ) {
  if ( ! ( this instanceof SlatePush ) ) return new SlatePush( options, complete )

  var slateRequestOptions = makeSlateRequestOptions( options )
  debug( 'slateRequestOptions' )
  debug( options.file.data )
  complete()
  // request( slateRequestOptions, requestHandler( complete ) )
}

function makeSlateRequestOptions ( options ) {
  return {
    method: 'POST',
    url: importLoadUrl( { host: options.host, formatId: options.formatId } ),
    headers: Object.assign(
      basicAuthHeader( { username: options.account.user, password: options.account.password } ),
      fileNameHeader( { baseFileName: options.file.baseName, fileExtension: options.file.extension } )
    ),
    body: toBuffer( options.file.data ),
  }
}

function toBuffer ( data ) {
  if ( typeof data === 'object' ) {
    var dataAsString = JSON.stringify( data )
  }
  else {
    var dataAsString = data;
  }

  return new Buffer( dataAsString )
}

function requestHandler ( complete ) {
  return function slateResponse ( error, response ) {
    if ( error ) console.log( error )
    else console.log( 'no-error' )
    // console.log( response )
    if ( response && response.body ) console.log( response.body )
    complete( error, response )
  }
}

/* helpers */

function importLoadUrl ( options ) {
  var host = options.host
  var formatId = options.formatId
  
  var urlPath = "manage/service/import?cmd=load"

  return `${ host }/${ urlPath }&format=${ formatId }`
}

function basicAuthHeader ( options ) {
  var username = options.username
  var password = options.password

  var hashContent = `${ username }:${ password }`
  var hash = Buffer.from( hashContent ).toString( 'base64' )
  var basicAuthValue = `Basic ${ hash }`
  var basicAuthHeader = { 'Authorization': basicAuthValue }
  return basicAuthHeader
}

function fileNameHeader ( options ) {
  var baseFileName = options.baseFileName
  var fileExtension = options.fileExtension
  var currentTime = new Date().getTime()
  var fileName = `${ baseFileName }--${ currentTime }.${ fileExtension }`
  return { 'Content-Disposition': `attachment; filename="${ fileName }"`  }
}
