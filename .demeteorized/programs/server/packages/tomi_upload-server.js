(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var RoutePolicy = Package.routepolicy.RoutePolicy;

/* Package-scope variables */
var UploadServer;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/tomi:upload-server/upload_server.js                                                            //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
var formidable = Npm.require('formidable');                                                                // 1
var http = Npm.require('http');                                                                            // 2
var sys = Npm.require('sys');                                                                              // 3
//var connect = Npm.require('connect');                                                                    // 4
var url = Npm.require('url');                                                                              // 5
var path = Npm.require('path');                                                                            // 6
var fs = Npm.require('fs');                                                                                // 7
var Fiber = Npm.require('fibers');                                                                         // 8
                                                                                                           // 9
var _existsSync = fs.existsSync || path.existsSync;                                                        // 10
var imageMagick = Npm.require('imagemagick');                                                              // 11
                                                                                                           // 12
var  options = {                                                                                           // 13
  /** @type String*/                                                                                       // 14
  tmpDir: null,                                                                                            // 15
  /** @type String*/                                                                                       // 16
  uploadDir: null,                                                                                         // 17
  uploadUrl: '/upload/',                                                                                   // 18
  checkCreateDirectories: false,                                                                           // 19
  maxPostSize: 11000000000, // 11 GB                                                                       // 20
  minFileSize: 1,                                                                                          // 21
  maxFileSize: 10000000000, // 10 GB                                                                       // 22
  acceptFileTypes: /.+/i,                                                                                  // 23
  // Files not matched by this regular expression force a download dialog,                                 // 24
  // to prevent executing any scripts in the context of the service domain:                                // 25
  inlineFileTypes: /\.(gif|jpe?g|png)$/i,                                                                  // 26
  imageTypes: /\.(gif|jpe?g|png)$/i,                                                                       // 27
  imageVersions: {                                                                                         // 28
    'thumbnail': {                                                                                         // 29
      width: 200,                                                                                          // 30
      height: 200                                                                                          // 31
    }                                                                                                      // 32
  },                                                                                                       // 33
  cacheTime: 86400,                                                                                        // 34
  getDirectory: function(fileInfo, formData) { return "" },                                                // 35
  getFileName: function(fileInfo, formData) { return fileInfo.name; },                                     // 36
  finished: function() {},                                                                                 // 37
  validateRequest: function() { return null; },                                                            // 38
  validateFile: function() { return null; },                                                               // 39
  accessControl: {                                                                                         // 40
    allowOrigin: '*',                                                                                      // 41
    allowMethods: 'OPTIONS, HEAD, GET, POST, PUT, DELETE',                                                 // 42
    allowHeaders: 'Content-Type, Content-Range, Content-Disposition'                                       // 43
  },                                                                                                       // 44
  mimeTypes: {                                                                                             // 45
    "html": "text/html",                                                                                   // 46
    "jpeg": "image/jpeg",                                                                                  // 47
    "jpg": "image/jpeg",                                                                                   // 48
    "png": "image/png",                                                                                    // 49
    "gif": "image/gif",                                                                                    // 50
    "js": "text/javascript",                                                                               // 51
    "css": "text/css",                                                                                     // 52
    "pdf": "application/pdf",                                                                              // 53
    "doc": "application/msword",                                                                           // 54
    "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",                     // 55
    "zip": "application/zip, application/x-compressed-zip",                                                // 56
    "txt": "text/plain"                                                                                    // 57
  }                                                                                                        // 58
  /* Uncomment and edit this section to provide the service via HTTPS:                                     // 59
   ssl: {                                                                                                  // 60
   key: fs.readFileSync('/Applications/XAMPP/etc/ssl.key/server.key'),                                     // 61
   cert: fs.readFileSync('/Applications/XAMPP/etc/ssl.crt/server.crt')                                     // 62
   },                                                                                                      // 63
   */                                                                                                      // 64
};                                                                                                         // 65
                                                                                                           // 66
                                                                                                           // 67
UploadServer = {                                                                                           // 68
  init: function(opts) {                                                                                   // 69
    if (opts.checkCreateDirectories != null) options.checkCreateDirectories = opts.checkCreateDirectories; // 70
                                                                                                           // 71
    if (opts.tmpDir == null) {                                                                             // 72
      throw new Meteor.Error('Temporary directory needs to be assigned!');                                 // 73
    } else {                                                                                               // 74
      options.tmpDir = opts.tmpDir;                                                                        // 75
    }                                                                                                      // 76
                                                                                                           // 77
    if (opts.cacheTime) {                                                                                  // 78
      options.cacheTime = opts.cacheTime;                                                                  // 79
    }                                                                                                      // 80
                                                                                                           // 81
    if (opts.mimeTypes != null) {                                                                          // 82
      for (var key in opts.mimeTypes) {                                                                    // 83
        options.mimeTypes[key] = opts.mimeTypes[key];                                                      // 84
      }                                                                                                    // 85
    }                                                                                                      // 86
                                                                                                           // 87
    if (opts.checkCreateDirectories) {                                                                     // 88
      checkCreateDirectory(options.tmpDir);                                                                // 89
    }                                                                                                      // 90
                                                                                                           // 91
    if (opts.uploadDir == null) {                                                                          // 92
      throw new Meteor.Error('Upload directory needs to be assigned!');                                    // 93
    } else {                                                                                               // 94
      options.uploadDir = opts.uploadDir;                                                                  // 95
    }                                                                                                      // 96
                                                                                                           // 97
    if (options.checkCreateDirectories) {                                                                  // 98
      checkCreateDirectory(options.uploadDir);                                                             // 99
    }                                                                                                      // 100
                                                                                                           // 101
    if (opts.maxPostSize != null) options.maxPostSize = opts.maxPostSize;                                  // 102
    if (opts.minFileSize != null) options.minFileSize = opts.maxPostSize;                                  // 103
    if (opts.maxFileSize != null) options.maxFileSize = opts.maxFileSize;                                  // 104
    if (opts.acceptFileTypes != null) options.acceptFileTypes = opts.acceptFileTypes;                      // 105
    if (opts.imageTypes != null) options.imageTypes = opts.imageTypes;                                     // 106
    if (opts.validateRequest != null) options.validateRequest = opts.validateRequest;                      // 107
    if (opts.validateFile != null) options.validateFile = opts.validateFile;                               // 108
    if (opts.getDirectory != null) options.getDirectory = opts.getDirectory;                               // 109
    if (opts.getFileName != null) options.getFileName = opts.getFileName;                                  // 110
    if (opts.finished != null) options.finished = opts.finished;                                           // 111
                                                                                                           // 112
    if (opts.uploadUrl) options.uploadUrl = opts.uploadUrl;                                                // 113
                                                                                                           // 114
    if (opts.imageVersions != null) options.imageVersions = opts.imageVersions                             // 115
    else options.imageVersions = [];                                                                       // 116
  },                                                                                                       // 117
  delete: function(filePath) {                                                                             // 118
                                                                                                           // 119
    // make sure paths are correct                                                                         // 120
    fs.unlinkSync(path.join(options.uploadDir, filePath));                                                 // 121
  },                                                                                                       // 122
  serve: function (req, res) {                                                                             // 123
    if (options.tmpDir == null || options.uploadDir == null) {                                             // 124
      throw new Meteor.Error('Upload component not initialised!');                                         // 125
    }                                                                                                      // 126
                                                                                                           // 127
    res.setHeader(                                                                                         // 128
      'Access-Control-Allow-Origin',                                                                       // 129
      options.accessControl.allowOrigin                                                                    // 130
    );                                                                                                     // 131
    res.setHeader(                                                                                         // 132
      'Access-Control-Allow-Methods',                                                                      // 133
      options.accessControl.allowMethods                                                                   // 134
    );                                                                                                     // 135
    res.setHeader(                                                                                         // 136
      'Access-Control-Allow-Headers',                                                                      // 137
      options.accessControl.allowHeaders                                                                   // 138
    );                                                                                                     // 139
    var handleResult = function (result, redirect) {                                                       // 140
        if (redirect) {                                                                                    // 141
          res.writeHead(302, {                                                                             // 142
            'Location': redirect.replace(                                                                  // 143
              /%s/,                                                                                        // 144
              encodeURIComponent(JSON.stringify(result))                                                   // 145
            )                                                                                              // 146
          });                                                                                              // 147
          res.end();                                                                                       // 148
        } else if (result.error) {                                                                         // 149
          res.writeHead(403, {'Content-Type': 'text/plain'});                                              // 150
          res.write(result.error);                                                                         // 151
          res.end();                                                                                       // 152
        } else {                                                                                           // 153
          //res.writeHead(200, {                                                                           // 154
          //  'Content-Type': req.headers.accept                                                           // 155
          //    .indexOf('application/json') !== -1 ?                                                      // 156
          //    'application/json' : 'text/plain'                                                          // 157
          //});                                                                                            // 158
          res.end(JSON.stringify(result));                                                                 // 159
        }                                                                                                  // 160
      },                                                                                                   // 161
      setNoCacheHeaders = function () {                                                                    // 162
        if (options.cacheTime) {                                                                           // 163
          res.setHeader('Cache-Control', 'public, max-age=' + options.cacheTime);                          // 164
        } else {                                                                                           // 165
          res.setHeader('Pragma', 'no-cache');                                                             // 166
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');                           // 167
          // res.setHeader('Content-Disposition', 'inline; filename="files.json"');                        // 168
        }                                                                                                  // 169
      },                                                                                                   // 170
      handler = new UploadHandler(req, res, handleResult);                                                 // 171
                                                                                                           // 172
    switch (req.method) {                                                                                  // 173
      case 'OPTIONS':                                                                                      // 174
        res.end();                                                                                         // 175
        break;                                                                                             // 176
      case 'HEAD':                                                                                         // 177
      case 'GET':                                                                                          // 178
        setNoCacheHeaders();                                                                               // 179
                                                                                                           // 180
        var uri = url.parse(req.url).pathname;                                                             // 181
        var filename = path.join(options.uploadDir, unescape(uri));                                        // 182
        var stats;                                                                                         // 183
                                                                                                           // 184
        try {                                                                                              // 185
          stats = fs.lstatSync(filename); // throws if path doesn't exist                                  // 186
        } catch (e) {                                                                                      // 187
          res.writeHead(404, {'Content-Type': 'text/plain'});                                              // 188
          res.write('404 Not Found\n');                                                                    // 189
          res.end();                                                                                       // 190
          return;                                                                                          // 191
        }                                                                                                  // 192
                                                                                                           // 193
        if (stats.isFile()) {                                                                              // 194
          // path exists, is a file                                                                        // 195
          var mimeType = options.mimeTypes[path.extname(filename).split(".").reverse()[0]];                // 196
          if (!mimeType) {                                                                                 // 197
            mimeType = "application/octet-stream";                                                         // 198
          }                                                                                                // 199
          res.writeHead(200, {'Content-Type': mimeType} );                                                 // 200
                                                                                                           // 201
          //connect.static(options.uploadDir)(req, res);                                                   // 202
          var fileStream = fs.createReadStream(filename);                                                  // 203
          fileStream.pipe(res);                                                                            // 204
                                                                                                           // 205
        } else if (stats.isDirectory()) {                                                                  // 206
          // path exists, is a directory                                                                   // 207
          res.writeHead(403, {'Content-Type': 'text/plain'});                                              // 208
          res.write('Access denied');                                                                      // 209
          res.end();                                                                                       // 210
        } else {                                                                                           // 211
          res.writeHead(500, {'Content-Type': 'text/plain'});                                              // 212
          res.write('500 Internal server error\n');                                                        // 213
          res.end();                                                                                       // 214
        }                                                                                                  // 215
        break;                                                                                             // 216
      case 'POST':                                                                                         // 217
        // validate post                                                                                   // 218
        var error = options.validateRequest(req, res);                                                     // 219
        if (error) {                                                                                       // 220
          res.writeHead(403, {'Content-Type': 'text/plain'});                                              // 221
          res.write(error);                                                                                // 222
          res.end();                                                                                       // 223
          return;                                                                                          // 224
        }                                                                                                  // 225
                                                                                                           // 226
        setNoCacheHeaders();                                                                               // 227
        handler.post();                                                                                    // 228
        break;                                                                                             // 229
      //case 'DELETE':                                                                                     // 230
      //  handler.destroy();                                                                               // 231
      //  break;                                                                                           // 232
      default:                                                                                             // 233
        res.statusCode = 405;                                                                              // 234
        res.end();                                                                                         // 235
    }                                                                                                      // 236
  }                                                                                                        // 237
}                                                                                                          // 238
                                                                                                           // 239
var utf8encode = function (str) {                                                                          // 240
  return unescape(encodeURIComponent(str));                                                                // 241
};                                                                                                         // 242
                                                                                                           // 243
var nameCountRegexp = /(?:(?: \(([\d]+)\))?(\.[^.]+))?$/;                                                  // 244
                                                                                                           // 245
var nameCountFunc = function (s, index, ext) {                                                             // 246
  return ' (' + ((parseInt(index, 10) || 0) + 1) + ')' + (ext || '');                                      // 247
};                                                                                                         // 248
                                                                                                           // 249
var FileInfo = function (file) {                                                                           // 250
  this.name = file.name;                                                                                   // 251
  this.size = file.size;                                                                                   // 252
  this.type = file.type;                                                                                   // 253
};                                                                                                         // 254
                                                                                                           // 255
var UploadHandler = function (req, res, callback) {                                                        // 256
  this.req = req;                                                                                          // 257
  this.res = res;                                                                                          // 258
  this.callback = callback;                                                                                // 259
};                                                                                                         // 260
                                                                                                           // 261
FileInfo.prototype.validate = function () {                                                                // 262
  this.error = null;                                                                                       // 263
  if (options.minFileSize && options.minFileSize > this.size) {                                            // 264
    this.error = 'File is too small';                                                                      // 265
  } else if (options.maxFileSize && options.maxFileSize < this.size) {                                     // 266
    this.error = 'File is too big';                                                                        // 267
  } else if (!options.acceptFileTypes.test(this.name)) {                                                   // 268
    this.error = 'Filetype not allowed';                                                                   // 269
  }                                                                                                        // 270
  return this.error;                                                                                       // 271
};                                                                                                         // 272
                                                                                                           // 273
FileInfo.prototype.safeName = function () {                                                                // 274
  // Prevent directory traversal and creating hidden system files:                                         // 275
  this.name = path.basename(this.name).replace(/^\.+/, '');                                                // 276
  // Prevent overwriting existing files:                                                                   // 277
  while (_existsSync(options.uploadDir + '/' + this.name)) {                                               // 278
    this.name = this.name.replace(nameCountRegexp, nameCountFunc);                                         // 279
  }                                                                                                        // 280
};                                                                                                         // 281
                                                                                                           // 282
FileInfo.prototype.initUrls = function (req, form) {                                                       // 283
  if (!this.error) {                                                                                       // 284
    var that = this,                                                                                       // 285
      subDirectory = options.getDirectory(this.name, form.formFields),                                     // 286
      baseUrl = (options.ssl ? 'https:' : 'http:') +                                                       // 287
        '//' + req.headers.host + options.uploadUrl;                                                       // 288
    this.url = baseUrl + (subDirectory ? (subDirectory + '/') : '') + encodeURIComponent(this.name);       // 289
    Object.keys(options.imageVersions).forEach(function (version) {                                        // 290
      if (_existsSync(                                                                                     // 291
          options.uploadDir + '/' + version + '/' + that.name                                              // 292
        )) {                                                                                               // 293
        that[version + 'Url'] = baseUrl + version + '/' +                                                  // 294
        encodeURIComponent(that.name);                                                                     // 295
      }                                                                                                    // 296
    });                                                                                                    // 297
  }                                                                                                        // 298
};                                                                                                         // 299
                                                                                                           // 300
UploadHandler.prototype.post = function () {                                                               // 301
  var handler = this,                                                                                      // 302
    form = new formidable.IncomingForm(),                                                                  // 303
    tmpFiles = [],                                                                                         // 304
    files = [],                                                                                            // 305
    map = {},                                                                                              // 306
    counter = 1,                                                                                           // 307
    redirect,                                                                                              // 308
    finish = function () {                                                                                 // 309
      counter -= 1;                                                                                        // 310
      if (!counter) {                                                                                      // 311
        files.forEach(function (fileInfo) {                                                                // 312
          fileInfo.initUrls(handler.req, form);                                                            // 313
        });                                                                                                // 314
        handler.callback({files: files}, redirect);                                                        // 315
      }                                                                                                    // 316
    };                                                                                                     // 317
  form.uploadDir = options.tmpDir;                                                                         // 318
  form.on('fileBegin', function (name, file) {                                                             // 319
    tmpFiles.push(file.path);                                                                              // 320
    var fileInfo = new FileInfo(file, handler.req, true);                                                  // 321
    fileInfo.safeName();                                                                                   // 322
                                                                                                           // 323
    // validate post                                                                                       // 324
    var error = options.validateFile(file);                                                                // 325
    if (error) {                                                                                           // 326
      res.writeHead(403, {'Content-Type': 'text/plain'});                                                  // 327
      res.write(error);                                                                                    // 328
      res.end();                                                                                           // 329
      return;                                                                                              // 330
    }                                                                                                      // 331
                                                                                                           // 332
    map[path.basename(file.path)] = fileInfo;                                                              // 333
    files.push(fileInfo);                                                                                  // 334
  }).on('field', function (name, value) {                                                                  // 335
    if (name === 'redirect') {                                                                             // 336
      redirect = value;                                                                                    // 337
    }                                                                                                      // 338
    // remember all the form fields                                                                        // 339
    if (this.formFields == null) {                                                                         // 340
      this.formFields = {};                                                                                // 341
    }                                                                                                      // 342
    //  console.log('Form field: ' + name + "-" + value);                                                  // 343
    this.formFields[name] = value;                                                                         // 344
  }).on('file', function (name, file) {                                                                    // 345
    var fileInfo = map[path.basename(file.path)];                                                          // 346
    fileInfo.size = file.size;                                                                             // 347
                                                                                                           // 348
    var error = fileInfo.validate();                                                                       // 349
    if (error) {                                                                                           // 350
      // delete file                                                                                       // 351
      fs.unlinkSync(file.path);                                                                            // 352
      // callback with error                                                                               // 353
      handler.callback({error: error});                                                                    // 354
      return;                                                                                              // 355
    }                                                                                                      // 356
                                                                                                           // 357
    // we can store files in subdirectories                                                                // 358
    var folder = options.getDirectory(fileInfo, this.formFields);                                          // 359
    // check if directory exists, if not, create all the directories                                       // 360
    var subFolders = folder.split('/');                                                                    // 361
    var currentFolder = options.uploadDir;                                                                 // 362
    for (var i = 0; i < subFolders.length; i++) {                                                          // 363
      currentFolder += '/' + subFolders[i];                                                                // 364
                                                                                                           // 365
      if (!fs.existsSync(currentFolder)) {                                                                 // 366
        fs.mkdirSync(currentFolder);                                                                       // 367
      }                                                                                                    // 368
    }                                                                                                      // 369
                                                                                                           // 370
    // possibly rename file if needed;                                                                     // 371
    var newFileName = options.getFileName(fileInfo, this.formFields);                                      // 372
                                                                                                           // 373
    // set the file name                                                                                   // 374
    fileInfo.name = newFileName;                                                                           // 375
    fileInfo.path = folder + "/" + newFileName;                                                            // 376
                                                                                                           // 377
    fs.renameSync(file.path, currentFolder + "/" + newFileName);                                           // 378
                                                                                                           // 379
    if (options.imageTypes.test(fileInfo.name)) {                                                          // 380
      Object.keys(options.imageVersions).forEach(function (version) {                                      // 381
        counter += 1;                                                                                      // 382
        var opts = options.imageVersions[version];                                                         // 383
                                                                                                           // 384
        // check if version directory exists                                                               // 385
        if (!fs.existsSync(currentFolder + '/' + version)) {                                               // 386
          fs.mkdirSync(currentFolder + '/' + version);                                                     // 387
        }                                                                                                  // 388
                                                                                                           // 389
        imageMagick.resize({                                                                               // 390
          width: opts.width,                                                                               // 391
          height: opts.height,                                                                             // 392
          srcPath: currentFolder + '/' + newFileName,                                                      // 393
          dstPath: currentFolder + '/' + version + '/' + newFileName                                       // 394
        }, finish);                                                                                        // 395
      });                                                                                                  // 396
    }                                                                                                      // 397
                                                                                                           // 398
    // call the feedback within its own fiber                                                              // 399
    var formFields = this.formFields;                                                                      // 400
    Fiber(function() {                                                                                     // 401
      options.finished(fileInfo, formFields);                                                              // 402
    }).run();                                                                                              // 403
                                                                                                           // 404
  }).on('aborted', function () {                                                                           // 405
    tmpFiles.forEach(function (file) {                                                                     // 406
      fs.unlink(file);                                                                                     // 407
    });                                                                                                    // 408
  }).on('error', function (e) {                                                                            // 409
    console.log(e);                                                                                        // 410
  }).on('progress', function (bytesReceived, bytesExpected) {                                              // 411
    if (bytesReceived > options.maxPostSize) {                                                             // 412
      handler.req.connection.destroy();                                                                    // 413
    }                                                                                                      // 414
  }).on('end', finish).parse(handler.req);                                                                 // 415
};                                                                                                         // 416
                                                                                                           // 417
UploadHandler.prototype.destroy = function () {                                                            // 418
  var handler = this,                                                                                      // 419
    fileName;                                                                                              // 420
  if (handler.req.url.slice(0, options.uploadUrl.length) === options.uploadUrl) {                          // 421
    fileName = path.basename(decodeURIComponent(handler.req.url));                                         // 422
    if (fileName[0] !== '.') {                                                                             // 423
      fs.unlink(options.uploadDir + '/' + fileName, function (ex) {                                        // 424
        Object.keys(options.imageVersions).forEach(function (version) {                                    // 425
          fs.unlink(options.uploadDir + '/' + version + '/' + fileName);                                   // 426
        });                                                                                                // 427
        handler.callback({success: !ex});                                                                  // 428
      });                                                                                                  // 429
      return;                                                                                              // 430
    }                                                                                                      // 431
  }                                                                                                        // 432
  handler.callback({success: false});                                                                      // 433
};                                                                                                         // 434
                                                                                                           // 435
// create directories                                                                                      // 436
                                                                                                           // 437
var checkCreateDirectory = function(dir) {                                                                 // 438
  if (!dir) {                                                                                              // 439
    return;                                                                                                // 440
  }                                                                                                        // 441
                                                                                                           // 442
  var dirParts = dir.split('/');                                                                           // 443
  var currentDir = '/';                                                                                    // 444
                                                                                                           // 445
  for (var i=0; i<dirParts.length; i++) {                                                                  // 446
    if (!dirParts[i]) {                                                                                    // 447
      continue;                                                                                            // 448
    }                                                                                                      // 449
                                                                                                           // 450
    currentDir += dirParts[i] + '/';                                                                       // 451
                                                                                                           // 452
    if (!fs.existsSync(currentDir)) {                                                                      // 453
      fs.mkdirSync(currentDir);                                                                            // 454
      console.log('Created directory: ' + currentDir);                                                     // 455
    }                                                                                                      // 456
  }                                                                                                        // 457
}                                                                                                          // 458
                                                                                                           // 459
// declare routes                                                                                          // 460
                                                                                                           // 461
RoutePolicy.declare(options.uploadUrl, 'network');                                                         // 462
WebApp.connectHandlers.use(options.uploadUrl, UploadServer.serve);                                         // 463
                                                                                                           // 464
                                                                                                           // 465
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/tomi:upload-server/router.js                                                                   //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
//Router.route('/upload', function () {                                                                    // 1
//  var req = this.request;                                                                                // 2
//  var res = this.response;                                                                               // 3
//                                                                                                         // 4
//  console.log('doing something');                                                                        // 5
//                                                                                                         // 6
//  UploadServer.serve(req, res);                                                                          // 7
//}, { where: 'server' });                                                                                 // 8
                                                                                                           // 9
                                                                                                           // 10
//Router.map(function () {                                                                                 // 11
//  this.route('upload', {                                                                                 // 12
//    path: '/upload/(.*)',                                                                                // 13
//    where: 'server',                                                                                     // 14
//    action: function() {                                                                                 // 15
//      UploadServer.serve(this.request, this.response);                                                   // 16
//    }                                                                                                    // 17
//  });                                                                                                    // 18
//});                                                                                                      // 19
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['tomi:upload-server'] = {
  UploadServer: UploadServer
};

})();

//# sourceMappingURL=tomi_upload-server.js.map
