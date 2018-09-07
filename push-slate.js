var debug = require( 'debug' )( 'manual' )
var request = require( 'request' )

var originHostMap = require( './origin-host-map.js' )

module.exports = PushSlate;

/**
 * @param {object} options
 * @param {object} options.data
 * @param {string} options.origin
 * @param {object} options.account
 * @param {string} options.account.user
 * @param {string} options.account.password
 * @param {Function} complete
 */
function PushSlate ( options, complete ) {
  if ( ! ( this instanceof PushSlate ) ) return new PushSlate( options, complete )

  var slateRequestOptions = makeSlateRequestOptions( options )

  request( slateRequestOptions, requestHandler( complete ) )
}

function makeSlateRequestOptions ( options ) {
  var dataToPush = toBuffer( options.data );
  var dataOrigin = options.origin;
  var slateAccount = options.account;
  return {
    method: 'POST',
    url: slateUrl( { origin: options.origin } ),
    headers: Object.assign(
      basicAuthHeader( { username: slateAccount.user, password: slateAccount.password } ),
      fileNameHeader( { baseFileName: 'graduate-study--program-interest', fileExtension: 'csv' } )
    ),
    body: dataToPush,
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

function slateUrl ( options ) {
  var dataOrigin = options.origin;

  var formatId = "113efb49-5a30-4aba-a228-0b94d4a75eb2"
  try {
    var host = originHostMap[ dataOrigin ]
  } catch ( error ) {
    throw new Error( 'Origin must be defined within the slate URL mapping.' )
  }
  
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

function sampleDataSource ( name ) {
  var fs = require( 'fs' )
  var datum = fs.readFileSync( `sample-data/${ name }` )
  return datum
}
