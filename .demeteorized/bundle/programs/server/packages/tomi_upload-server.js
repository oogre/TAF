(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var RoutePolicy = Package.routepolicy.RoutePolicy;

/* Package-scope variables */
var UploadServer;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/tomi_upload-server/upload_server.js                                                                   //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
var formidable = Npm.require('formidable');                                                                       // 1
var http = Npm.require('http');                                                                                   // 2
var sys = Npm.require('sys');                                                                                     // 3
                                                                                                                  // 4
//var connect = Npm.require('connect');                                                                           // 5
var url = Npm.require('url');                                                                                     // 6
var path = Npm.require('path');                                                                                   // 7
var fs = Npm.require('fs');                                                                                       // 8
var Fiber = Npm.require('fibers');                                                                                // 9
                                                                                                                  // 10
var _existsSync = fs.existsSync || path.existsSync;                                                               // 11
var imageMagick = Npm.require('imagemagick');                                                                     // 12
                                                                                                                  // 13
var options = {                                                                                                   // 14
  /** @type String*/                                                                                              // 15
  tmpDir: null,                                                                                                   // 16
  /** @type String*/                                                                                              // 17
  uploadDir: null,                                                                                                // 18
  uploadUrl: '/upload/',                                                                                          // 19
  checkCreateDirectories: false,                                                                                  // 20
  maxPostSize: 11000000000, // 11 GB                                                                              // 21
  minFileSize: 1,                                                                                                 // 22
  maxFileSize: 10000000000, // 10 GB                                                                              // 23
  acceptFileTypes: /.+/i,                                                                                         // 24
  // Files not matched by this regular expression force a download dialog,                                        // 25
  // to prevent executing any scripts in the context of the service domain:                                       // 26
  inlineFileTypes: /\.(gif|jpe?g|png)$/i,                                                                         // 27
  imageTypes: /\.(gif|jpe?g|png)$/i,                                                                              // 28
  imageVersions: {                                                                                                // 29
    thumbnail: {                                                                                                  // 30
      width: 200,                                                                                                 // 31
      height: 200,                                                                                                // 32
    },                                                                                                            // 33
  },                                                                                                              // 34
  crop: false,                                                                                                    // 35
  overwrite: false,                                                                                               // 36
  cacheTime: 86400,                                                                                               // 37
  getDirectory: function (fileInfo, formData) {                                                                   // 38
    return ""                                                                                                     // 39
  },                                                                                                              // 40
  getFileName: function (fileInfo, formData) {                                                                    // 41
    return fileInfo.name;                                                                                         // 42
  },                                                                                                              // 43
  finished: function () {                                                                                         // 44
  },                                                                                                              // 45
  validateRequest: function () {                                                                                  // 46
    return null;                                                                                                  // 47
  },                                                                                                              // 48
  validateFile: function () {                                                                                     // 49
    return null;                                                                                                  // 50
  },                                                                                                              // 51
  accessControl: {                                                                                                // 52
    allowOrigin: '*',                                                                                             // 53
    allowMethods: 'OPTIONS, HEAD, GET, POST, PUT, DELETE',                                                        // 54
    allowHeaders: 'Content-Type, Content-Range, Content-Disposition'                                              // 55
  },                                                                                                              // 56
  mimeTypes: {                                                                                                    // 57
    "html": "text/html",                                                                                          // 58
    "jpeg": "image/jpeg",                                                                                         // 59
    "jpg": "image/jpeg",                                                                                          // 60
    "png": "image/png",                                                                                           // 61
    "gif": "image/gif",                                                                                           // 62
    "js": "text/javascript",                                                                                      // 63
    "css": "text/css",                                                                                            // 64
    "pdf": "application/pdf",                                                                                     // 65
    "doc": "application/msword",                                                                                  // 66
    "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",                            // 67
    "zip": "application/zip, application/x-compressed-zip",                                                       // 68
    "txt": "text/plain"                                                                                           // 69
  }                                                                                                               // 70
  /* Uncomment and edit this section to provide the service via HTTPS:                                            // 71
   ssl: {                                                                                                         // 72
   key: fs.readFileSync('/Applications/XAMPP/etc/ssl.key/server.key'),                                            // 73
   cert: fs.readFileSync('/Applications/XAMPP/etc/ssl.crt/server.crt')                                            // 74
   },                                                                                                             // 75
   */                                                                                                             // 76
};                                                                                                                // 77
                                                                                                                  // 78
                                                                                                                  // 79
UploadServer = {                                                                                                  // 80
  getOptions: function()                                                                                          // 81
  {                                                                                                               // 82
    return options;                                                                                               // 83
  },                                                                                                              // 84
  init: function (opts) {                                                                                         // 85
    if (opts.checkCreateDirectories != null) options.checkCreateDirectories = opts.checkCreateDirectories;        // 86
                                                                                                                  // 87
    if (opts.tmpDir == null) {                                                                                    // 88
      throw new Meteor.Error('Temporary directory needs to be assigned!');                                        // 89
    } else {                                                                                                      // 90
      options.tmpDir = opts.tmpDir;                                                                               // 91
    }                                                                                                             // 92
                                                                                                                  // 93
    if (opts.cacheTime != null) {                                                                                 // 94
      options.cacheTime = opts.cacheTime;                                                                         // 95
    }                                                                                                             // 96
                                                                                                                  // 97
    if (opts.mimeTypes != null) {                                                                                 // 98
      for (var key in opts.mimeTypes) {                                                                           // 99
        options.mimeTypes[key] = opts.mimeTypes[key];                                                             // 100
      }                                                                                                           // 101
    }                                                                                                             // 102
                                                                                                                  // 103
    if (opts.checkCreateDirectories) {                                                                            // 104
      checkCreateDirectory(options.tmpDir);                                                                       // 105
    }                                                                                                             // 106
                                                                                                                  // 107
    if (opts.uploadDir == null) {                                                                                 // 108
      throw new Meteor.Error('Upload directory needs to be assigned!');                                           // 109
    } else {                                                                                                      // 110
      options.uploadDir = opts.uploadDir;                                                                         // 111
    }                                                                                                             // 112
                                                                                                                  // 113
    if (opts.uploadUrl) {                                                                                         // 114
      options.uploadUrl = opts.uploadUrl;                                                                         // 115
    }                                                                                                             // 116
                                                                                                                  // 117
    if (options.checkCreateDirectories) {                                                                         // 118
      checkCreateDirectory(options.uploadDir);                                                                    // 119
    }                                                                                                             // 120
                                                                                                                  // 121
    if (opts.maxPostSize != null) options.maxPostSize = opts.maxPostSize;                                         // 122
    if (opts.minFileSize != null) options.minFileSize = opts.minFileSize;                                         // 123
    if (opts.maxFileSize != null) options.maxFileSize = opts.maxFileSize;                                         // 124
    if (opts.acceptFileTypes != null) options.acceptFileTypes = opts.acceptFileTypes;                             // 125
    if (opts.imageTypes != null) options.imageTypes = opts.imageTypes;                                            // 126
    if (opts.crop != null) options.crop = opts.crop;                                                              // 127
    if (opts.validateRequest != null) options.validateRequest = opts.validateRequest;                             // 128
    if (opts.validateFile != null) options.validateFile = opts.validateFile;                                      // 129
    if (opts.getDirectory != null) options.getDirectory = opts.getDirectory;                                      // 130
    if (opts.getFileName != null) options.getFileName = opts.getFileName;                                         // 131
    if (opts.finished != null) options.finished = opts.finished;                                                  // 132
    if (opts.overwrite != null) options.overwrite = opts.overwrite;                                               // 133
                                                                                                                  // 134
    if (opts.uploadUrl) options.uploadUrl = opts.uploadUrl;                                                       // 135
                                                                                                                  // 136
    if (opts.imageVersions != null) options.imageVersions = opts.imageVersions                                    // 137
    else options.imageVersions = [];                                                                              // 138
                                                                                                                  // 139
    if (options.uploadUrl != "/upload/") {                                                                        // 140
      console.log("Custom upload url setup to: " + options.uploadUrl);                                            // 141
    }                                                                                                             // 142
                                                                                                                  // 143
    RoutePolicy.declare(options.uploadUrl, 'network');                                                            // 144
    WebApp.connectHandlers.use(options.uploadUrl, UploadServer.serve);                                            // 145
  },                                                                                                              // 146
  delete: function (filePath) {                                                                                   // 147
                                                                                                                  // 148
    // make sure paths are correct                                                                                // 149
    fs.unlinkSync(path.join(options.uploadDir, filePath));                                                        // 150
                                                                                                                  // 151
    // unlink all imageVersions also                                                                              // 152
    if (options.imageVersions) {                                                                                  // 153
    	var subFolders = Object.keys(options.imageVersions);                                                         // 154
 	for(var i=0; i<subFolders.length; i++) {                                                                        // 155
	    fs.unlinkSync(path.join(options.uploadDir, subFolders[i], filePath));                                        // 156
 	}                                                                                                               // 157
    }                                                                                                             // 158
  },                                                                                                              // 159
  serve: function (req, res) {                                                                                    // 160
    if (options.tmpDir == null || options.uploadDir == null) {                                                    // 161
      throw new Meteor.Error('Upload component not initialised!');                                                // 162
    }                                                                                                             // 163
                                                                                                                  // 164
    res.setHeader(                                                                                                // 165
      'Access-Control-Allow-Origin',                                                                              // 166
      options.accessControl.allowOrigin                                                                           // 167
    );                                                                                                            // 168
    res.setHeader(                                                                                                // 169
      'Access-Control-Allow-Methods',                                                                             // 170
      options.accessControl.allowMethods                                                                          // 171
    );                                                                                                            // 172
    res.setHeader(                                                                                                // 173
      'Access-Control-Allow-Headers',                                                                             // 174
      options.accessControl.allowHeaders                                                                          // 175
    );                                                                                                            // 176
    var handleResult = function (result, redirect) {                                                              // 177
        if (redirect) {                                                                                           // 178
          res.writeHead(302, {                                                                                    // 179
            'Location': redirect.replace(                                                                         // 180
              /%s/,                                                                                               // 181
              encodeURIComponent(JSON.stringify(result))                                                          // 182
            )                                                                                                     // 183
          });                                                                                                     // 184
          res.end();                                                                                              // 185
        } else if (result.error) {                                                                                // 186
          res.writeHead(403, {'Content-Type': 'text/plain'});                                                     // 187
          res.write(result.error);                                                                                // 188
          res.end();                                                                                              // 189
        } else {                                                                                                  // 190
          //res.writeHead(200, {                                                                                  // 191
          //  'Content-Type': req.headers.accept                                                                  // 192
          //    .indexOf('application/json') !== -1 ?                                                             // 193
          //    'application/json' : 'text/plain'                                                                 // 194
          //});                                                                                                   // 195
          res.end(JSON.stringify(result));                                                                        // 196
        }                                                                                                         // 197
      },                                                                                                          // 198
      setNoCacheHeaders = function () {                                                                           // 199
        if (options.cacheTime) {                                                                                  // 200
          res.setHeader('Cache-Control', 'public, max-age=' + options.cacheTime);                                 // 201
        } else {                                                                                                  // 202
          res.setHeader('Pragma', 'no-cache');                                                                    // 203
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');                                  // 204
          // res.setHeader('Content-Disposition', 'inline; filename="files.json"');                               // 205
        }                                                                                                         // 206
      },                                                                                                          // 207
      handler = new UploadHandler(req, res, handleResult);                                                        // 208
                                                                                                                  // 209
                                                                                                                  // 210
    // validate the request                                                                                       // 211
    var error = options.validateRequest(req, res);                                                                // 212
    if (error == false || (error != true && error != null)) {                                                     // 213
      res.writeHead(403, {'Content-Type': 'text/plain'});                                                         // 214
      res.write(error.toString());                                                                                // 215
      res.end();                                                                                                  // 216
      return;                                                                                                     // 217
    }                                                                                                             // 218
                                                                                                                  // 219
    switch (req.method) {                                                                                         // 220
      case 'OPTIONS':                                                                                             // 221
        res.end();                                                                                                // 222
        break;                                                                                                    // 223
      case 'HEAD':                                                                                                // 224
      case 'GET':                                                                                                 // 225
        setNoCacheHeaders();                                                                                      // 226
                                                                                                                  // 227
        var uri = url.parse(req.url).pathname;                                                                    // 228
        var filename = path.join(options.uploadDir, unescape(uri));                                               // 229
        var stats;                                                                                                // 230
                                                                                                                  // 231
        try {                                                                                                     // 232
          stats = fs.lstatSync(filename); // throws if path doesn't exist                                         // 233
        } catch (e) {                                                                                             // 234
          res.writeHead(404, {'Content-Type': 'text/plain'});                                                     // 235
          res.write('404 Not Found\n');                                                                           // 236
          res.end();                                                                                              // 237
          return;                                                                                                 // 238
        }                                                                                                         // 239
                                                                                                                  // 240
        if (stats.isFile()) {                                                                                     // 241
          // path exists, is a file                                                                               // 242
          var mimeType = options.mimeTypes[path.extname(filename).split(".").reverse()[0]];                       // 243
          if (!mimeType) {                                                                                        // 244
            mimeType = "application/octet-stream";                                                                // 245
          }                                                                                                       // 246
          res.writeHead(200, {'Content-Type': mimeType});                                                         // 247
                                                                                                                  // 248
          //connect.static(options.uploadDir)(req, res);                                                          // 249
          var fileStream = fs.createReadStream(filename);                                                         // 250
          fileStream.pipe(res);                                                                                   // 251
                                                                                                                  // 252
        } else if (stats.isDirectory()) {                                                                         // 253
          // path exists, is a directory                                                                          // 254
          res.writeHead(403, {'Content-Type': 'text/plain'});                                                     // 255
          res.write('Access denied');                                                                             // 256
          res.end();                                                                                              // 257
        } else {                                                                                                  // 258
          res.writeHead(500, {'Content-Type': 'text/plain'});                                                     // 259
          res.write('500 Internal server error\n');                                                               // 260
          res.end();                                                                                              // 261
        }                                                                                                         // 262
        break;                                                                                                    // 263
      case 'POST':                                                                                                // 264
        // validate post                                                                                          // 265
        setNoCacheHeaders();                                                                                      // 266
        handler.post();                                                                                           // 267
        break;                                                                                                    // 268
      //case 'DELETE':                                                                                            // 269
      //  handler.destroy();                                                                                      // 270
      //  break;                                                                                                  // 271
      default:                                                                                                    // 272
        res.statusCode = 405;                                                                                     // 273
        res.end();                                                                                                // 274
    }                                                                                                             // 275
  }                                                                                                               // 276
}                                                                                                                 // 277
                                                                                                                  // 278
var utf8encode = function (str) {                                                                                 // 279
  return unescape(encodeURIComponent(str));                                                                       // 280
};                                                                                                                // 281
                                                                                                                  // 282
var nameCountRegexp = /(?:(?: \(([\d]+)\))?(\.[^.]+))?$/;                                                         // 283
                                                                                                                  // 284
var nameCountFunc = function (s, index, ext) {                                                                    // 285
  return ' (' + ((parseInt(index, 10) || 0) + 1) + ')' + (ext || '');                                             // 286
};                                                                                                                // 287
                                                                                                                  // 288
/**                                                                                                               // 289
 * @class FileInfo Manages paths for uploaded objects                                                             // 290
 */                                                                                                               // 291
var FileInfo = function (file, req, form) {                                                                       // 292
  this.name = file.name;                                                                                          // 293
  this.path = file.name;                                                                                          // 294
  this.size = file.size;                                                                                          // 295
  this.type = file.type;                                                                                          // 296
                                                                                                                  // 297
  this.subDirectory = options.getDirectory(this, form.formFields);                                                // 298
  this.baseUrl = (options.ssl ? 'https:' : 'http:') + '//' + req.headers.host + options.uploadUrl;                // 299
  this.url = this.baseUrl + (this.subDirectory ? (this.subDirectory + '/') : '') + encodeURIComponent(this.name);
};                                                                                                                // 301
                                                                                                                  // 302
FileInfo.prototype.validate = function () {                                                                       // 303
  this.error = null;                                                                                              // 304
  if (options.minFileSize && options.minFileSize > this.size) {                                                   // 305
    this.error = 'File is too small';                                                                             // 306
  } else if (options.maxFileSize && options.maxFileSize < this.size) {                                            // 307
    this.error = 'File is too big';                                                                               // 308
  } else if (!options.acceptFileTypes.test(this.name)) {                                                          // 309
    this.error = 'Filetype not allowed';                                                                          // 310
  }                                                                                                               // 311
  return this.error;                                                                                              // 312
};                                                                                                                // 313
                                                                                                                  // 314
// FileInfo.prototype.safeName = function () {                                                                    // 315
//   // Prevent directory traversal and creating hidden system files:                                             // 316
//   this.name = path.basename(this.name).replace(/^\.+/, '');                                                    // 317
//   // Prevent overwriting existing files:                                                                       // 318
//   while (_existsSync(options.uploadDir + '/' + this.name)) {                                                   // 319
//     this.name = this.name.replace(nameCountRegexp, nameCountFunc);                                             // 320
//   }                                                                                                            // 321
// };                                                                                                             // 322
                                                                                                                  // 323
FileInfo.prototype.initUrls = function (req, form) {                                                              // 324
  if (!this.error) {                                                                                              // 325
    // image                                                                                                      // 326
    var that = this;                                                                                              // 327
    Object.keys(options.imageVersions).forEach(function (version) {                                               // 328
      if (_existsSync(                                                                                            // 329
          options.uploadDir + '/' + version + '/' + that.name                                                     // 330
        )) {                                                                                                      // 331
        that[version + 'Url'] = that.baseUrl + version + '/' +                                                    // 332
        encodeURIComponent(that.name);                                                                            // 333
      }                                                                                                           // 334
    });                                                                                                           // 335
  }                                                                                                               // 336
};                                                                                                                // 337
                                                                                                                  // 338
var UploadHandler = function (req, res, callback) {                                                               // 339
  this.req = req;                                                                                                 // 340
  this.res = res;                                                                                                 // 341
  this.callback = callback;                                                                                       // 342
};                                                                                                                // 343
                                                                                                                  // 344
UploadHandler.prototype.post = function () {                                                                      // 345
  var handler = this,                                                                                             // 346
    form = new formidable.IncomingForm(),                                                                         // 347
    tmpFiles = [],                                                                                                // 348
    files = [],                                                                                                   // 349
    map = {},                                                                                                     // 350
    counter = 1,                                                                                                  // 351
    redirect,                                                                                                     // 352
    finish = function (err, stdout) {                                                                             // 353
			if (err) throw err;                                                                                            // 354
      counter -= 1;                                                                                               // 355
      if (!counter) {                                                                                             // 356
        files.forEach(function (fileInfo) {                                                                       // 357
          fileInfo.initUrls(handler.req, form);                                                                   // 358
        });                                                                                                       // 359
        handler.callback({files: files}, redirect);                                                               // 360
      }                                                                                                           // 361
    };                                                                                                            // 362
  form.uploadDir = options.tmpDir;                                                                                // 363
  form.on('fileBegin', function (name, file) {                                                                    // 364
    tmpFiles.push(file.path);                                                                                     // 365
    var fileInfo = new FileInfo(file, handler.req, form);                                                         // 366
    //fileInfo.safeName();                                                                                        // 367
                                                                                                                  // 368
    map[path.basename(file.path)] = fileInfo;                                                                     // 369
    files.push(fileInfo);                                                                                         // 370
  }).on('field', function (name, value) {                                                                         // 371
    if (name === 'redirect') {                                                                                    // 372
      redirect = value;                                                                                           // 373
    }                                                                                                             // 374
    // remember all the form fields                                                                               // 375
    if (this.formFields == null) {                                                                                // 376
      this.formFields = {};                                                                                       // 377
    }                                                                                                             // 378
    //  console.log('Form field: ' + name + "-" + value);                                                         // 379
    this.formFields[name] = value;                                                                                // 380
  }).on('file', function (name, file) {                                                                           // 381
    var fileInfo = map[path.basename(file.path)];                                                                 // 382
    fileInfo.size = file.size;                                                                                    // 383
                                                                                                                  // 384
    // custom validation                                                                                          // 385
    var error = options.validateFile(file, handler.req);                                                          // 386
    if (error == false || (error != true && error != null)) {                                                     // 387
      handler.res.writeHead(403, {'Content-Type': 'text/plain'});                                                 // 388
      handler.res.write(error == false ? "validationFailed" : error);                                             // 389
      handler.res.end();                                                                                          // 390
      fs.unlinkSync(file.path);                                                                                   // 391
      return;                                                                                                     // 392
    }                                                                                                             // 393
                                                                                                                  // 394
    // fileinfo validation                                                                                        // 395
    error = fileInfo.validate();                                                                                  // 396
    if (error) {                                                                                                  // 397
      // delete file                                                                                              // 398
      fs.unlinkSync(file.path);                                                                                   // 399
      // callback with error                                                                                      // 400
      handler.callback({error: error});                                                                           // 401
      return;                                                                                                     // 402
    }                                                                                                             // 403
                                                                                                                  // 404
    // we can store files in subdirectories                                                                       // 405
    var folder = options.getDirectory(fileInfo, this.formFields);                                                 // 406
                                                                                                                  // 407
    // make safe directory, disable all '.'                                                                       // 408
    folder.replace(/\./g, '');                                                                                    // 409
                                                                                                                  // 410
    // check if directory exists, if not, create all the directories                                              // 411
    var subFolders = folder.split('/');                                                                           // 412
    var currentFolder = options.uploadDir;                                                                        // 413
                                                                                                                  // 414
    for (var i = 0; i < subFolders.length; i++) {                                                                 // 415
      currentFolder += '/' + subFolders[i];                                                                       // 416
                                                                                                                  // 417
      if (!fs.existsSync(currentFolder)) {                                                                        // 418
        fs.mkdirSync(currentFolder);                                                                              // 419
      }                                                                                                           // 420
    }                                                                                                             // 421
                                                                                                                  // 422
    // possibly rename file if needed;                                                                            // 423
    var newFileName = options.getFileName(fileInfo, this.formFields);                                             // 424
                                                                                                                  // 425
    // make safe file name                                                                                        // 426
    newFileName = getSafeName(currentFolder, newFileName);                                                        // 427
                                                                                                                  // 428
    // set the file name                                                                                          // 429
    fileInfo.name = newFileName;                                                                                  // 430
    fileInfo.path = folder + "/" + newFileName;                                                                   // 431
                                                                                                                  // 432
		var imageVersionsFunc = function() {                                                                            // 433
			if (options.imageTypes.test(fileInfo.name)) {                                                                  // 434
	      Object.keys(options.imageVersions).forEach(function (version) {                                            // 435
	        counter += 1;                                                                                            // 436
	        var opts = options.imageVersions[version];                                                               // 437
                                                                                                                  // 438
	        // check if version directory exists                                                                     // 439
	        if (!fs.existsSync(currentFolder + version)) {                                                           // 440
	          fs.mkdirSync(currentFolder + version);                                                                 // 441
	        }                                                                                                        // 442
                                                                                                                  // 443
	        var ioptions = {                                                                                         // 444
	          srcPath: currentFolder + newFileName,                                                                  // 445
	          dstPath: currentFolder + version + '/' + newFileName                                                   // 446
	        };                                                                                                       // 447
                                                                                                                  // 448
	        if (opts.width) {                                                                                        // 449
	          ioptions.width = opts.width;                                                                           // 450
	        }                                                                                                        // 451
                                                                                                                  // 452
	        if (opts.height) {                                                                                       // 453
	          ioptions.height = opts.height;                                                                         // 454
	        }                                                                                                        // 455
                                                                                                                  // 456
            if (options.crop) {                                                                                   // 457
              ioptions.quality = 1;                                                                               // 458
              ioptions.gravity = 'Center';                                                                        // 459
              imageMagick.crop(ioptions, finish);                                                                 // 460
            } else {                                                                                              // 461
              imageMagick.resize(ioptions, finish);                                                               // 462
            }                                                                                                     // 463
	      });                                                                                                        // 464
	    }                                                                                                            // 465
		};                                                                                                              // 466
                                                                                                                  // 467
    // Move the file to the final destination                                                                     // 468
    var destinationFile = currentFolder + newFileName;                                                            // 469
    try                                                                                                           // 470
    {                                                                                                             // 471
     	// Try moving through renameSync                                                                            // 472
       	fs.renameSync(file.path, destinationFile);                                                                // 473
				imageVersionsFunc();                                                                                          // 474
    }                                                                                                             // 475
    catch(exception)                                                                                              // 476
    {                                                                                                             // 477
    	// if moving failed, try a copy + delete instead, this to support moving work between partitions             // 478
    	var is = fs.createReadStream(file.path);                                                                     // 479
		var os = fs.createWriteStream(destinationFile);                                                                 // 480
		is.pipe(os);                                                                                                    // 481
		is.on('end',function() {                                                                                        // 482
    		fs.unlinkSync(file.path);                                                                                   // 483
				imageVersionsFunc();                                                                                          // 484
		});                                                                                                             // 485
    }                                                                                                             // 486
                                                                                                                  // 487
    // call the feedback within its own fiber                                                                     // 488
    var formFields = this.formFields;                                                                             // 489
    Fiber(function () {                                                                                           // 490
      options.finished(fileInfo, formFields);                                                                     // 491
    }).run();                                                                                                     // 492
                                                                                                                  // 493
  }).on('aborted', function () {                                                                                  // 494
    tmpFiles.forEach(function (file) {                                                                            // 495
      fs.unlink(file);                                                                                            // 496
    });                                                                                                           // 497
  }).on('error', function (e) {                                                                                   // 498
    console.log('ERROR');                                                                                         // 499
    console.log(e);                                                                                               // 500
  }).on('progress', function (bytesReceived, bytesExpected) {                                                     // 501
    if (bytesReceived > options.maxPostSize) {                                                                    // 502
      handler.req.connection.destroy();                                                                           // 503
    }                                                                                                             // 504
  }).on('end', finish).parse(handler.req);                                                                        // 505
};                                                                                                                // 506
                                                                                                                  // 507
UploadHandler.prototype.destroy = function () {                                                                   // 508
  var handler = this,                                                                                             // 509
    fileName;                                                                                                     // 510
  if (handler.req.url.slice(0, options.uploadUrl.length) === options.uploadUrl) {                                 // 511
    fileName = path.basename(decodeURIComponent(handler.req.url));                                                // 512
    if (fileName[0] !== '.') {                                                                                    // 513
      fs.unlink(options.uploadDir + '/' + fileName, function (ex) {                                               // 514
        Object.keys(options.imageVersions).forEach(function (version) {                                           // 515
          fs.unlink(options.uploadDir + '/' + version + '/' + fileName);                                          // 516
        });                                                                                                       // 517
        handler.callback({success: !ex});                                                                         // 518
      });                                                                                                         // 519
      return;                                                                                                     // 520
    }                                                                                                             // 521
  }                                                                                                               // 522
  handler.callback({success: false});                                                                             // 523
};                                                                                                                // 524
                                                                                                                  // 525
// create directories                                                                                             // 526
                                                                                                                  // 527
var checkCreateDirectory = function (dir) {                                                                       // 528
  if (!dir) {                                                                                                     // 529
    return;                                                                                                       // 530
  }                                                                                                               // 531
                                                                                                                  // 532
  // If we're on Windows we'll remove the drive letter                                                            // 533
  if(/^win/.test(process.platform)) {                                                                             // 534
  	dir = dir.replace(/([A-Z]:[\\\/]).*?/gi, '')                                                                   // 535
  }                                                                                                               // 536
                                                                                                                  // 537
  var dirParts = dir.split('/');                                                                                  // 538
  var currentDir = '/';                                                                                           // 539
                                                                                                                  // 540
  for (var i = 0; i < dirParts.length; i++) {                                                                     // 541
    if (!dirParts[i]) {                                                                                           // 542
      continue;                                                                                                   // 543
    }                                                                                                             // 544
                                                                                                                  // 545
    currentDir += dirParts[i] + '/';                                                                              // 546
                                                                                                                  // 547
    if (!fs.existsSync(currentDir)) {                                                                             // 548
      fs.mkdirSync(currentDir);                                                                                   // 549
      console.log('Created directory: ' + currentDir);                                                            // 550
    }                                                                                                             // 551
  }                                                                                                               // 552
}                                                                                                                 // 553
                                                                                                                  // 554
var getSafeName = function(directory, fileName) {                                                                 // 555
	var n = fileName;                                                                                                // 556
	// Prevent directory traversal and creating hidden system files:                                                 // 557
	n = path.basename(n).replace(/^\.+/, '');                                                                        // 558
	// Prevent overwriting existing files:                                                                           // 559
	if (!options.overwrite) {                                                                                        // 560
  	while (_existsSync(directory + '/' + n)) {                                                                     // 561
  		n = n.replace(nameCountRegexp, nameCountFunc);                                                                // 562
  	}                                                                                                              // 563
  }                                                                                                               // 564
	return n;                                                                                                        // 565
}                                                                                                                 // 566
                                                                                                                  // 567
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/tomi_upload-server/router.js                                                                          //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
//Router.route('/upload', function () {                                                                           // 1
//  var req = this.request;                                                                                       // 2
//  var res = this.response;                                                                                      // 3
//                                                                                                                // 4
//  console.log('doing something');                                                                               // 5
//                                                                                                                // 6
//  UploadServer.serve(req, res);                                                                                 // 7
//}, { where: 'server' });                                                                                        // 8
                                                                                                                  // 9
                                                                                                                  // 10
//Router.map(function () {                                                                                        // 11
//  this.route('upload', {                                                                                        // 12
//    path: '/upload/(.*)',                                                                                       // 13
//    where: 'server',                                                                                            // 14
//    action: function() {                                                                                        // 15
//      UploadServer.serve(this.request, this.response);                                                          // 16
//    }                                                                                                           // 17
//  });                                                                                                           // 18
//});                                                                                                             // 19
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['tomi:upload-server'] = {
  UploadServer: UploadServer
};

})();

//# sourceMappingURL=tomi_upload-server.js.map
