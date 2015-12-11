(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;

/* Package-scope variables */
var PDFDocument, fs;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                          //
// packages/pascoual_pdfkit/pdfkitWrapper.js                                                //
//                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////
                                                                                            //
PDFDocument = Npm.require('pdfkit');                                                        // 1
PDFDocument.PX_PER_CM = 28.33;                                                              // 2
                                                                                            // 3
fs = Npm.require('fs');                                                                     // 4
fs.writeFileFiber = Meteor.wrapAsync(fs.writeFile.bind(fs));                                // 5
                                                                                            // 6
// New output methode with a callBack respecting the classic params (err, result)           // 7
PDFDocument.prototype.outputForMeteor = function(fn) {                                      // 8
  return this.finalize((function(_this) {                                                   // 9
    return function() {                                                                     // 10
      var out;                                                                              // 11
      out = [];                                                                             // 12
      _this.generateHeader(out);                                                            // 13
      return _this.generateBody(out, function() {                                           // 14
        var k, ret, _i, _len;                                                               // 15
        _this.generateXRef(out);                                                            // 16
        _this.generateTrailer(out);                                                         // 17
        ret = [];                                                                           // 18
        for (_i = 0, _len = out.length; _i < _len; _i++) {                                  // 19
          k = out[_i];                                                                      // 20
          ret.push(k + '\n');                                                               // 21
        }                                                                                   // 22
        // add "null ," to get a classic callBack prototype !                               // 23
        return fn(null, new Buffer(ret.join(''), 'binary'));                                // 24
      });                                                                                   // 25
    };                                                                                      // 26
  })(this));                                                                                // 27
};                                                                                          // 28
                                                                                            // 29
/**                                                                                         // 30
 * Sync but non blocking thread (Fibered)                                                   // 31
 */                                                                                         // 32
PDFDocument.prototype.outputSync = Meteor.wrapAsync(PDFDocument.prototype.outputForMeteor);
PDFDocument.prototype.writeSync = function (filename) {return fs.writeFileFiber(filename, this.outputSync(), 'binary');}
                                                                                            // 35
                                                                                            // 36
//////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['pascoual:pdfkit'] = {
  PDFDocument: PDFDocument
};

})();

//# sourceMappingURL=pascoual_pdfkit.js.map
