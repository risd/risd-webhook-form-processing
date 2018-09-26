var moment = require( 'moment-timezone' )

module.exports = now;

function now () {
  return moment().tz( 'America/New_York' ).format()
}
