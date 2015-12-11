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
  overwrite: false,                                                                                               // 35
  cacheTime: 86400,                                                                                               // 36
  getDirectory: function (fileInfo, formData) {                                                                   // 37
    return ""                                                                                                     // 38
  },                                                                                                              // 39
  getFileName: function (fileInfo, formData) {                                                                    // 40
    return fileInfo.name;                                                                                         // 41
  },                                                                                                              // 42
  finished: function () {                                                                                         // 43
  },                                                                                                              // 44
  validateRequest: function () {                                                                                  // 45
    return null;                                                                                                  // 46
  },                                                                                                              // 47
  validateFile: function () {                                                                                     // 48
    return null;                                                                                                  // 49
  },                                                                                                              // 50
  accessControl: {                                                                                                // 51
    allowOrigin: '*',                                                                                             // 52
    allowMethods: 'OPTIONS, HEAD, GET, POST, PUT, DELETE',                                                        // 53
    allowHeaders: 'Content-Type, Content-Range, Content-Disposition'                                              // 54
  },                                                                                                              // 55
  mimeTypes: {                                                                                                    // 56
    "html": "text/html",                                                                                          // 57
    "jpeg": "image/jpeg",                                                                                         // 58
    "jpg": "image/jpeg",                                                                                          // 59
    "png": "image/png",                                                                                           // 60
    "gif": "image/gif",                                                                                           // 61
    "js": "text/javascript",                                                                                      // 62
    "css": "text/css",                                                                                            // 63
    "pdf": "application/pdf",                                                                                     // 64
    "doc": "application/msword",                                                                                  // 65
    "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",                            // 66
    "zip": "application/zip, application/x-compressed-zip",                                                       // 67
    "txt": "text/plain"                                                                                           // 68
  }                                                                                                               // 69
  /* Uncomment and edit this section to provide the service via HTTPS:                                            // 70
   ssl: {                                                                                                         // 71
   key: fs.readFileSync('/Applications/XAMPP/etc/ssl.key/server.key'),                                            // 72
   cert: fs.readFileSync('/Applications/XAMPP/etc/ssl.crt/server.crt')                                            // 73
   },                                                                                                             // 74
   */                                                                                                             // 75
};                                                                                                                // 76
                                                                                                                  // 77
                                                                                                                  // 78
UploadServer = {                                                                                                  // 79
  getOptions: function()                                                                                          // 80
  {                                                                                                               // 81
    return options;                                                                                               // 82
  },                                                                                                              // 83
  init: function (opts) {                                                                                         // 84
    if (opts.checkCreateDirectories != null) options.checkCreateDirectories = opts.checkCreateDirectories;        // 85
                                                                                                                  // 86
    if (opts.tmpDir == null) {                                                                                    // 87
      throw new Meteor.Error('Temporary directory needs to be assigned!');                                        // 88
    } else {                                                                                                      // 89
      options.tmpDir = opts.tmpDir;                                                                               // 90
    }                                                                                                             // 91
                                                                                                                  // 92
    if (opts.cacheTime != null) {                                                                                 // 93
      options.cacheTime = opts.cacheTime;                                                                         // 94
    }                                                                                                             // 95
                                                                                                                  // 96
    if (opts.mimeTypes != null) {                                                                                 // 97
      for (var key in opts.mimeTypes) {                                                                           // 98
        options.mimeTypes[key] = opts.mimeTypes[key];                                                             // 99
      }                                                                                                           // 100
    }                                                                                                             // 101
                                                                                                                  // 102
    if (opts.checkCreateDirectories) {                                                                            // 103
      checkCreateDirectory(options.tmpDir);                                                                       // 104
    }                                                                                                             // 105
                                                                                                                  // 106
    if (opts.uploadDir == null) {                                                                                 // 107
      throw new Meteor.Error('Upload directory needs to be assigned!');                                           // 108
    } else {                                                                                                      // 109
      options.uploadDir = opts.uploadDir;                                                                         // 110
    }                                                                                                             // 111
                                                                                                                  // 112
    if (options.checkCreateDirectories) {                                                                         // 113
      checkCreateDirectory(options.uploadDir);                                                                    // 114
    }                                                                                                             // 115
                                                                                                                  // 116
    if (opts.maxPostSize != null) options.maxPostSize = opts.maxPostSize;                                         // 117
    if (opts.minFileSize != null) options.minFileSize = opts.minFileSize;                                         // 118
    if (opts.maxFileSize != null) options.maxFileSize = opts.maxFileSize;                                         // 119
    if (opts.acceptFileTypes != null) options.acceptFileTypes = opts.acceptFileTypes;                             // 120
    if (opts.imageTypes != null) options.imageTypes = opts.imageTypes;                                            // 121
    if (opts.validateRequest != null) options.validateRequest = opts.validateRequest;                             // 122
    if (opts.validateFile != null) options.validateFile = opts.validateFile;                                      // 123
    if (opts.getDirectory != null) options.getDirectory = opts.getDirectory;                                      // 124
    if (opts.getFileName != null) options.getFileName = opts.getFileName;                                         // 125
    if (opts.finished != null) options.finished = opts.finished;                                                  // 126
    if (opts.overwrite != null) options.overwrite = opts.overwrite;                                               // 127
                                                                                                                  // 128
    if (opts.uploadUrl) options.uploadUrl = opts.uploadUrl;                                                       // 129
                                                                                                                  // 130
    if (opts.imageVersions != null) options.imageVersions = opts.imageVersions                                    // 131
    else options.imageVersions = [];                                                                              // 132
  },                                                                                                              // 133
  delete: function (filePath) {                                                                                   // 134
                                                                                                                  // 135
    // make sure paths are correct                                                                                // 136
    fs.unlinkSync(path.join(options.uploadDir, filePath));                                                        // 137
  },                                                                                                              // 138
  serve: function (req, res) {                                                                                    // 139
    if (options.tmpDir == null || options.uploadDir == null) {                                                    // 140
      throw new Meteor.Error('Upload component not initialised!');                                                // 141
    }                                                                                                             // 142
                                                                                                                  // 143
    res.setHeader(                                                                                                // 144
      'Access-Control-Allow-Origin',                                                                              // 145
      options.accessControl.allowOrigin                                                                           // 146
    );                                                                                                            // 147
    res.setHeader(                                                                                                // 148
      'Access-Control-Allow-Methods',                                                                             // 149
      options.accessControl.allowMethods                                                                          // 150
    );                                                                                                            // 151
    res.setHeader(                                                                                                // 152
      'Access-Control-Allow-Headers',                                                                             // 153
      options.accessControl.allowHeaders                                                                          // 154
    );                                                                                                            // 155
    var handleResult = function (result, redirect) {                                                              // 156
        if (redirect) {                                                                                           // 157
          res.writeHead(302, {                                                                                    // 158
            'Location': redirect.replace(                                                                         // 159
              /%s/,                                                                                               // 160
              encodeURIComponent(JSON.stringify(result))                                                          // 161
            )                                                                                                     // 162
          });                                                                                                     // 163
          res.end();                                                                                              // 164
        } else if (result.error) {                                                                                // 165
          res.writeHead(403, {'Content-Type': 'text/plain'});                                                     // 166
          res.write(result.error);                                                                                // 167
          res.end();                                                                                              // 168
        } else {                                                                                                  // 169
          //res.writeHead(200, {                                                                                  // 170
          //  'Content-Type': req.headers.accept                                                                  // 171
          //    .indexOf('application/json') !== -1 ?                                                             // 172
          //    'application/json' : 'text/plain'                                                                 // 173
          //});                                                                                                   // 174
          res.end(JSON.stringify(result));                                                                        // 175
        }                                                                                                         // 176
      },                                                                                                          // 177
      setNoCacheHeaders = function () {                                                                           // 178
        if (options.cacheTime) {                                                                                  // 179
          res.setHeader('Cache-Control', 'public, max-age=' + options.cacheTime);                                 // 180
        } else {                                                                                                  // 181
          res.setHeader('Pragma', 'no-cache');                                                                    // 182
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');                                  // 183
          // res.setHeader('Content-Disposition', 'inline; filename="files.json"');                               // 184
        }                                                                                                         // 185
      },                                                                                                          // 186
      handler = new UploadHandler(req, res, handleResult);                                                        // 187
                                                                                                                  // 188
                                                                                                                  // 189
    // validate the request                                                                                       // 190
    var error = options.validateRequest(req, res);                                                                // 191
    if (error) {                                                                                                  // 192
      res.writeHead(403, {'Content-Type': 'text/plain'});                                                         // 193
      res.write(error);                                                                                           // 194
      res.end();                                                                                                  // 195
      return;                                                                                                     // 196
    }                                                                                                             // 197
                                                                                                                  // 198
    switch (req.method) {                                                                                         // 199
      case 'OPTIONS':                                                                                             // 200
        res.end();                                                                                                // 201
        break;                                                                                                    // 202
      case 'HEAD':                                                                                                // 203
      case 'GET':                                                                                                 // 204
        setNoCacheHeaders();                                                                                      // 205
                                                                                                                  // 206
        var uri = url.parse(req.url).pathname;                                                                    // 207
        var filename = path.join(options.uploadDir, unescape(uri));                                               // 208
        var stats;                                                                                                // 209
                                                                                                                  // 210
        try {                                                                                                     // 211
          stats = fs.lstatSync(filename); // throws if path doesn't exist                                         // 212
        } catch (e) {                                                                                             // 213
          res.writeHead(404, {'Content-Type': 'text/plain'});                                                     // 214
          res.write('404 Not Found\n');                                                                           // 215
          res.end();                                                                                              // 216
          return;                                                                                                 // 217
        }                                                                                                         // 218
                                                                                                                  // 219
        if (stats.isFile()) {                                                                                     // 220
          // path exists, is a file                                                                               // 221
          var mimeType = options.mimeTypes[path.extname(filename).split(".").reverse()[0]];                       // 222
          if (!mimeType) {                                                                                        // 223
            mimeType = "application/octet-stream";                                                                // 224
          }                                                                                                       // 225
          res.writeHead(200, {'Content-Type': mimeType});                                                         // 226
                                                                                                                  // 227
          //connect.static(options.uploadDir)(req, res);                                                          // 228
          var fileStream = fs.createReadStream(filename);                                                         // 229
          fileStream.pipe(res);                                                                                   // 230
                                                                                                                  // 231
        } else if (stats.isDirectory()) {                                                                         // 232
          // path exists, is a directory                                                                          // 233
          res.writeHead(403, {'Content-Type': 'text/plain'});                                                     // 234
          res.write('Access denied');                                                                             // 235
          res.end();                                                                                              // 236
        } else {                                                                                                  // 237
          res.writeHead(500, {'Content-Type': 'text/plain'});                                                     // 238
          res.write('500 Internal server error\n');                                                               // 239
          res.end();                                                                                              // 240
        }                                                                                                         // 241
        break;                                                                                                    // 242
      case 'POST':                                                                                                // 243
        // validate post                                                                                          // 244
        setNoCacheHeaders();                                                                                      // 245
        handler.post();                                                                                           // 246
        break;                                                                                                    // 247
      //case 'DELETE':                                                                                            // 248
      //  handler.destroy();                                                                                      // 249
      //  break;                                                                                                  // 250
      default:                                                                                                    // 251
        res.statusCode = 405;                                                                                     // 252
        res.end();                                                                                                // 253
    }                                                                                                             // 254
  }                                                                                                               // 255
}                                                                                                                 // 256
                                                                                                                  // 257
var utf8encode = function (str) {                                                                                 // 258
  return unescape(encodeURIComponent(str));                                                                       // 259
};                                                                                                                // 260
                                                                                                                  // 261
var nameCountRegexp = /(?:(?: \(([\d]+)\))?(\.[^.]+))?$/;                                                         // 262
                                                                                                                  // 263
var nameCountFunc = function (s, index, ext) {                                                                    // 264
  return ' (' + ((parseInt(index, 10) || 0) + 1) + ')' + (ext || '');                                             // 265
};                                                                                                                // 266
                                                                                                                  // 267
/**                                                                                                               // 268
 * @class FileInfo Manages paths for uploaded objects                                                             // 269
 */                                                                                                               // 270
var FileInfo = function (file, req, form) {                                                                       // 271
  this.name = file.name;                                                                                          // 272
  this.path = file.name;                                                                                          // 273
  this.size = file.size;                                                                                          // 274
  this.type = file.type;                                                                                          // 275
                                                                                                                  // 276
  this.subDirectory = options.getDirectory(this, form.formFields);                                                // 277
  this.baseUrl = (options.ssl ? 'https:' : 'http:') + '//' + req.headers.host + options.uploadUrl;                // 278
  this.url = this.baseUrl + (this.subDirectory ? (this.subDirectory + '/') : '') + encodeURIComponent(this.name);
};                                                                                                                // 280
                                                                                                                  // 281
FileInfo.prototype.validate = function () {                                                                       // 282
  this.error = null;                                                                                              // 283
  if (options.minFileSize && options.minFileSize > this.size) {                                                   // 284
    this.error = 'File is too small';                                                                             // 285
  } else if (options.maxFileSize && options.maxFileSize < this.size) {                                            // 286
    this.error = 'File is too big';                                                                               // 287
  } else if (!options.acceptFileTypes.test(this.name)) {                                                          // 288
    this.error = 'Filetype not allowed';                                                                          // 289
  }                                                                                                               // 290
  return this.error;                                                                                              // 291
};                                                                                                                // 292
                                                                                                                  // 293
// FileInfo.prototype.safeName = function () {                                                                    // 294
//   // Prevent directory traversal and creating hidden system files:                                             // 295
//   this.name = path.basename(this.name).replace(/^\.+/, '');                                                    // 296
//   // Prevent overwriting existing files:                                                                       // 297
//   while (_existsSync(options.uploadDir + '/' + this.name)) {                                                   // 298
//     this.name = this.name.replace(nameCountRegexp, nameCountFunc);                                             // 299
//   }                                                                                                            // 300
// };                                                                                                             // 301
                                                                                                                  // 302
FileInfo.prototype.initUrls = function (req, form) {                                                              // 303
  if (!this.error) {                                                                                              // 304
    // image                                                                                                      // 305
    var that = this;                                                                                              // 306
    Object.keys(options.imageVersions).forEach(function (version) {                                               // 307
      if (_existsSync(                                                                                            // 308
          options.uploadDir + '/' + version + '/' + that.name                                                     // 309
        )) {                                                                                                      // 310
        that[version + 'Url'] = that.baseUrl + version + '/' +                                                    // 311
        encodeURIComponent(that.name);                                                                            // 312
      }                                                                                                           // 313
    });                                                                                                           // 314
  }                                                                                                               // 315
};                                                                                                                // 316
                                                                                                                  // 317
var UploadHandler = function (req, res, callback) {                                                               // 318
  this.req = req;                                                                                                 // 319
  this.res = res;                                                                                                 // 320
  this.callback = callback;                                                                                       // 321
};                                                                                                                // 322
                                                                                                                  // 323
UploadHandler.prototype.post = function () {                                                                      // 324
  var handler = this,                                                                                             // 325
    form = new formidable.IncomingForm(),                                                                         // 326
    tmpFiles = [],                                                                                                // 327
    files = [],                                                                                                   // 328
    map = {},                                                                                                     // 329
    counter = 1,                                                                                                  // 330
    redirect,                                                                                                     // 331
    finish = function () {                                                                                        // 332
      counter -= 1;                                                                                               // 333
      if (!counter) {                                                                                             // 334
        files.forEach(function (fileInfo) {                                                                       // 335
          fileInfo.initUrls(handler.req, form);                                                                   // 336
        });                                                                                                       // 337
        handler.callback({files: files}, redirect);                                                               // 338
      }                                                                                                           // 339
    };                                                                                                            // 340
  form.uploadDir = options.tmpDir;                                                                                // 341
  form.on('fileBegin', function (name, file) {                                                                    // 342
    tmpFiles.push(file.path);                                                                                     // 343
    var fileInfo = new FileInfo(file, handler.req, form);                                                         // 344
                                                                                                                  // 345
    //fileInfo.safeName();                                                                                        // 346
                                                                                                                  // 347
    // validate post                                                                                              // 348
    var error = options.validateFile(file);                                                                       // 349
    if (error) {                                                                                                  // 350
      res.writeHead(403, {'Content-Type': 'text/plain'});                                                         // 351
      res.write(error);                                                                                           // 352
      res.end();                                                                                                  // 353
      return;                                                                                                     // 354
    }                                                                                                             // 355
                                                                                                                  // 356
    map[path.basename(file.path)] = fileInfo;                                                                     // 357
    files.push(fileInfo);                                                                                         // 358
  }).on('field', function (name, value) {                                                                         // 359
    if (name === 'redirect') {                                                                                    // 360
      redirect = value;                                                                                           // 361
    }                                                                                                             // 362
    // remember all the form fields                                                                               // 363
    if (this.formFields == null) {                                                                                // 364
      this.formFields = {};                                                                                       // 365
    }                                                                                                             // 366
    //  console.log('Form field: ' + name + "-" + value);                                                         // 367
    this.formFields[name] = value;                                                                                // 368
  }).on('file', function (name, file) {                                                                           // 369
    var fileInfo = map[path.basename(file.path)];                                                                 // 370
    fileInfo.size = file.size;                                                                                    // 371
                                                                                                                  // 372
    var error = fileInfo.validate();                                                                              // 373
    if (error) {                                                                                                  // 374
      // delete file                                                                                              // 375
      fs.unlinkSync(file.path);                                                                                   // 376
      // callback with error                                                                                      // 377
      handler.callback({error: error});                                                                           // 378
      return;                                                                                                     // 379
    }                                                                                                             // 380
                                                                                                                  // 381
    // we can store files in subdirectories                                                                       // 382
    var folder = options.getDirectory(fileInfo, this.formFields);                                                 // 383
                                                                                                                  // 384
    // make safe directory, disable all '.'                                                                       // 385
    folder.replace(/\./g, '');                                                                                    // 386
                                                                                                                  // 387
    // check if directory exists, if not, create all the directories                                              // 388
    var subFolders = folder.split('/');                                                                           // 389
    var currentFolder = options.uploadDir;                                                                        // 390
    for (var i = 0; i < subFolders.length; i++) {                                                                 // 391
      currentFolder += '/' + subFolders[i];                                                                       // 392
                                                                                                                  // 393
      if (!fs.existsSync(currentFolder)) {                                                                        // 394
        fs.mkdirSync(currentFolder);                                                                              // 395
      }                                                                                                           // 396
    }                                                                                                             // 397
                                                                                                                  // 398
    // possibly rename file if needed;                                                                            // 399
    var newFileName = options.getFileName(fileInfo, this.formFields);                                             // 400
                                                                                                                  // 401
    // make safe file name                                                                                        // 402
    newFileName = getSafeName(currentFolder, newFileName);                                                        // 403
                                                                                                                  // 404
    // set the file name                                                                                          // 405
    fileInfo.name = newFileName;                                                                                  // 406
    fileInfo.path = folder + "/" + newFileName;                                                                   // 407
                                                                                                                  // 408
    // Move the file to the final destination                                                                     // 409
    var destinationFile = currentFolder + "/" + newFileName;                                                      // 410
    try                                                                                                           // 411
    {                                                                                                             // 412
     	// Try moving through renameSync                                                                            // 413
       	fs.renameSync(file.path, destinationFile)                                                                 // 414
    }                                                                                                             // 415
    catch(exception)                                                                                              // 416
    {                                                                                                             // 417
    	// if moving failed, try a copy + delete instead, this to support moving work between partitions             // 418
    	var is = fs.createReadStream(file.path);                                                                     // 419
		var os = fs.createWriteStream(destinationFile);                                                                 // 420
		is.pipe(os);                                                                                                    // 421
		is.on('end',function() {                                                                                        // 422
    		fs.unlinkSync(file.path);                                                                                   // 423
		});                                                                                                             // 424
    }                                                                                                             // 425
                                                                                                                  // 426
    if (options.imageTypes.test(fileInfo.name)) {                                                                 // 427
      Object.keys(options.imageVersions).forEach(function (version) {                                             // 428
        counter += 1;                                                                                             // 429
        var opts = options.imageVersions[version];                                                                // 430
                                                                                                                  // 431
        // check if version directory exists                                                                      // 432
        if (!fs.existsSync(currentFolder + '/' + version)) {                                                      // 433
          fs.mkdirSync(currentFolder + '/' + version);                                                            // 434
        }                                                                                                         // 435
                                                                                                                  // 436
        var ioptions = {                                                                                          // 437
          srcPath: currentFolder + '/' + newFileName,                                                             // 438
          dstPath: currentFolder + '/' + version + '/' + newFileName                                              // 439
        };                                                                                                        // 440
                                                                                                                  // 441
        if (opts.width) {                                                                                         // 442
          ioptions.width = opts.width;                                                                            // 443
        }                                                                                                         // 444
                                                                                                                  // 445
        if (opts.height) {                                                                                        // 446
          ioptions.height = opts.height;                                                                          // 447
        }                                                                                                         // 448
                                                                                                                  // 449
        imageMagick.resize(ioptions, finish);                                                                     // 450
      });                                                                                                         // 451
    }                                                                                                             // 452
                                                                                                                  // 453
    // call the feedback within its own fiber                                                                     // 454
    var formFields = this.formFields;                                                                             // 455
    Fiber(function () {                                                                                           // 456
      options.finished(fileInfo, formFields);                                                                     // 457
    }).run();                                                                                                     // 458
                                                                                                                  // 459
  }).on('aborted', function () {                                                                                  // 460
    tmpFiles.forEach(function (file) {                                                                            // 461
      fs.unlink(file);                                                                                            // 462
    });                                                                                                           // 463
  }).on('error', function (e) {                                                                                   // 464
    console.log('ERROR');                                                                                         // 465
    console.log(e);                                                                                               // 466
  }).on('progress', function (bytesReceived, bytesExpected) {                                                     // 467
    if (bytesReceived > options.maxPostSize) {                                                                    // 468
      handler.req.connection.destroy();                                                                           // 469
    }                                                                                                             // 470
  }).on('end', finish).parse(handler.req);                                                                        // 471
};                                                                                                                // 472
                                                                                                                  // 473
UploadHandler.prototype.destroy = function () {                                                                   // 474
  var handler = this,                                                                                             // 475
    fileName;                                                                                                     // 476
  if (handler.req.url.slice(0, options.uploadUrl.length) === options.uploadUrl) {                                 // 477
    fileName = path.basename(decodeURIComponent(handler.req.url));                                                // 478
    if (fileName[0] !== '.') {                                                                                    // 479
      fs.unlink(options.uploadDir + '/' + fileName, function (ex) {                                               // 480
        Object.keys(options.imageVersions).forEach(function (version) {                                           // 481
          fs.unlink(options.uploadDir + '/' + version + '/' + fileName);                                          // 482
        });                                                                                                       // 483
        handler.callback({success: !ex});                                                                         // 484
      });                                                                                                         // 485
      return;                                                                                                     // 486
    }                                                                                                             // 487
  }                                                                                                               // 488
  handler.callback({success: false});                                                                             // 489
};                                                                                                                // 490
                                                                                                                  // 491
// create directories                                                                                             // 492
                                                                                                                  // 493
var checkCreateDirectory = function (dir) {                                                                       // 494
  if (!dir) {                                                                                                     // 495
    return;                                                                                                       // 496
  }                                                                                                               // 497
                                                                                                                  // 498
  // If we're on Windows we'll remove the drive letter                                                            // 499
  if(/^win/.test(process.platform)) {                                                                             // 500
  	dir = dir.replace(/([A-Z]:[\\\/]).*?/gi, '')                                                                   // 501
  }                                                                                                               // 502
                                                                                                                  // 503
  var dirParts = dir.split('/');                                                                                  // 504
  var currentDir = '/';                                                                                           // 505
                                                                                                                  // 506
  for (var i = 0; i < dirParts.length; i++) {                                                                     // 507
    if (!dirParts[i]) {                                                                                           // 508
      continue;                                                                                                   // 509
    }                                                                                                             // 510
                                                                                                                  // 511
    currentDir += dirParts[i] + '/';                                                                              // 512
                                                                                                                  // 513
    if (!fs.existsSync(currentDir)) {                                                                             // 514
      fs.mkdirSync(currentDir);                                                                                   // 515
      console.log('Created directory: ' + currentDir);                                                            // 516
    }                                                                                                             // 517
  }                                                                                                               // 518
}                                                                                                                 // 519
                                                                                                                  // 520
var getSafeName = function(directory, fileName) {                                                                 // 521
	var n = fileName;                                                                                                // 522
	// Prevent directory traversal and creating hidden system files:                                                 // 523
	n = path.basename(n).replace(/^\.+/, '');                                                                        // 524
	// Prevent overwriting existing files:                                                                           // 525
	if (!options.overwrite) {                                                                                        // 526
  	while (_existsSync(directory + '/' + n)) {                                                                     // 527
  		n = n.replace(nameCountRegexp, nameCountFunc);                                                                // 528
  	}                                                                                                              // 529
  }                                                                                                               // 530
	return n;                                                                                                        // 531
}                                                                                                                 // 532
                                                                                                                  // 533
// declare routes                                                                                                 // 534
                                                                                                                  // 535
RoutePolicy.declare(options.uploadUrl, 'network');                                                                // 536
WebApp.connectHandlers.use(options.uploadUrl, UploadServer.serve);                                                // 537
                                                                                                                  // 538
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
