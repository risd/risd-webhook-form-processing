var debug = require( 'debug' )( 'firebase' )
var firebase = require( 'firebase-admin' )
var async = require( 'async' )

module.exports = FirebaseForms;

/**
 * @param {object} options
 * @param {object} options.project     Name of the Firebase project
 * @param {object} options.credential  Object that represents Firebase project cert
 * @return {object} api                The interface into Firebase useful for saving and fetching form data
 * @return {object} api.saveSubmission    Save form submission
 * @return {object} api.fetchSubmissions  Fetch all submissions for a form
 * @return {object} api.updateSubmissions  Update all submission keys with the given value
 */
function FirebaseForms ( options ) {
  if ( ! ( this instanceof FirebaseForms ) ) return new FirebaseForms( options )

  if ( firebase.apps.length === 0 ) {
    firebase.initializeApp( {
      credential: firebase.credential.cert( options.credential ),
      databaseURL: `https:://${ options.project }.firebaseio.com`,
    } )
  }
  
  // store site references mapped by the name of the site
  var siteNameToDataRef = {}

  return {
    saveSubmission: saveFormSubmission,
    fetchSubmissions: fetchFormSubmissions,
    updateSubmissions: updateFormSubmissions,
  }

  // site-name : string => ref : /bucket/{site-name}/{site-key}/dev/forms
  function getDataRefForSiteName ( siteName, complete ) {
    debug( 'get-data-ref-for-site-name' )
    debug( siteName )
    debug( escapeName( siteName ) )
    if ( siteNameToDataRef.hasOwnProperty( siteName ) ) return complete( null, siteNameToDataRef[ siteName ] )

    var keyRef = firebase.database().ref( `management/sites/${ escapeName( siteName ) }/key` )
    debug( 'key ref' )
    debug( keyRef.toString() )
    keyRef.once( 'value', function onSiteKeySnapshot ( keySnapshot ) {
        var keyValue = keySnapshot.val()
        debug( 'key-value' )
        debug( keyValue )
        if ( ! keyValue ) return complete( new Error( 'invalid key' ) )
        var siteDataRef = firebase.database().ref( `/buckets/${ escapeName( siteName ) }/${ keyValue }/dev/forms` )
        siteNameToDataRef[ siteName ] = siteDataRef;
        complete( null, siteDataRef )
      },
      function onSiteKeySnapshotError ( error ) {
        return complete( error )
      } )
  }

  // saves to /bucket/{site-name}/{site-key}/dev/forms/{form-name}/submissions
  function saveFormSubmission ( options, complete ) {
    debug( 'save-form-submission' )
    var siteName = options.siteName
    var formName = options.formName
    var formData = options.formData

    async.waterfall( [
      getDataRefForSiteName.bind( null, siteName ),
      saveFormDataWithDataRef,
    ], handleSaveFormDataPipeline )

    function handleSaveFormDataPipeline ( error ) {
      debug( 'handle-save-form-data-pipeline' )
      debug( error )
      if ( error ) return complete( error )
      complete()
    }

    function saveFormDataWithDataRef ( siteDataRef, subComplete ) {
      debug( 'save-form-with-data-ref' )
      debug( formData )
      var formSubmissionsRef = siteDataRef.child( `${ formName }/submissions` ).push()
      formSubmissionsRef.set( formData, subComplete )
    }
  }

  // fetches from /bucket/{site-name}/{site-key}/dev/forms/{form-name}/submissions
  function fetchFormSubmissions ( options, complete ) {
    debug( 'fetch-form-submissions' )
    debug( options )
    var siteName = options.siteName
    var formName = options.formName

    async.waterfall( [
      getDataRefForSiteName.bind( null, siteName ),
      fetchFormSubmissionsWithDataRef,
    ], handleFetchFormSubmissionsPipeline )

    function handleFetchFormSubmissionsPipeline ( error, submissions ) {
      if ( error ) return complete( error )
      complete( null, submissions )
    }

    function fetchFormSubmissionsWithDataRef ( siteDataRef, subComplete ) {
      siteDataRef.child( `${ formName }/submissions` )
        .once( 'value', function handleSubmissionsSnapshot ( submissionsSnapshot ) {
          var submissions = submissionsSnapshot.val()
          subComplete( null, submissions )
        },
        function handleSubmissionsSnapshotError ( error ) {
          subComplete( error )
        } )
    }
  }

  // updates /bucket/{site-name}/{site-key}/dev/forms/{form-name}/submissions
  function updateFormSubmissions ( options, complete ) {
    debug( 'update-form-submissions' )
    var siteName = options.siteName
    var formName = options.formName
    var updateKeyValues = options.updateKeyValues

    async.waterfall( [
      getDataRefForSiteName.bind( null, siteName ),
      updateFormSubmissionsWithDataRef
    ], complete )

    function updateFormSubmissionsWithDataRef ( siteDataRef, subComplete ) {
      debug( 'updateKeyValues' )
      debug( updateKeyValues )
      siteDataRef.child( `${ formName }/submissions` )
        .update( updateKeyValues, subComplete )
    }

  }

  function escapeName ( siteName ) {
    return siteName.replace( /\./g, ',1' )
  }
}
