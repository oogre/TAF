(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;

/* Package-scope variables */
var PDFDocument, fs;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/pascoual_pdfkitx/pdfkitx.server.js                       //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
PDFDocument = Npm.require('pdfkit');
PDFDocument.PX_PER_CM = 28.33;

fs = Npm.require('fs');

PDFDocument.prototype.write = function (filename) {
  this.pipe(fs.createWriteStream(filename));
  this.end();
}

///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['pascoual:pdfkitx'] = {}, {
  PDFDocument: PDFDocument
});

})();
