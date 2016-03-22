//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var $ = Package.jquery.$;
var jQuery = Package.jquery.jQuery;
var Blaze = Package.ui.Blaze;
var UI = Package.ui.UI;
var Handlebars = Package.ui.Handlebars;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var isprefetch;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/sergeyt_typeahead/typeahead.bundle.js                                                                   //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/*!                                                                                                                 // 1
 * typeahead.js 0.11.1                                                                                              // 2
 * https://github.com/twitter/typeahead.js                                                                          // 3
 * Copyright 2013-2015 Twitter, Inc. and other contributors; Licensed MIT                                           // 4
 */                                                                                                                 // 5
                                                                                                                    // 6
(function(root, factory) {                                                                                          // 7
    if (typeof define === "function" && define.amd) {                                                               // 8
        define("bloodhound", [ "jquery" ], function(a0) {                                                           // 9
            return root["Bloodhound"] = factory(a0);                                                                // 10
        });                                                                                                         // 11
    } else if (typeof exports === "object") {                                                                       // 12
        module.exports = factory(require("jquery"));                                                                // 13
    } else {                                                                                                        // 14
        root["Bloodhound"] = factory(jQuery);                                                                       // 15
    }                                                                                                               // 16
})(this, function($) {                                                                                              // 17
    var _ = function() {                                                                                            // 18
        "use strict";                                                                                               // 19
        return {                                                                                                    // 20
            isMsie: function() {                                                                                    // 21
                return /(msie|trident)/i.test(navigator.userAgent) ? navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2] : false;
            },                                                                                                      // 23
            isBlankString: function(str) {                                                                          // 24
                return !str || /^\s*$/.test(str);                                                                   // 25
            },                                                                                                      // 26
            escapeRegExChars: function(str) {                                                                       // 27
                return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");                                  // 28
            },                                                                                                      // 29
            isString: function(obj) {                                                                               // 30
                return typeof obj === "string";                                                                     // 31
            },                                                                                                      // 32
            isNumber: function(obj) {                                                                               // 33
                return typeof obj === "number";                                                                     // 34
            },                                                                                                      // 35
            isArray: $.isArray,                                                                                     // 36
            isFunction: $.isFunction,                                                                               // 37
            isObject: $.isPlainObject,                                                                              // 38
            isUndefined: function(obj) {                                                                            // 39
                return typeof obj === "undefined";                                                                  // 40
            },                                                                                                      // 41
            isElement: function(obj) {                                                                              // 42
                return !!(obj && obj.nodeType === 1);                                                               // 43
            },                                                                                                      // 44
            isJQuery: function(obj) {                                                                               // 45
                return obj instanceof $;                                                                            // 46
            },                                                                                                      // 47
            toStr: function toStr(s) {                                                                              // 48
                return _.isUndefined(s) || s === null ? "" : s + "";                                                // 49
            },                                                                                                      // 50
            bind: $.proxy,                                                                                          // 51
            each: function(collection, cb) {                                                                        // 52
                $.each(collection, reverseArgs);                                                                    // 53
                function reverseArgs(index, value) {                                                                // 54
                    return cb(value, index);                                                                        // 55
                }                                                                                                   // 56
            },                                                                                                      // 57
            map: $.map,                                                                                             // 58
            filter: $.grep,                                                                                         // 59
            every: function(obj, test) {                                                                            // 60
                var result = true;                                                                                  // 61
                if (!obj) {                                                                                         // 62
                    return result;                                                                                  // 63
                }                                                                                                   // 64
                $.each(obj, function(key, val) {                                                                    // 65
                    if (!(result = test.call(null, val, key, obj))) {                                               // 66
                        return false;                                                                               // 67
                    }                                                                                               // 68
                });                                                                                                 // 69
                return !!result;                                                                                    // 70
            },                                                                                                      // 71
            some: function(obj, test) {                                                                             // 72
                var result = false;                                                                                 // 73
                if (!obj) {                                                                                         // 74
                    return result;                                                                                  // 75
                }                                                                                                   // 76
                $.each(obj, function(key, val) {                                                                    // 77
                    if (result = test.call(null, val, key, obj)) {                                                  // 78
                        return false;                                                                               // 79
                    }                                                                                               // 80
                });                                                                                                 // 81
                return !!result;                                                                                    // 82
            },                                                                                                      // 83
            mixin: $.extend,                                                                                        // 84
            identity: function(x) {                                                                                 // 85
                return x;                                                                                           // 86
            },                                                                                                      // 87
            clone: function(obj) {                                                                                  // 88
                return $.extend(true, {}, obj);                                                                     // 89
            },                                                                                                      // 90
            getIdGenerator: function() {                                                                            // 91
                var counter = 0;                                                                                    // 92
                return function() {                                                                                 // 93
                    return counter++;                                                                               // 94
                };                                                                                                  // 95
            },                                                                                                      // 96
            templatify: function templatify(obj) {                                                                  // 97
                return $.isFunction(obj) ? obj : template;                                                          // 98
                function template() {                                                                               // 99
                    return String(obj);                                                                             // 100
                }                                                                                                   // 101
            },                                                                                                      // 102
            defer: function(fn) {                                                                                   // 103
                setTimeout(fn, 0);                                                                                  // 104
            },                                                                                                      // 105
            debounce: function(func, wait, immediate) {                                                             // 106
                var timeout, result;                                                                                // 107
                return function() {                                                                                 // 108
                    var context = this, args = arguments, later, callNow;                                           // 109
                    later = function() {                                                                            // 110
                        timeout = null;                                                                             // 111
                        if (!immediate) {                                                                           // 112
                            result = func.apply(context, args);                                                     // 113
                        }                                                                                           // 114
                    };                                                                                              // 115
                    callNow = immediate && !timeout;                                                                // 116
                    clearTimeout(timeout);                                                                          // 117
                    timeout = setTimeout(later, wait);                                                              // 118
                    if (callNow) {                                                                                  // 119
                        result = func.apply(context, args);                                                         // 120
                    }                                                                                               // 121
                    return result;                                                                                  // 122
                };                                                                                                  // 123
            },                                                                                                      // 124
            throttle: function(func, wait) {                                                                        // 125
                var context, args, timeout, result, previous, later;                                                // 126
                previous = 0;                                                                                       // 127
                later = function() {                                                                                // 128
                    previous = new Date();                                                                          // 129
                    timeout = null;                                                                                 // 130
                    result = func.apply(context, args);                                                             // 131
                };                                                                                                  // 132
                return function() {                                                                                 // 133
                    var now = new Date(), remaining = wait - (now - previous);                                      // 134
                    context = this;                                                                                 // 135
                    args = arguments;                                                                               // 136
                    if (remaining <= 0) {                                                                           // 137
                        clearTimeout(timeout);                                                                      // 138
                        timeout = null;                                                                             // 139
                        previous = now;                                                                             // 140
                        result = func.apply(context, args);                                                         // 141
                    } else if (!timeout) {                                                                          // 142
                        timeout = setTimeout(later, remaining);                                                     // 143
                    }                                                                                               // 144
                    return result;                                                                                  // 145
                };                                                                                                  // 146
            },                                                                                                      // 147
            stringify: function(val) {                                                                              // 148
                return _.isString(val) ? val : JSON.stringify(val);                                                 // 149
            },                                                                                                      // 150
            noop: function() {}                                                                                     // 151
        };                                                                                                          // 152
    }();                                                                                                            // 153
    var VERSION = "0.11.1";                                                                                         // 154
    var tokenizers = function() {                                                                                   // 155
        "use strict";                                                                                               // 156
        return {                                                                                                    // 157
            nonword: nonword,                                                                                       // 158
            whitespace: whitespace,                                                                                 // 159
            obj: {                                                                                                  // 160
                nonword: getObjTokenizer(nonword),                                                                  // 161
                whitespace: getObjTokenizer(whitespace)                                                             // 162
            }                                                                                                       // 163
        };                                                                                                          // 164
        function whitespace(str) {                                                                                  // 165
            str = _.toStr(str);                                                                                     // 166
            return str ? str.split(/\s+/) : [];                                                                     // 167
        }                                                                                                           // 168
        function nonword(str) {                                                                                     // 169
            str = _.toStr(str);                                                                                     // 170
            return str ? str.split(/\W+/) : [];                                                                     // 171
        }                                                                                                           // 172
        function getObjTokenizer(tokenizer) {                                                                       // 173
            return function setKey(keys) {                                                                          // 174
                keys = _.isArray(keys) ? keys : [].slice.call(arguments, 0);                                        // 175
                return function tokenize(o) {                                                                       // 176
                    var tokens = [];                                                                                // 177
                    _.each(keys, function(k) {                                                                      // 178
                        tokens = tokens.concat(tokenizer(_.toStr(o[k])));                                           // 179
                    });                                                                                             // 180
                    return tokens;                                                                                  // 181
                };                                                                                                  // 182
            };                                                                                                      // 183
        }                                                                                                           // 184
    }();                                                                                                            // 185
    var LruCache = function() {                                                                                     // 186
        "use strict";                                                                                               // 187
        function LruCache(maxSize) {                                                                                // 188
            this.maxSize = _.isNumber(maxSize) ? maxSize : 100;                                                     // 189
            this.reset();                                                                                           // 190
            if (this.maxSize <= 0) {                                                                                // 191
                this.set = this.get = $.noop;                                                                       // 192
            }                                                                                                       // 193
        }                                                                                                           // 194
        _.mixin(LruCache.prototype, {                                                                               // 195
            set: function set(key, val) {                                                                           // 196
                var tailItem = this.list.tail, node;                                                                // 197
                if (this.size >= this.maxSize) {                                                                    // 198
                    this.list.remove(tailItem);                                                                     // 199
                    delete this.hash[tailItem.key];                                                                 // 200
                    this.size--;                                                                                    // 201
                }                                                                                                   // 202
                if (node = this.hash[key]) {                                                                        // 203
                    node.val = val;                                                                                 // 204
                    this.list.moveToFront(node);                                                                    // 205
                } else {                                                                                            // 206
                    node = new Node(key, val);                                                                      // 207
                    this.list.add(node);                                                                            // 208
                    this.hash[key] = node;                                                                          // 209
                    this.size++;                                                                                    // 210
                }                                                                                                   // 211
            },                                                                                                      // 212
            get: function get(key) {                                                                                // 213
                var node = this.hash[key];                                                                          // 214
                if (node) {                                                                                         // 215
                    this.list.moveToFront(node);                                                                    // 216
                    return node.val;                                                                                // 217
                }                                                                                                   // 218
            },                                                                                                      // 219
            reset: function reset() {                                                                               // 220
                this.size = 0;                                                                                      // 221
                this.hash = {};                                                                                     // 222
                this.list = new List();                                                                             // 223
            }                                                                                                       // 224
        });                                                                                                         // 225
        function List() {                                                                                           // 226
            this.head = this.tail = null;                                                                           // 227
        }                                                                                                           // 228
        _.mixin(List.prototype, {                                                                                   // 229
            add: function add(node) {                                                                               // 230
                if (this.head) {                                                                                    // 231
                    node.next = this.head;                                                                          // 232
                    this.head.prev = node;                                                                          // 233
                }                                                                                                   // 234
                this.head = node;                                                                                   // 235
                this.tail = this.tail || node;                                                                      // 236
            },                                                                                                      // 237
            remove: function remove(node) {                                                                         // 238
                node.prev ? node.prev.next = node.next : this.head = node.next;                                     // 239
                node.next ? node.next.prev = node.prev : this.tail = node.prev;                                     // 240
            },                                                                                                      // 241
            moveToFront: function(node) {                                                                           // 242
                this.remove(node);                                                                                  // 243
                this.add(node);                                                                                     // 244
            }                                                                                                       // 245
        });                                                                                                         // 246
        function Node(key, val) {                                                                                   // 247
            this.key = key;                                                                                         // 248
            this.val = val;                                                                                         // 249
            this.prev = this.next = null;                                                                           // 250
        }                                                                                                           // 251
        return LruCache;                                                                                            // 252
    }();                                                                                                            // 253
    var PersistentStorage = function() {                                                                            // 254
        "use strict";                                                                                               // 255
        var LOCAL_STORAGE;                                                                                          // 256
        try {                                                                                                       // 257
            LOCAL_STORAGE = window.localStorage;                                                                    // 258
            LOCAL_STORAGE.setItem("~~~", "!");                                                                      // 259
            LOCAL_STORAGE.removeItem("~~~");                                                                        // 260
        } catch (err) {                                                                                             // 261
            LOCAL_STORAGE = null;                                                                                   // 262
        }                                                                                                           // 263
        function PersistentStorage(namespace, override) {                                                           // 264
            this.prefix = [ "__", namespace, "__" ].join("");                                                       // 265
            this.ttlKey = "__ttl__";                                                                                // 266
            this.keyMatcher = new RegExp("^" + _.escapeRegExChars(this.prefix));                                    // 267
            this.ls = override || LOCAL_STORAGE;                                                                    // 268
            !this.ls && this._noop();                                                                               // 269
        }                                                                                                           // 270
        _.mixin(PersistentStorage.prototype, {                                                                      // 271
            _prefix: function(key) {                                                                                // 272
                return this.prefix + key;                                                                           // 273
            },                                                                                                      // 274
            _ttlKey: function(key) {                                                                                // 275
                return this._prefix(key) + this.ttlKey;                                                             // 276
            },                                                                                                      // 277
            _noop: function() {                                                                                     // 278
                this.get = this.set = this.remove = this.clear = this.isExpired = _.noop;                           // 279
            },                                                                                                      // 280
            _safeSet: function(key, val) {                                                                          // 281
                try {                                                                                               // 282
                    this.ls.setItem(key, val);                                                                      // 283
                } catch (err) {                                                                                     // 284
                    if (err.name === "QuotaExceededError") {                                                        // 285
                        this.clear();                                                                               // 286
                        this._noop();                                                                               // 287
                    }                                                                                               // 288
                }                                                                                                   // 289
            },                                                                                                      // 290
            get: function(key) {                                                                                    // 291
                if (this.isExpired(key)) {                                                                          // 292
                    this.remove(key);                                                                               // 293
                }                                                                                                   // 294
                return decode(this.ls.getItem(this._prefix(key)));                                                  // 295
            },                                                                                                      // 296
            set: function(key, val, ttl) {                                                                          // 297
                if (_.isNumber(ttl)) {                                                                              // 298
                    this._safeSet(this._ttlKey(key), encode(now() + ttl));                                          // 299
                } else {                                                                                            // 300
                    this.ls.removeItem(this._ttlKey(key));                                                          // 301
                }                                                                                                   // 302
                return this._safeSet(this._prefix(key), encode(val));                                               // 303
            },                                                                                                      // 304
            remove: function(key) {                                                                                 // 305
                this.ls.removeItem(this._ttlKey(key));                                                              // 306
                this.ls.removeItem(this._prefix(key));                                                              // 307
                return this;                                                                                        // 308
            },                                                                                                      // 309
            clear: function() {                                                                                     // 310
                var i, keys = gatherMatchingKeys(this.keyMatcher);                                                  // 311
                for (i = keys.length; i--; ) {                                                                      // 312
                    this.remove(keys[i]);                                                                           // 313
                }                                                                                                   // 314
                return this;                                                                                        // 315
            },                                                                                                      // 316
            isExpired: function(key) {                                                                              // 317
                var ttl = decode(this.ls.getItem(this._ttlKey(key)));                                               // 318
                return _.isNumber(ttl) && now() > ttl ? true : false;                                               // 319
            }                                                                                                       // 320
        });                                                                                                         // 321
        return PersistentStorage;                                                                                   // 322
        function now() {                                                                                            // 323
            return new Date().getTime();                                                                            // 324
        }                                                                                                           // 325
        function encode(val) {                                                                                      // 326
            return JSON.stringify(_.isUndefined(val) ? null : val);                                                 // 327
        }                                                                                                           // 328
        function decode(val) {                                                                                      // 329
            return $.parseJSON(val);                                                                                // 330
        }                                                                                                           // 331
        function gatherMatchingKeys(keyMatcher) {                                                                   // 332
            var i, key, keys = [], len = LOCAL_STORAGE.length;                                                      // 333
            for (i = 0; i < len; i++) {                                                                             // 334
                if ((key = LOCAL_STORAGE.key(i)).match(keyMatcher)) {                                               // 335
                    keys.push(key.replace(keyMatcher, ""));                                                         // 336
                }                                                                                                   // 337
            }                                                                                                       // 338
            return keys;                                                                                            // 339
        }                                                                                                           // 340
    }();                                                                                                            // 341
    var Transport = function() {                                                                                    // 342
        "use strict";                                                                                               // 343
        var pendingRequestsCount = 0, pendingRequests = {}, maxPendingRequests = 6, sharedCache = new LruCache(10);
        function Transport(o) {                                                                                     // 345
            o = o || {};                                                                                            // 346
            this.cancelled = false;                                                                                 // 347
            this.lastReq = null;                                                                                    // 348
            this._send = o.transport;                                                                               // 349
            this._get = o.limiter ? o.limiter(this._get) : this._get;                                               // 350
            this._cache = o.cache === false ? new LruCache(0) : sharedCache;                                        // 351
        }                                                                                                           // 352
        Transport.setMaxPendingRequests = function setMaxPendingRequests(num) {                                     // 353
            maxPendingRequests = num;                                                                               // 354
        };                                                                                                          // 355
        Transport.resetCache = function resetCache() {                                                              // 356
            sharedCache.reset();                                                                                    // 357
        };                                                                                                          // 358
        _.mixin(Transport.prototype, {                                                                              // 359
            _fingerprint: function fingerprint(o) {                                                                 // 360
                o = o || {};                                                                                        // 361
                return o.url + o.type + $.param(o.data || {});                                                      // 362
            },                                                                                                      // 363
            _get: function(o, cb) {                                                                                 // 364
                var that = this, fingerprint, jqXhr;                                                                // 365
                fingerprint = this._fingerprint(o);                                                                 // 366
                if (this.cancelled || fingerprint !== this.lastReq) {                                               // 367
                    return;                                                                                         // 368
                }                                                                                                   // 369
                if (jqXhr = pendingRequests[fingerprint]) {                                                         // 370
                    jqXhr.done(done).fail(fail);                                                                    // 371
                } else if (pendingRequestsCount < maxPendingRequests) {                                             // 372
                    pendingRequestsCount++;                                                                         // 373
                    pendingRequests[fingerprint] = this._send(o).done(done).fail(fail).always(always);              // 374
                } else {                                                                                            // 375
                    this.onDeckRequestArgs = [].slice.call(arguments, 0);                                           // 376
                }                                                                                                   // 377
                function done(resp) {                                                                               // 378
                    cb(null, resp);                                                                                 // 379
                    that._cache.set(fingerprint, resp);                                                             // 380
                }                                                                                                   // 381
                function fail() {                                                                                   // 382
                    cb(true);                                                                                       // 383
                }                                                                                                   // 384
                function always() {                                                                                 // 385
                    pendingRequestsCount--;                                                                         // 386
                    delete pendingRequests[fingerprint];                                                            // 387
                    if (that.onDeckRequestArgs) {                                                                   // 388
                        that._get.apply(that, that.onDeckRequestArgs);                                              // 389
                        that.onDeckRequestArgs = null;                                                              // 390
                    }                                                                                               // 391
                }                                                                                                   // 392
            },                                                                                                      // 393
            get: function(o, cb) {                                                                                  // 394
                var resp, fingerprint;                                                                              // 395
                cb = cb || $.noop;                                                                                  // 396
                o = _.isString(o) ? {                                                                               // 397
                    url: o                                                                                          // 398
                } : o || {};                                                                                        // 399
                fingerprint = this._fingerprint(o);                                                                 // 400
                this.cancelled = false;                                                                             // 401
                this.lastReq = fingerprint;                                                                         // 402
                if (resp = this._cache.get(fingerprint)) {                                                          // 403
                    cb(null, resp);                                                                                 // 404
                } else {                                                                                            // 405
                    this._get(o, cb);                                                                               // 406
                }                                                                                                   // 407
            },                                                                                                      // 408
            cancel: function() {                                                                                    // 409
                this.cancelled = true;                                                                              // 410
            }                                                                                                       // 411
        });                                                                                                         // 412
        return Transport;                                                                                           // 413
    }();                                                                                                            // 414
    var SearchIndex = window.SearchIndex = function() {                                                             // 415
        "use strict";                                                                                               // 416
        var CHILDREN = "c", IDS = "i";                                                                              // 417
        function SearchIndex(o) {                                                                                   // 418
            o = o || {};                                                                                            // 419
            if (!o.datumTokenizer || !o.queryTokenizer) {                                                           // 420
                $.error("datumTokenizer and queryTokenizer are both required");                                     // 421
            }                                                                                                       // 422
            this.identify = o.identify || _.stringify;                                                              // 423
            this.datumTokenizer = o.datumTokenizer;                                                                 // 424
            this.queryTokenizer = o.queryTokenizer;                                                                 // 425
            this.reset();                                                                                           // 426
        }                                                                                                           // 427
        _.mixin(SearchIndex.prototype, {                                                                            // 428
            bootstrap: function bootstrap(o) {                                                                      // 429
                this.datums = o.datums;                                                                             // 430
                this.trie = o.trie;                                                                                 // 431
            },                                                                                                      // 432
            add: function(data) {                                                                                   // 433
                var that = this;                                                                                    // 434
                data = _.isArray(data) ? data : [ data ];                                                           // 435
                _.each(data, function(datum) {                                                                      // 436
                    var id, tokens;                                                                                 // 437
                    that.datums[id = that.identify(datum)] = datum;                                                 // 438
                    tokens = normalizeTokens(that.datumTokenizer(datum));                                           // 439
                    _.each(tokens, function(token) {                                                                // 440
                        var node, chars, ch;                                                                        // 441
                        node = that.trie;                                                                           // 442
                        chars = token.split("");                                                                    // 443
                        while (ch = chars.shift()) {                                                                // 444
                            node = node[CHILDREN][ch] || (node[CHILDREN][ch] = newNode());                          // 445
                            node[IDS].push(id);                                                                     // 446
                        }                                                                                           // 447
                    });                                                                                             // 448
                });                                                                                                 // 449
            },                                                                                                      // 450
            get: function get(ids) {                                                                                // 451
                var that = this;                                                                                    // 452
                return _.map(ids, function(id) {                                                                    // 453
                    return that.datums[id];                                                                         // 454
                });                                                                                                 // 455
            },                                                                                                      // 456
            search: function search(query) {                                                                        // 457
                var that = this, tokens, matches;                                                                   // 458
                tokens = normalizeTokens(this.queryTokenizer(query));                                               // 459
                _.each(tokens, function(token) {                                                                    // 460
                    var node, chars, ch, ids;                                                                       // 461
                    if (matches && matches.length === 0) {                                                          // 462
                        return false;                                                                               // 463
                    }                                                                                               // 464
                    node = that.trie;                                                                               // 465
                    chars = token.split("");                                                                        // 466
                    while (node && (ch = chars.shift())) {                                                          // 467
                        node = node[CHILDREN][ch];                                                                  // 468
                    }                                                                                               // 469
                    if (node && chars.length === 0) {                                                               // 470
                        ids = node[IDS].slice(0);                                                                   // 471
                        matches = matches ? getIntersection(matches, ids) : ids;                                    // 472
                    } else {                                                                                        // 473
                        matches = [];                                                                               // 474
                        return false;                                                                               // 475
                    }                                                                                               // 476
                });                                                                                                 // 477
                return matches ? _.map(unique(matches), function(id) {                                              // 478
                    return that.datums[id];                                                                         // 479
                }) : [];                                                                                            // 480
            },                                                                                                      // 481
            all: function all() {                                                                                   // 482
                var values = [];                                                                                    // 483
                for (var key in this.datums) {                                                                      // 484
                    values.push(this.datums[key]);                                                                  // 485
                }                                                                                                   // 486
                return values;                                                                                      // 487
            },                                                                                                      // 488
            reset: function reset() {                                                                               // 489
                this.datums = {};                                                                                   // 490
                this.trie = newNode();                                                                              // 491
            },                                                                                                      // 492
            serialize: function serialize() {                                                                       // 493
                return {                                                                                            // 494
                    datums: this.datums,                                                                            // 495
                    trie: this.trie                                                                                 // 496
                };                                                                                                  // 497
            }                                                                                                       // 498
        });                                                                                                         // 499
        return SearchIndex;                                                                                         // 500
        function normalizeTokens(tokens) {                                                                          // 501
            tokens = _.filter(tokens, function(token) {                                                             // 502
                return !!token;                                                                                     // 503
            });                                                                                                     // 504
            tokens = _.map(tokens, function(token) {                                                                // 505
                return token.toLowerCase();                                                                         // 506
            });                                                                                                     // 507
            return tokens;                                                                                          // 508
        }                                                                                                           // 509
        function newNode() {                                                                                        // 510
            var node = {};                                                                                          // 511
            node[IDS] = [];                                                                                         // 512
            node[CHILDREN] = {};                                                                                    // 513
            return node;                                                                                            // 514
        }                                                                                                           // 515
        function unique(array) {                                                                                    // 516
            var seen = {}, uniques = [];                                                                            // 517
            for (var i = 0, len = array.length; i < len; i++) {                                                     // 518
                if (!seen[array[i]]) {                                                                              // 519
                    seen[array[i]] = true;                                                                          // 520
                    uniques.push(array[i]);                                                                         // 521
                }                                                                                                   // 522
            }                                                                                                       // 523
            return uniques;                                                                                         // 524
        }                                                                                                           // 525
        function getIntersection(arrayA, arrayB) {                                                                  // 526
            var ai = 0, bi = 0, intersection = [];                                                                  // 527
            arrayA = arrayA.sort();                                                                                 // 528
            arrayB = arrayB.sort();                                                                                 // 529
            var lenArrayA = arrayA.length, lenArrayB = arrayB.length;                                               // 530
            while (ai < lenArrayA && bi < lenArrayB) {                                                              // 531
                if (arrayA[ai] < arrayB[bi]) {                                                                      // 532
                    ai++;                                                                                           // 533
                } else if (arrayA[ai] > arrayB[bi]) {                                                               // 534
                    bi++;                                                                                           // 535
                } else {                                                                                            // 536
                    intersection.push(arrayA[ai]);                                                                  // 537
                    ai++;                                                                                           // 538
                    bi++;                                                                                           // 539
                }                                                                                                   // 540
            }                                                                                                       // 541
            return intersection;                                                                                    // 542
        }                                                                                                           // 543
    }();                                                                                                            // 544
    var Prefetch = function() {                                                                                     // 545
        "use strict";                                                                                               // 546
        var keys;                                                                                                   // 547
        keys = {                                                                                                    // 548
            data: "data",                                                                                           // 549
            protocol: "protocol",                                                                                   // 550
            thumbprint: "thumbprint"                                                                                // 551
        };                                                                                                          // 552
        function Prefetch(o) {                                                                                      // 553
            this.url = o.url;                                                                                       // 554
            this.ttl = o.ttl;                                                                                       // 555
            this.cache = o.cache;                                                                                   // 556
            this.prepare = o.prepare;                                                                               // 557
            this.transform = o.transform;                                                                           // 558
            this.transport = o.transport;                                                                           // 559
            this.thumbprint = o.thumbprint;                                                                         // 560
            this.storage = new PersistentStorage(o.cacheKey);                                                       // 561
        }                                                                                                           // 562
        _.mixin(Prefetch.prototype, {                                                                               // 563
            _settings: function settings() {                                                                        // 564
                return {                                                                                            // 565
                    url: this.url,                                                                                  // 566
                    type: "GET",                                                                                    // 567
                    dataType: "json"                                                                                // 568
                };                                                                                                  // 569
            },                                                                                                      // 570
            store: function store(data) {                                                                           // 571
                if (!this.cache) {                                                                                  // 572
                    return;                                                                                         // 573
                }                                                                                                   // 574
                this.storage.set(keys.data, data, this.ttl);                                                        // 575
                this.storage.set(keys.protocol, location.protocol, this.ttl);                                       // 576
                this.storage.set(keys.thumbprint, this.thumbprint, this.ttl);                                       // 577
            },                                                                                                      // 578
            fromCache: function fromCache() {                                                                       // 579
                var stored = {}, isExpired;                                                                         // 580
                if (!this.cache) {                                                                                  // 581
                    return null;                                                                                    // 582
                }                                                                                                   // 583
                stored.data = this.storage.get(keys.data);                                                          // 584
                stored.protocol = this.storage.get(keys.protocol);                                                  // 585
                stored.thumbprint = this.storage.get(keys.thumbprint);                                              // 586
                isExpired = stored.thumbprint !== this.thumbprint || stored.protocol !== location.protocol;         // 587
                return stored.data && !isExpired ? stored.data : null;                                              // 588
            },                                                                                                      // 589
            fromNetwork: function(cb) {                                                                             // 590
                var that = this, settings;                                                                          // 591
                if (!cb) {                                                                                          // 592
                    return;                                                                                         // 593
                }                                                                                                   // 594
                settings = this.prepare(this._settings());                                                          // 595
                this.transport(settings).fail(onError).done(onResponse);                                            // 596
                function onError() {                                                                                // 597
                    cb(true);                                                                                       // 598
                }                                                                                                   // 599
                function onResponse(resp) {                                                                         // 600
                    cb(null, that.transform(resp));                                                                 // 601
                }                                                                                                   // 602
            },                                                                                                      // 603
            clear: function clear() {                                                                               // 604
                this.storage.clear();                                                                               // 605
                return this;                                                                                        // 606
            }                                                                                                       // 607
        });                                                                                                         // 608
        return Prefetch;                                                                                            // 609
    }();                                                                                                            // 610
    var Remote = function() {                                                                                       // 611
        "use strict";                                                                                               // 612
        function Remote(o) {                                                                                        // 613
            this.url = o.url;                                                                                       // 614
            this.prepare = o.prepare;                                                                               // 615
            this.transform = o.transform;                                                                           // 616
            this.transport = new Transport({                                                                        // 617
                cache: o.cache,                                                                                     // 618
                limiter: o.limiter,                                                                                 // 619
                transport: o.transport                                                                              // 620
            });                                                                                                     // 621
        }                                                                                                           // 622
        _.mixin(Remote.prototype, {                                                                                 // 623
            _settings: function settings() {                                                                        // 624
                return {                                                                                            // 625
                    url: this.url,                                                                                  // 626
                    type: "GET",                                                                                    // 627
                    dataType: "json"                                                                                // 628
                };                                                                                                  // 629
            },                                                                                                      // 630
            get: function get(query, cb) {                                                                          // 631
                var that = this, settings;                                                                          // 632
                if (!cb) {                                                                                          // 633
                    return;                                                                                         // 634
                }                                                                                                   // 635
                query = query || "";                                                                                // 636
                settings = this.prepare(query, this._settings());                                                   // 637
                return this.transport.get(settings, onResponse);                                                    // 638
                function onResponse(err, resp) {                                                                    // 639
                    err ? cb([]) : cb(that.transform(resp));                                                        // 640
                }                                                                                                   // 641
            },                                                                                                      // 642
            cancelLastRequest: function cancelLastRequest() {                                                       // 643
                this.transport.cancel();                                                                            // 644
            }                                                                                                       // 645
        });                                                                                                         // 646
        return Remote;                                                                                              // 647
    }();                                                                                                            // 648
    var oParser = function() {                                                                                      // 649
        "use strict";                                                                                               // 650
        return function parse(o) {                                                                                  // 651
            var defaults, sorter;                                                                                   // 652
            defaults = {                                                                                            // 653
                initialize: true,                                                                                   // 654
                identify: _.stringify,                                                                              // 655
                datumTokenizer: null,                                                                               // 656
                queryTokenizer: null,                                                                               // 657
                sufficient: 5,                                                                                      // 658
                sorter: null,                                                                                       // 659
                local: [],                                                                                          // 660
                prefetch: null,                                                                                     // 661
                remote: null                                                                                        // 662
            };                                                                                                      // 663
            o = _.mixin(defaults, o || {});                                                                         // 664
            !o.datumTokenizer && $.error("datumTokenizer is required");                                             // 665
            !o.queryTokenizer && $.error("queryTokenizer is required");                                             // 666
            sorter = o.sorter;                                                                                      // 667
            o.sorter = sorter ? function(x) {                                                                       // 668
                return x.sort(sorter);                                                                              // 669
            } : _.identity;                                                                                         // 670
            o.local = _.isFunction(o.local) ? o.local() : o.local;                                                  // 671
            o.prefetch = parsePrefetch(o.prefetch);                                                                 // 672
            o.remote = parseRemote(o.remote);                                                                       // 673
            return o;                                                                                               // 674
        };                                                                                                          // 675
        function parsePrefetch(o) {                                                                                 // 676
            var defaults;                                                                                           // 677
            if (!o) {                                                                                               // 678
                return null;                                                                                        // 679
            }                                                                                                       // 680
            defaults = {                                                                                            // 681
                url: null,                                                                                          // 682
                ttl: 24 * 60 * 60 * 1e3,                                                                            // 683
                cache: true,                                                                                        // 684
                cacheKey: null,                                                                                     // 685
                thumbprint: "",                                                                                     // 686
                prepare: _.identity,                                                                                // 687
                transform: _.identity,                                                                              // 688
                transport: null                                                                                     // 689
            };                                                                                                      // 690
            o = _.isString(o) ? {                                                                                   // 691
                url: o                                                                                              // 692
            } : o;                                                                                                  // 693
            o = _.mixin(defaults, o);                                                                               // 694
            !o.url && $.error("prefetch requires url to be set");                                                   // 695
            o.transform = o.filter || o.transform;                                                                  // 696
            o.cacheKey = o.cacheKey || o.url;                                                                       // 697
            o.thumbprint = VERSION + o.thumbprint;                                                                  // 698
            o.transport = o.transport ? callbackToDeferred(o.transport) : $.ajax;                                   // 699
            return o;                                                                                               // 700
        }                                                                                                           // 701
        function parseRemote(o) {                                                                                   // 702
            var defaults;                                                                                           // 703
            if (!o) {                                                                                               // 704
                return;                                                                                             // 705
            }                                                                                                       // 706
            defaults = {                                                                                            // 707
                url: null,                                                                                          // 708
                cache: true,                                                                                        // 709
                prepare: null,                                                                                      // 710
                replace: null,                                                                                      // 711
                wildcard: null,                                                                                     // 712
                limiter: null,                                                                                      // 713
                rateLimitBy: "debounce",                                                                            // 714
                rateLimitWait: 300,                                                                                 // 715
                transform: _.identity,                                                                              // 716
                transport: null                                                                                     // 717
            };                                                                                                      // 718
            o = _.isString(o) ? {                                                                                   // 719
                url: o                                                                                              // 720
            } : o;                                                                                                  // 721
            o = _.mixin(defaults, o);                                                                               // 722
            !o.url && $.error("remote requires url to be set");                                                     // 723
            o.transform = o.filter || o.transform;                                                                  // 724
            o.prepare = toRemotePrepare(o);                                                                         // 725
            o.limiter = toLimiter(o);                                                                               // 726
            o.transport = o.transport ? callbackToDeferred(o.transport) : $.ajax;                                   // 727
            delete o.replace;                                                                                       // 728
            delete o.wildcard;                                                                                      // 729
            delete o.rateLimitBy;                                                                                   // 730
            delete o.rateLimitWait;                                                                                 // 731
            return o;                                                                                               // 732
        }                                                                                                           // 733
        function toRemotePrepare(o) {                                                                               // 734
            var prepare, replace, wildcard;                                                                         // 735
            prepare = o.prepare;                                                                                    // 736
            replace = o.replace;                                                                                    // 737
            wildcard = o.wildcard;                                                                                  // 738
            if (prepare) {                                                                                          // 739
                return prepare;                                                                                     // 740
            }                                                                                                       // 741
            if (replace) {                                                                                          // 742
                prepare = prepareByReplace;                                                                         // 743
            } else if (o.wildcard) {                                                                                // 744
                prepare = prepareByWildcard;                                                                        // 745
            } else {                                                                                                // 746
                prepare = idenityPrepare;                                                                           // 747
            }                                                                                                       // 748
            return prepare;                                                                                         // 749
            function prepareByReplace(query, settings) {                                                            // 750
                settings.url = replace(settings.url, query);                                                        // 751
                return settings;                                                                                    // 752
            }                                                                                                       // 753
            function prepareByWildcard(query, settings) {                                                           // 754
                settings.url = settings.url.replace(wildcard, encodeURIComponent(query));                           // 755
                return settings;                                                                                    // 756
            }                                                                                                       // 757
            function idenityPrepare(query, settings) {                                                              // 758
                return settings;                                                                                    // 759
            }                                                                                                       // 760
        }                                                                                                           // 761
        function toLimiter(o) {                                                                                     // 762
            var limiter, method, wait;                                                                              // 763
            limiter = o.limiter;                                                                                    // 764
            method = o.rateLimitBy;                                                                                 // 765
            wait = o.rateLimitWait;                                                                                 // 766
            if (!limiter) {                                                                                         // 767
                limiter = /^throttle$/i.test(method) ? throttle(wait) : debounce(wait);                             // 768
            }                                                                                                       // 769
            return limiter;                                                                                         // 770
            function debounce(wait) {                                                                               // 771
                return function debounce(fn) {                                                                      // 772
                    return _.debounce(fn, wait);                                                                    // 773
                };                                                                                                  // 774
            }                                                                                                       // 775
            function throttle(wait) {                                                                               // 776
                return function throttle(fn) {                                                                      // 777
                    return _.throttle(fn, wait);                                                                    // 778
                };                                                                                                  // 779
            }                                                                                                       // 780
        }                                                                                                           // 781
        function callbackToDeferred(fn) {                                                                           // 782
            return function wrapper(o) {                                                                            // 783
                var deferred = $.Deferred();                                                                        // 784
                fn(o, onSuccess, onError);                                                                          // 785
                return deferred;                                                                                    // 786
                function onSuccess(resp) {                                                                          // 787
                    _.defer(function() {                                                                            // 788
                        deferred.resolve(resp);                                                                     // 789
                    });                                                                                             // 790
                }                                                                                                   // 791
                function onError(err) {                                                                             // 792
                    _.defer(function() {                                                                            // 793
                        deferred.reject(err);                                                                       // 794
                    });                                                                                             // 795
                }                                                                                                   // 796
            };                                                                                                      // 797
        }                                                                                                           // 798
    }();                                                                                                            // 799
    var Bloodhound = function() {                                                                                   // 800
        "use strict";                                                                                               // 801
        var old;                                                                                                    // 802
        old = window && window.Bloodhound;                                                                          // 803
        function Bloodhound(o) {                                                                                    // 804
            o = oParser(o);                                                                                         // 805
            this.sorter = o.sorter;                                                                                 // 806
            this.identify = o.identify;                                                                             // 807
            this.sufficient = o.sufficient;                                                                         // 808
            this.local = o.local;                                                                                   // 809
            this.remote = o.remote ? new Remote(o.remote) : null;                                                   // 810
            this.prefetch = o.prefetch ? new Prefetch(o.prefetch) : null;                                           // 811
            this.index = new SearchIndex({                                                                          // 812
                identify: this.identify,                                                                            // 813
                datumTokenizer: o.datumTokenizer,                                                                   // 814
                queryTokenizer: o.queryTokenizer                                                                    // 815
            });                                                                                                     // 816
            o.initialize !== false && this.initialize();                                                            // 817
        }                                                                                                           // 818
        Bloodhound.noConflict = function noConflict() {                                                             // 819
            window && (window.Bloodhound = old);                                                                    // 820
            return Bloodhound;                                                                                      // 821
        };                                                                                                          // 822
        Bloodhound.tokenizers = tokenizers;                                                                         // 823
        _.mixin(Bloodhound.prototype, {                                                                             // 824
            __ttAdapter: function ttAdapter() {                                                                     // 825
                var that = this;                                                                                    // 826
                return this.remote ? withAsync : withoutAsync;                                                      // 827
                function withAsync(query, sync, async) {                                                            // 828
                    return that.search(query, sync, async);                                                         // 829
                }                                                                                                   // 830
                function withoutAsync(query, sync) {                                                                // 831
                    return that.search(query, sync);                                                                // 832
                }                                                                                                   // 833
            },                                                                                                      // 834
            _loadPrefetch: function loadPrefetch() {                                                                // 835
                var that = this, deferred, serialized;                                                              // 836
                deferred = $.Deferred();                                                                            // 837
                if (!this.prefetch) {                                                                               // 838
                    deferred.resolve();                                                                             // 839
                } else if (serialized = this.prefetch.fromCache()) {                                                // 840
                    this.index.bootstrap(serialized);                                                               // 841
                    deferred.resolve();                                                                             // 842
                } else {                                                                                            // 843
                    this.prefetch.fromNetwork(done);                                                                // 844
                }                                                                                                   // 845
                return deferred.promise();                                                                          // 846
                function done(err, data) {                                                                          // 847
                    if (err) {                                                                                      // 848
                        return deferred.reject();                                                                   // 849
                    }                                                                                               // 850
                    that.add(data);                                                                                 // 851
                    that.prefetch.store(that.index.serialize());                                                    // 852
                    deferred.resolve();                                                                             // 853
                }                                                                                                   // 854
            },                                                                                                      // 855
            _initialize: function initialize() {                                                                    // 856
                var that = this, deferred;                                                                          // 857
                this.clear();                                                                                       // 858
                (this.initPromise = this._loadPrefetch()).done(addLocalToIndex);                                    // 859
                return this.initPromise;                                                                            // 860
                function addLocalToIndex() {                                                                        // 861
                    that.add(that.local);                                                                           // 862
                }                                                                                                   // 863
            },                                                                                                      // 864
            initialize: function initialize(force) {                                                                // 865
                return !this.initPromise || force ? this._initialize() : this.initPromise;                          // 866
            },                                                                                                      // 867
            add: function add(data) {                                                                               // 868
                this.index.add(data);                                                                               // 869
                return this;                                                                                        // 870
            },                                                                                                      // 871
            get: function get(ids) {                                                                                // 872
                ids = _.isArray(ids) ? ids : [].slice.call(arguments);                                              // 873
                return this.index.get(ids);                                                                         // 874
            },                                                                                                      // 875
            search: function search(query, sync, async) {                                                           // 876
                var that = this, local;                                                                             // 877
                local = this.sorter(this.index.search(query));                                                      // 878
                sync(this.remote ? local.slice() : local);                                                          // 879
                if (this.remote && local.length < this.sufficient) {                                                // 880
                    this.remote.get(query, processRemote);                                                          // 881
                } else if (this.remote) {                                                                           // 882
                    this.remote.cancelLastRequest();                                                                // 883
                }                                                                                                   // 884
                return this;                                                                                        // 885
                function processRemote(remote) {                                                                    // 886
                    var nonDuplicates = [];                                                                         // 887
                    _.each(remote, function(r) {                                                                    // 888
                        !_.some(local, function(l) {                                                                // 889
                            return that.identify(r) === that.identify(l);                                           // 890
                        }) && nonDuplicates.push(r);                                                                // 891
                    });                                                                                             // 892
                    async && async(nonDuplicates);                                                                  // 893
                }                                                                                                   // 894
            },                                                                                                      // 895
            all: function all() {                                                                                   // 896
                return this.index.all();                                                                            // 897
            },                                                                                                      // 898
            clear: function clear() {                                                                               // 899
                this.index.reset();                                                                                 // 900
                return this;                                                                                        // 901
            },                                                                                                      // 902
            clearPrefetchCache: function clearPrefetchCache() {                                                     // 903
                this.prefetch && this.prefetch.clear();                                                             // 904
                return this;                                                                                        // 905
            },                                                                                                      // 906
            clearRemoteCache: function clearRemoteCache() {                                                         // 907
                Transport.resetCache();                                                                             // 908
                return this;                                                                                        // 909
            },                                                                                                      // 910
            ttAdapter: function ttAdapter() {                                                                       // 911
                return this.__ttAdapter();                                                                          // 912
            }                                                                                                       // 913
        });                                                                                                         // 914
        return Bloodhound;                                                                                          // 915
    }();                                                                                                            // 916
    return Bloodhound;                                                                                              // 917
});                                                                                                                 // 918
                                                                                                                    // 919
(function(root, factory) {                                                                                          // 920
    if (typeof define === "function" && define.amd) {                                                               // 921
        define("typeahead.js", [ "jquery" ], function(a0) {                                                         // 922
            return factory(a0);                                                                                     // 923
        });                                                                                                         // 924
    } else if (typeof exports === "object") {                                                                       // 925
        module.exports = factory(require("jquery"));                                                                // 926
    } else {                                                                                                        // 927
        factory(jQuery);                                                                                            // 928
    }                                                                                                               // 929
})(this, function($) {                                                                                              // 930
    var _ = function() {                                                                                            // 931
        "use strict";                                                                                               // 932
        return {                                                                                                    // 933
            isMsie: function() {                                                                                    // 934
                return /(msie|trident)/i.test(navigator.userAgent) ? navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2] : false;
            },                                                                                                      // 936
            isBlankString: function(str) {                                                                          // 937
                return !str || /^\s*$/.test(str);                                                                   // 938
            },                                                                                                      // 939
            escapeRegExChars: function(str) {                                                                       // 940
                return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");                                  // 941
            },                                                                                                      // 942
            isString: function(obj) {                                                                               // 943
                return typeof obj === "string";                                                                     // 944
            },                                                                                                      // 945
            isNumber: function(obj) {                                                                               // 946
                return typeof obj === "number";                                                                     // 947
            },                                                                                                      // 948
            isArray: $.isArray,                                                                                     // 949
            isFunction: $.isFunction,                                                                               // 950
            isObject: $.isPlainObject,                                                                              // 951
            isUndefined: function(obj) {                                                                            // 952
                return typeof obj === "undefined";                                                                  // 953
            },                                                                                                      // 954
            isElement: function(obj) {                                                                              // 955
                return !!(obj && obj.nodeType === 1);                                                               // 956
            },                                                                                                      // 957
            isJQuery: function(obj) {                                                                               // 958
                return obj instanceof $;                                                                            // 959
            },                                                                                                      // 960
            toStr: function toStr(s) {                                                                              // 961
                return _.isUndefined(s) || s === null ? "" : s + "";                                                // 962
            },                                                                                                      // 963
            bind: $.proxy,                                                                                          // 964
            each: function(collection, cb) {                                                                        // 965
                $.each(collection, reverseArgs);                                                                    // 966
                function reverseArgs(index, value) {                                                                // 967
                    return cb(value, index);                                                                        // 968
                }                                                                                                   // 969
            },                                                                                                      // 970
            map: $.map,                                                                                             // 971
            filter: $.grep,                                                                                         // 972
            every: function(obj, test) {                                                                            // 973
                var result = true;                                                                                  // 974
                if (!obj) {                                                                                         // 975
                    return result;                                                                                  // 976
                }                                                                                                   // 977
                $.each(obj, function(key, val) {                                                                    // 978
                    if (!(result = test.call(null, val, key, obj))) {                                               // 979
                        return false;                                                                               // 980
                    }                                                                                               // 981
                });                                                                                                 // 982
                return !!result;                                                                                    // 983
            },                                                                                                      // 984
            some: function(obj, test) {                                                                             // 985
                var result = false;                                                                                 // 986
                if (!obj) {                                                                                         // 987
                    return result;                                                                                  // 988
                }                                                                                                   // 989
                $.each(obj, function(key, val) {                                                                    // 990
                    if (result = test.call(null, val, key, obj)) {                                                  // 991
                        return false;                                                                               // 992
                    }                                                                                               // 993
                });                                                                                                 // 994
                return !!result;                                                                                    // 995
            },                                                                                                      // 996
            mixin: $.extend,                                                                                        // 997
            identity: function(x) {                                                                                 // 998
                return x;                                                                                           // 999
            },                                                                                                      // 1000
            clone: function(obj) {                                                                                  // 1001
                return $.extend(true, {}, obj);                                                                     // 1002
            },                                                                                                      // 1003
            getIdGenerator: function() {                                                                            // 1004
                var counter = 0;                                                                                    // 1005
                return function() {                                                                                 // 1006
                    return counter++;                                                                               // 1007
                };                                                                                                  // 1008
            },                                                                                                      // 1009
            templatify: function templatify(obj) {                                                                  // 1010
                return $.isFunction(obj) ? obj : template;                                                          // 1011
                function template() {                                                                               // 1012
                    return String(obj);                                                                             // 1013
                }                                                                                                   // 1014
            },                                                                                                      // 1015
            defer: function(fn) {                                                                                   // 1016
                setTimeout(fn, 0);                                                                                  // 1017
            },                                                                                                      // 1018
            debounce: function(func, wait, immediate) {                                                             // 1019
                var timeout, result;                                                                                // 1020
                return function() {                                                                                 // 1021
                    var context = this, args = arguments, later, callNow;                                           // 1022
                    later = function() {                                                                            // 1023
                        timeout = null;                                                                             // 1024
                        if (!immediate) {                                                                           // 1025
                            result = func.apply(context, args);                                                     // 1026
                        }                                                                                           // 1027
                    };                                                                                              // 1028
                    callNow = immediate && !timeout;                                                                // 1029
                    clearTimeout(timeout);                                                                          // 1030
                    timeout = setTimeout(later, wait);                                                              // 1031
                    if (callNow) {                                                                                  // 1032
                        result = func.apply(context, args);                                                         // 1033
                    }                                                                                               // 1034
                    return result;                                                                                  // 1035
                };                                                                                                  // 1036
            },                                                                                                      // 1037
            throttle: function(func, wait) {                                                                        // 1038
                var context, args, timeout, result, previous, later;                                                // 1039
                previous = 0;                                                                                       // 1040
                later = function() {                                                                                // 1041
                    previous = new Date();                                                                          // 1042
                    timeout = null;                                                                                 // 1043
                    result = func.apply(context, args);                                                             // 1044
                };                                                                                                  // 1045
                return function() {                                                                                 // 1046
                    var now = new Date(), remaining = wait - (now - previous);                                      // 1047
                    context = this;                                                                                 // 1048
                    args = arguments;                                                                               // 1049
                    if (remaining <= 0) {                                                                           // 1050
                        clearTimeout(timeout);                                                                      // 1051
                        timeout = null;                                                                             // 1052
                        previous = now;                                                                             // 1053
                        result = func.apply(context, args);                                                         // 1054
                    } else if (!timeout) {                                                                          // 1055
                        timeout = setTimeout(later, remaining);                                                     // 1056
                    }                                                                                               // 1057
                    return result;                                                                                  // 1058
                };                                                                                                  // 1059
            },                                                                                                      // 1060
            stringify: function(val) {                                                                              // 1061
                return _.isString(val) ? val : JSON.stringify(val);                                                 // 1062
            },                                                                                                      // 1063
            noop: function() {}                                                                                     // 1064
        };                                                                                                          // 1065
    }();                                                                                                            // 1066
    var WWW = function() {                                                                                          // 1067
        "use strict";                                                                                               // 1068
        var defaultClassNames = {                                                                                   // 1069
            wrapper: "twitter-typeahead",                                                                           // 1070
            input: "tt-input",                                                                                      // 1071
            hint: "tt-hint",                                                                                        // 1072
            menu: "tt-menu",                                                                                        // 1073
            dataset: "tt-dataset",                                                                                  // 1074
            suggestion: "tt-suggestion",                                                                            // 1075
            selectable: "tt-selectable",                                                                            // 1076
            empty: "tt-empty",                                                                                      // 1077
            open: "tt-open",                                                                                        // 1078
            cursor: "tt-cursor",                                                                                    // 1079
            highlight: "tt-highlight"                                                                               // 1080
        };                                                                                                          // 1081
        return build;                                                                                               // 1082
        function build(o) {                                                                                         // 1083
            var www, classes;                                                                                       // 1084
            classes = _.mixin({}, defaultClassNames, o);                                                            // 1085
            www = {                                                                                                 // 1086
                css: buildCss(),                                                                                    // 1087
                classes: classes,                                                                                   // 1088
                html: buildHtml(classes),                                                                           // 1089
                selectors: buildSelectors(classes)                                                                  // 1090
            };                                                                                                      // 1091
            return {                                                                                                // 1092
                css: www.css,                                                                                       // 1093
                html: www.html,                                                                                     // 1094
                classes: www.classes,                                                                               // 1095
                selectors: www.selectors,                                                                           // 1096
                mixin: function(o) {                                                                                // 1097
                    _.mixin(o, www);                                                                                // 1098
                }                                                                                                   // 1099
            };                                                                                                      // 1100
        }                                                                                                           // 1101
        function buildHtml(c) {                                                                                     // 1102
            return {                                                                                                // 1103
                wrapper: '<span class="' + c.wrapper + '"></span>',                                                 // 1104
                menu: '<div class="' + c.menu + '"></div>'                                                          // 1105
            };                                                                                                      // 1106
        }                                                                                                           // 1107
        function buildSelectors(classes) {                                                                          // 1108
            var selectors = {};                                                                                     // 1109
            _.each(classes, function(v, k) {                                                                        // 1110
                selectors[k] = "." + v;                                                                             // 1111
            });                                                                                                     // 1112
            return selectors;                                                                                       // 1113
        }                                                                                                           // 1114
        function buildCss() {                                                                                       // 1115
            var css = {                                                                                             // 1116
                wrapper: {                                                                                          // 1117
                    position: "relative",                                                                           // 1118
                    display: "inline-block"                                                                         // 1119
                },                                                                                                  // 1120
                hint: {                                                                                             // 1121
                    position: "absolute",                                                                           // 1122
                    top: "0",                                                                                       // 1123
                    left: "0",                                                                                      // 1124
                    borderColor: "transparent",                                                                     // 1125
                    boxShadow: "none",                                                                              // 1126
                    opacity: "1"                                                                                    // 1127
                },                                                                                                  // 1128
                input: {                                                                                            // 1129
                    position: "relative",                                                                           // 1130
                    verticalAlign: "top",                                                                           // 1131
                    backgroundColor: "transparent"                                                                  // 1132
                },                                                                                                  // 1133
                inputWithNoHint: {                                                                                  // 1134
                    position: "relative",                                                                           // 1135
                    verticalAlign: "top"                                                                            // 1136
                },                                                                                                  // 1137
                menu: {                                                                                             // 1138
                    position: "absolute",                                                                           // 1139
                    top: "100%",                                                                                    // 1140
                    left: "0",                                                                                      // 1141
                    zIndex: "100",                                                                                  // 1142
                    display: "none"                                                                                 // 1143
                },                                                                                                  // 1144
                ltr: {                                                                                              // 1145
                    left: "0",                                                                                      // 1146
                    right: "auto"                                                                                   // 1147
                },                                                                                                  // 1148
                rtl: {                                                                                              // 1149
                    left: "auto",                                                                                   // 1150
                    right: " 0"                                                                                     // 1151
                }                                                                                                   // 1152
            };                                                                                                      // 1153
            if (_.isMsie()) {                                                                                       // 1154
                _.mixin(css.input, {                                                                                // 1155
                    backgroundImage: "url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)"
                });                                                                                                 // 1157
            }                                                                                                       // 1158
            return css;                                                                                             // 1159
        }                                                                                                           // 1160
    }();                                                                                                            // 1161
    var EventBus = function() {                                                                                     // 1162
        "use strict";                                                                                               // 1163
        var namespace, deprecationMap;                                                                              // 1164
        namespace = "typeahead:";                                                                                   // 1165
        deprecationMap = {                                                                                          // 1166
            render: "rendered",                                                                                     // 1167
            cursorchange: "cursorchanged",                                                                          // 1168
            select: "selected",                                                                                     // 1169
            autocomplete: "autocompleted"                                                                           // 1170
        };                                                                                                          // 1171
        function EventBus(o) {                                                                                      // 1172
            if (!o || !o.el) {                                                                                      // 1173
                $.error("EventBus initialized without el");                                                         // 1174
            }                                                                                                       // 1175
            this.$el = $(o.el);                                                                                     // 1176
        }                                                                                                           // 1177
        _.mixin(EventBus.prototype, {                                                                               // 1178
            _trigger: function(type, args) {                                                                        // 1179
                var $e;                                                                                             // 1180
                $e = $.Event(namespace + type);                                                                     // 1181
                (args = args || []).unshift($e);                                                                    // 1182
                this.$el.trigger.apply(this.$el, args);                                                             // 1183
                return $e;                                                                                          // 1184
            },                                                                                                      // 1185
            before: function(type) {                                                                                // 1186
                var args, $e;                                                                                       // 1187
                args = [].slice.call(arguments, 1);                                                                 // 1188
                $e = this._trigger("before" + type, args);                                                          // 1189
                return $e.isDefaultPrevented();                                                                     // 1190
            },                                                                                                      // 1191
            trigger: function(type) {                                                                               // 1192
                var deprecatedType;                                                                                 // 1193
                this._trigger(type, [].slice.call(arguments, 1));                                                   // 1194
                if (deprecatedType = deprecationMap[type]) {                                                        // 1195
                    this._trigger(deprecatedType, [].slice.call(arguments, 1));                                     // 1196
                }                                                                                                   // 1197
            }                                                                                                       // 1198
        });                                                                                                         // 1199
        return EventBus;                                                                                            // 1200
    }();                                                                                                            // 1201
    var EventEmitter = function() {                                                                                 // 1202
        "use strict";                                                                                               // 1203
        var splitter = /\s+/, nextTick = getNextTick();                                                             // 1204
        return {                                                                                                    // 1205
            onSync: onSync,                                                                                         // 1206
            onAsync: onAsync,                                                                                       // 1207
            off: off,                                                                                               // 1208
            trigger: trigger                                                                                        // 1209
        };                                                                                                          // 1210
        function on(method, types, cb, context) {                                                                   // 1211
            var type;                                                                                               // 1212
            if (!cb) {                                                                                              // 1213
                return this;                                                                                        // 1214
            }                                                                                                       // 1215
            types = types.split(splitter);                                                                          // 1216
            cb = context ? bindContext(cb, context) : cb;                                                           // 1217
            this._callbacks = this._callbacks || {};                                                                // 1218
            while (type = types.shift()) {                                                                          // 1219
                this._callbacks[type] = this._callbacks[type] || {                                                  // 1220
                    sync: [],                                                                                       // 1221
                    async: []                                                                                       // 1222
                };                                                                                                  // 1223
                this._callbacks[type][method].push(cb);                                                             // 1224
            }                                                                                                       // 1225
            return this;                                                                                            // 1226
        }                                                                                                           // 1227
        function onAsync(types, cb, context) {                                                                      // 1228
            return on.call(this, "async", types, cb, context);                                                      // 1229
        }                                                                                                           // 1230
        function onSync(types, cb, context) {                                                                       // 1231
            return on.call(this, "sync", types, cb, context);                                                       // 1232
        }                                                                                                           // 1233
        function off(types) {                                                                                       // 1234
            var type;                                                                                               // 1235
            if (!this._callbacks) {                                                                                 // 1236
                return this;                                                                                        // 1237
            }                                                                                                       // 1238
            types = types.split(splitter);                                                                          // 1239
            while (type = types.shift()) {                                                                          // 1240
                delete this._callbacks[type];                                                                       // 1241
            }                                                                                                       // 1242
            return this;                                                                                            // 1243
        }                                                                                                           // 1244
        function trigger(types) {                                                                                   // 1245
            var type, callbacks, args, syncFlush, asyncFlush;                                                       // 1246
            if (!this._callbacks) {                                                                                 // 1247
                return this;                                                                                        // 1248
            }                                                                                                       // 1249
            types = types.split(splitter);                                                                          // 1250
            args = [].slice.call(arguments, 1);                                                                     // 1251
            while ((type = types.shift()) && (callbacks = this._callbacks[type])) {                                 // 1252
                syncFlush = getFlush(callbacks.sync, this, [ type ].concat(args));                                  // 1253
                asyncFlush = getFlush(callbacks.async, this, [ type ].concat(args));                                // 1254
                syncFlush() && nextTick(asyncFlush);                                                                // 1255
            }                                                                                                       // 1256
            return this;                                                                                            // 1257
        }                                                                                                           // 1258
        function getFlush(callbacks, context, args) {                                                               // 1259
            return flush;                                                                                           // 1260
            function flush() {                                                                                      // 1261
                var cancelled;                                                                                      // 1262
                for (var i = 0, len = callbacks.length; !cancelled && i < len; i += 1) {                            // 1263
                    cancelled = callbacks[i].apply(context, args) === false;                                        // 1264
                }                                                                                                   // 1265
                return !cancelled;                                                                                  // 1266
            }                                                                                                       // 1267
        }                                                                                                           // 1268
        function getNextTick() {                                                                                    // 1269
            var nextTickFn;                                                                                         // 1270
            if (window.setImmediate) {                                                                              // 1271
                nextTickFn = function nextTickSetImmediate(fn) {                                                    // 1272
                    setImmediate(function() {                                                                       // 1273
                        fn();                                                                                       // 1274
                    });                                                                                             // 1275
                };                                                                                                  // 1276
            } else {                                                                                                // 1277
                nextTickFn = function nextTickSetTimeout(fn) {                                                      // 1278
                    setTimeout(function() {                                                                         // 1279
                        fn();                                                                                       // 1280
                    }, 0);                                                                                          // 1281
                };                                                                                                  // 1282
            }                                                                                                       // 1283
            return nextTickFn;                                                                                      // 1284
        }                                                                                                           // 1285
        function bindContext(fn, context) {                                                                         // 1286
            return fn.bind ? fn.bind(context) : function() {                                                        // 1287
                fn.apply(context, [].slice.call(arguments, 0));                                                     // 1288
            };                                                                                                      // 1289
        }                                                                                                           // 1290
    }();                                                                                                            // 1291
    var highlight = function(doc) {                                                                                 // 1292
        "use strict";                                                                                               // 1293
        var defaults = {                                                                                            // 1294
            node: null,                                                                                             // 1295
            pattern: null,                                                                                          // 1296
            tagName: "strong",                                                                                      // 1297
            className: null,                                                                                        // 1298
            wordsOnly: false,                                                                                       // 1299
            caseSensitive: false                                                                                    // 1300
        };                                                                                                          // 1301
        return function hightlight(o) {                                                                             // 1302
            var regex;                                                                                              // 1303
            o = _.mixin({}, defaults, o);                                                                           // 1304
            if (!o.node || !o.pattern) {                                                                            // 1305
                return;                                                                                             // 1306
            }                                                                                                       // 1307
            o.pattern = _.isArray(o.pattern) ? o.pattern : [ o.pattern ];                                           // 1308
            regex = getRegex(o.pattern, o.caseSensitive, o.wordsOnly);                                              // 1309
            traverse(o.node, hightlightTextNode);                                                                   // 1310
            function hightlightTextNode(textNode) {                                                                 // 1311
                var match, patternNode, wrapperNode;                                                                // 1312
                if (match = regex.exec(textNode.data)) {                                                            // 1313
                    wrapperNode = doc.createElement(o.tagName);                                                     // 1314
                    o.className && (wrapperNode.className = o.className);                                           // 1315
                    patternNode = textNode.splitText(match.index);                                                  // 1316
                    patternNode.splitText(match[0].length);                                                         // 1317
                    wrapperNode.appendChild(patternNode.cloneNode(true));                                           // 1318
                    textNode.parentNode.replaceChild(wrapperNode, patternNode);                                     // 1319
                }                                                                                                   // 1320
                return !!match;                                                                                     // 1321
            }                                                                                                       // 1322
            function traverse(el, hightlightTextNode) {                                                             // 1323
                var childNode, TEXT_NODE_TYPE = 3;                                                                  // 1324
                for (var i = 0; i < el.childNodes.length; i++) {                                                    // 1325
                    childNode = el.childNodes[i];                                                                   // 1326
                    if (childNode.nodeType === TEXT_NODE_TYPE) {                                                    // 1327
                        i += hightlightTextNode(childNode) ? 1 : 0;                                                 // 1328
                    } else {                                                                                        // 1329
                        traverse(childNode, hightlightTextNode);                                                    // 1330
                    }                                                                                               // 1331
                }                                                                                                   // 1332
            }                                                                                                       // 1333
        };                                                                                                          // 1334
        function getRegex(patterns, caseSensitive, wordsOnly) {                                                     // 1335
            var escapedPatterns = [], regexStr;                                                                     // 1336
            for (var i = 0, len = patterns.length; i < len; i++) {                                                  // 1337
                escapedPatterns.push(_.escapeRegExChars(patterns[i]));                                              // 1338
            }                                                                                                       // 1339
            regexStr = wordsOnly ? "\\b(" + escapedPatterns.join("|") + ")\\b" : "(" + escapedPatterns.join("|") + ")";
            return caseSensitive ? new RegExp(regexStr) : new RegExp(regexStr, "i");                                // 1341
        }                                                                                                           // 1342
    }(window.document);                                                                                             // 1343
    var Input = function() {                                                                                        // 1344
        "use strict";                                                                                               // 1345
        var specialKeyCodeMap;                                                                                      // 1346
        specialKeyCodeMap = {                                                                                       // 1347
            9: "tab",                                                                                               // 1348
            27: "esc",                                                                                              // 1349
            37: "left",                                                                                             // 1350
            39: "right",                                                                                            // 1351
            13: "enter",                                                                                            // 1352
            38: "up",                                                                                               // 1353
            40: "down"                                                                                              // 1354
        };                                                                                                          // 1355
        function Input(o, www) {                                                                                    // 1356
            o = o || {};                                                                                            // 1357
            if (!o.input) {                                                                                         // 1358
                $.error("input is missing");                                                                        // 1359
            }                                                                                                       // 1360
            www.mixin(this);                                                                                        // 1361
            this.$hint = $(o.hint);                                                                                 // 1362
            this.$input = $(o.input);                                                                               // 1363
            this.query = this.$input.val();                                                                         // 1364
            this.queryWhenFocused = this.hasFocus() ? this.query : null;                                            // 1365
            this.$overflowHelper = buildOverflowHelper(this.$input);                                                // 1366
            this._checkLanguageDirection();                                                                         // 1367
            if (this.$hint.length === 0) {                                                                          // 1368
                this.setHint = this.getHint = this.clearHint = this.clearHintIfInvalid = _.noop;                    // 1369
            }                                                                                                       // 1370
        }                                                                                                           // 1371
        Input.normalizeQuery = function(str) {                                                                      // 1372
            return _.toStr(str).replace(/^\s*/g, "").replace(/\s{2,}/g, " ");                                       // 1373
        };                                                                                                          // 1374
        _.mixin(Input.prototype, EventEmitter, {                                                                    // 1375
            _onBlur: function onBlur() {                                                                            // 1376
                this.resetInputValue();                                                                             // 1377
                this.trigger("blurred");                                                                            // 1378
            },                                                                                                      // 1379
            _onFocus: function onFocus() {                                                                          // 1380
                this.queryWhenFocused = this.query;                                                                 // 1381
                this.trigger("focused");                                                                            // 1382
            },                                                                                                      // 1383
            _onKeydown: function onKeydown($e) {                                                                    // 1384
                var keyName = specialKeyCodeMap[$e.which || $e.keyCode];                                            // 1385
                this._managePreventDefault(keyName, $e);                                                            // 1386
                if (keyName && this._shouldTrigger(keyName, $e)) {                                                  // 1387
                    this.trigger(keyName + "Keyed", $e);                                                            // 1388
                }                                                                                                   // 1389
            },                                                                                                      // 1390
            _onInput: function onInput() {                                                                          // 1391
                this._setQuery(this.getInputValue());                                                               // 1392
                this.clearHintIfInvalid();                                                                          // 1393
                this._checkLanguageDirection();                                                                     // 1394
            },                                                                                                      // 1395
            _managePreventDefault: function managePreventDefault(keyName, $e) {                                     // 1396
                var preventDefault;                                                                                 // 1397
                switch (keyName) {                                                                                  // 1398
                  case "up":                                                                                        // 1399
                  case "down":                                                                                      // 1400
                    preventDefault = !withModifier($e);                                                             // 1401
                    break;                                                                                          // 1402
                                                                                                                    // 1403
                  default:                                                                                          // 1404
                    preventDefault = false;                                                                         // 1405
                }                                                                                                   // 1406
                preventDefault && $e.preventDefault();                                                              // 1407
            },                                                                                                      // 1408
            _shouldTrigger: function shouldTrigger(keyName, $e) {                                                   // 1409
                var trigger;                                                                                        // 1410
                switch (keyName) {                                                                                  // 1411
                  case "tab":                                                                                       // 1412
                    trigger = !withModifier($e);                                                                    // 1413
                    break;                                                                                          // 1414
                                                                                                                    // 1415
                  default:                                                                                          // 1416
                    trigger = true;                                                                                 // 1417
                }                                                                                                   // 1418
                return trigger;                                                                                     // 1419
            },                                                                                                      // 1420
            _checkLanguageDirection: function checkLanguageDirection() {                                            // 1421
                var dir = (this.$input.css("direction") || "ltr").toLowerCase();                                    // 1422
                if (this.dir !== dir) {                                                                             // 1423
                    this.dir = dir;                                                                                 // 1424
                    this.$hint.attr("dir", dir);                                                                    // 1425
                    this.trigger("langDirChanged", dir);                                                            // 1426
                }                                                                                                   // 1427
            },                                                                                                      // 1428
            _setQuery: function setQuery(val, silent) {                                                             // 1429
                var areEquivalent, hasDifferentWhitespace;                                                          // 1430
                areEquivalent = areQueriesEquivalent(val, this.query);                                              // 1431
                hasDifferentWhitespace = areEquivalent ? this.query.length !== val.length : false;                  // 1432
                this.query = val;                                                                                   // 1433
                if (!silent && !areEquivalent) {                                                                    // 1434
                    this.trigger("queryChanged", this.query);                                                       // 1435
                } else if (!silent && hasDifferentWhitespace) {                                                     // 1436
                    this.trigger("whitespaceChanged", this.query);                                                  // 1437
                }                                                                                                   // 1438
            },                                                                                                      // 1439
            bind: function() {                                                                                      // 1440
                var that = this, onBlur, onFocus, onKeydown, onInput;                                               // 1441
                onBlur = _.bind(this._onBlur, this);                                                                // 1442
                onFocus = _.bind(this._onFocus, this);                                                              // 1443
                onKeydown = _.bind(this._onKeydown, this);                                                          // 1444
                onInput = _.bind(this._onInput, this);                                                              // 1445
                this.$input.on("blur.tt", onBlur).on("focus.tt", onFocus).on("keydown.tt", onKeydown);              // 1446
                if (!_.isMsie() || _.isMsie() > 9) {                                                                // 1447
                    this.$input.on("input.tt", onInput);                                                            // 1448
                } else {                                                                                            // 1449
                    this.$input.on("keydown.tt keypress.tt cut.tt paste.tt", function($e) {                         // 1450
                        if (specialKeyCodeMap[$e.which || $e.keyCode]) {                                            // 1451
                            return;                                                                                 // 1452
                        }                                                                                           // 1453
                        _.defer(_.bind(that._onInput, that, $e));                                                   // 1454
                    });                                                                                             // 1455
                }                                                                                                   // 1456
                return this;                                                                                        // 1457
            },                                                                                                      // 1458
            focus: function focus() {                                                                               // 1459
                this.$input.focus();                                                                                // 1460
            },                                                                                                      // 1461
            blur: function blur() {                                                                                 // 1462
                this.$input.blur();                                                                                 // 1463
            },                                                                                                      // 1464
            getLangDir: function getLangDir() {                                                                     // 1465
                return this.dir;                                                                                    // 1466
            },                                                                                                      // 1467
            getQuery: function getQuery() {                                                                         // 1468
                return this.query || "";                                                                            // 1469
            },                                                                                                      // 1470
            setQuery: function setQuery(val, silent) {                                                              // 1471
                this.setInputValue(val);                                                                            // 1472
                this._setQuery(val, silent);                                                                        // 1473
            },                                                                                                      // 1474
            hasQueryChangedSinceLastFocus: function hasQueryChangedSinceLastFocus() {                               // 1475
                return this.query !== this.queryWhenFocused;                                                        // 1476
            },                                                                                                      // 1477
            getInputValue: function getInputValue() {                                                               // 1478
                return this.$input.val();                                                                           // 1479
            },                                                                                                      // 1480
            setInputValue: function setInputValue(value) {                                                          // 1481
                this.$input.val(value);                                                                             // 1482
                this.clearHintIfInvalid();                                                                          // 1483
                this._checkLanguageDirection();                                                                     // 1484
            },                                                                                                      // 1485
            resetInputValue: function resetInputValue() {                                                           // 1486
                this.setInputValue(this.query);                                                                     // 1487
            },                                                                                                      // 1488
            getHint: function getHint() {                                                                           // 1489
                return this.$hint.val();                                                                            // 1490
            },                                                                                                      // 1491
            setHint: function setHint(value) {                                                                      // 1492
                this.$hint.val(value);                                                                              // 1493
            },                                                                                                      // 1494
            clearHint: function clearHint() {                                                                       // 1495
                this.setHint("");                                                                                   // 1496
            },                                                                                                      // 1497
            clearHintIfInvalid: function clearHintIfInvalid() {                                                     // 1498
                var val, hint, valIsPrefixOfHint, isValid;                                                          // 1499
                val = this.getInputValue();                                                                         // 1500
                hint = this.getHint();                                                                              // 1501
                valIsPrefixOfHint = val !== hint && hint.indexOf(val) === 0;                                        // 1502
                isValid = val !== "" && valIsPrefixOfHint && !this.hasOverflow();                                   // 1503
                !isValid && this.clearHint();                                                                       // 1504
            },                                                                                                      // 1505
            hasFocus: function hasFocus() {                                                                         // 1506
                return this.$input.is(":focus");                                                                    // 1507
            },                                                                                                      // 1508
            hasOverflow: function hasOverflow() {                                                                   // 1509
                var constraint = this.$input.width() - 2;                                                           // 1510
                this.$overflowHelper.text(this.getInputValue());                                                    // 1511
                return this.$overflowHelper.width() >= constraint;                                                  // 1512
            },                                                                                                      // 1513
            isCursorAtEnd: function() {                                                                             // 1514
                var valueLength, selectionStart, range;                                                             // 1515
                valueLength = this.$input.val().length;                                                             // 1516
                selectionStart = this.$input[0].selectionStart;                                                     // 1517
                if (_.isNumber(selectionStart)) {                                                                   // 1518
                    return selectionStart === valueLength;                                                          // 1519
                } else if (document.selection) {                                                                    // 1520
                    range = document.selection.createRange();                                                       // 1521
                    range.moveStart("character", -valueLength);                                                     // 1522
                    return valueLength === range.text.length;                                                       // 1523
                }                                                                                                   // 1524
                return true;                                                                                        // 1525
            },                                                                                                      // 1526
            destroy: function destroy() {                                                                           // 1527
                this.$hint.off(".tt");                                                                              // 1528
                this.$input.off(".tt");                                                                             // 1529
                this.$overflowHelper.remove();                                                                      // 1530
                this.$hint = this.$input = this.$overflowHelper = $("<div>");                                       // 1531
            }                                                                                                       // 1532
        });                                                                                                         // 1533
        return Input;                                                                                               // 1534
        function buildOverflowHelper($input) {                                                                      // 1535
            return $('<pre aria-hidden="true"></pre>').css({                                                        // 1536
                position: "absolute",                                                                               // 1537
                visibility: "hidden",                                                                               // 1538
                whiteSpace: "pre",                                                                                  // 1539
                fontFamily: $input.css("font-family"),                                                              // 1540
                fontSize: $input.css("font-size"),                                                                  // 1541
                fontStyle: $input.css("font-style"),                                                                // 1542
                fontVariant: $input.css("font-variant"),                                                            // 1543
                fontWeight: $input.css("font-weight"),                                                              // 1544
                wordSpacing: $input.css("word-spacing"),                                                            // 1545
                letterSpacing: $input.css("letter-spacing"),                                                        // 1546
                textIndent: $input.css("text-indent"),                                                              // 1547
                textRendering: $input.css("text-rendering"),                                                        // 1548
                textTransform: $input.css("text-transform")                                                         // 1549
            }).insertAfter($input);                                                                                 // 1550
        }                                                                                                           // 1551
        function areQueriesEquivalent(a, b) {                                                                       // 1552
            return Input.normalizeQuery(a) === Input.normalizeQuery(b);                                             // 1553
        }                                                                                                           // 1554
        function withModifier($e) {                                                                                 // 1555
            return $e.altKey || $e.ctrlKey || $e.metaKey || $e.shiftKey;                                            // 1556
        }                                                                                                           // 1557
    }();                                                                                                            // 1558
    var Dataset = function() {                                                                                      // 1559
        "use strict";                                                                                               // 1560
        var keys, nameGenerator;                                                                                    // 1561
        keys = {                                                                                                    // 1562
            val: "tt-selectable-display",                                                                           // 1563
            obj: "tt-selectable-object"                                                                             // 1564
        };                                                                                                          // 1565
        nameGenerator = _.getIdGenerator();                                                                         // 1566
        function Dataset(o, www) {                                                                                  // 1567
            o = o || {};                                                                                            // 1568
            o.templates = o.templates || {};                                                                        // 1569
            o.templates.notFound = o.templates.notFound || o.templates.empty;                                       // 1570
            if (!o.source) {                                                                                        // 1571
                $.error("missing source");                                                                          // 1572
            }                                                                                                       // 1573
            if (!o.node) {                                                                                          // 1574
                $.error("missing node");                                                                            // 1575
            }                                                                                                       // 1576
            if (o.name && !isValidName(o.name)) {                                                                   // 1577
                $.error("invalid dataset name: " + o.name);                                                         // 1578
            }                                                                                                       // 1579
            www.mixin(this);                                                                                        // 1580
            this.highlight = !!o.highlight;                                                                         // 1581
            this.name = o.name || nameGenerator();                                                                  // 1582
            this.limit = o.limit || 5;                                                                              // 1583
            this.displayFn = getDisplayFn(o.display || o.displayKey);                                               // 1584
            this.templates = getTemplates(o.templates, this.displayFn);                                             // 1585
            this.source = o.source.__ttAdapter ? o.source.__ttAdapter() : o.source;                                 // 1586
            this.async = _.isUndefined(o.async) ? this.source.length > 2 : !!o.async;                               // 1587
            this._resetLastSuggestion();                                                                            // 1588
            this.$el = $(o.node).addClass(this.classes.dataset).addClass(this.classes.dataset + "-" + this.name);   // 1589
        }                                                                                                           // 1590
        Dataset.extractData = function extractData(el) {                                                            // 1591
            var $el = $(el);                                                                                        // 1592
            if ($el.data(keys.obj)) {                                                                               // 1593
                return {                                                                                            // 1594
                    val: $el.data(keys.val) || "",                                                                  // 1595
                    obj: $el.data(keys.obj) || null                                                                 // 1596
                };                                                                                                  // 1597
            }                                                                                                       // 1598
            return null;                                                                                            // 1599
        };                                                                                                          // 1600
        _.mixin(Dataset.prototype, EventEmitter, {                                                                  // 1601
            _overwrite: function overwrite(query, suggestions) {                                                    // 1602
                suggestions = suggestions || [];                                                                    // 1603
                if (suggestions.length) {                                                                           // 1604
                    this._renderSuggestions(query, suggestions);                                                    // 1605
                } else if (this.async && this.templates.pending) {                                                  // 1606
                    this._renderPending(query);                                                                     // 1607
                } else if (!this.async && this.templates.notFound) {                                                // 1608
                    this._renderNotFound(query);                                                                    // 1609
                } else {                                                                                            // 1610
                    this._empty();                                                                                  // 1611
                }                                                                                                   // 1612
                this.trigger("rendered", this.name, suggestions, false);                                            // 1613
            },                                                                                                      // 1614
            _append: function append(query, suggestions) {                                                          // 1615
                suggestions = suggestions || [];                                                                    // 1616
                if (suggestions.length && this.$lastSuggestion.length) {                                            // 1617
                    this._appendSuggestions(query, suggestions);                                                    // 1618
                } else if (suggestions.length) {                                                                    // 1619
                    this._renderSuggestions(query, suggestions);                                                    // 1620
                } else if (!this.$lastSuggestion.length && this.templates.notFound) {                               // 1621
                    this._renderNotFound(query);                                                                    // 1622
                }                                                                                                   // 1623
                this.trigger("rendered", this.name, suggestions, true);                                             // 1624
            },                                                                                                      // 1625
            _renderSuggestions: function renderSuggestions(query, suggestions) {                                    // 1626
                var $fragment;                                                                                      // 1627
                $fragment = this._getSuggestionsFragment(query, suggestions);                                       // 1628
                this.$lastSuggestion = $fragment.children().last();                                                 // 1629
                this.$el.html($fragment).prepend(this._getHeader(query, suggestions)).append(this._getFooter(query, suggestions));
            },                                                                                                      // 1631
            _appendSuggestions: function appendSuggestions(query, suggestions) {                                    // 1632
                var $fragment, $lastSuggestion;                                                                     // 1633
                $fragment = this._getSuggestionsFragment(query, suggestions);                                       // 1634
                $lastSuggestion = $fragment.children().last();                                                      // 1635
                this.$lastSuggestion.after($fragment);                                                              // 1636
                this.$lastSuggestion = $lastSuggestion;                                                             // 1637
            },                                                                                                      // 1638
            _renderPending: function renderPending(query) {                                                         // 1639
                var template = this.templates.pending;                                                              // 1640
                this._resetLastSuggestion();                                                                        // 1641
                template && this.$el.html(template({                                                                // 1642
                    query: query,                                                                                   // 1643
                    dataset: this.name                                                                              // 1644
                }));                                                                                                // 1645
            },                                                                                                      // 1646
            _renderNotFound: function renderNotFound(query) {                                                       // 1647
                var template = this.templates.notFound;                                                             // 1648
                this._resetLastSuggestion();                                                                        // 1649
                template && this.$el.html(template({                                                                // 1650
                    query: query,                                                                                   // 1651
                    dataset: this.name                                                                              // 1652
                }));                                                                                                // 1653
            },                                                                                                      // 1654
            _empty: function empty() {                                                                              // 1655
                this.$el.empty();                                                                                   // 1656
                this._resetLastSuggestion();                                                                        // 1657
            },                                                                                                      // 1658
            _getSuggestionsFragment: function getSuggestionsFragment(query, suggestions) {                          // 1659
                var that = this, fragment;                                                                          // 1660
                fragment = document.createDocumentFragment();                                                       // 1661
                _.each(suggestions, function getSuggestionNode(suggestion) {                                        // 1662
                    var $el, context;                                                                               // 1663
                    context = that._injectQuery(query, suggestion);                                                 // 1664
                    $el = $(that.templates.suggestion(context)).data(keys.obj, suggestion).data(keys.val, that.displayFn(suggestion)).addClass(that.classes.suggestion + " " + that.classes.selectable);
                    fragment.appendChild($el[0]);                                                                   // 1666
                });                                                                                                 // 1667
                this.highlight && highlight({                                                                       // 1668
                    className: this.classes.highlight,                                                              // 1669
                    node: fragment,                                                                                 // 1670
                    pattern: query                                                                                  // 1671
                });                                                                                                 // 1672
                return $(fragment);                                                                                 // 1673
            },                                                                                                      // 1674
            _getFooter: function getFooter(query, suggestions) {                                                    // 1675
                return this.templates.footer ? this.templates.footer({                                              // 1676
                    query: query,                                                                                   // 1677
                    suggestions: suggestions,                                                                       // 1678
                    dataset: this.name                                                                              // 1679
                }) : null;                                                                                          // 1680
            },                                                                                                      // 1681
            _getHeader: function getHeader(query, suggestions) {                                                    // 1682
                return this.templates.header ? this.templates.header({                                              // 1683
                    query: query,                                                                                   // 1684
                    suggestions: suggestions,                                                                       // 1685
                    dataset: this.name                                                                              // 1686
                }) : null;                                                                                          // 1687
            },                                                                                                      // 1688
            _resetLastSuggestion: function resetLastSuggestion() {                                                  // 1689
                this.$lastSuggestion = $();                                                                         // 1690
            },                                                                                                      // 1691
            _injectQuery: function injectQuery(query, obj) {                                                        // 1692
                return _.isObject(obj) ? _.mixin({                                                                  // 1693
                    _query: query                                                                                   // 1694
                }, obj) : obj;                                                                                      // 1695
            },                                                                                                      // 1696
            update: function update(query) {                                                                        // 1697
                var that = this, canceled = false, syncCalled = false, rendered = 0;                                // 1698
                this.cancel();                                                                                      // 1699
                this.cancel = function cancel() {                                                                   // 1700
                    canceled = true;                                                                                // 1701
                    that.cancel = $.noop;                                                                           // 1702
                    that.async && that.trigger("asyncCanceled", query);                                             // 1703
                };                                                                                                  // 1704
                this.source(query, sync, async);                                                                    // 1705
                !syncCalled && sync([]);                                                                            // 1706
                function sync(suggestions) {                                                                        // 1707
                    if (syncCalled) {                                                                               // 1708
                        return;                                                                                     // 1709
                    }                                                                                               // 1710
                    syncCalled = true;                                                                              // 1711
                    suggestions = (suggestions || []).slice(0, that.limit);                                         // 1712
                    rendered = suggestions.length;                                                                  // 1713
                    that._overwrite(query, suggestions);                                                            // 1714
                    if (rendered < that.limit && that.async) {                                                      // 1715
                        that.trigger("asyncRequested", query);                                                      // 1716
                    }                                                                                               // 1717
                }                                                                                                   // 1718
                function async(suggestions) {                                                                       // 1719
                    suggestions = suggestions || [];                                                                // 1720
                    if (!canceled && rendered < that.limit) {                                                       // 1721
                        that.cancel = $.noop;                                                                       // 1722
                        suggestions = suggestions.slice(0, that.limit - rendered);                                  // 1723
                        that._append(query, suggestions);                                                           // 1724
                        rendered += suggestions.length;                                                             // 1725
                        that.async && that.trigger("asyncReceived", query);                                         // 1726
                    }                                                                                               // 1727
                }                                                                                                   // 1728
            },                                                                                                      // 1729
            cancel: $.noop,                                                                                         // 1730
            clear: function clear() {                                                                               // 1731
                this._empty();                                                                                      // 1732
                this.cancel();                                                                                      // 1733
                this.trigger("cleared");                                                                            // 1734
            },                                                                                                      // 1735
            isEmpty: function isEmpty() {                                                                           // 1736
                return this.$el.is(":empty");                                                                       // 1737
            },                                                                                                      // 1738
            destroy: function destroy() {                                                                           // 1739
                this.$el = $("<div>");                                                                              // 1740
            }                                                                                                       // 1741
        });                                                                                                         // 1742
        return Dataset;                                                                                             // 1743
        function getDisplayFn(display) {                                                                            // 1744
            display = display || _.stringify;                                                                       // 1745
            return _.isFunction(display) ? display : displayFn;                                                     // 1746
            function displayFn(obj) {                                                                               // 1747
                return obj[display];                                                                                // 1748
            }                                                                                                       // 1749
        }                                                                                                           // 1750
        function getTemplates(templates, displayFn) {                                                               // 1751
            return {                                                                                                // 1752
                notFound: templates.notFound && _.templatify(templates.notFound),                                   // 1753
                pending: templates.pending && _.templatify(templates.pending),                                      // 1754
                header: templates.header && _.templatify(templates.header),                                         // 1755
                footer: templates.footer && _.templatify(templates.footer),                                         // 1756
                suggestion: templates.suggestion || suggestionTemplate                                              // 1757
            };                                                                                                      // 1758
            function suggestionTemplate(context) {                                                                  // 1759
                return $("<div>").text(displayFn(context));                                                         // 1760
            }                                                                                                       // 1761
        }                                                                                                           // 1762
        function isValidName(str) {                                                                                 // 1763
            return /^[_a-zA-Z0-9-]+$/.test(str);                                                                    // 1764
        }                                                                                                           // 1765
    }();                                                                                                            // 1766
    var Menu = function() {                                                                                         // 1767
        "use strict";                                                                                               // 1768
        function Menu(o, www) {                                                                                     // 1769
            var that = this;                                                                                        // 1770
            o = o || {};                                                                                            // 1771
            if (!o.node) {                                                                                          // 1772
                $.error("node is required");                                                                        // 1773
            }                                                                                                       // 1774
            www.mixin(this);                                                                                        // 1775
            this.$node = $(o.node);                                                                                 // 1776
            this.query = null;                                                                                      // 1777
            this.datasets = _.map(o.datasets, initializeDataset);                                                   // 1778
            function initializeDataset(oDataset) {                                                                  // 1779
                var node = that.$node.find(oDataset.node).first();                                                  // 1780
                oDataset.node = node.length ? node : $("<div>").appendTo(that.$node);                               // 1781
                return new Dataset(oDataset, www);                                                                  // 1782
            }                                                                                                       // 1783
        }                                                                                                           // 1784
        _.mixin(Menu.prototype, EventEmitter, {                                                                     // 1785
            _onSelectableClick: function onSelectableClick($e) {                                                    // 1786
                this.trigger("selectableClicked", $($e.currentTarget));                                             // 1787
            },                                                                                                      // 1788
            _onRendered: function onRendered(type, dataset, suggestions, async) {                                   // 1789
                this.$node.toggleClass(this.classes.empty, this._allDatasetsEmpty());                               // 1790
                this.trigger("datasetRendered", dataset, suggestions, async);                                       // 1791
            },                                                                                                      // 1792
            _onCleared: function onCleared() {                                                                      // 1793
                this.$node.toggleClass(this.classes.empty, this._allDatasetsEmpty());                               // 1794
                this.trigger("datasetCleared");                                                                     // 1795
            },                                                                                                      // 1796
            _propagate: function propagate() {                                                                      // 1797
                this.trigger.apply(this, arguments);                                                                // 1798
            },                                                                                                      // 1799
            _allDatasetsEmpty: function allDatasetsEmpty() {                                                        // 1800
                return _.every(this.datasets, isDatasetEmpty);                                                      // 1801
                function isDatasetEmpty(dataset) {                                                                  // 1802
                    return dataset.isEmpty();                                                                       // 1803
                }                                                                                                   // 1804
            },                                                                                                      // 1805
            _getSelectables: function getSelectables() {                                                            // 1806
                return this.$node.find(this.selectors.selectable);                                                  // 1807
            },                                                                                                      // 1808
            _removeCursor: function _removeCursor() {                                                               // 1809
                var $selectable = this.getActiveSelectable();                                                       // 1810
                $selectable && $selectable.removeClass(this.classes.cursor);                                        // 1811
            },                                                                                                      // 1812
            _ensureVisible: function ensureVisible($el) {                                                           // 1813
                var elTop, elBottom, nodeScrollTop, nodeHeight;                                                     // 1814
                elTop = $el.position().top;                                                                         // 1815
                elBottom = elTop + $el.outerHeight(true);                                                           // 1816
                nodeScrollTop = this.$node.scrollTop();                                                             // 1817
                nodeHeight = this.$node.height() + parseInt(this.$node.css("paddingTop"), 10) + parseInt(this.$node.css("paddingBottom"), 10);
                if (elTop < 0) {                                                                                    // 1819
                    this.$node.scrollTop(nodeScrollTop + elTop);                                                    // 1820
                } else if (nodeHeight < elBottom) {                                                                 // 1821
                    this.$node.scrollTop(nodeScrollTop + (elBottom - nodeHeight));                                  // 1822
                }                                                                                                   // 1823
            },                                                                                                      // 1824
            bind: function() {                                                                                      // 1825
                var that = this, onSelectableClick;                                                                 // 1826
                onSelectableClick = _.bind(this._onSelectableClick, this);                                          // 1827
                this.$node.on("click.tt", this.selectors.selectable, onSelectableClick);                            // 1828
                _.each(this.datasets, function(dataset) {                                                           // 1829
                    dataset.onSync("asyncRequested", that._propagate, that).onSync("asyncCanceled", that._propagate, that).onSync("asyncReceived", that._propagate, that).onSync("rendered", that._onRendered, that).onSync("cleared", that._onCleared, that);
                });                                                                                                 // 1831
                return this;                                                                                        // 1832
            },                                                                                                      // 1833
            isOpen: function isOpen() {                                                                             // 1834
                return this.$node.hasClass(this.classes.open);                                                      // 1835
            },                                                                                                      // 1836
            open: function open() {                                                                                 // 1837
                this.$node.addClass(this.classes.open);                                                             // 1838
            },                                                                                                      // 1839
            close: function close() {                                                                               // 1840
                this.$node.removeClass(this.classes.open);                                                          // 1841
                this._removeCursor();                                                                               // 1842
            },                                                                                                      // 1843
            setLanguageDirection: function setLanguageDirection(dir) {                                              // 1844
                this.$node.attr("dir", dir);                                                                        // 1845
            },                                                                                                      // 1846
            selectableRelativeToCursor: function selectableRelativeToCursor(delta) {                                // 1847
                var $selectables, $oldCursor, oldIndex, newIndex;                                                   // 1848
                $oldCursor = this.getActiveSelectable();                                                            // 1849
                $selectables = this._getSelectables();                                                              // 1850
                oldIndex = $oldCursor ? $selectables.index($oldCursor) : -1;                                        // 1851
                newIndex = oldIndex + delta;                                                                        // 1852
                newIndex = (newIndex + 1) % ($selectables.length + 1) - 1;                                          // 1853
                newIndex = newIndex < -1 ? $selectables.length - 1 : newIndex;                                      // 1854
                return newIndex === -1 ? null : $selectables.eq(newIndex);                                          // 1855
            },                                                                                                      // 1856
            setCursor: function setCursor($selectable) {                                                            // 1857
                this._removeCursor();                                                                               // 1858
                if ($selectable = $selectable && $selectable.first()) {                                             // 1859
                    $selectable.addClass(this.classes.cursor);                                                      // 1860
                    this._ensureVisible($selectable);                                                               // 1861
                }                                                                                                   // 1862
            },                                                                                                      // 1863
            getSelectableData: function getSelectableData($el) {                                                    // 1864
                return $el && $el.length ? Dataset.extractData($el) : null;                                         // 1865
            },                                                                                                      // 1866
            getActiveSelectable: function getActiveSelectable() {                                                   // 1867
                var $selectable = this._getSelectables().filter(this.selectors.cursor).first();                     // 1868
                return $selectable.length ? $selectable : null;                                                     // 1869
            },                                                                                                      // 1870
            getTopSelectable: function getTopSelectable() {                                                         // 1871
                var $selectable = this._getSelectables().first();                                                   // 1872
                return $selectable.length ? $selectable : null;                                                     // 1873
            },                                                                                                      // 1874
            update: function update(query) {                                                                        // 1875
                var isValidUpdate = query !== this.query;                                                           // 1876
                if (isValidUpdate) {                                                                                // 1877
                    this.query = query;                                                                             // 1878
                    _.each(this.datasets, updateDataset);                                                           // 1879
                }                                                                                                   // 1880
                return isValidUpdate;                                                                               // 1881
                function updateDataset(dataset) {                                                                   // 1882
                    dataset.update(query);                                                                          // 1883
                }                                                                                                   // 1884
            },                                                                                                      // 1885
            empty: function empty() {                                                                               // 1886
                _.each(this.datasets, clearDataset);                                                                // 1887
                this.query = null;                                                                                  // 1888
                this.$node.addClass(this.classes.empty);                                                            // 1889
                function clearDataset(dataset) {                                                                    // 1890
                    dataset.clear();                                                                                // 1891
                }                                                                                                   // 1892
            },                                                                                                      // 1893
            destroy: function destroy() {                                                                           // 1894
                this.$node.off(".tt");                                                                              // 1895
                this.$node = $("<div>");                                                                            // 1896
                _.each(this.datasets, destroyDataset);                                                              // 1897
                function destroyDataset(dataset) {                                                                  // 1898
                    dataset.destroy();                                                                              // 1899
                }                                                                                                   // 1900
            }                                                                                                       // 1901
        });                                                                                                         // 1902
        return Menu;                                                                                                // 1903
    }();                                                                                                            // 1904
    var DefaultMenu = function() {                                                                                  // 1905
        "use strict";                                                                                               // 1906
        var s = Menu.prototype;                                                                                     // 1907
        function DefaultMenu() {                                                                                    // 1908
            Menu.apply(this, [].slice.call(arguments, 0));                                                          // 1909
        }                                                                                                           // 1910
        _.mixin(DefaultMenu.prototype, Menu.prototype, {                                                            // 1911
            open: function open() {                                                                                 // 1912
                !this._allDatasetsEmpty() && this._show();                                                          // 1913
                return s.open.apply(this, [].slice.call(arguments, 0));                                             // 1914
            },                                                                                                      // 1915
            close: function close() {                                                                               // 1916
                this._hide();                                                                                       // 1917
                return s.close.apply(this, [].slice.call(arguments, 0));                                            // 1918
            },                                                                                                      // 1919
            _onRendered: function onRendered() {                                                                    // 1920
                if (this._allDatasetsEmpty()) {                                                                     // 1921
                    this._hide();                                                                                   // 1922
                } else {                                                                                            // 1923
                    this.isOpen() && this._show();                                                                  // 1924
                }                                                                                                   // 1925
                return s._onRendered.apply(this, [].slice.call(arguments, 0));                                      // 1926
            },                                                                                                      // 1927
            _onCleared: function onCleared() {                                                                      // 1928
                if (this._allDatasetsEmpty()) {                                                                     // 1929
                    this._hide();                                                                                   // 1930
                } else {                                                                                            // 1931
                    this.isOpen() && this._show();                                                                  // 1932
                }                                                                                                   // 1933
                return s._onCleared.apply(this, [].slice.call(arguments, 0));                                       // 1934
            },                                                                                                      // 1935
            setLanguageDirection: function setLanguageDirection(dir) {                                              // 1936
                this.$node.css(dir === "ltr" ? this.css.ltr : this.css.rtl);                                        // 1937
                return s.setLanguageDirection.apply(this, [].slice.call(arguments, 0));                             // 1938
            },                                                                                                      // 1939
            _hide: function hide() {                                                                                // 1940
                this.$node.hide();                                                                                  // 1941
            },                                                                                                      // 1942
            _show: function show() {                                                                                // 1943
                this.$node.css("display", "block");                                                                 // 1944
            }                                                                                                       // 1945
        });                                                                                                         // 1946
        return DefaultMenu;                                                                                         // 1947
    }();                                                                                                            // 1948
    var Typeahead = function() {                                                                                    // 1949
        "use strict";                                                                                               // 1950
        function Typeahead(o, www) {                                                                                // 1951
            var onFocused, onBlurred, onEnterKeyed, onTabKeyed, onEscKeyed, onUpKeyed, onDownKeyed, onLeftKeyed, onRightKeyed, onQueryChanged, onWhitespaceChanged;
            o = o || {};                                                                                            // 1953
            if (!o.input) {                                                                                         // 1954
                $.error("missing input");                                                                           // 1955
            }                                                                                                       // 1956
            if (!o.menu) {                                                                                          // 1957
                $.error("missing menu");                                                                            // 1958
            }                                                                                                       // 1959
            if (!o.eventBus) {                                                                                      // 1960
                $.error("missing event bus");                                                                       // 1961
            }                                                                                                       // 1962
            www.mixin(this);                                                                                        // 1963
            this.eventBus = o.eventBus;                                                                             // 1964
            this.minLength = _.isNumber(o.minLength) ? o.minLength : 1;                                             // 1965
            this.input = o.input;                                                                                   // 1966
            this.menu = o.menu;                                                                                     // 1967
            this.enabled = true;                                                                                    // 1968
            this.active = false;                                                                                    // 1969
            this.input.hasFocus() && this.activate();                                                               // 1970
            this.dir = this.input.getLangDir();                                                                     // 1971
            this._hacks();                                                                                          // 1972
            this.menu.bind().onSync("selectableClicked", this._onSelectableClicked, this).onSync("asyncRequested", this._onAsyncRequested, this).onSync("asyncCanceled", this._onAsyncCanceled, this).onSync("asyncReceived", this._onAsyncReceived, this).onSync("datasetRendered", this._onDatasetRendered, this).onSync("datasetCleared", this._onDatasetCleared, this);
            onFocused = c(this, "activate", "open", "_onFocused");                                                  // 1974
            onBlurred = c(this, "deactivate", "_onBlurred");                                                        // 1975
            onEnterKeyed = c(this, "isActive", "isOpen", "_onEnterKeyed");                                          // 1976
            onTabKeyed = c(this, "isActive", "isOpen", "_onTabKeyed");                                              // 1977
            onEscKeyed = c(this, "isActive", "_onEscKeyed");                                                        // 1978
            onUpKeyed = c(this, "isActive", "open", "_onUpKeyed");                                                  // 1979
            onDownKeyed = c(this, "isActive", "open", "_onDownKeyed");                                              // 1980
            onLeftKeyed = c(this, "isActive", "isOpen", "_onLeftKeyed");                                            // 1981
            onRightKeyed = c(this, "isActive", "isOpen", "_onRightKeyed");                                          // 1982
            onQueryChanged = c(this, "_openIfActive", "_onQueryChanged");                                           // 1983
            onWhitespaceChanged = c(this, "_openIfActive", "_onWhitespaceChanged");                                 // 1984
            this.input.bind().onSync("focused", onFocused, this).onSync("blurred", onBlurred, this).onSync("enterKeyed", onEnterKeyed, this).onSync("tabKeyed", onTabKeyed, this).onSync("escKeyed", onEscKeyed, this).onSync("upKeyed", onUpKeyed, this).onSync("downKeyed", onDownKeyed, this).onSync("leftKeyed", onLeftKeyed, this).onSync("rightKeyed", onRightKeyed, this).onSync("queryChanged", onQueryChanged, this).onSync("whitespaceChanged", onWhitespaceChanged, this).onSync("langDirChanged", this._onLangDirChanged, this);
        }                                                                                                           // 1986
        _.mixin(Typeahead.prototype, {                                                                              // 1987
            _hacks: function hacks() {                                                                              // 1988
                var $input, $menu;                                                                                  // 1989
                $input = this.input.$input || $("<div>");                                                           // 1990
                $menu = this.menu.$node || $("<div>");                                                              // 1991
                $input.on("blur.tt", function($e) {                                                                 // 1992
                    var active, isActive, hasActive;                                                                // 1993
                    active = document.activeElement;                                                                // 1994
                    isActive = $menu.is(active);                                                                    // 1995
                    hasActive = $menu.has(active).length > 0;                                                       // 1996
                    if (_.isMsie() && (isActive || hasActive)) {                                                    // 1997
                        $e.preventDefault();                                                                        // 1998
                        $e.stopImmediatePropagation();                                                              // 1999
                        _.defer(function() {                                                                        // 2000
                            $input.focus();                                                                         // 2001
                        });                                                                                         // 2002
                    }                                                                                               // 2003
                });                                                                                                 // 2004
                $menu.on("mousedown.tt", function($e) {                                                             // 2005
                    $e.preventDefault();                                                                            // 2006
                });                                                                                                 // 2007
            },                                                                                                      // 2008
            _onSelectableClicked: function onSelectableClicked(type, $el) {                                         // 2009
                this.select($el);                                                                                   // 2010
            },                                                                                                      // 2011
            _onDatasetCleared: function onDatasetCleared() {                                                        // 2012
                this._updateHint();                                                                                 // 2013
            },                                                                                                      // 2014
            _onDatasetRendered: function onDatasetRendered(type, dataset, suggestions, async) {                     // 2015
                this._updateHint();                                                                                 // 2016
                this.eventBus.trigger("render", suggestions, async, dataset);                                       // 2017
            },                                                                                                      // 2018
            _onAsyncRequested: function onAsyncRequested(type, dataset, query) {                                    // 2019
                this.eventBus.trigger("asyncrequest", query, dataset);                                              // 2020
            },                                                                                                      // 2021
            _onAsyncCanceled: function onAsyncCanceled(type, dataset, query) {                                      // 2022
                this.eventBus.trigger("asynccancel", query, dataset);                                               // 2023
            },                                                                                                      // 2024
            _onAsyncReceived: function onAsyncReceived(type, dataset, query) {                                      // 2025
                this.eventBus.trigger("asyncreceive", query, dataset);                                              // 2026
            },                                                                                                      // 2027
            _onFocused: function onFocused() {                                                                      // 2028
                this._minLengthMet() && this.menu.update(this.input.getQuery());                                    // 2029
            },                                                                                                      // 2030
            _onBlurred: function onBlurred() {                                                                      // 2031
                if (this.input.hasQueryChangedSinceLastFocus()) {                                                   // 2032
                    this.eventBus.trigger("change", this.input.getQuery());                                         // 2033
                }                                                                                                   // 2034
            },                                                                                                      // 2035
            _onEnterKeyed: function onEnterKeyed(type, $e) {                                                        // 2036
                var $selectable;                                                                                    // 2037
                if ($selectable = this.menu.getActiveSelectable()) {                                                // 2038
                    this.select($selectable) && $e.preventDefault();                                                // 2039
                }                                                                                                   // 2040
            },                                                                                                      // 2041
            _onTabKeyed: function onTabKeyed(type, $e) {                                                            // 2042
                var $selectable;                                                                                    // 2043
                if ($selectable = this.menu.getActiveSelectable()) {                                                // 2044
                    this.select($selectable) && $e.preventDefault();                                                // 2045
                } else if ($selectable = this.menu.getTopSelectable()) {                                            // 2046
                    this.autocomplete($selectable) && $e.preventDefault();                                          // 2047
                }                                                                                                   // 2048
            },                                                                                                      // 2049
            _onEscKeyed: function onEscKeyed() {                                                                    // 2050
                this.close();                                                                                       // 2051
            },                                                                                                      // 2052
            _onUpKeyed: function onUpKeyed() {                                                                      // 2053
                this.moveCursor(-1);                                                                                // 2054
            },                                                                                                      // 2055
            _onDownKeyed: function onDownKeyed() {                                                                  // 2056
                this.moveCursor(+1);                                                                                // 2057
            },                                                                                                      // 2058
            _onLeftKeyed: function onLeftKeyed() {                                                                  // 2059
                if (this.dir === "rtl" && this.input.isCursorAtEnd()) {                                             // 2060
                    this.autocomplete(this.menu.getTopSelectable());                                                // 2061
                }                                                                                                   // 2062
            },                                                                                                      // 2063
            _onRightKeyed: function onRightKeyed() {                                                                // 2064
                if (this.dir === "ltr" && this.input.isCursorAtEnd()) {                                             // 2065
                    this.autocomplete(this.menu.getTopSelectable());                                                // 2066
                }                                                                                                   // 2067
            },                                                                                                      // 2068
            _onQueryChanged: function onQueryChanged(e, query) {                                                    // 2069
                this._minLengthMet(query) ? this.menu.update(query) : this.menu.empty();                            // 2070
            },                                                                                                      // 2071
            _onWhitespaceChanged: function onWhitespaceChanged() {                                                  // 2072
                this._updateHint();                                                                                 // 2073
            },                                                                                                      // 2074
            _onLangDirChanged: function onLangDirChanged(e, dir) {                                                  // 2075
                if (this.dir !== dir) {                                                                             // 2076
                    this.dir = dir;                                                                                 // 2077
                    this.menu.setLanguageDirection(dir);                                                            // 2078
                }                                                                                                   // 2079
            },                                                                                                      // 2080
            _openIfActive: function openIfActive() {                                                                // 2081
                this.isActive() && this.open();                                                                     // 2082
            },                                                                                                      // 2083
            _minLengthMet: function minLengthMet(query) {                                                           // 2084
                query = _.isString(query) ? query : this.input.getQuery() || "";                                    // 2085
                return query.length >= this.minLength;                                                              // 2086
            },                                                                                                      // 2087
            _updateHint: function updateHint() {                                                                    // 2088
                var $selectable, data, val, query, escapedQuery, frontMatchRegEx, match;                            // 2089
                $selectable = this.menu.getTopSelectable();                                                         // 2090
                data = this.menu.getSelectableData($selectable);                                                    // 2091
                val = this.input.getInputValue();                                                                   // 2092
                if (data && !_.isBlankString(val) && !this.input.hasOverflow()) {                                   // 2093
                    query = Input.normalizeQuery(val);                                                              // 2094
                    escapedQuery = _.escapeRegExChars(query);                                                       // 2095
                    frontMatchRegEx = new RegExp("^(?:" + escapedQuery + ")(.+$)", "i");                            // 2096
                    match = frontMatchRegEx.exec(data.val);                                                         // 2097
                    match && this.input.setHint(val + match[1]);                                                    // 2098
                } else {                                                                                            // 2099
                    this.input.clearHint();                                                                         // 2100
                }                                                                                                   // 2101
            },                                                                                                      // 2102
            isEnabled: function isEnabled() {                                                                       // 2103
                return this.enabled;                                                                                // 2104
            },                                                                                                      // 2105
            enable: function enable() {                                                                             // 2106
                this.enabled = true;                                                                                // 2107
            },                                                                                                      // 2108
            disable: function disable() {                                                                           // 2109
                this.enabled = false;                                                                               // 2110
            },                                                                                                      // 2111
            isActive: function isActive() {                                                                         // 2112
                return this.active;                                                                                 // 2113
            },                                                                                                      // 2114
            activate: function activate() {                                                                         // 2115
                if (this.isActive()) {                                                                              // 2116
                    return true;                                                                                    // 2117
                } else if (!this.isEnabled() || this.eventBus.before("active")) {                                   // 2118
                    return false;                                                                                   // 2119
                } else {                                                                                            // 2120
                    this.active = true;                                                                             // 2121
                    this.eventBus.trigger("active");                                                                // 2122
                    return true;                                                                                    // 2123
                }                                                                                                   // 2124
            },                                                                                                      // 2125
            deactivate: function deactivate() {                                                                     // 2126
                if (!this.isActive()) {                                                                             // 2127
                    return true;                                                                                    // 2128
                } else if (this.eventBus.before("idle")) {                                                          // 2129
                    return false;                                                                                   // 2130
                } else {                                                                                            // 2131
                    this.active = false;                                                                            // 2132
                    this.close();                                                                                   // 2133
                    this.eventBus.trigger("idle");                                                                  // 2134
                    return true;                                                                                    // 2135
                }                                                                                                   // 2136
            },                                                                                                      // 2137
            isOpen: function isOpen() {                                                                             // 2138
                return this.menu.isOpen();                                                                          // 2139
            },                                                                                                      // 2140
            open: function open() {                                                                                 // 2141
                if (!this.isOpen() && !this.eventBus.before("open")) {                                              // 2142
                    this.menu.open();                                                                               // 2143
                    this._updateHint();                                                                             // 2144
                    this.eventBus.trigger("open");                                                                  // 2145
                }                                                                                                   // 2146
                return this.isOpen();                                                                               // 2147
            },                                                                                                      // 2148
            close: function close() {                                                                               // 2149
                if (this.isOpen() && !this.eventBus.before("close")) {                                              // 2150
                    this.menu.close();                                                                              // 2151
                    this.input.clearHint();                                                                         // 2152
                    this.input.resetInputValue();                                                                   // 2153
                    this.eventBus.trigger("close");                                                                 // 2154
                }                                                                                                   // 2155
                return !this.isOpen();                                                                              // 2156
            },                                                                                                      // 2157
            setVal: function setVal(val) {                                                                          // 2158
                this.input.setQuery(_.toStr(val));                                                                  // 2159
            },                                                                                                      // 2160
            getVal: function getVal() {                                                                             // 2161
                return this.input.getQuery();                                                                       // 2162
            },                                                                                                      // 2163
            select: function select($selectable) {                                                                  // 2164
                var data = this.menu.getSelectableData($selectable);                                                // 2165
                if (data && !this.eventBus.before("select", data.obj)) {                                            // 2166
                    this.input.setQuery(data.val, true);                                                            // 2167
                    this.eventBus.trigger("select", data.obj);                                                      // 2168
                    this.close();                                                                                   // 2169
                    return true;                                                                                    // 2170
                }                                                                                                   // 2171
                return false;                                                                                       // 2172
            },                                                                                                      // 2173
            autocomplete: function autocomplete($selectable) {                                                      // 2174
                var query, data, isValid;                                                                           // 2175
                query = this.input.getQuery();                                                                      // 2176
                data = this.menu.getSelectableData($selectable);                                                    // 2177
                isValid = data && query !== data.val;                                                               // 2178
                if (isValid && !this.eventBus.before("autocomplete", data.obj)) {                                   // 2179
                    this.input.setQuery(data.val);                                                                  // 2180
                    this.eventBus.trigger("autocomplete", data.obj);                                                // 2181
                    return true;                                                                                    // 2182
                }                                                                                                   // 2183
                return false;                                                                                       // 2184
            },                                                                                                      // 2185
            moveCursor: function moveCursor(delta) {                                                                // 2186
                var query, $candidate, data, payload, cancelMove;                                                   // 2187
                query = this.input.getQuery();                                                                      // 2188
                $candidate = this.menu.selectableRelativeToCursor(delta);                                           // 2189
                data = this.menu.getSelectableData($candidate);                                                     // 2190
                payload = data ? data.obj : null;                                                                   // 2191
                cancelMove = this._minLengthMet() && this.menu.update(query);                                       // 2192
                if (!cancelMove && !this.eventBus.before("cursorchange", payload)) {                                // 2193
                    this.menu.setCursor($candidate);                                                                // 2194
                    if (data) {                                                                                     // 2195
                        this.input.setInputValue(data.val);                                                         // 2196
                    } else {                                                                                        // 2197
                        this.input.resetInputValue();                                                               // 2198
                        this._updateHint();                                                                         // 2199
                    }                                                                                               // 2200
                    this.eventBus.trigger("cursorchange", payload);                                                 // 2201
                    return true;                                                                                    // 2202
                }                                                                                                   // 2203
                return false;                                                                                       // 2204
            },                                                                                                      // 2205
            destroy: function destroy() {                                                                           // 2206
                this.input.destroy();                                                                               // 2207
                this.menu.destroy();                                                                                // 2208
            }                                                                                                       // 2209
        });                                                                                                         // 2210
        return Typeahead;                                                                                           // 2211
        function c(ctx) {                                                                                           // 2212
            var methods = [].slice.call(arguments, 1);                                                              // 2213
            return function() {                                                                                     // 2214
                var args = [].slice.call(arguments);                                                                // 2215
                _.each(methods, function(method) {                                                                  // 2216
                    return ctx[method].apply(ctx, args);                                                            // 2217
                });                                                                                                 // 2218
            };                                                                                                      // 2219
        }                                                                                                           // 2220
    }();                                                                                                            // 2221
    (function() {                                                                                                   // 2222
        "use strict";                                                                                               // 2223
        var old, keys, methods;                                                                                     // 2224
        old = $.fn.typeahead;                                                                                       // 2225
        keys = {                                                                                                    // 2226
            www: "tt-www",                                                                                          // 2227
            attrs: "tt-attrs",                                                                                      // 2228
            typeahead: "tt-typeahead"                                                                               // 2229
        };                                                                                                          // 2230
        methods = {                                                                                                 // 2231
            initialize: function initialize(o, datasets) {                                                          // 2232
                var www;                                                                                            // 2233
                datasets = _.isArray(datasets) ? datasets : [].slice.call(arguments, 1);                            // 2234
                o = o || {};                                                                                        // 2235
                www = WWW(o.classNames);                                                                            // 2236
                return this.each(attach);                                                                           // 2237
                function attach() {                                                                                 // 2238
                    var $input, $wrapper, $hint, $menu, defaultHint, defaultMenu, eventBus, input, menu, typeahead, MenuConstructor;
                    _.each(datasets, function(d) {                                                                  // 2240
                        d.highlight = !!o.highlight;                                                                // 2241
                    });                                                                                             // 2242
                    $input = $(this);                                                                               // 2243
                    $wrapper = $(www.html.wrapper);                                                                 // 2244
                    $hint = $elOrNull(o.hint);                                                                      // 2245
                    $menu = $elOrNull(o.menu);                                                                      // 2246
                    defaultHint = o.hint !== false && !$hint;                                                       // 2247
                    defaultMenu = o.menu !== false && !$menu;                                                       // 2248
                    defaultHint && ($hint = buildHintFromInput($input, www));                                       // 2249
                    defaultMenu && ($menu = $(www.html.menu).css(www.css.menu));                                    // 2250
                    $hint && $hint.val("");                                                                         // 2251
                    $input = prepInput($input, www);                                                                // 2252
                    if (defaultHint || defaultMenu) {                                                               // 2253
                        $wrapper.css(www.css.wrapper);                                                              // 2254
                        $input.css(defaultHint ? www.css.input : www.css.inputWithNoHint);                          // 2255
                        $input.wrap($wrapper).parent().prepend(defaultHint ? $hint : null).append(defaultMenu ? $menu : null);
                    }                                                                                               // 2257
                    MenuConstructor = defaultMenu ? DefaultMenu : Menu;                                             // 2258
                    eventBus = new EventBus({                                                                       // 2259
                        el: $input                                                                                  // 2260
                    });                                                                                             // 2261
                    input = new Input({                                                                             // 2262
                        hint: $hint,                                                                                // 2263
                        input: $input                                                                               // 2264
                    }, www);                                                                                        // 2265
                    menu = new MenuConstructor({                                                                    // 2266
                        node: $menu,                                                                                // 2267
                        datasets: datasets                                                                          // 2268
                    }, www);                                                                                        // 2269
                    typeahead = new Typeahead({                                                                     // 2270
                        input: input,                                                                               // 2271
                        menu: menu,                                                                                 // 2272
                        eventBus: eventBus,                                                                         // 2273
                        minLength: o.minLength                                                                      // 2274
                    }, www);                                                                                        // 2275
                    $input.data(keys.www, www);                                                                     // 2276
                    $input.data(keys.typeahead, typeahead);                                                         // 2277
                }                                                                                                   // 2278
            },                                                                                                      // 2279
            isEnabled: function isEnabled() {                                                                       // 2280
                var enabled;                                                                                        // 2281
                ttEach(this.first(), function(t) {                                                                  // 2282
                    enabled = t.isEnabled();                                                                        // 2283
                });                                                                                                 // 2284
                return enabled;                                                                                     // 2285
            },                                                                                                      // 2286
            enable: function enable() {                                                                             // 2287
                ttEach(this, function(t) {                                                                          // 2288
                    t.enable();                                                                                     // 2289
                });                                                                                                 // 2290
                return this;                                                                                        // 2291
            },                                                                                                      // 2292
            disable: function disable() {                                                                           // 2293
                ttEach(this, function(t) {                                                                          // 2294
                    t.disable();                                                                                    // 2295
                });                                                                                                 // 2296
                return this;                                                                                        // 2297
            },                                                                                                      // 2298
            isActive: function isActive() {                                                                         // 2299
                var active;                                                                                         // 2300
                ttEach(this.first(), function(t) {                                                                  // 2301
                    active = t.isActive();                                                                          // 2302
                });                                                                                                 // 2303
                return active;                                                                                      // 2304
            },                                                                                                      // 2305
            activate: function activate() {                                                                         // 2306
                ttEach(this, function(t) {                                                                          // 2307
                    t.activate();                                                                                   // 2308
                });                                                                                                 // 2309
                return this;                                                                                        // 2310
            },                                                                                                      // 2311
            deactivate: function deactivate() {                                                                     // 2312
                ttEach(this, function(t) {                                                                          // 2313
                    t.deactivate();                                                                                 // 2314
                });                                                                                                 // 2315
                return this;                                                                                        // 2316
            },                                                                                                      // 2317
            isOpen: function isOpen() {                                                                             // 2318
                var open;                                                                                           // 2319
                ttEach(this.first(), function(t) {                                                                  // 2320
                    open = t.isOpen();                                                                              // 2321
                });                                                                                                 // 2322
                return open;                                                                                        // 2323
            },                                                                                                      // 2324
            open: function open() {                                                                                 // 2325
                ttEach(this, function(t) {                                                                          // 2326
                    t.open();                                                                                       // 2327
                });                                                                                                 // 2328
                return this;                                                                                        // 2329
            },                                                                                                      // 2330
            close: function close() {                                                                               // 2331
                ttEach(this, function(t) {                                                                          // 2332
                    t.close();                                                                                      // 2333
                });                                                                                                 // 2334
                return this;                                                                                        // 2335
            },                                                                                                      // 2336
            select: function select(el) {                                                                           // 2337
                var success = false, $el = $(el);                                                                   // 2338
                ttEach(this.first(), function(t) {                                                                  // 2339
                    success = t.select($el);                                                                        // 2340
                });                                                                                                 // 2341
                return success;                                                                                     // 2342
            },                                                                                                      // 2343
            autocomplete: function autocomplete(el) {                                                               // 2344
                var success = false, $el = $(el);                                                                   // 2345
                ttEach(this.first(), function(t) {                                                                  // 2346
                    success = t.autocomplete($el);                                                                  // 2347
                });                                                                                                 // 2348
                return success;                                                                                     // 2349
            },                                                                                                      // 2350
            moveCursor: function moveCursoe(delta) {                                                                // 2351
                var success = false;                                                                                // 2352
                ttEach(this.first(), function(t) {                                                                  // 2353
                    success = t.moveCursor(delta);                                                                  // 2354
                });                                                                                                 // 2355
                return success;                                                                                     // 2356
            },                                                                                                      // 2357
            val: function val(newVal) {                                                                             // 2358
                var query;                                                                                          // 2359
                if (!arguments.length) {                                                                            // 2360
                    ttEach(this.first(), function(t) {                                                              // 2361
                        query = t.getVal();                                                                         // 2362
                    });                                                                                             // 2363
                    return query;                                                                                   // 2364
                } else {                                                                                            // 2365
                    ttEach(this, function(t) {                                                                      // 2366
                        t.setVal(newVal);                                                                           // 2367
                    });                                                                                             // 2368
                    return this;                                                                                    // 2369
                }                                                                                                   // 2370
            },                                                                                                      // 2371
            destroy: function destroy() {                                                                           // 2372
                ttEach(this, function(typeahead, $input) {                                                          // 2373
                    revert($input);                                                                                 // 2374
                    typeahead.destroy();                                                                            // 2375
                });                                                                                                 // 2376
                return this;                                                                                        // 2377
            }                                                                                                       // 2378
        };                                                                                                          // 2379
        $.fn.typeahead = function(method) {                                                                         // 2380
            if (methods[method]) {                                                                                  // 2381
                return methods[method].apply(this, [].slice.call(arguments, 1));                                    // 2382
            } else {                                                                                                // 2383
                return methods.initialize.apply(this, arguments);                                                   // 2384
            }                                                                                                       // 2385
        };                                                                                                          // 2386
        $.fn.typeahead.noConflict = function noConflict() {                                                         // 2387
            $.fn.typeahead = old;                                                                                   // 2388
            return this;                                                                                            // 2389
        };                                                                                                          // 2390
        function ttEach($els, fn) {                                                                                 // 2391
            $els.each(function() {                                                                                  // 2392
                var $input = $(this), typeahead;                                                                    // 2393
                (typeahead = $input.data(keys.typeahead)) && fn(typeahead, $input);                                 // 2394
            });                                                                                                     // 2395
        }                                                                                                           // 2396
        function buildHintFromInput($input, www) {                                                                  // 2397
            return $input.clone().addClass(www.classes.hint).removeData().css(www.css.hint).css(getBackgroundStyles($input)).prop("readonly", true).removeAttr("id name placeholder required").attr({
                tabindex: -1                                                                                        // 2399
            });                                                                                                     // 2400
        }                                                                                                           // 2401
        function prepInput($input, www) {                                                                           // 2402
            $input.data(keys.attrs, {                                                                               // 2403
                dir: $input.attr("dir"),                                                                            // 2404
                autocomplete: $input.attr("autocomplete"),                                                          // 2405
                spellcheck: $input.attr("spellcheck"),                                                              // 2406
                style: $input.attr("style")                                                                         // 2407
            });                                                                                                     // 2408
            $input.addClass(www.classes.input);                                                                     // 2409
            try {                                                                                                   // 2410
                !$input.attr("dir") && $input.attr("dir", "auto");                                                  // 2411
            } catch (e) {}                                                                                          // 2412
            return $input;                                                                                          // 2413
        }                                                                                                           // 2414
        function getBackgroundStyles($el) {                                                                         // 2415
            return {                                                                                                // 2416
                backgroundAttachment: $el.css("background-attachment"),                                             // 2417
                backgroundClip: $el.css("background-clip"),                                                         // 2418
                backgroundColor: $el.css("background-color"),                                                       // 2419
                backgroundImage: $el.css("background-image"),                                                       // 2420
                backgroundOrigin: $el.css("background-origin"),                                                     // 2421
                backgroundPosition: $el.css("background-position"),                                                 // 2422
                backgroundRepeat: $el.css("background-repeat"),                                                     // 2423
                backgroundSize: $el.css("background-size")                                                          // 2424
            };                                                                                                      // 2425
        }                                                                                                           // 2426
        function revert($input) {                                                                                   // 2427
            var www, $wrapper;                                                                                      // 2428
            www = $input.data(keys.www);                                                                            // 2429
            $wrapper = $input.parent().filter(www.selectors.wrapper);                                               // 2430
            _.each($input.data(keys.attrs), function(val, key) {                                                    // 2431
                _.isUndefined(val) ? $input.removeAttr(key) : $input.attr(key, val);                                // 2432
            });                                                                                                     // 2433
            $input.removeData(keys.typeahead).removeData(keys.www).removeData(keys.attr).removeClass(www.classes.input);
            if ($wrapper.length) {                                                                                  // 2435
                $input.detach().insertAfter($wrapper);                                                              // 2436
                $wrapper.remove();                                                                                  // 2437
            }                                                                                                       // 2438
        }                                                                                                           // 2439
        function $elOrNull(obj) {                                                                                   // 2440
            var isValid, $el;                                                                                       // 2441
            isValid = _.isJQuery(obj) || _.isElement(obj);                                                          // 2442
            $el = isValid ? $(obj).first() : [];                                                                    // 2443
            return $el.length ? $el : null;                                                                         // 2444
        }                                                                                                           // 2445
    })();                                                                                                           // 2446
});                                                                                                                 // 2447
                                                                                                                    // 2448
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/sergeyt_typeahead/index.js                                                                              //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var global = this || window;                                                                                        // 1
                                                                                                                    // 2
function identity(x) { return x; }                                                                                  // 3
                                                                                                                    // 4
// String.trim polyfill                                                                                             // 5
if (!String.prototype.trim) {                                                                                       // 6
	String.prototype.trim = function () {                                                                              // 7
		return this.replace(/^\s+|\s+$/g, '');                                                                            // 8
	};                                                                                                                 // 9
}                                                                                                                   // 10
                                                                                                                    // 11
var typeaheadEvents = [                                                                                             // 12
	"active",                                                                                                          // 13
	"idle",                                                                                                            // 14
	"open",                                                                                                            // 15
	"close",                                                                                                           // 16
	"change",                                                                                                          // 17
	"render",                                                                                                          // 18
	"select",                                                                                                          // 19
	"autocomplete",                                                                                                    // 20
	"asyncrequest",                                                                                                    // 21
	"asynccancel",                                                                                                     // 22
	"asyncreceive",                                                                                                    // 23
];                                                                                                                  // 24
                                                                                                                    // 25
/**                                                                                                                 // 26
 * Activates typeahead behavior for given element.                                                                  // 27
 * @param element (required) The DOM element to infect.                                                             // 28
 * @param source (optional) The custom data source.                                                                 // 29
 */                                                                                                                 // 30
Meteor.typeahead = function(element, source) {                                                                      // 31
	var $e = $(element);                                                                                               // 32
	var datasets = resolve_datasets($e, source);                                                                       // 33
                                                                                                                    // 34
	$e.typeahead('destroy');                                                                                           // 35
                                                                                                                    // 36
	var options = $e.data('options') || {};                                                                            // 37
	if (typeof options != 'object') {                                                                                  // 38
		options = {};                                                                                                     // 39
	}                                                                                                                  // 40
                                                                                                                    // 41
	function get_bool(name, defval) {                                                                                  // 42
		var val = $e.data(name);                                                                                          // 43
		return val === undefined ? defval : !!val;                                                                        // 44
	}                                                                                                                  // 45
                                                                                                                    // 46
	// other known options passed via data attributes                                                                  // 47
	var highlight = get_bool('highlight', false);                                                                      // 48
	var hint = get_bool('hint', true);                                                                                 // 49
	var autoselect = get_bool('autoselect', false);                                                                    // 50
	var minLength = get_min_length($e);                                                                                // 51
                                                                                                                    // 52
	options = $.extend(options, {                                                                                      // 53
		highlight: highlight,                                                                                             // 54
		hint: hint,                                                                                                       // 55
		minLength: minLength,                                                                                             // 56
		autoselect: autoselect                                                                                            // 57
	});                                                                                                                // 58
                                                                                                                    // 59
	var instance;                                                                                                      // 60
	if (Array.isArray(datasets)) {                                                                                     // 61
		instance = $e.typeahead.apply($e, [options].concat(datasets));                                                    // 62
	} else {                                                                                                           // 63
		var dataset = datasets;                                                                                           // 64
                                                                                                                    // 65
		// TODO remove this when typeahead.js will support minLength = 0                                                  // 66
		if (minLength === 0 && dataset.local) {                                                                           // 67
			// based on @snekse suggestion (see https://github.com/twitter/typeahead.js/pull/719)                            // 68
			var altSource = dataset.source;                                                                                  // 69
			dataset.source = function(query, sync, async) {                                                                  // 70
				return query ? altSource(query, sync, async) : sync(dataset.local());                                           // 71
			};                                                                                                               // 72
		}                                                                                                                 // 73
                                                                                                                    // 74
		instance = $e.typeahead(options, dataset);                                                                        // 75
	}                                                                                                                  // 76
                                                                                                                    // 77
	// bind event handlers                                                                                             // 78
	typeaheadEvents.forEach(function(name) {                                                                           // 79
		var fn = resolve_template_function($e[0], $e.data(name));                                                         // 80
		if ($.isFunction(fn)) {                                                                                           // 81
			instance.on('typeahead:' + name, fn);                                                                            // 82
		}                                                                                                                 // 83
	});                                                                                                                // 84
                                                                                                                    // 85
	// fix to apply bootstrap form-control to tt-hint                                                                  // 86
	// TODO support other classes if needed                                                                            // 87
	if ($e.hasClass('form-control')) {                                                                                 // 88
		$e.parent('.twitter-typeahead').find('.tt-hint').addClass('form-control');                                        // 89
	}                                                                                                                  // 90
                                                                                                                    // 91
	// TODO remove this when typeahead.js will support minLength = 0                                                   // 92
	if (minLength === 0) {                                                                                             // 93
		$e.on('focus', function() {                                                                                       // 94
			if ($e.val() === '') {                                                                                           // 95
				$e.data('ttTypeahead').input.trigger('queryChanged', '');                                                       // 96
			}                                                                                                                // 97
		});                                                                                                               // 98
	}                                                                                                                  // 99
                                                                                                                    // 100
	return instance;                                                                                                   // 101
};                                                                                                                  // 102
                                                                                                                    // 103
/**                                                                                                                 // 104
 * Activates all typeahead elements.                                                                                // 105
 * @param selector (optional) selector to find typeahead elements to be activated                                   // 106
 */                                                                                                                 // 107
Meteor.typeahead.inject = function(selector) {                                                                      // 108
	if (!selector) {                                                                                                   // 109
		selector = '.typeahead';                                                                                          // 110
	}                                                                                                                  // 111
                                                                                                                    // 112
	// See if we have a template instance to reference                                                                 // 113
	var template = Template.instance();                                                                                // 114
	if (!template) {                                                                                                   // 115
		// If we don't, just init on the entire DOM                                                                       // 116
		$(selector).each(init_typeahead);                                                                                 // 117
	} else {                                                                                                           // 118
		// Otherwise just init this template's typeaheads                                                                 // 119
		template.$(selector).each(init_typeahead);                                                                        // 120
	}                                                                                                                  // 121
};                                                                                                                  // 122
                                                                                                                    // 123
function init_typeahead(index, element) {                                                                           // 124
	try {                                                                                                              // 125
		if (!$(element).data('ttTypeahead')) {                                                                            // 126
			Meteor.typeahead(element);                                                                                       // 127
		}                                                                                                                 // 128
	} catch (err) {                                                                                                    // 129
		console.log(err);                                                                                                 // 130
		return;                                                                                                           // 131
	}                                                                                                                  // 132
}                                                                                                                   // 133
                                                                                                                    // 134
function resolve_datasets($e, source) {                                                                             // 135
	var element = $e[0];                                                                                               // 136
	var datasets = $e.data('sources') || $e.data('sets');                                                              // 137
	if (datasets) {                                                                                                    // 138
		if (typeof datasets == 'string') {                                                                                // 139
			datasets = resolve_template_function(element, datasets);                                                         // 140
		}                                                                                                                 // 141
		if ($.isFunction(datasets)) {                                                                                     // 142
			datasets = datasets() || [];                                                                                     // 143
		}                                                                                                                 // 144
		return datasets.map(function(ds) {                                                                                // 145
			return make_bloodhound(ds);                                                                                      // 146
		});                                                                                                               // 147
	}                                                                                                                  // 148
                                                                                                                    // 149
	var name = normalize_dataset_name($e.attr('data-source-name') || $e.attr('name') || $e.attr('id') || 'dataset');   // 150
	var limit = $e.data('limit');                                                                                      // 151
	var templateName = $e.data('template'); // specifies name of custom template                                       // 152
	var templates = $e.data('templates'); // specifies custom templates                                                // 153
	var valueKey = $e.data('value-key') || 'value';                                                                    // 154
	var minLength = get_min_length($e);                                                                                // 155
                                                                                                                    // 156
	if (!source) {                                                                                                     // 157
		source = $e.data('source') || [];                                                                                 // 158
	}                                                                                                                  // 159
                                                                                                                    // 160
	var dataset = {                                                                                                    // 161
		name: name,                                                                                                       // 162
		valueKey: valueKey,                                                                                               // 163
		displayKey: valueKey,                                                                                             // 164
		minLength: minLength,                                                                                             // 165
	};                                                                                                                 // 166
                                                                                                                    // 167
	if (limit) {                                                                                                       // 168
		dataset.limit = limit;                                                                                            // 169
	}                                                                                                                  // 170
                                                                                                                    // 171
	// support for custom templates                                                                                    // 172
	if (templateName) {                                                                                                // 173
		dataset.template = templateName;                                                                                  // 174
	}                                                                                                                  // 175
                                                                                                                    // 176
	// parse string with custom templates if it is specified                                                           // 177
	if (templates && typeof templates === 'string') {                                                                  // 178
		set_templates(dataset, templates);                                                                                // 179
	}                                                                                                                  // 180
                                                                                                                    // 181
	dataset.templates = make_templates(dataset);                                                                       // 182
                                                                                                                    // 183
	if (typeof source === 'string') {                                                                                  // 184
		if (source.indexOf('/') >= 0) { // support prefetch urls                                                          // 185
			isprefetch = true;                                                                                               // 186
			dataset.prefetch = {                                                                                             // 187
				url: source,                                                                                                    // 188
				filter: function(list) {                                                                                        // 189
					return (list || []).map(value_wrapper(dataset));                                                               // 190
				}                                                                                                               // 191
			};                                                                                                               // 192
			return make_bloodhound(dataset);                                                                                 // 193
		}                                                                                                                 // 194
		source = resolve_data_source(element, source);                                                                    // 195
	}                                                                                                                  // 196
                                                                                                                    // 197
	if ($.isArray(source) || ($.isFunction(source) && source.length === 0)) {                                          // 198
		dataset.local = source;                                                                                           // 199
		return make_bloodhound(dataset);                                                                                  // 200
	}                                                                                                                  // 201
                                                                                                                    // 202
	dataset.source = source;                                                                                           // 203
                                                                                                                    // 204
	return dataset;                                                                                                    // 205
}                                                                                                                   // 206
                                                                                                                    // 207
function get_min_length($e) {                                                                                       // 208
	var value = parseInt($e.data('min-length'));                                                                       // 209
	return isNaN(value) || value < 0 ? 1 : value;                                                                      // 210
}                                                                                                                   // 211
                                                                                                                    // 212
// typeahead.js throws error if dataset name does not meet /^[_a-zA-Z0-9-]+$/                                       // 213
function normalize_dataset_name(name) {                                                                             // 214
	return name.replace(/[\]\[\.]/g, '_');                                                                             // 215
}                                                                                                                   // 216
                                                                                                                    // 217
// Parses string with template names and set appropriate dataset properties.                                        // 218
function set_templates(dataset, templates) {                                                                        // 219
	var templateKeys = {                                                                                               // 220
		header: 1,                                                                                                        // 221
		footer: 1,                                                                                                        // 222
		suggestion: 1,                                                                                                    // 223
		template: 1, // suggestion alias                                                                                  // 224
		notFound: 1,                                                                                                      // 225
		empty: 1, // notFound alias                                                                                       // 226
		pending: 1                                                                                                        // 227
	};                                                                                                                 // 228
	var pairs = templates.split(/[;,]+/);                                                                              // 229
	pairs.map(function(s) {                                                                                            // 230
		var p = s.split(/[:=]+/).map(function(it) { return it.trim(); });                                                 // 231
		switch (p.length) {                                                                                               // 232
			case 1: // set suggestion template when no key is specified                                                      // 233
				return ['template', p[0]];                                                                                      // 234
			case 2:                                                                                                          // 235
				return (p[0] in templateKeys) ? [p[0], p[1]] : null;                                                            // 236
			default:                                                                                                         // 237
				return null;                                                                                                    // 238
		}                                                                                                                 // 239
	}).filter(identity).forEach(function(p) {                                                                          // 240
		dataset[p[0]] = p[1];                                                                                             // 241
	});                                                                                                                // 242
}                                                                                                                   // 243
                                                                                                                    // 244
// Resolves data source function.                                                                                   // 245
function resolve_data_source(element, name) {                                                                       // 246
	var fn = resolve_template_function(element, name);                                                                 // 247
	if ($.isFunction(fn)) {                                                                                            // 248
		return fn;                                                                                                        // 249
	}                                                                                                                  // 250
                                                                                                                    // 251
	// collection.name                                                                                                 // 252
	var path = name.split('.');                                                                                        // 253
	if (path.length > 0) {                                                                                             // 254
		var collection = find_collection(path[0]);                                                                        // 255
		if (collection) {                                                                                                 // 256
			var property = path.length > 1 ? path[1] : "";                                                                   // 257
			return function() {                                                                                              // 258
				return collection.find().fetch()                                                                                // 259
					.map(function(it) {                                                                                            // 260
						var value = property ? it[property] : it.name || it.title;                                                    // 261
						// wrap to object to use object id in selected event handler                                                  // 262
						return value ? {value: value, id: it._id} : "";                                                               // 263
					})                                                                                                             // 264
					.filter(identity);                                                                                             // 265
			};                                                                                                               // 266
		}                                                                                                                 // 267
	}                                                                                                                  // 268
                                                                                                                    // 269
	console.log("Unable to resolve data source function '%s'.", name);                                                 // 270
	return [];                                                                                                         // 271
}                                                                                                                   // 272
                                                                                                                    // 273
function find_collection(name) {                                                                                    // 274
	if (typeof Mongo != "undefined" && typeof Mongo.Collection != "undefined") {                                       // 275
		// when use dburles:mongo-collection-instances                                                                    // 276
		if ($.isFunction(Mongo.Collection.get)) {                                                                         // 277
			return Mongo.Collection.get(name);                                                                               // 278
		}                                                                                                                 // 279
	}                                                                                                                  // 280
	if (global) {                                                                                                      // 281
		return global[name] || global[name.toLowerCase()] || null;                                                        // 282
	}                                                                                                                  // 283
	return null;                                                                                                       // 284
}                                                                                                                   // 285
                                                                                                                    // 286
// Resolves function with specified name from context of given element.                                             // 287
function resolve_template_function(element, name) {                                                                 // 288
	var fn = null;                                                                                                     // 289
	var opts = {sync:false};                                                                                           // 290
	// traverse view hierarchy and find helper function                                                                // 291
	var view = Blaze.getView(element);                                                                                 // 292
	while (view) {                                                                                                     // 293
		fn = resolve_helper(view, name, opts);                                                                            // 294
		if ($.isFunction(fn)) {                                                                                           // 295
			break;                                                                                                           // 296
		}                                                                                                                 // 297
		view = view.parentView;                                                                                           // 298
	}                                                                                                                  // 299
                                                                                                                    // 300
	if (!$.isFunction(fn)) {                                                                                           // 301
		return null;                                                                                                      // 302
	}                                                                                                                  // 303
                                                                                                                    // 304
	// calls template helper function with Template.instance() context                                                 // 305
	function invoke(args) {                                                                                            // 306
		// use Blaze._withCurrentView internal function to set current view                                               // 307
		// also since meteor 1.2 no need to use Template._withTemplateInstanceFunc                                        // 308
		// since the function is already bound to template instance                                                       // 309
		return Blaze._withCurrentView(view, function() {                                                                  // 310
			return fn.apply(null, args);                                                                                     // 311
		});                                                                                                               // 312
	}                                                                                                                  // 313
                                                                                                                    // 314
	if (opts.sync) { // local dataset?                                                                                 // 315
		return function() {                                                                                               // 316
			return invoke(Array.prototype.slice.call(arguments));                                                            // 317
		};                                                                                                                // 318
	}                                                                                                                  // 319
	// async data source                                                                                               // 320
	return function(a) {                                                                                               // 321
		return invoke(Array.prototype.slice.call(arguments));                                                             // 322
	};                                                                                                                 // 323
}                                                                                                                   // 324
                                                                                                                    // 325
function resolve_helper(view, name, opts) {                                                                         // 326
	if (!view.template) {                                                                                              // 327
		return null;                                                                                                      // 328
	}                                                                                                                  // 329
	// we need to known whether the helper function is async                                                           // 330
	// use view.template.__helpers to determine that                                                                   // 331
	// since meteor 1.2 Blaze._getTemplateHelper wraps                                                                 // 332
	// the helper function binding it to template context                                                              // 333
	var fn = view.template.__helpers.get(name) || view.template[name];                                                 // 334
	if (!$.isFunction(fn)) {                                                                                           // 335
		return null;                                                                                                      // 336
	}                                                                                                                  // 337
	opts.sync = fn.length === 0;                                                                                       // 338
	return Blaze._getTemplateHelper(view.template, name, function() {                                                  // 339
		return view.templateInstance();                                                                                   // 340
	});                                                                                                                // 341
}                                                                                                                   // 342
                                                                                                                    // 343
// Returns HTML template function that generates HTML string using data from suggestion item.                       // 344
// This function is implemented using given meteor template specified by templateName argument.                     // 345
function make_template_function(templateName) {                                                                     // 346
	if (!templateName) {                                                                                               // 347
		throw new Error("templateName is not specified");                                                                 // 348
	}                                                                                                                  // 349
                                                                                                                    // 350
	var tmpl = Template[templateName];                                                                                 // 351
	if (!tmpl) {                                                                                                       // 352
		throw new Error("Template '" + templateName  + "' is not defined");                                               // 353
	}                                                                                                                  // 354
                                                                                                                    // 355
	return function(context) {                                                                                         // 356
		var div = $("<div/>");                                                                                            // 357
		if ($.isFunction(Blaze.renderWithData)) {                                                                         // 358
			Blaze.renderWithData(tmpl, context, div[0]);                                                                     // 359
		} else { // for meteor < v0.9                                                                                     // 360
			var range = UI.renderWithData(tmpl, context);                                                                    // 361
			UI.insert(range, div[0]);                                                                                        // 362
		}                                                                                                                 // 363
		// return html wrapped into div to avoid visual issues                                                            // 364
		return div[0].outerHTML;                                                                                          // 365
	};                                                                                                                 // 366
}                                                                                                                   // 367
                                                                                                                    // 368
// Creates object with template functions (for header, footer, suggestion, empty templates).                        // 369
function make_templates(dataset) {                                                                                  // 370
                                                                                                                    // 371
	function make(value) {                                                                                             // 372
		if (!value) {                                                                                                     // 373
			return null;                                                                                                     // 374
		}                                                                                                                 // 375
		if (typeof value === "string") {                                                                                  // 376
			if (value.indexOf('<') >= 0) { // detect HTML string                                                             // 377
				return value;                                                                                                   // 378
			}                                                                                                                // 379
			return make_template_function(value);                                                                            // 380
		}                                                                                                                 // 381
		return $.isFunction(value) ? value : null;                                                                        // 382
	}                                                                                                                  // 383
                                                                                                                    // 384
	var templates = {                                                                                                  // 385
		header: make(dataset.header),                                                                                     // 386
		footer: make(dataset.footer),                                                                                     // 387
		suggestion: make(dataset.suggestion || dataset.template),                                                         // 388
		notFound: make(dataset.notFound || dataset.empty)                                                                 // 389
	};                                                                                                                 // 390
                                                                                                                    // 391
	return Object.keys(templates)                                                                                      // 392
		.filter(function(key) { return templates[key]; })                                                                 // 393
		.reduce(function(result, key) {                                                                                   // 394
			result[key] = templates[key];                                                                                    // 395
			return result;                                                                                                   // 396
		}, {});                                                                                                           // 397
}                                                                                                                   // 398
                                                                                                                    // 399
// Returns function to map string value to plain JS object required by typeahead.                                   // 400
function value_wrapper(dataset) {                                                                                   // 401
	return function(value) {                                                                                           // 402
		if (typeof value === 'object') {                                                                                  // 403
			return value;                                                                                                    // 404
		}                                                                                                                 // 405
		var item = {};                                                                                                    // 406
		item[dataset.valueKey] = value;                                                                                   // 407
		return item;                                                                                                      // 408
	};                                                                                                                 // 409
}                                                                                                                   // 410
                                                                                                                    // 411
// Creates Bloodhound suggestion engine based on given dataset.                                                     // 412
function make_bloodhound(dataset) {                                                                                 // 413
	if (!dataset.template) {                                                                                           // 414
		if (Array.isArray(dataset.local)) {                                                                               // 415
			dataset.local = dataset.local.map(value_wrapper(dataset));                                                       // 416
		} else if ($.isFunction(dataset.local) && dataset.local.length === 0) {                                           // 417
			var localFn = dataset.local;                                                                                     // 418
			dataset.local = function() {                                                                                     // 419
				return (localFn() || []).map(value_wrapper(dataset));                                                           // 420
			};                                                                                                               // 421
		}                                                                                                                 // 422
	}                                                                                                                  // 423
                                                                                                                    // 424
	var need_bloodhound = dataset.prefetch || Array.isArray(dataset.local) ||                                          // 425
		$.isFunction(dataset.local) && dataset.local.length === 0;                                                        // 426
                                                                                                                    // 427
	var engine;                                                                                                        // 428
                                                                                                                    // 429
	if (need_bloodhound) {                                                                                             // 430
		var options = $.extend({}, dataset, {                                                                             // 431
			// TODO support custom tokenizers                                                                                // 432
			datumTokenizer: Bloodhound.tokenizers.obj.whitespace(dataset.valueKey),                                          // 433
			queryTokenizer: Bloodhound.tokenizers.whitespace                                                                 // 434
		});                                                                                                               // 435
                                                                                                                    // 436
		engine = new Bloodhound(options);                                                                                 // 437
		engine.initialize();                                                                                              // 438
                                                                                                                    // 439
		if ($.isFunction(dataset.local) && dataset.local.length === 0) {                                                  // 440
			// update data source on changing deps of local function                                                         // 441
			// TODO find better (functional) way to do that                                                                  // 442
			var tracker = Template.instance() || Tracker;                                                                    // 443
			tracker.autorun(function(comp) {                                                                                 // 444
				// TODO stop tracking if typeahead is explicitly destroyed (issue #70)                                          // 445
				engine = new Bloodhound(options);                                                                               // 446
				engine.initialize();                                                                                            // 447
			});                                                                                                              // 448
		}                                                                                                                 // 449
	}                                                                                                                  // 450
                                                                                                                    // 451
	function bloodhound_source(query, cb) {                                                                            // 452
		var fn = engine.ttAdapter();                                                                                      // 453
		return fn(query, cb);                                                                                             // 454
	}                                                                                                                  // 455
                                                                                                                    // 456
	var src = need_bloodhound || typeof dataset.local !== 'undefined' ?                                                // 457
		{source: need_bloodhound ? bloodhound_source : dataset.local}                                                     // 458
		: {};                                                                                                             // 459
                                                                                                                    // 460
	var templates = typeof dataset.templates === 'undefined' ?                                                         // 461
		{templates: make_templates(dataset)}                                                                              // 462
		: {};                                                                                                             // 463
                                                                                                                    // 464
	return $.extend({}, dataset, src, templates);                                                                      // 465
}                                                                                                                   // 466
                                                                                                                    // 467
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['sergeyt:typeahead'] = {};

})();
