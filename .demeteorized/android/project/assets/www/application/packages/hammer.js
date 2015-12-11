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

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/hammer/jquery.hammer/jquery.hammer.js                                                                  //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
/*! jQuery plugin for Hammer.JS - v1.0.0 - 2014-01-02                                                              // 1
 * http://eightmedia.github.com/hammer.js                                                                          // 2
 *                                                                                                                 // 3
 * Copyright (c) 2014 Jorik Tangelder <j.tangelder@gmail.com>;                                                     // 4
 * Licensed under the MIT license *//*! Hammer.JS - v1.0.6 - 2014-01-02                                            // 5
 * http://eightmedia.github.com/hammer.js                                                                          // 6
 *                                                                                                                 // 7
 * Copyright (c) 2014 Jorik Tangelder <j.tangelder@gmail.com>;                                                     // 8
 * Licensed under the MIT license */                                                                               // 9
                                                                                                                   // 10
(function(window, undefined) {                                                                                     // 11
  'use strict';                                                                                                    // 12
                                                                                                                   // 13
/**                                                                                                                // 14
 * Hammer                                                                                                          // 15
 * use this to create instances                                                                                    // 16
 * @param   {HTMLElement}   element                                                                                // 17
 * @param   {Object}        options                                                                                // 18
 * @returns {Hammer.Instance}                                                                                      // 19
 * @constructor                                                                                                    // 20
 */                                                                                                                // 21
var Hammer = function(element, options) {                                                                          // 22
  return new Hammer.Instance(element, options || {});                                                              // 23
};                                                                                                                 // 24
                                                                                                                   // 25
// default settings                                                                                                // 26
Hammer.defaults = {                                                                                                // 27
  // add styles and attributes to the element to prevent the browser from doing                                    // 28
  // its native behavior. this doesnt prevent the scrolling, but cancels                                           // 29
  // the contextmenu, tap highlighting etc                                                                         // 30
  // set to false to disable this                                                                                  // 31
  stop_browser_behavior: {                                                                                         // 32
    // this also triggers onselectstart=false for IE                                                               // 33
    userSelect       : 'none',                                                                                     // 34
    // this makes the element blocking in IE10 >, you could experiment with the value                              // 35
    // see for more options this issue; https://github.com/EightMedia/hammer.js/issues/241                         // 36
    touchAction      : 'none',                                                                                     // 37
    touchCallout     : 'none',                                                                                     // 38
    contentZooming   : 'none',                                                                                     // 39
    userDrag         : 'none',                                                                                     // 40
    tapHighlightColor: 'rgba(0,0,0,0)'                                                                             // 41
  }                                                                                                                // 42
                                                                                                                   // 43
  //                                                                                                               // 44
  // more settings are defined per gesture at gestures.js                                                          // 45
  //                                                                                                               // 46
};                                                                                                                 // 47
                                                                                                                   // 48
// detect touchevents                                                                                              // 49
Hammer.HAS_POINTEREVENTS = window.navigator.pointerEnabled || window.navigator.msPointerEnabled;                   // 50
Hammer.HAS_TOUCHEVENTS = ('ontouchstart' in window);                                                               // 51
                                                                                                                   // 52
// dont use mouseevents on mobile devices                                                                          // 53
Hammer.MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android|silk/i;                                                // 54
Hammer.NO_MOUSEEVENTS = Hammer.HAS_TOUCHEVENTS && window.navigator.userAgent.match(Hammer.MOBILE_REGEX);           // 55
                                                                                                                   // 56
// eventtypes per touchevent (start, move, end)                                                                    // 57
// are filled by Hammer.event.determineEventTypes on setup                                                         // 58
Hammer.EVENT_TYPES = {};                                                                                           // 59
                                                                                                                   // 60
// direction defines                                                                                               // 61
Hammer.DIRECTION_DOWN = 'down';                                                                                    // 62
Hammer.DIRECTION_LEFT = 'left';                                                                                    // 63
Hammer.DIRECTION_UP = 'up';                                                                                        // 64
Hammer.DIRECTION_RIGHT = 'right';                                                                                  // 65
                                                                                                                   // 66
// pointer type                                                                                                    // 67
Hammer.POINTER_MOUSE = 'mouse';                                                                                    // 68
Hammer.POINTER_TOUCH = 'touch';                                                                                    // 69
Hammer.POINTER_PEN = 'pen';                                                                                        // 70
                                                                                                                   // 71
// touch event defines                                                                                             // 72
Hammer.EVENT_START = 'start';                                                                                      // 73
Hammer.EVENT_MOVE = 'move';                                                                                        // 74
Hammer.EVENT_END = 'end';                                                                                          // 75
                                                                                                                   // 76
// hammer document where the base events are added at                                                              // 77
Hammer.DOCUMENT = window.document;                                                                                 // 78
                                                                                                                   // 79
// plugins and gestures namespaces                                                                                 // 80
Hammer.plugins = Hammer.plugins || {};                                                                             // 81
Hammer.gestures = Hammer.gestures || {};                                                                           // 82
                                                                                                                   // 83
// if the window events are set...                                                                                 // 84
Hammer.READY = false;                                                                                              // 85
                                                                                                                   // 86
/**                                                                                                                // 87
 * setup events to detect gestures on the document                                                                 // 88
 */                                                                                                                // 89
function setup() {                                                                                                 // 90
  if(Hammer.READY) {                                                                                               // 91
    return;                                                                                                        // 92
  }                                                                                                                // 93
                                                                                                                   // 94
  // find what eventtypes we add listeners to                                                                      // 95
  Hammer.event.determineEventTypes();                                                                              // 96
                                                                                                                   // 97
  // Register all gestures inside Hammer.gestures                                                                  // 98
  Hammer.utils.each(Hammer.gestures, function(gesture){                                                            // 99
    Hammer.detection.register(gesture);                                                                            // 100
  });                                                                                                              // 101
                                                                                                                   // 102
  // Add touch events on the document                                                                              // 103
  Hammer.event.onTouch(Hammer.DOCUMENT, Hammer.EVENT_MOVE, Hammer.detection.detect);                               // 104
  Hammer.event.onTouch(Hammer.DOCUMENT, Hammer.EVENT_END, Hammer.detection.detect);                                // 105
                                                                                                                   // 106
  // Hammer is ready...!                                                                                           // 107
  Hammer.READY = true;                                                                                             // 108
}                                                                                                                  // 109
                                                                                                                   // 110
Hammer.utils = {                                                                                                   // 111
  /**                                                                                                              // 112
   * extend method,                                                                                                // 113
   * also used for cloning when dest is an empty object                                                            // 114
   * @param   {Object}    dest                                                                                     // 115
   * @param   {Object}    src                                                                                      // 116
   * @parm  {Boolean}  merge    do a merge                                                                         // 117
   * @returns {Object}    dest                                                                                     // 118
   */                                                                                                              // 119
  extend: function extend(dest, src, merge) {                                                                      // 120
    for(var key in src) {                                                                                          // 121
      if(dest[key] !== undefined && merge) {                                                                       // 122
        continue;                                                                                                  // 123
      }                                                                                                            // 124
      dest[key] = src[key];                                                                                        // 125
    }                                                                                                              // 126
    return dest;                                                                                                   // 127
  },                                                                                                               // 128
                                                                                                                   // 129
                                                                                                                   // 130
  /**                                                                                                              // 131
   * for each                                                                                                      // 132
   * @param obj                                                                                                    // 133
   * @param iterator                                                                                               // 134
   */                                                                                                              // 135
  each: function(obj, iterator, context) {                                                                         // 136
    var i, length;                                                                                                 // 137
    // native forEach on arrays                                                                                    // 138
    if ('forEach' in obj) {                                                                                        // 139
      obj.forEach(iterator, context);                                                                              // 140
    }                                                                                                              // 141
    // arrays                                                                                                      // 142
    else if(obj.length !== undefined) {                                                                            // 143
      for (i = 0, length = obj.length; i < length; i++) {                                                          // 144
        if (iterator.call(context, obj[i], i, obj) === false) {                                                    // 145
          return;                                                                                                  // 146
        }                                                                                                          // 147
      }                                                                                                            // 148
    }                                                                                                              // 149
    // objects                                                                                                     // 150
    else {                                                                                                         // 151
      for (i in obj) {                                                                                             // 152
        if (obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj) === false) {                           // 153
          return;                                                                                                  // 154
        }                                                                                                          // 155
      }                                                                                                            // 156
    }                                                                                                              // 157
  },                                                                                                               // 158
                                                                                                                   // 159
  /**                                                                                                              // 160
   * find if a node is in the given parent                                                                         // 161
   * used for event delegation tricks                                                                              // 162
   * @param   {HTMLElement}   node                                                                                 // 163
   * @param   {HTMLElement}   parent                                                                               // 164
   * @returns {boolean}       has_parent                                                                           // 165
   */                                                                                                              // 166
  hasParent: function(node, parent) {                                                                              // 167
    while(node) {                                                                                                  // 168
      if(node == parent) {                                                                                         // 169
        return true;                                                                                               // 170
      }                                                                                                            // 171
      node = node.parentNode;                                                                                      // 172
    }                                                                                                              // 173
    return false;                                                                                                  // 174
  },                                                                                                               // 175
                                                                                                                   // 176
                                                                                                                   // 177
  /**                                                                                                              // 178
   * get the center of all the touches                                                                             // 179
   * @param   {Array}     touches                                                                                  // 180
   * @returns {Object}    center                                                                                   // 181
   */                                                                                                              // 182
  getCenter: function getCenter(touches) {                                                                         // 183
    var valuesX = [], valuesY = [];                                                                                // 184
                                                                                                                   // 185
    Hammer.utils.each(touches, function(touch) {                                                                   // 186
      // I prefer clientX because it ignore the scrolling position                                                 // 187
      valuesX.push(typeof touch.clientX !== 'undefined' ? touch.clientX : touch.pageX );                           // 188
      valuesY.push(typeof touch.clientY !== 'undefined' ? touch.clientY : touch.pageY );                           // 189
    });                                                                                                            // 190
                                                                                                                   // 191
    return {                                                                                                       // 192
      pageX: ((Math.min.apply(Math, valuesX) + Math.max.apply(Math, valuesX)) / 2),                                // 193
      pageY: ((Math.min.apply(Math, valuesY) + Math.max.apply(Math, valuesY)) / 2)                                 // 194
    };                                                                                                             // 195
  },                                                                                                               // 196
                                                                                                                   // 197
                                                                                                                   // 198
  /**                                                                                                              // 199
   * calculate the velocity between two points                                                                     // 200
   * @param   {Number}    delta_time                                                                               // 201
   * @param   {Number}    delta_x                                                                                  // 202
   * @param   {Number}    delta_y                                                                                  // 203
   * @returns {Object}    velocity                                                                                 // 204
   */                                                                                                              // 205
  getVelocity: function getVelocity(delta_time, delta_x, delta_y) {                                                // 206
    return {                                                                                                       // 207
      x: Math.abs(delta_x / delta_time) || 0,                                                                      // 208
      y: Math.abs(delta_y / delta_time) || 0                                                                       // 209
    };                                                                                                             // 210
  },                                                                                                               // 211
                                                                                                                   // 212
                                                                                                                   // 213
  /**                                                                                                              // 214
   * calculate the angle between two coordinates                                                                   // 215
   * @param   {Touch}     touch1                                                                                   // 216
   * @param   {Touch}     touch2                                                                                   // 217
   * @returns {Number}    angle                                                                                    // 218
   */                                                                                                              // 219
  getAngle: function getAngle(touch1, touch2) {                                                                    // 220
    var y = touch2.pageY - touch1.pageY,                                                                           // 221
      x = touch2.pageX - touch1.pageX;                                                                             // 222
    return Math.atan2(y, x) * 180 / Math.PI;                                                                       // 223
  },                                                                                                               // 224
                                                                                                                   // 225
                                                                                                                   // 226
  /**                                                                                                              // 227
   * angle to direction define                                                                                     // 228
   * @param   {Touch}     touch1                                                                                   // 229
   * @param   {Touch}     touch2                                                                                   // 230
   * @returns {String}    direction constant, like Hammer.DIRECTION_LEFT                                           // 231
   */                                                                                                              // 232
  getDirection: function getDirection(touch1, touch2) {                                                            // 233
    var x = Math.abs(touch1.pageX - touch2.pageX),                                                                 // 234
      y = Math.abs(touch1.pageY - touch2.pageY);                                                                   // 235
                                                                                                                   // 236
    if(x >= y) {                                                                                                   // 237
      return touch1.pageX - touch2.pageX > 0 ? Hammer.DIRECTION_LEFT : Hammer.DIRECTION_RIGHT;                     // 238
    }                                                                                                              // 239
    else {                                                                                                         // 240
      return touch1.pageY - touch2.pageY > 0 ? Hammer.DIRECTION_UP : Hammer.DIRECTION_DOWN;                        // 241
    }                                                                                                              // 242
  },                                                                                                               // 243
                                                                                                                   // 244
                                                                                                                   // 245
  /**                                                                                                              // 246
   * calculate the distance between two touches                                                                    // 247
   * @param   {Touch}     touch1                                                                                   // 248
   * @param   {Touch}     touch2                                                                                   // 249
   * @returns {Number}    distance                                                                                 // 250
   */                                                                                                              // 251
  getDistance: function getDistance(touch1, touch2) {                                                              // 252
    var x = touch2.pageX - touch1.pageX,                                                                           // 253
      y = touch2.pageY - touch1.pageY;                                                                             // 254
    return Math.sqrt((x * x) + (y * y));                                                                           // 255
  },                                                                                                               // 256
                                                                                                                   // 257
                                                                                                                   // 258
  /**                                                                                                              // 259
   * calculate the scale factor between two touchLists (fingers)                                                   // 260
   * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out                          // 261
   * @param   {Array}     start                                                                                    // 262
   * @param   {Array}     end                                                                                      // 263
   * @returns {Number}    scale                                                                                    // 264
   */                                                                                                              // 265
  getScale: function getScale(start, end) {                                                                        // 266
    // need two fingers...                                                                                         // 267
    if(start.length >= 2 && end.length >= 2) {                                                                     // 268
      return this.getDistance(end[0], end[1]) /                                                                    // 269
        this.getDistance(start[0], start[1]);                                                                      // 270
    }                                                                                                              // 271
    return 1;                                                                                                      // 272
  },                                                                                                               // 273
                                                                                                                   // 274
                                                                                                                   // 275
  /**                                                                                                              // 276
   * calculate the rotation degrees between two touchLists (fingers)                                               // 277
   * @param   {Array}     start                                                                                    // 278
   * @param   {Array}     end                                                                                      // 279
   * @returns {Number}    rotation                                                                                 // 280
   */                                                                                                              // 281
  getRotation: function getRotation(start, end) {                                                                  // 282
    // need two fingers                                                                                            // 283
    if(start.length >= 2 && end.length >= 2) {                                                                     // 284
      return this.getAngle(end[1], end[0]) -                                                                       // 285
        this.getAngle(start[1], start[0]);                                                                         // 286
    }                                                                                                              // 287
    return 0;                                                                                                      // 288
  },                                                                                                               // 289
                                                                                                                   // 290
                                                                                                                   // 291
  /**                                                                                                              // 292
   * boolean if the direction is vertical                                                                          // 293
   * @param    {String}    direction                                                                               // 294
   * @returns  {Boolean}   is_vertical                                                                             // 295
   */                                                                                                              // 296
  isVertical: function isVertical(direction) {                                                                     // 297
    return (direction == Hammer.DIRECTION_UP || direction == Hammer.DIRECTION_DOWN);                               // 298
  },                                                                                                               // 299
                                                                                                                   // 300
                                                                                                                   // 301
  /**                                                                                                              // 302
   * stop browser default behavior with css props                                                                  // 303
   * @param   {HtmlElement}   element                                                                              // 304
   * @param   {Object}        css_props                                                                            // 305
   */                                                                                                              // 306
  stopDefaultBrowserBehavior: function stopDefaultBrowserBehavior(element, css_props) {                            // 307
    if(!css_props || !element || !element.style) {                                                                 // 308
      return;                                                                                                      // 309
    }                                                                                                              // 310
                                                                                                                   // 311
    // with css properties for modern browsers                                                                     // 312
    Hammer.utils.each(['webkit', 'khtml', 'moz', 'Moz', 'ms', 'o', ''], function(vendor) {                         // 313
      Hammer.utils.each(css_props, function(prop) {                                                                // 314
          // vender prefix at the property                                                                         // 315
          if(vendor) {                                                                                             // 316
            prop = vendor + prop.substring(0, 1).toUpperCase() + prop.substring(1);                                // 317
          }                                                                                                        // 318
          // set the style                                                                                         // 319
          if(prop in element.style) {                                                                              // 320
            element.style[prop] = prop;                                                                            // 321
          }                                                                                                        // 322
      });                                                                                                          // 323
    });                                                                                                            // 324
                                                                                                                   // 325
    // also the disable onselectstart                                                                              // 326
    if(css_props.userSelect == 'none') {                                                                           // 327
      element.onselectstart = function() {                                                                         // 328
        return false;                                                                                              // 329
      };                                                                                                           // 330
    }                                                                                                              // 331
                                                                                                                   // 332
    // and disable ondragstart                                                                                     // 333
    if(css_props.userDrag == 'none') {                                                                             // 334
      element.ondragstart = function() {                                                                           // 335
        return false;                                                                                              // 336
      };                                                                                                           // 337
    }                                                                                                              // 338
  }                                                                                                                // 339
};                                                                                                                 // 340
                                                                                                                   // 341
                                                                                                                   // 342
/**                                                                                                                // 343
 * create new hammer instance                                                                                      // 344
 * all methods should return the instance itself, so it is chainable.                                              // 345
 * @param   {HTMLElement}       element                                                                            // 346
 * @param   {Object}            [options={}]                                                                       // 347
 * @returns {Hammer.Instance}                                                                                      // 348
 * @constructor                                                                                                    // 349
 */                                                                                                                // 350
Hammer.Instance = function(element, options) {                                                                     // 351
  var self = this;                                                                                                 // 352
                                                                                                                   // 353
  // setup HammerJS window events and register all gestures                                                        // 354
  // this also sets up the default options                                                                         // 355
  setup();                                                                                                         // 356
                                                                                                                   // 357
  this.element = element;                                                                                          // 358
                                                                                                                   // 359
  // start/stop detection option                                                                                   // 360
  this.enabled = true;                                                                                             // 361
                                                                                                                   // 362
  // merge options                                                                                                 // 363
  this.options = Hammer.utils.extend(                                                                              // 364
    Hammer.utils.extend({}, Hammer.defaults),                                                                      // 365
    options || {});                                                                                                // 366
                                                                                                                   // 367
  // add some css to the element to prevent the browser from doing its native behavoir                             // 368
  if(this.options.stop_browser_behavior) {                                                                         // 369
    Hammer.utils.stopDefaultBrowserBehavior(this.element, this.options.stop_browser_behavior);                     // 370
  }                                                                                                                // 371
                                                                                                                   // 372
  // start detection on touchstart                                                                                 // 373
  Hammer.event.onTouch(element, Hammer.EVENT_START, function(ev) {                                                 // 374
    if(self.enabled) {                                                                                             // 375
      Hammer.detection.startDetect(self, ev);                                                                      // 376
    }                                                                                                              // 377
  });                                                                                                              // 378
                                                                                                                   // 379
  // return instance                                                                                               // 380
  return this;                                                                                                     // 381
};                                                                                                                 // 382
                                                                                                                   // 383
                                                                                                                   // 384
Hammer.Instance.prototype = {                                                                                      // 385
  /**                                                                                                              // 386
   * bind events to the instance                                                                                   // 387
   * @param   {String}      gesture                                                                                // 388
   * @param   {Function}    handler                                                                                // 389
   * @returns {Hammer.Instance}                                                                                    // 390
   */                                                                                                              // 391
  on: function onEvent(gesture, handler) {                                                                         // 392
    var gestures = gesture.split(' ');                                                                             // 393
    Hammer.utils.each(gestures, function(gesture) {                                                                // 394
      this.element.addEventListener(gesture, handler, false);                                                      // 395
    }, this);                                                                                                      // 396
    return this;                                                                                                   // 397
  },                                                                                                               // 398
                                                                                                                   // 399
                                                                                                                   // 400
  /**                                                                                                              // 401
   * unbind events to the instance                                                                                 // 402
   * @param   {String}      gesture                                                                                // 403
   * @param   {Function}    handler                                                                                // 404
   * @returns {Hammer.Instance}                                                                                    // 405
   */                                                                                                              // 406
  off: function offEvent(gesture, handler) {                                                                       // 407
    var gestures = gesture.split(' ');                                                                             // 408
    Hammer.utils.each(gestures, function(gesture) {                                                                // 409
      this.element.removeEventListener(gesture, handler, false);                                                   // 410
    }, this);                                                                                                      // 411
    return this;                                                                                                   // 412
  },                                                                                                               // 413
                                                                                                                   // 414
                                                                                                                   // 415
  /**                                                                                                              // 416
   * trigger gesture event                                                                                         // 417
   * @param   {String}      gesture                                                                                // 418
   * @param   {Object}      [eventData]                                                                            // 419
   * @returns {Hammer.Instance}                                                                                    // 420
   */                                                                                                              // 421
  trigger: function triggerEvent(gesture, eventData) {                                                             // 422
    // optional                                                                                                    // 423
    if(!eventData) {                                                                                               // 424
      eventData = {};                                                                                              // 425
    }                                                                                                              // 426
                                                                                                                   // 427
    // create DOM event                                                                                            // 428
    var event = Hammer.DOCUMENT.createEvent('Event');                                                              // 429
    event.initEvent(gesture, true, true);                                                                          // 430
    event.gesture = eventData;                                                                                     // 431
                                                                                                                   // 432
    // trigger on the target if it is in the instance element,                                                     // 433
    // this is for event delegation tricks                                                                         // 434
    var element = this.element;                                                                                    // 435
    if(Hammer.utils.hasParent(eventData.target, element)) {                                                        // 436
      element = eventData.target;                                                                                  // 437
    }                                                                                                              // 438
                                                                                                                   // 439
    element.dispatchEvent(event);                                                                                  // 440
    return this;                                                                                                   // 441
  },                                                                                                               // 442
                                                                                                                   // 443
                                                                                                                   // 444
  /**                                                                                                              // 445
   * enable of disable hammer.js detection                                                                         // 446
   * @param   {Boolean}   state                                                                                    // 447
   * @returns {Hammer.Instance}                                                                                    // 448
   */                                                                                                              // 449
  enable: function enable(state) {                                                                                 // 450
    this.enabled = state;                                                                                          // 451
    return this;                                                                                                   // 452
  }                                                                                                                // 453
};                                                                                                                 // 454
                                                                                                                   // 455
                                                                                                                   // 456
/**                                                                                                                // 457
 * this holds the last move event,                                                                                 // 458
 * used to fix empty touchend issue                                                                                // 459
 * see the onTouch event for an explanation                                                                        // 460
 * @type {Object}                                                                                                  // 461
 */                                                                                                                // 462
var last_move_event = null;                                                                                        // 463
                                                                                                                   // 464
                                                                                                                   // 465
/**                                                                                                                // 466
 * when the mouse is hold down, this is true                                                                       // 467
 * @type {Boolean}                                                                                                 // 468
 */                                                                                                                // 469
var enable_detect = false;                                                                                         // 470
                                                                                                                   // 471
                                                                                                                   // 472
/**                                                                                                                // 473
 * when touch events have been fired, this is true                                                                 // 474
 * @type {Boolean}                                                                                                 // 475
 */                                                                                                                // 476
var touch_triggered = false;                                                                                       // 477
                                                                                                                   // 478
                                                                                                                   // 479
Hammer.event = {                                                                                                   // 480
  /**                                                                                                              // 481
   * simple addEventListener                                                                                       // 482
   * @param   {HTMLElement}   element                                                                              // 483
   * @param   {String}        type                                                                                 // 484
   * @param   {Function}      handler                                                                              // 485
   */                                                                                                              // 486
  bindDom: function(element, type, handler) {                                                                      // 487
    var types = type.split(' ');                                                                                   // 488
    Hammer.utils.each(types, function(type){                                                                       // 489
      element.addEventListener(type, handler, false);                                                              // 490
    });                                                                                                            // 491
  },                                                                                                               // 492
                                                                                                                   // 493
                                                                                                                   // 494
  /**                                                                                                              // 495
   * touch events with mouse fallback                                                                              // 496
   * @param   {HTMLElement}   element                                                                              // 497
   * @param   {String}        eventType        like Hammer.EVENT_MOVE                                              // 498
   * @param   {Function}      handler                                                                              // 499
   */                                                                                                              // 500
  onTouch: function onTouch(element, eventType, handler) {                                                         // 501
    var self = this;                                                                                               // 502
                                                                                                                   // 503
    this.bindDom(element, Hammer.EVENT_TYPES[eventType], function bindDomOnTouch(ev) {                             // 504
      var sourceEventType = ev.type.toLowerCase();                                                                 // 505
                                                                                                                   // 506
      // onmouseup, but when touchend has been fired we do nothing.                                                // 507
      // this is for touchdevices which also fire a mouseup on touchend                                            // 508
      if(sourceEventType.match(/mouse/) && touch_triggered) {                                                      // 509
        return;                                                                                                    // 510
      }                                                                                                            // 511
                                                                                                                   // 512
      // mousebutton must be down or a touch event                                                                 // 513
      else if(sourceEventType.match(/touch/) ||   // touch events are always on screen                             // 514
        sourceEventType.match(/pointerdown/) || // pointerevents touch                                             // 515
        (sourceEventType.match(/mouse/) && ev.which === 1)   // mouse is pressed                                   // 516
        ) {                                                                                                        // 517
        enable_detect = true;                                                                                      // 518
      }                                                                                                            // 519
                                                                                                                   // 520
      // mouse isn't pressed                                                                                       // 521
      else if(sourceEventType.match(/mouse/) && !ev.which) {                                                       // 522
        enable_detect = false;                                                                                     // 523
      }                                                                                                            // 524
                                                                                                                   // 525
                                                                                                                   // 526
      // we are in a touch event, set the touch triggered bool to true,                                            // 527
      // this for the conflicts that may occur on ios and android                                                  // 528
      if(sourceEventType.match(/touch|pointer/)) {                                                                 // 529
        touch_triggered = true;                                                                                    // 530
      }                                                                                                            // 531
                                                                                                                   // 532
      // count the total touches on the screen                                                                     // 533
      var count_touches = 0;                                                                                       // 534
                                                                                                                   // 535
      // when touch has been triggered in this detection session                                                   // 536
      // and we are now handling a mouse event, we stop that to prevent conflicts                                  // 537
      if(enable_detect) {                                                                                          // 538
        // update pointerevent                                                                                     // 539
        if(Hammer.HAS_POINTEREVENTS && eventType != Hammer.EVENT_END) {                                            // 540
          count_touches = Hammer.PointerEvent.updatePointer(eventType, ev);                                        // 541
        }                                                                                                          // 542
        // touch                                                                                                   // 543
        else if(sourceEventType.match(/touch/)) {                                                                  // 544
          count_touches = ev.touches.length;                                                                       // 545
        }                                                                                                          // 546
        // mouse                                                                                                   // 547
        else if(!touch_triggered) {                                                                                // 548
          count_touches = sourceEventType.match(/up/) ? 0 : 1;                                                     // 549
        }                                                                                                          // 550
                                                                                                                   // 551
        // if we are in a end event, but when we remove one touch and                                              // 552
        // we still have enough, set eventType to move                                                             // 553
        if(count_touches > 0 && eventType == Hammer.EVENT_END) {                                                   // 554
          eventType = Hammer.EVENT_MOVE;                                                                           // 555
        }                                                                                                          // 556
        // no touches, force the end event                                                                         // 557
        else if(!count_touches) {                                                                                  // 558
          eventType = Hammer.EVENT_END;                                                                            // 559
        }                                                                                                          // 560
                                                                                                                   // 561
        // store the last move event                                                                               // 562
        if(count_touches || last_move_event === null) {                                                            // 563
          last_move_event = ev;                                                                                    // 564
        }                                                                                                          // 565
                                                                                                                   // 566
        // trigger the handler                                                                                     // 567
        handler.call(Hammer.detection, self.collectEventData(element, eventType, self.getTouchList(last_move_event, eventType), ev));
                                                                                                                   // 569
        // remove pointerevent from list                                                                           // 570
        if(Hammer.HAS_POINTEREVENTS && eventType == Hammer.EVENT_END) {                                            // 571
          count_touches = Hammer.PointerEvent.updatePointer(eventType, ev);                                        // 572
        }                                                                                                          // 573
      }                                                                                                            // 574
                                                                                                                   // 575
      // on the end we reset everything                                                                            // 576
      if(!count_touches) {                                                                                         // 577
        last_move_event = null;                                                                                    // 578
        enable_detect = false;                                                                                     // 579
        touch_triggered = false;                                                                                   // 580
        Hammer.PointerEvent.reset();                                                                               // 581
      }                                                                                                            // 582
    });                                                                                                            // 583
  },                                                                                                               // 584
                                                                                                                   // 585
                                                                                                                   // 586
  /**                                                                                                              // 587
   * we have different events for each device/browser                                                              // 588
   * determine what we need and set them in the Hammer.EVENT_TYPES constant                                        // 589
   */                                                                                                              // 590
  determineEventTypes: function determineEventTypes() {                                                            // 591
    // determine the eventtype we want to set                                                                      // 592
    var types;                                                                                                     // 593
                                                                                                                   // 594
    // pointerEvents magic                                                                                         // 595
    if(Hammer.HAS_POINTEREVENTS) {                                                                                 // 596
      types = Hammer.PointerEvent.getEvents();                                                                     // 597
    }                                                                                                              // 598
    // on Android, iOS, blackberry, windows mobile we dont want any mouseevents                                    // 599
    else if(Hammer.NO_MOUSEEVENTS) {                                                                               // 600
      types = [                                                                                                    // 601
        'touchstart',                                                                                              // 602
        'touchmove',                                                                                               // 603
        'touchend touchcancel'];                                                                                   // 604
    }                                                                                                              // 605
    // for non pointer events browsers and mixed browsers,                                                         // 606
    // like chrome on windows8 touch laptop                                                                        // 607
    else {                                                                                                         // 608
      types = [                                                                                                    // 609
        'touchstart mousedown',                                                                                    // 610
        'touchmove mousemove',                                                                                     // 611
        'touchend touchcancel mouseup'];                                                                           // 612
    }                                                                                                              // 613
                                                                                                                   // 614
    Hammer.EVENT_TYPES[Hammer.EVENT_START] = types[0];                                                             // 615
    Hammer.EVENT_TYPES[Hammer.EVENT_MOVE] = types[1];                                                              // 616
    Hammer.EVENT_TYPES[Hammer.EVENT_END] = types[2];                                                               // 617
  },                                                                                                               // 618
                                                                                                                   // 619
                                                                                                                   // 620
  /**                                                                                                              // 621
   * create touchlist depending on the event                                                                       // 622
   * @param   {Object}    ev                                                                                       // 623
   * @param   {String}    eventType   used by the fakemultitouch plugin                                            // 624
   */                                                                                                              // 625
  getTouchList: function getTouchList(ev/*, eventType*/) {                                                         // 626
    // get the fake pointerEvent touchlist                                                                         // 627
    if(Hammer.HAS_POINTEREVENTS) {                                                                                 // 628
      return Hammer.PointerEvent.getTouchList();                                                                   // 629
    }                                                                                                              // 630
    // get the touchlist                                                                                           // 631
    else if(ev.touches) {                                                                                          // 632
      return ev.touches;                                                                                           // 633
    }                                                                                                              // 634
    // make fake touchlist from mouse position                                                                     // 635
    else {                                                                                                         // 636
      ev.identifier = 1;                                                                                           // 637
      return [ev];                                                                                                 // 638
    }                                                                                                              // 639
  },                                                                                                               // 640
                                                                                                                   // 641
                                                                                                                   // 642
  /**                                                                                                              // 643
   * collect event data for Hammer js                                                                              // 644
   * @param   {HTMLElement}   element                                                                              // 645
   * @param   {String}        eventType        like Hammer.EVENT_MOVE                                              // 646
   * @param   {Object}        eventData                                                                            // 647
   */                                                                                                              // 648
  collectEventData: function collectEventData(element, eventType, touches, ev) {                                   // 649
    // find out pointerType                                                                                        // 650
    var pointerType = Hammer.POINTER_TOUCH;                                                                        // 651
    if(ev.type.match(/mouse/) || Hammer.PointerEvent.matchType(Hammer.POINTER_MOUSE, ev)) {                        // 652
      pointerType = Hammer.POINTER_MOUSE;                                                                          // 653
    }                                                                                                              // 654
                                                                                                                   // 655
    return {                                                                                                       // 656
      center     : Hammer.utils.getCenter(touches),                                                                // 657
      timeStamp  : new Date().getTime(),                                                                           // 658
      target     : ev.target,                                                                                      // 659
      touches    : touches,                                                                                        // 660
      eventType  : eventType,                                                                                      // 661
      pointerType: pointerType,                                                                                    // 662
      srcEvent   : ev,                                                                                             // 663
                                                                                                                   // 664
      /**                                                                                                          // 665
       * prevent the browser default actions                                                                       // 666
       * mostly used to disable scrolling of the browser                                                           // 667
       */                                                                                                          // 668
      preventDefault: function() {                                                                                 // 669
        if(this.srcEvent.preventManipulation) {                                                                    // 670
          this.srcEvent.preventManipulation();                                                                     // 671
        }                                                                                                          // 672
                                                                                                                   // 673
        if(this.srcEvent.preventDefault) {                                                                         // 674
          this.srcEvent.preventDefault();                                                                          // 675
        }                                                                                                          // 676
      },                                                                                                           // 677
                                                                                                                   // 678
      /**                                                                                                          // 679
       * stop bubbling the event up to its parents                                                                 // 680
       */                                                                                                          // 681
      stopPropagation: function() {                                                                                // 682
        this.srcEvent.stopPropagation();                                                                           // 683
      },                                                                                                           // 684
                                                                                                                   // 685
      /**                                                                                                          // 686
       * immediately stop gesture detection                                                                        // 687
       * might be useful after a swipe was detected                                                                // 688
       * @return {*}                                                                                               // 689
       */                                                                                                          // 690
      stopDetect: function() {                                                                                     // 691
        return Hammer.detection.stopDetect();                                                                      // 692
      }                                                                                                            // 693
    };                                                                                                             // 694
  }                                                                                                                // 695
};                                                                                                                 // 696
                                                                                                                   // 697
Hammer.PointerEvent = {                                                                                            // 698
  /**                                                                                                              // 699
   * holds all pointers                                                                                            // 700
   * @type {Object}                                                                                                // 701
   */                                                                                                              // 702
  pointers: {},                                                                                                    // 703
                                                                                                                   // 704
  /**                                                                                                              // 705
   * get a list of pointers                                                                                        // 706
   * @returns {Array}     touchlist                                                                                // 707
   */                                                                                                              // 708
  getTouchList: function() {                                                                                       // 709
    var self = this;                                                                                               // 710
    var touchlist = [];                                                                                            // 711
                                                                                                                   // 712
    // we can use forEach since pointerEvents only is in IE10                                                      // 713
    Hammer.utils.each(self.pointers, function(pointer){                                                            // 714
      touchlist.push(pointer);                                                                                     // 715
    });                                                                                                            // 716
                                                                                                                   // 717
    return touchlist;                                                                                              // 718
  },                                                                                                               // 719
                                                                                                                   // 720
  /**                                                                                                              // 721
   * update the position of a pointer                                                                              // 722
   * @param   {String}   type             Hammer.EVENT_END                                                         // 723
   * @param   {Object}   pointerEvent                                                                              // 724
   */                                                                                                              // 725
  updatePointer: function(type, pointerEvent) {                                                                    // 726
    if(type == Hammer.EVENT_END) {                                                                                 // 727
      this.pointers = {};                                                                                          // 728
    }                                                                                                              // 729
    else {                                                                                                         // 730
      pointerEvent.identifier = pointerEvent.pointerId;                                                            // 731
      this.pointers[pointerEvent.pointerId] = pointerEvent;                                                        // 732
    }                                                                                                              // 733
                                                                                                                   // 734
    return Object.keys(this.pointers).length;                                                                      // 735
  },                                                                                                               // 736
                                                                                                                   // 737
  /**                                                                                                              // 738
   * check if ev matches pointertype                                                                               // 739
   * @param   {String}        pointerType     Hammer.POINTER_MOUSE                                                 // 740
   * @param   {PointerEvent}  ev                                                                                   // 741
   */                                                                                                              // 742
  matchType: function(pointerType, ev) {                                                                           // 743
    if(!ev.pointerType) {                                                                                          // 744
      return false;                                                                                                // 745
    }                                                                                                              // 746
                                                                                                                   // 747
    var pt = ev.pointerType,                                                                                       // 748
      types = {};                                                                                                  // 749
    types[Hammer.POINTER_MOUSE] = (pt === ev.MSPOINTER_TYPE_MOUSE || pt === Hammer.POINTER_MOUSE);                 // 750
    types[Hammer.POINTER_TOUCH] = (pt === ev.MSPOINTER_TYPE_TOUCH || pt === Hammer.POINTER_TOUCH);                 // 751
    types[Hammer.POINTER_PEN] = (pt === ev.MSPOINTER_TYPE_PEN || pt === Hammer.POINTER_PEN);                       // 752
    return types[pointerType];                                                                                     // 753
  },                                                                                                               // 754
                                                                                                                   // 755
                                                                                                                   // 756
  /**                                                                                                              // 757
   * get events                                                                                                    // 758
   */                                                                                                              // 759
  getEvents: function() {                                                                                          // 760
    return [                                                                                                       // 761
      'pointerdown MSPointerDown',                                                                                 // 762
      'pointermove MSPointerMove',                                                                                 // 763
      'pointerup pointercancel MSPointerUp MSPointerCancel'                                                        // 764
    ];                                                                                                             // 765
  },                                                                                                               // 766
                                                                                                                   // 767
  /**                                                                                                              // 768
   * reset the list                                                                                                // 769
   */                                                                                                              // 770
  reset: function() {                                                                                              // 771
    this.pointers = {};                                                                                            // 772
  }                                                                                                                // 773
};                                                                                                                 // 774
                                                                                                                   // 775
                                                                                                                   // 776
Hammer.detection = {                                                                                               // 777
  // contains all registred Hammer.gestures in the correct order                                                   // 778
  gestures: [],                                                                                                    // 779
                                                                                                                   // 780
  // data of the current Hammer.gesture detection session                                                          // 781
  current : null,                                                                                                  // 782
                                                                                                                   // 783
  // the previous Hammer.gesture session data                                                                      // 784
  // is a full clone of the previous gesture.current object                                                        // 785
  previous: null,                                                                                                  // 786
                                                                                                                   // 787
  // when this becomes true, no gestures are fired                                                                 // 788
  stopped : false,                                                                                                 // 789
                                                                                                                   // 790
                                                                                                                   // 791
  /**                                                                                                              // 792
   * start Hammer.gesture detection                                                                                // 793
   * @param   {Hammer.Instance}   inst                                                                             // 794
   * @param   {Object}            eventData                                                                        // 795
   */                                                                                                              // 796
  startDetect: function startDetect(inst, eventData) {                                                             // 797
    // already busy with a Hammer.gesture detection on an element                                                  // 798
    if(this.current) {                                                                                             // 799
      return;                                                                                                      // 800
    }                                                                                                              // 801
                                                                                                                   // 802
    this.stopped = false;                                                                                          // 803
                                                                                                                   // 804
    this.current = {                                                                                               // 805
      inst      : inst, // reference to HammerInstance we're working for                                           // 806
      startEvent: Hammer.utils.extend({}, eventData), // start eventData for distances, timing etc                 // 807
      lastEvent : false, // last eventData                                                                         // 808
      name      : '' // current gesture we're in/detected, can be 'tap', 'hold' etc                                // 809
    };                                                                                                             // 810
                                                                                                                   // 811
    this.detect(eventData);                                                                                        // 812
  },                                                                                                               // 813
                                                                                                                   // 814
                                                                                                                   // 815
  /**                                                                                                              // 816
   * Hammer.gesture detection                                                                                      // 817
   * @param   {Object}    eventData                                                                                // 818
   */                                                                                                              // 819
  detect: function detect(eventData) {                                                                             // 820
    if(!this.current || this.stopped) {                                                                            // 821
      return;                                                                                                      // 822
    }                                                                                                              // 823
                                                                                                                   // 824
    // extend event data with calculations about scale, distance etc                                               // 825
    eventData = this.extendEventData(eventData);                                                                   // 826
                                                                                                                   // 827
    // instance options                                                                                            // 828
    var inst_options = this.current.inst.options;                                                                  // 829
                                                                                                                   // 830
    // call Hammer.gesture handlers                                                                                // 831
    Hammer.utils.each(this.gestures, function(gesture) {                                                           // 832
      // only when the instance options have enabled this gesture                                                  // 833
      if(!this.stopped && inst_options[gesture.name] !== false) {                                                  // 834
        // if a handler returns false, we stop with the detection                                                  // 835
        if(gesture.handler.call(gesture, eventData, this.current.inst) === false) {                                // 836
          this.stopDetect();                                                                                       // 837
          return false;                                                                                            // 838
        }                                                                                                          // 839
      }                                                                                                            // 840
    }, this);                                                                                                      // 841
                                                                                                                   // 842
    // store as previous event event                                                                               // 843
    if(this.current) {                                                                                             // 844
      this.current.lastEvent = eventData;                                                                          // 845
    }                                                                                                              // 846
                                                                                                                   // 847
    // endevent, but not the last touch, so dont stop                                                              // 848
    if(eventData.eventType == Hammer.EVENT_END && !eventData.touches.length - 1) {                                 // 849
      this.stopDetect();                                                                                           // 850
    }                                                                                                              // 851
                                                                                                                   // 852
    return eventData;                                                                                              // 853
  },                                                                                                               // 854
                                                                                                                   // 855
                                                                                                                   // 856
  /**                                                                                                              // 857
   * clear the Hammer.gesture vars                                                                                 // 858
   * this is called on endDetect, but can also be used when a final Hammer.gesture has been detected               // 859
   * to stop other Hammer.gestures from being fired                                                                // 860
   */                                                                                                              // 861
  stopDetect: function stopDetect() {                                                                              // 862
    // clone current data to the store as the previous gesture                                                     // 863
    // used for the double tap gesture, since this is an other gesture detect session                              // 864
    this.previous = Hammer.utils.extend({}, this.current);                                                         // 865
                                                                                                                   // 866
    // reset the current                                                                                           // 867
    this.current = null;                                                                                           // 868
                                                                                                                   // 869
    // stopped!                                                                                                    // 870
    this.stopped = true;                                                                                           // 871
  },                                                                                                               // 872
                                                                                                                   // 873
                                                                                                                   // 874
  /**                                                                                                              // 875
   * extend eventData for Hammer.gestures                                                                          // 876
   * @param   {Object}   ev                                                                                        // 877
   * @returns {Object}   ev                                                                                        // 878
   */                                                                                                              // 879
  extendEventData: function extendEventData(ev) {                                                                  // 880
    var startEv = this.current.startEvent;                                                                         // 881
                                                                                                                   // 882
    // if the touches change, set the new touches over the startEvent touches                                      // 883
    // this because touchevents don't have all the touches on touchstart, or the                                   // 884
    // user must place his fingers at the EXACT same time on the screen, which is not realistic                    // 885
    // but, sometimes it happens that both fingers are touching at the EXACT same time                             // 886
    if(startEv && (ev.touches.length != startEv.touches.length || ev.touches === startEv.touches)) {               // 887
      // extend 1 level deep to get the touchlist with the touch objects                                           // 888
      startEv.touches = [];                                                                                        // 889
      Hammer.utils.each(ev.touches, function(touch) {                                                              // 890
        startEv.touches.push(Hammer.utils.extend({}, touch));                                                      // 891
      });                                                                                                          // 892
    }                                                                                                              // 893
                                                                                                                   // 894
    var delta_time = ev.timeStamp - startEv.timeStamp                                                              // 895
      , delta_x = ev.center.pageX - startEv.center.pageX                                                           // 896
      , delta_y = ev.center.pageY - startEv.center.pageY                                                           // 897
      , velocity = Hammer.utils.getVelocity(delta_time, delta_x, delta_y)                                          // 898
      , interimAngle                                                                                               // 899
      , interimDirection;                                                                                          // 900
                                                                                                                   // 901
    // end events (e.g. dragend) don't have useful values for interimDirection & interimAngle                      // 902
    // because the previous event has exactly the same coordinates                                                 // 903
    // so for end events, take the previous values of interimDirection & interimAngle                              // 904
    // instead of recalculating them and getting a spurious '0'                                                    // 905
    if(ev.eventType === 'end') {                                                                                   // 906
      interimAngle = this.current.lastEvent && this.current.lastEvent.interimAngle;                                // 907
      interimDirection = this.current.lastEvent && this.current.lastEvent.interimDirection;                        // 908
    }                                                                                                              // 909
    else {                                                                                                         // 910
      interimAngle = this.current.lastEvent && Hammer.utils.getAngle(this.current.lastEvent.center, ev.center);    // 911
      interimDirection = this.current.lastEvent && Hammer.utils.getDirection(this.current.lastEvent.center, ev.center);
    }                                                                                                              // 913
                                                                                                                   // 914
    Hammer.utils.extend(ev, {                                                                                      // 915
      deltaTime: delta_time,                                                                                       // 916
                                                                                                                   // 917
      deltaX: delta_x,                                                                                             // 918
      deltaY: delta_y,                                                                                             // 919
                                                                                                                   // 920
      velocityX: velocity.x,                                                                                       // 921
      velocityY: velocity.y,                                                                                       // 922
                                                                                                                   // 923
      distance: Hammer.utils.getDistance(startEv.center, ev.center),                                               // 924
                                                                                                                   // 925
      angle: Hammer.utils.getAngle(startEv.center, ev.center),                                                     // 926
      interimAngle: interimAngle,                                                                                  // 927
                                                                                                                   // 928
      direction: Hammer.utils.getDirection(startEv.center, ev.center),                                             // 929
      interimDirection: interimDirection,                                                                          // 930
                                                                                                                   // 931
      scale: Hammer.utils.getScale(startEv.touches, ev.touches),                                                   // 932
      rotation: Hammer.utils.getRotation(startEv.touches, ev.touches),                                             // 933
                                                                                                                   // 934
      startEvent: startEv                                                                                          // 935
    });                                                                                                            // 936
                                                                                                                   // 937
    return ev;                                                                                                     // 938
  },                                                                                                               // 939
                                                                                                                   // 940
                                                                                                                   // 941
  /**                                                                                                              // 942
   * register new gesture                                                                                          // 943
   * @param   {Object}    gesture object, see gestures.js for documentation                                        // 944
   * @returns {Array}     gestures                                                                                 // 945
   */                                                                                                              // 946
  register: function register(gesture) {                                                                           // 947
    // add an enable gesture options if there is no given                                                          // 948
    var options = gesture.defaults || {};                                                                          // 949
    if(options[gesture.name] === undefined) {                                                                      // 950
      options[gesture.name] = true;                                                                                // 951
    }                                                                                                              // 952
                                                                                                                   // 953
    // extend Hammer default options with the Hammer.gesture options                                               // 954
    Hammer.utils.extend(Hammer.defaults, options, true);                                                           // 955
                                                                                                                   // 956
    // set its index                                                                                               // 957
    gesture.index = gesture.index || 1000;                                                                         // 958
                                                                                                                   // 959
    // add Hammer.gesture to the list                                                                              // 960
    this.gestures.push(gesture);                                                                                   // 961
                                                                                                                   // 962
    // sort the list by index                                                                                      // 963
    this.gestures.sort(function(a, b) {                                                                            // 964
      if(a.index < b.index) { return -1; }                                                                         // 965
      if(a.index > b.index) { return 1; }                                                                          // 966
      return 0;                                                                                                    // 967
    });                                                                                                            // 968
                                                                                                                   // 969
    return this.gestures;                                                                                          // 970
  }                                                                                                                // 971
};                                                                                                                 // 972
                                                                                                                   // 973
                                                                                                                   // 974
/**                                                                                                                // 975
 * Drag                                                                                                            // 976
 * Move with x fingers (default 1) around on the page. Blocking the scrolling when                                 // 977
 * moving left and right is a good practice. When all the drag events are blocking                                 // 978
 * you disable scrolling on that area.                                                                             // 979
 * @events  drag, drapleft, dragright, dragup, dragdown                                                            // 980
 */                                                                                                                // 981
Hammer.gestures.Drag = {                                                                                           // 982
  name     : 'drag',                                                                                               // 983
  index    : 50,                                                                                                   // 984
  defaults : {                                                                                                     // 985
    drag_min_distance            : 10,                                                                             // 986
                                                                                                                   // 987
    // Set correct_for_drag_min_distance to true to make the starting point of the drag                            // 988
    // be calculated from where the drag was triggered, not from where the touch started.                          // 989
    // Useful to avoid a jerk-starting drag, which can make fine-adjustments                                       // 990
    // through dragging difficult, and be visually unappealing.                                                    // 991
    correct_for_drag_min_distance: true,                                                                           // 992
                                                                                                                   // 993
    // set 0 for unlimited, but this can conflict with transform                                                   // 994
    drag_max_touches             : 1,                                                                              // 995
                                                                                                                   // 996
    // prevent default browser behavior when dragging occurs                                                       // 997
    // be careful with it, it makes the element a blocking element                                                 // 998
    // when you are using the drag gesture, it is a good practice to set this true                                 // 999
    drag_block_horizontal        : false,                                                                          // 1000
    drag_block_vertical          : false,                                                                          // 1001
                                                                                                                   // 1002
    // drag_lock_to_axis keeps the drag gesture on the axis that it started on,                                    // 1003
    // It disallows vertical directions if the initial direction was horizontal, and vice versa.                   // 1004
    drag_lock_to_axis            : false,                                                                          // 1005
                                                                                                                   // 1006
    // drag lock only kicks in when distance > drag_lock_min_distance                                              // 1007
    // This way, locking occurs only when the distance has become large enough to reliably determine the direction
    drag_lock_min_distance       : 25                                                                              // 1009
  },                                                                                                               // 1010
                                                                                                                   // 1011
  triggered: false,                                                                                                // 1012
  handler  : function dragGesture(ev, inst) {                                                                      // 1013
    // current gesture isnt drag, but dragged is true                                                              // 1014
    // this means an other gesture is busy. now call dragend                                                       // 1015
    if(Hammer.detection.current.name != this.name && this.triggered) {                                             // 1016
      inst.trigger(this.name + 'end', ev);                                                                         // 1017
      this.triggered = false;                                                                                      // 1018
      return;                                                                                                      // 1019
    }                                                                                                              // 1020
                                                                                                                   // 1021
    // max touches                                                                                                 // 1022
    if(inst.options.drag_max_touches > 0 &&                                                                        // 1023
      ev.touches.length > inst.options.drag_max_touches) {                                                         // 1024
      return;                                                                                                      // 1025
    }                                                                                                              // 1026
                                                                                                                   // 1027
    switch(ev.eventType) {                                                                                         // 1028
      case Hammer.EVENT_START:                                                                                     // 1029
        this.triggered = false;                                                                                    // 1030
        break;                                                                                                     // 1031
                                                                                                                   // 1032
      case Hammer.EVENT_MOVE:                                                                                      // 1033
        // when the distance we moved is too small we skip this gesture                                            // 1034
        // or we can be already in dragging                                                                        // 1035
        if(ev.distance < inst.options.drag_min_distance &&                                                         // 1036
          Hammer.detection.current.name != this.name) {                                                            // 1037
          return;                                                                                                  // 1038
        }                                                                                                          // 1039
                                                                                                                   // 1040
        // we are dragging!                                                                                        // 1041
        if(Hammer.detection.current.name != this.name) {                                                           // 1042
          Hammer.detection.current.name = this.name;                                                               // 1043
          if(inst.options.correct_for_drag_min_distance && ev.distance > 0) {                                      // 1044
            // When a drag is triggered, set the event center to drag_min_distance pixels from the original event center.
            // Without this correction, the dragged distance would jumpstart at drag_min_distance pixels instead of at 0.
            // It might be useful to save the original start point somewhere                                       // 1047
            var factor = Math.abs(inst.options.drag_min_distance / ev.distance);                                   // 1048
            Hammer.detection.current.startEvent.center.pageX += ev.deltaX * factor;                                // 1049
            Hammer.detection.current.startEvent.center.pageY += ev.deltaY * factor;                                // 1050
                                                                                                                   // 1051
            // recalculate event data using new start point                                                        // 1052
            ev = Hammer.detection.extendEventData(ev);                                                             // 1053
          }                                                                                                        // 1054
        }                                                                                                          // 1055
                                                                                                                   // 1056
        // lock drag to axis?                                                                                      // 1057
        if(Hammer.detection.current.lastEvent.drag_locked_to_axis || (inst.options.drag_lock_to_axis && inst.options.drag_lock_min_distance <= ev.distance)) {
          ev.drag_locked_to_axis = true;                                                                           // 1059
        }                                                                                                          // 1060
        var last_direction = Hammer.detection.current.lastEvent.direction;                                         // 1061
        if(ev.drag_locked_to_axis && last_direction !== ev.direction) {                                            // 1062
          // keep direction on the axis that the drag gesture started on                                           // 1063
          if(Hammer.utils.isVertical(last_direction)) {                                                            // 1064
            ev.direction = (ev.deltaY < 0) ? Hammer.DIRECTION_UP : Hammer.DIRECTION_DOWN;                          // 1065
          }                                                                                                        // 1066
          else {                                                                                                   // 1067
            ev.direction = (ev.deltaX < 0) ? Hammer.DIRECTION_LEFT : Hammer.DIRECTION_RIGHT;                       // 1068
          }                                                                                                        // 1069
        }                                                                                                          // 1070
                                                                                                                   // 1071
        // first time, trigger dragstart event                                                                     // 1072
        if(!this.triggered) {                                                                                      // 1073
          inst.trigger(this.name + 'start', ev);                                                                   // 1074
          this.triggered = true;                                                                                   // 1075
        }                                                                                                          // 1076
                                                                                                                   // 1077
        // trigger normal event                                                                                    // 1078
        inst.trigger(this.name, ev);                                                                               // 1079
                                                                                                                   // 1080
        // direction event, like dragdown                                                                          // 1081
        inst.trigger(this.name + ev.direction, ev);                                                                // 1082
                                                                                                                   // 1083
        // block the browser events                                                                                // 1084
        if((inst.options.drag_block_vertical && Hammer.utils.isVertical(ev.direction)) ||                          // 1085
          (inst.options.drag_block_horizontal && !Hammer.utils.isVertical(ev.direction))) {                        // 1086
          ev.preventDefault();                                                                                     // 1087
        }                                                                                                          // 1088
        break;                                                                                                     // 1089
                                                                                                                   // 1090
      case Hammer.EVENT_END:                                                                                       // 1091
        // trigger dragend                                                                                         // 1092
        if(this.triggered) {                                                                                       // 1093
          inst.trigger(this.name + 'end', ev);                                                                     // 1094
        }                                                                                                          // 1095
                                                                                                                   // 1096
        this.triggered = false;                                                                                    // 1097
        break;                                                                                                     // 1098
    }                                                                                                              // 1099
  }                                                                                                                // 1100
};                                                                                                                 // 1101
                                                                                                                   // 1102
/**                                                                                                                // 1103
 * Hold                                                                                                            // 1104
 * Touch stays at the same place for x time                                                                        // 1105
 * @events  hold                                                                                                   // 1106
 */                                                                                                                // 1107
Hammer.gestures.Hold = {                                                                                           // 1108
  name    : 'hold',                                                                                                // 1109
  index   : 10,                                                                                                    // 1110
  defaults: {                                                                                                      // 1111
    hold_timeout  : 500,                                                                                           // 1112
    hold_threshold: 1                                                                                              // 1113
  },                                                                                                               // 1114
  timer   : null,                                                                                                  // 1115
  handler : function holdGesture(ev, inst) {                                                                       // 1116
    switch(ev.eventType) {                                                                                         // 1117
      case Hammer.EVENT_START:                                                                                     // 1118
        // clear any running timers                                                                                // 1119
        clearTimeout(this.timer);                                                                                  // 1120
                                                                                                                   // 1121
        // set the gesture so we can check in the timeout if it still is                                           // 1122
        Hammer.detection.current.name = this.name;                                                                 // 1123
                                                                                                                   // 1124
        // set timer and if after the timeout it still is hold,                                                    // 1125
        // we trigger the hold event                                                                               // 1126
        this.timer = setTimeout(function() {                                                                       // 1127
          if(Hammer.detection.current.name == 'hold') {                                                            // 1128
            inst.trigger('hold', ev);                                                                              // 1129
          }                                                                                                        // 1130
        }, inst.options.hold_timeout);                                                                             // 1131
        break;                                                                                                     // 1132
                                                                                                                   // 1133
      // when you move or end we clear the timer                                                                   // 1134
      case Hammer.EVENT_MOVE:                                                                                      // 1135
        if(ev.distance > inst.options.hold_threshold) {                                                            // 1136
          clearTimeout(this.timer);                                                                                // 1137
        }                                                                                                          // 1138
        break;                                                                                                     // 1139
                                                                                                                   // 1140
      case Hammer.EVENT_END:                                                                                       // 1141
        clearTimeout(this.timer);                                                                                  // 1142
        break;                                                                                                     // 1143
    }                                                                                                              // 1144
  }                                                                                                                // 1145
};                                                                                                                 // 1146
                                                                                                                   // 1147
/**                                                                                                                // 1148
 * Release                                                                                                         // 1149
 * Called as last, tells the user has released the screen                                                          // 1150
 * @events  release                                                                                                // 1151
 */                                                                                                                // 1152
Hammer.gestures.Release = {                                                                                        // 1153
  name   : 'release',                                                                                              // 1154
  index  : Infinity,                                                                                               // 1155
  handler: function releaseGesture(ev, inst) {                                                                     // 1156
    if(ev.eventType == Hammer.EVENT_END) {                                                                         // 1157
      inst.trigger(this.name, ev);                                                                                 // 1158
    }                                                                                                              // 1159
  }                                                                                                                // 1160
};                                                                                                                 // 1161
                                                                                                                   // 1162
/**                                                                                                                // 1163
 * Swipe                                                                                                           // 1164
 * triggers swipe events when the end velocity is above the threshold                                              // 1165
 * @events  swipe, swipeleft, swiperight, swipeup, swipedown                                                       // 1166
 */                                                                                                                // 1167
Hammer.gestures.Swipe = {                                                                                          // 1168
  name    : 'swipe',                                                                                               // 1169
  index   : 40,                                                                                                    // 1170
  defaults: {                                                                                                      // 1171
    // set 0 for unlimited, but this can conflict with transform                                                   // 1172
    swipe_min_touches: 1,                                                                                          // 1173
    swipe_max_touches: 1,                                                                                          // 1174
    swipe_velocity   : 0.7                                                                                         // 1175
  },                                                                                                               // 1176
  handler : function swipeGesture(ev, inst) {                                                                      // 1177
    if(ev.eventType == Hammer.EVENT_END) {                                                                         // 1178
      // max touches                                                                                               // 1179
      if(inst.options.swipe_max_touches > 0 &&                                                                     // 1180
        ev.touches.length < inst.options.swipe_min_touches &&                                                      // 1181
        ev.touches.length > inst.options.swipe_max_touches) {                                                      // 1182
        return;                                                                                                    // 1183
      }                                                                                                            // 1184
                                                                                                                   // 1185
      // when the distance we moved is too small we skip this gesture                                              // 1186
      // or we can be already in dragging                                                                          // 1187
      if(ev.velocityX > inst.options.swipe_velocity ||                                                             // 1188
        ev.velocityY > inst.options.swipe_velocity) {                                                              // 1189
        // trigger swipe events                                                                                    // 1190
        inst.trigger(this.name, ev);                                                                               // 1191
        inst.trigger(this.name + ev.direction, ev);                                                                // 1192
      }                                                                                                            // 1193
    }                                                                                                              // 1194
  }                                                                                                                // 1195
};                                                                                                                 // 1196
                                                                                                                   // 1197
/**                                                                                                                // 1198
 * Tap/DoubleTap                                                                                                   // 1199
 * Quick touch at a place or double at the same place                                                              // 1200
 * @events  tap, doubletap                                                                                         // 1201
 */                                                                                                                // 1202
Hammer.gestures.Tap = {                                                                                            // 1203
  name    : 'tap',                                                                                                 // 1204
  index   : 100,                                                                                                   // 1205
  defaults: {                                                                                                      // 1206
    tap_max_touchtime : 250,                                                                                       // 1207
    tap_max_distance  : 10,                                                                                        // 1208
    tap_always        : true,                                                                                      // 1209
    doubletap_distance: 20,                                                                                        // 1210
    doubletap_interval: 300                                                                                        // 1211
  },                                                                                                               // 1212
  handler : function tapGesture(ev, inst) {                                                                        // 1213
    if(ev.eventType == Hammer.EVENT_END && ev.srcEvent.type != 'touchcancel') {                                    // 1214
      // previous gesture, for the double tap since these are two different gesture detections                     // 1215
      var prev = Hammer.detection.previous,                                                                        // 1216
        did_doubletap = false;                                                                                     // 1217
                                                                                                                   // 1218
      // when the touchtime is higher then the max touch time                                                      // 1219
      // or when the moving distance is too much                                                                   // 1220
      if(ev.deltaTime > inst.options.tap_max_touchtime ||                                                          // 1221
        ev.distance > inst.options.tap_max_distance) {                                                             // 1222
        return;                                                                                                    // 1223
      }                                                                                                            // 1224
                                                                                                                   // 1225
      // check if double tap                                                                                       // 1226
      if(prev && prev.name == 'tap' &&                                                                             // 1227
        (ev.timeStamp - prev.lastEvent.timeStamp) < inst.options.doubletap_interval &&                             // 1228
        ev.distance < inst.options.doubletap_distance) {                                                           // 1229
        inst.trigger('doubletap', ev);                                                                             // 1230
        did_doubletap = true;                                                                                      // 1231
      }                                                                                                            // 1232
                                                                                                                   // 1233
      // do a single tap                                                                                           // 1234
      if(!did_doubletap || inst.options.tap_always) {                                                              // 1235
        Hammer.detection.current.name = 'tap';                                                                     // 1236
        inst.trigger(Hammer.detection.current.name, ev);                                                           // 1237
      }                                                                                                            // 1238
    }                                                                                                              // 1239
  }                                                                                                                // 1240
};                                                                                                                 // 1241
                                                                                                                   // 1242
/**                                                                                                                // 1243
 * Touch                                                                                                           // 1244
 * Called as first, tells the user has touched the screen                                                          // 1245
 * @events  touch                                                                                                  // 1246
 */                                                                                                                // 1247
Hammer.gestures.Touch = {                                                                                          // 1248
  name    : 'touch',                                                                                               // 1249
  index   : -Infinity,                                                                                             // 1250
  defaults: {                                                                                                      // 1251
    // call preventDefault at touchstart, and makes the element blocking by                                        // 1252
    // disabling the scrolling of the page, but it improves gestures like                                          // 1253
    // transforming and dragging.                                                                                  // 1254
    // be careful with using this, it can be very annoying for users to be stuck                                   // 1255
    // on the page                                                                                                 // 1256
    prevent_default    : false,                                                                                    // 1257
                                                                                                                   // 1258
    // disable mouse events, so only touch (or pen!) input triggers events                                         // 1259
    prevent_mouseevents: false                                                                                     // 1260
  },                                                                                                               // 1261
  handler : function touchGesture(ev, inst) {                                                                      // 1262
    if(inst.options.prevent_mouseevents && ev.pointerType == Hammer.POINTER_MOUSE) {                               // 1263
      ev.stopDetect();                                                                                             // 1264
      return;                                                                                                      // 1265
    }                                                                                                              // 1266
                                                                                                                   // 1267
    if(inst.options.prevent_default) {                                                                             // 1268
      ev.preventDefault();                                                                                         // 1269
    }                                                                                                              // 1270
                                                                                                                   // 1271
    if(ev.eventType == Hammer.EVENT_START) {                                                                       // 1272
      inst.trigger(this.name, ev);                                                                                 // 1273
    }                                                                                                              // 1274
  }                                                                                                                // 1275
};                                                                                                                 // 1276
                                                                                                                   // 1277
/**                                                                                                                // 1278
 * Transform                                                                                                       // 1279
 * User want to scale or rotate with 2 fingers                                                                     // 1280
 * @events  transform, pinch, pinchin, pinchout, rotate                                                            // 1281
 */                                                                                                                // 1282
Hammer.gestures.Transform = {                                                                                      // 1283
  name     : 'transform',                                                                                          // 1284
  index    : 45,                                                                                                   // 1285
  defaults : {                                                                                                     // 1286
    // factor, no scale is 1, zoomin is to 0 and zoomout until higher then 1                                       // 1287
    transform_min_scale   : 0.01,                                                                                  // 1288
    // rotation in degrees                                                                                         // 1289
    transform_min_rotation: 1,                                                                                     // 1290
    // prevent default browser behavior when two touches are on the screen                                         // 1291
    // but it makes the element a blocking element                                                                 // 1292
    // when you are using the transform gesture, it is a good practice to set this true                            // 1293
    transform_always_block: false                                                                                  // 1294
  },                                                                                                               // 1295
  triggered: false,                                                                                                // 1296
  handler  : function transformGesture(ev, inst) {                                                                 // 1297
    // current gesture isnt drag, but dragged is true                                                              // 1298
    // this means an other gesture is busy. now call dragend                                                       // 1299
    if(Hammer.detection.current.name != this.name && this.triggered) {                                             // 1300
      inst.trigger(this.name + 'end', ev);                                                                         // 1301
      this.triggered = false;                                                                                      // 1302
      return;                                                                                                      // 1303
    }                                                                                                              // 1304
                                                                                                                   // 1305
    // atleast multitouch                                                                                          // 1306
    if(ev.touches.length < 2) {                                                                                    // 1307
      return;                                                                                                      // 1308
    }                                                                                                              // 1309
                                                                                                                   // 1310
    // prevent default when two fingers are on the screen                                                          // 1311
    if(inst.options.transform_always_block) {                                                                      // 1312
      ev.preventDefault();                                                                                         // 1313
    }                                                                                                              // 1314
                                                                                                                   // 1315
    switch(ev.eventType) {                                                                                         // 1316
      case Hammer.EVENT_START:                                                                                     // 1317
        this.triggered = false;                                                                                    // 1318
        break;                                                                                                     // 1319
                                                                                                                   // 1320
      case Hammer.EVENT_MOVE:                                                                                      // 1321
        var scale_threshold = Math.abs(1 - ev.scale);                                                              // 1322
        var rotation_threshold = Math.abs(ev.rotation);                                                            // 1323
                                                                                                                   // 1324
        // when the distance we moved is too small we skip this gesture                                            // 1325
        // or we can be already in dragging                                                                        // 1326
        if(scale_threshold < inst.options.transform_min_scale &&                                                   // 1327
          rotation_threshold < inst.options.transform_min_rotation) {                                              // 1328
          return;                                                                                                  // 1329
        }                                                                                                          // 1330
                                                                                                                   // 1331
        // we are transforming!                                                                                    // 1332
        Hammer.detection.current.name = this.name;                                                                 // 1333
                                                                                                                   // 1334
        // first time, trigger dragstart event                                                                     // 1335
        if(!this.triggered) {                                                                                      // 1336
          inst.trigger(this.name + 'start', ev);                                                                   // 1337
          this.triggered = true;                                                                                   // 1338
        }                                                                                                          // 1339
                                                                                                                   // 1340
        inst.trigger(this.name, ev); // basic transform event                                                      // 1341
                                                                                                                   // 1342
        // trigger rotate event                                                                                    // 1343
        if(rotation_threshold > inst.options.transform_min_rotation) {                                             // 1344
          inst.trigger('rotate', ev);                                                                              // 1345
        }                                                                                                          // 1346
                                                                                                                   // 1347
        // trigger pinch event                                                                                     // 1348
        if(scale_threshold > inst.options.transform_min_scale) {                                                   // 1349
          inst.trigger('pinch', ev);                                                                               // 1350
          inst.trigger('pinch' + ((ev.scale < 1) ? 'in' : 'out'), ev);                                             // 1351
        }                                                                                                          // 1352
        break;                                                                                                     // 1353
                                                                                                                   // 1354
      case Hammer.EVENT_END:                                                                                       // 1355
        // trigger dragend                                                                                         // 1356
        if(this.triggered) {                                                                                       // 1357
          inst.trigger(this.name + 'end', ev);                                                                     // 1358
        }                                                                                                          // 1359
                                                                                                                   // 1360
        this.triggered = false;                                                                                    // 1361
        break;                                                                                                     // 1362
    }                                                                                                              // 1363
  }                                                                                                                // 1364
};                                                                                                                 // 1365
                                                                                                                   // 1366
  // Based off Lo-Dash's excellent UMD wrapper (slightly modified) - https://github.com/bestiejs/lodash/blob/master/lodash.js#L5515-L5543
  // some AMD build optimizers, like r.js, check for specific condition patterns like the following:               // 1368
  if(typeof define == 'function' && typeof define.amd == 'object' && define.amd) {                                 // 1369
    // define as an anonymous module                                                                               // 1370
    define(function() {                                                                                            // 1371
      return Hammer;                                                                                               // 1372
    });                                                                                                            // 1373
    // check for `exports` after `define` in case a build optimizer adds an `exports` object                       // 1374
  }                                                                                                                // 1375
  else if(typeof module === 'object' && typeof module.exports === 'object') {                                      // 1376
    module.exports = Hammer;                                                                                       // 1377
  }                                                                                                                // 1378
  else {                                                                                                           // 1379
    window.Hammer = Hammer;                                                                                        // 1380
  }                                                                                                                // 1381
})(this);                                                                                                          // 1382
                                                                                                                   // 1383
/*! jQuery plugin for Hammer.JS - v1.0.0 - 2014-01-02                                                              // 1384
 * http://eightmedia.github.com/hammer.js                                                                          // 1385
 *                                                                                                                 // 1386
 * Copyright (c) 2014 Jorik Tangelder <j.tangelder@gmail.com>;                                                     // 1387
 * Licensed under the MIT license */(function(window, undefined) {                                                 // 1388
  'use strict';                                                                                                    // 1389
                                                                                                                   // 1390
function setup(Hammer, $) {                                                                                        // 1391
  /**                                                                                                              // 1392
   * bind dom events                                                                                               // 1393
   * this overwrites addEventListener                                                                              // 1394
   * @param   {HTMLElement}   element                                                                              // 1395
   * @param   {String}        eventTypes                                                                           // 1396
   * @param   {Function}      handler                                                                              // 1397
   */                                                                                                              // 1398
  Hammer.event.bindDom = function(element, eventTypes, handler) {                                                  // 1399
    $(element).on(eventTypes, function(ev) {                                                                       // 1400
      var data = ev.originalEvent || ev;                                                                           // 1401
                                                                                                                   // 1402
      if(data.pageX === undefined) {                                                                               // 1403
        data.pageX = ev.pageX;                                                                                     // 1404
        data.pageY = ev.pageY;                                                                                     // 1405
      }                                                                                                            // 1406
                                                                                                                   // 1407
      if(!data.target) {                                                                                           // 1408
        data.target = ev.target;                                                                                   // 1409
      }                                                                                                            // 1410
                                                                                                                   // 1411
      if(data.which === undefined) {                                                                               // 1412
        data.which = data.button;                                                                                  // 1413
      }                                                                                                            // 1414
                                                                                                                   // 1415
      if(!data.preventDefault) {                                                                                   // 1416
        data.preventDefault = ev.preventDefault;                                                                   // 1417
      }                                                                                                            // 1418
                                                                                                                   // 1419
      if(!data.stopPropagation) {                                                                                  // 1420
        data.stopPropagation = ev.stopPropagation;                                                                 // 1421
      }                                                                                                            // 1422
                                                                                                                   // 1423
      handler.call(this, data);                                                                                    // 1424
    });                                                                                                            // 1425
  };                                                                                                               // 1426
                                                                                                                   // 1427
  /**                                                                                                              // 1428
   * the methods are called by the instance, but with the jquery plugin                                            // 1429
   * we use the jquery event methods instead.                                                                      // 1430
   * @this    {Hammer.Instance}                                                                                    // 1431
   * @return  {jQuery}                                                                                             // 1432
   */                                                                                                              // 1433
  Hammer.Instance.prototype.on = function(types, handler) {                                                        // 1434
    return $(this.element).on(types, handler);                                                                     // 1435
  };                                                                                                               // 1436
  Hammer.Instance.prototype.off = function(types, handler) {                                                       // 1437
    return $(this.element).off(types, handler);                                                                    // 1438
  };                                                                                                               // 1439
                                                                                                                   // 1440
                                                                                                                   // 1441
  /**                                                                                                              // 1442
   * trigger events                                                                                                // 1443
   * this is called by the gestures to trigger an event like 'tap'                                                 // 1444
   * @this    {Hammer.Instance}                                                                                    // 1445
   * @param   {String}    gesture                                                                                  // 1446
   * @param   {Object}    eventData                                                                                // 1447
   * @return  {jQuery}                                                                                             // 1448
   */                                                                                                              // 1449
  Hammer.Instance.prototype.trigger = function(gesture, eventData) {                                               // 1450
    var el = $(this.element);                                                                                      // 1451
    if(el.has(eventData.target).length) {                                                                          // 1452
      el = $(eventData.target);                                                                                    // 1453
    }                                                                                                              // 1454
                                                                                                                   // 1455
    return el.trigger({                                                                                            // 1456
      type   : gesture,                                                                                            // 1457
      gesture: eventData                                                                                           // 1458
    });                                                                                                            // 1459
  };                                                                                                               // 1460
                                                                                                                   // 1461
                                                                                                                   // 1462
  /**                                                                                                              // 1463
   * jQuery plugin                                                                                                 // 1464
   * create instance of Hammer and watch for gestures,                                                             // 1465
   * and when called again you can change the options                                                              // 1466
   * @param   {Object}    [options={}]                                                                             // 1467
   * @return  {jQuery}                                                                                             // 1468
   */                                                                                                              // 1469
  $.fn.hammer = function(options) {                                                                                // 1470
    return this.each(function() {                                                                                  // 1471
      var el = $(this);                                                                                            // 1472
      var inst = el.data('hammer');                                                                                // 1473
      // start new hammer instance                                                                                 // 1474
      if(!inst) {                                                                                                  // 1475
        el.data('hammer', new Hammer(this, options || {}));                                                        // 1476
      }                                                                                                            // 1477
      // change the options                                                                                        // 1478
      else if(inst && options) {                                                                                   // 1479
        Hammer.utils.extend(inst.options, options);                                                                // 1480
      }                                                                                                            // 1481
    });                                                                                                            // 1482
  };                                                                                                               // 1483
}                                                                                                                  // 1484
                                                                                                                   // 1485
  // Based off Lo-Dash's excellent UMD wrapper (slightly modified) - https://github.com/bestiejs/lodash/blob/master/lodash.js#L5515-L5543
  // some AMD build optimizers, like r.js, check for specific condition patterns like the following:               // 1487
  if(typeof define == 'function' && typeof define.amd == 'object' && define.amd) {                                 // 1488
    // define as an anonymous module                                                                               // 1489
    define(['hammer', 'jquery'], setup);                                                                           // 1490
                                                                                                                   // 1491
  }                                                                                                                // 1492
  else {                                                                                                           // 1493
    setup(window.Hammer, window.jQuery || window.Zepto);                                                           // 1494
  }                                                                                                                // 1495
})(this);                                                                                                          // 1496
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.hammer = {};

})();
