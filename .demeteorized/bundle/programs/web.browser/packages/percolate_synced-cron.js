(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;

/* Package-scope variables */
var SyncedCron, Later;



/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['percolate:synced-cron'] = {};

})();
