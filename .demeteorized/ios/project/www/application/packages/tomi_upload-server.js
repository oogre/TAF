(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/tomi_upload-server/router.js                             //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
//Router.route('/upload', function () {                              // 1
//  var req = this.request;                                          // 2
//  var res = this.response;                                         // 3
//                                                                   // 4
//  console.log('doing something');                                  // 5
//                                                                   // 6
//  UploadServer.serve(req, res);                                    // 7
//}, { where: 'server' });                                           // 8
                                                                     // 9
                                                                     // 10
//Router.map(function () {                                           // 11
//  this.route('upload', {                                           // 12
//    path: '/upload/(.*)',                                          // 13
//    where: 'server',                                               // 14
//    action: function() {                                           // 15
//      UploadServer.serve(this.request, this.response);             // 16
//    }                                                              // 17
//  });                                                              // 18
//});                                                                // 19
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['tomi:upload-server'] = {};

})();
