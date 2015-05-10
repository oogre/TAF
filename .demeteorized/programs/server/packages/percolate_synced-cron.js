(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var check = Package.check.check;
var Match = Package.check.Match;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var Log = Package.logging.Log;

/* Package-scope variables */
var SyncedCron, Later;

(function () {

/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
// packages/percolate:synced-cron/synced-cron-server.js                            //
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
                                                                                   //
// A package for running jobs synchronized across multiple processes               // 1
SyncedCron = {                                                                     // 2
  _entries: {},                                                                    // 3
  running: false,                                                                  // 4
  options: {                                                                       // 5
    //Log job run details to console                                               // 6
    log: true,                                                                     // 7
                                                                                   // 8
    logger: null,                                                                  // 9
                                                                                   // 10
    //Name of collection to use for synchronisation and logging                    // 11
    collectionName: 'cronHistory',                                                 // 12
                                                                                   // 13
    //Default to using localTime                                                   // 14
    utc: false,                                                                    // 15
                                                                                   // 16
    //TTL in seconds for history records in collection to expire                   // 17
    //NOTE: Unset to remove expiry but ensure you remove the index from            // 18
    //mongo by hand                                                                // 19
    collectionTTL: 172800                                                          // 20
  },                                                                               // 21
  config: function(opts) {                                                         // 22
    this.options = _.extend({}, this.options, opts);                               // 23
  }                                                                                // 24
}                                                                                  // 25
                                                                                   // 26
Later = Npm.require('later');                                                      // 27
                                                                                   // 28
/*                                                                                 // 29
  Logger factory function. Takes a prefix string and options object                // 30
  and uses an injected `logger` if provided, else falls back to                    // 31
  Meteor's `Log` package.                                                          // 32
                                                                                   // 33
  Will send a log object to the injected logger, on the following form:            // 34
                                                                                   // 35
    message: String                                                                // 36
    level: String (info, warn, error, debug)                                       // 37
    tag: 'SyncedCron'                                                              // 38
*/                                                                                 // 39
function createLogger(prefix) {                                                    // 40
  check(prefix, String);                                                           // 41
                                                                                   // 42
  // Return noop if logging is disabled.                                           // 43
  if(SyncedCron.options.log === false) {                                           // 44
    return function() {};                                                          // 45
  }                                                                                // 46
                                                                                   // 47
  return function(level, message) {                                                // 48
    check(level, Match.OneOf('info', 'error', 'warn', 'debug'));                   // 49
    check(message, String);                                                        // 50
                                                                                   // 51
    var logger = SyncedCron.options && SyncedCron.options.logger;                  // 52
                                                                                   // 53
    if(logger && _.isFunction(logger)) {                                           // 54
                                                                                   // 55
      logger({                                                                     // 56
        level: level,                                                              // 57
        message: message,                                                          // 58
        tag: prefix                                                                // 59
      });                                                                          // 60
                                                                                   // 61
    } else {                                                                       // 62
      Log[level]({ message: prefix + ': ' + message });                            // 63
    }                                                                              // 64
  }                                                                                // 65
}                                                                                  // 66
                                                                                   // 67
var log;                                                                           // 68
                                                                                   // 69
Meteor.startup(function() {                                                        // 70
  var options = SyncedCron.options;                                                // 71
                                                                                   // 72
  log = createLogger('SyncedCron');                                                // 73
                                                                                   // 74
  ['info', 'warn', 'error', 'debug'].forEach(function(level) {                     // 75
    log[level] = _.partial(log, level);                                            // 76
  });                                                                              // 77
                                                                                   // 78
  // Don't allow TTL less than 5 minutes so we don't break synchronization         // 79
  var minTTL = 300;                                                                // 80
                                                                                   // 81
  // Use UTC or localtime for evaluating schedules                                 // 82
  if (options.utc)                                                                 // 83
    Later.date.UTC();                                                              // 84
  else                                                                             // 85
    Later.date.localTime();                                                        // 86
                                                                                   // 87
  // collection holding the job history records                                    // 88
  SyncedCron._collection = new Mongo.Collection(options.collectionName);           // 89
  SyncedCron._collection._ensureIndex({intendedAt: 1, name: 1}, {unique: true});   // 90
                                                                                   // 91
  if (options.collectionTTL) {                                                     // 92
    if (options.collectionTTL > minTTL)                                            // 93
      SyncedCron._collection._ensureIndex({startedAt: 1 },                         // 94
        { expireAfterSeconds: options.collectionTTL } );                           // 95
    else                                                                           // 96
      log.warn('Not going to use a TTL that is shorter than:' + minTTL);           // 97
  }                                                                                // 98
});                                                                                // 99
                                                                                   // 100
var scheduleEntry = function(entry) {                                              // 101
  var schedule = entry.schedule(Later.parse);                                      // 102
  entry._timer =                                                                   // 103
    SyncedCron._laterSetInterval(SyncedCron._entryWrapper(entry), schedule);       // 104
                                                                                   // 105
  log.info('Scheduled "' + entry.name + '" next run @'                             // 106
    + Later.schedule(schedule).next(1));                                           // 107
}                                                                                  // 108
                                                                                   // 109
// add a scheduled job                                                             // 110
// SyncedCron.add({                                                                // 111
//   name: String, //*required* unique name of the job                             // 112
//   schedule: function(laterParser) {},//*required* when to run the job           // 113
//   job: function() {}, //*required* the code to run                              // 114
// });                                                                             // 115
SyncedCron.add = function(entry) {                                                 // 116
  check(entry.name, String);                                                       // 117
  check(entry.schedule, Function);                                                 // 118
  check(entry.job, Function);                                                      // 119
                                                                                   // 120
  // check                                                                         // 121
  if (!this._entries[entry.name]) {                                                // 122
    this._entries[entry.name] = entry;                                             // 123
                                                                                   // 124
    // If cron is already running, start directly.                                 // 125
    if (this.running) {                                                            // 126
      scheduleEntry(entry);                                                        // 127
    }                                                                              // 128
  }                                                                                // 129
}                                                                                  // 130
                                                                                   // 131
// Start processing added jobs                                                     // 132
SyncedCron.start = function() {                                                    // 133
  var self = this;                                                                 // 134
                                                                                   // 135
  Meteor.startup(function() {                                                      // 136
    // Schedule each job with later.js                                             // 137
    _.each(self._entries, function(entry) {                                        // 138
      scheduleEntry(entry);                                                        // 139
    });                                                                            // 140
    self.running = true;                                                           // 141
  });                                                                              // 142
}                                                                                  // 143
                                                                                   // 144
// Return the next scheduled date of the first matching entry or undefined         // 145
SyncedCron.nextScheduledAtDate = function(jobName) {                               // 146
  var entry = this._entries[jobName];                                              // 147
                                                                                   // 148
  if (entry)                                                                       // 149
    return Later.schedule(entry.schedule(Later.parse)).next(1);                    // 150
}                                                                                  // 151
                                                                                   // 152
// Remove and stop the entry referenced by jobName                                 // 153
SyncedCron.remove = function(jobName) {                                            // 154
  var entry = this._entries[jobName];                                              // 155
                                                                                   // 156
  if (entry) {                                                                     // 157
    if (entry._timer)                                                              // 158
      entry._timer.clear();                                                        // 159
                                                                                   // 160
    delete this._entries[jobName];                                                 // 161
    log.info('Removed "' + entry.name);                                            // 162
  }                                                                                // 163
}                                                                                  // 164
                                                                                   // 165
// Pause processing, but do not remove jobs so that the start method will          // 166
// restart existing jobs                                                           // 167
SyncedCron.pause = function() {                                                    // 168
  if (this.running) {                                                              // 169
    _.each(this._entries, function(entry) {                                        // 170
      entry._timer.clear();                                                        // 171
    });                                                                            // 172
    this.running = false;                                                          // 173
  }                                                                                // 174
}                                                                                  // 175
                                                                                   // 176
// Stop processing and remove ALL jobs                                             // 177
SyncedCron.stop = function() {                                                     // 178
  _.each(this._entries, function(entry, name) {                                    // 179
    SyncedCron.remove(name);                                                       // 180
  });                                                                              // 181
  this.running = false;                                                            // 182
}                                                                                  // 183
                                                                                   // 184
// The meat of our logic. Checks if the specified has already run. If not,         // 185
// records that it's running the job, runs it, and records the output              // 186
SyncedCron._entryWrapper = function(entry) {                                       // 187
  var self = this;                                                                 // 188
                                                                                   // 189
  return function(intendedAt) {                                                    // 190
    var jobHistory = {                                                             // 191
      intendedAt: intendedAt,                                                      // 192
      name: entry.name,                                                            // 193
      startedAt: new Date()                                                        // 194
    };                                                                             // 195
                                                                                   // 196
    // If we have a dup key error, another instance has already tried to run       // 197
    // this job.                                                                   // 198
    try {                                                                          // 199
      jobHistory._id = self._collection.insert(jobHistory);                        // 200
    } catch(e) {                                                                   // 201
      // http://www.mongodb.org/about/contributors/error-codes/                    // 202
      // 11000 == duplicate key error                                              // 203
      if (e.name === 'MongoError' && e.code === 11000) {                           // 204
        log.info('Not running "' + entry.name + '" again.');                       // 205
        return;                                                                    // 206
      }                                                                            // 207
                                                                                   // 208
      throw e;                                                                     // 209
    };                                                                             // 210
                                                                                   // 211
    // run and record the job                                                      // 212
    try {                                                                          // 213
      log.info('Starting "' + entry.name + '".');                                  // 214
      var output = entry.job(intendedAt); // <- Run the actual job                 // 215
                                                                                   // 216
      log.info('Finished "' + entry.name + '".');                                  // 217
      self._collection.update({_id: jobHistory._id}, {                             // 218
        $set: {                                                                    // 219
          finishedAt: new Date(),                                                  // 220
          result: output                                                           // 221
        }                                                                          // 222
      });                                                                          // 223
    } catch(e) {                                                                   // 224
      log.info('Exception "' + entry.name +'" ' + e.stack);                        // 225
      self._collection.update({_id: jobHistory._id}, {                             // 226
        $set: {                                                                    // 227
          finishedAt: new Date(),                                                  // 228
          error: e.stack                                                           // 229
        }                                                                          // 230
      });                                                                          // 231
    }                                                                              // 232
  };                                                                               // 233
}                                                                                  // 234
                                                                                   // 235
// for tests                                                                       // 236
SyncedCron._reset = function() {                                                   // 237
  this._entries = {};                                                              // 238
  this._collection.remove({});                                                     // 239
  this.running = false;                                                            // 240
}                                                                                  // 241
                                                                                   // 242
// ---------------------------------------------------------------------------     // 243
// The following two functions are lifted from the later.js package, however       // 244
// I've made the following changes:                                                // 245
// - Use Meteor.setTimeout and Meteor.clearTimeout                                 // 246
// - Added an 'intendedAt' parameter to the callback fn that specifies the precise // 247
//   time the callback function *should* be run (so we can co-ordinate jobs)       // 248
//   between multiple, potentially laggy and unsynced machines                     // 249
                                                                                   // 250
// From: https://github.com/bunkat/later/blob/master/src/core/setinterval.js       // 251
SyncedCron._laterSetInterval = function(fn, sched) {                               // 252
                                                                                   // 253
  var t = SyncedCron._laterSetTimeout(scheduleTimeout, sched),                     // 254
      done = false;                                                                // 255
                                                                                   // 256
  /**                                                                              // 257
  * Executes the specified function and then sets the timeout for the next         // 258
  * interval.                                                                      // 259
  */                                                                               // 260
  function scheduleTimeout(intendedAt) {                                           // 261
    if(!done) {                                                                    // 262
      fn(intendedAt);                                                              // 263
      t = SyncedCron._laterSetTimeout(scheduleTimeout, sched);                     // 264
    }                                                                              // 265
  }                                                                                // 266
                                                                                   // 267
  return {                                                                         // 268
                                                                                   // 269
    /**                                                                            // 270
    * Clears the timeout.                                                          // 271
    */                                                                             // 272
    clear: function() {                                                            // 273
      done = true;                                                                 // 274
      t.clear();                                                                   // 275
    }                                                                              // 276
                                                                                   // 277
  };                                                                               // 278
                                                                                   // 279
};                                                                                 // 280
                                                                                   // 281
// From: https://github.com/bunkat/later/blob/master/src/core/settimeout.js        // 282
SyncedCron._laterSetTimeout = function(fn, sched) {                                // 283
                                                                                   // 284
  var s = Later.schedule(sched), t;                                                // 285
  scheduleTimeout();                                                               // 286
                                                                                   // 287
  /**                                                                              // 288
  * Schedules the timeout to occur. If the next occurrence is greater than the     // 289
  * max supported delay (2147483647 ms) than we delay for that amount before       // 290
  * attempting to schedule the timeout again.                                      // 291
  */                                                                               // 292
  function scheduleTimeout() {                                                     // 293
    var now = Date.now(),                                                          // 294
        next = s.next(2, now),                                                     // 295
        diff = next[0].getTime() - now,                                            // 296
        intendedAt = next[0];                                                      // 297
                                                                                   // 298
    // minimum time to fire is one second, use next occurrence instead             // 299
    if(diff < 1000) {                                                              // 300
      diff = next[1].getTime() - now;                                              // 301
      intendedAt = next[1];                                                        // 302
    }                                                                              // 303
                                                                                   // 304
    if(diff < 2147483647) {                                                        // 305
      t = Meteor.setTimeout(function() { fn(intendedAt); }, diff);                 // 306
    }                                                                              // 307
    else {                                                                         // 308
      t = Meteor.setTimeout(scheduleTimeout, 2147483647);                          // 309
    }                                                                              // 310
  }                                                                                // 311
                                                                                   // 312
  return {                                                                         // 313
                                                                                   // 314
    /**                                                                            // 315
    * Clears the timeout.                                                          // 316
    */                                                                             // 317
    clear: function() {                                                            // 318
      Meteor.clearTimeout(t);                                                      // 319
    }                                                                              // 320
                                                                                   // 321
  };                                                                               // 322
                                                                                   // 323
};                                                                                 // 324
// ---------------------------------------------------------------------------     // 325
                                                                                   // 326
/////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['percolate:synced-cron'] = {
  SyncedCron: SyncedCron
};

})();

//# sourceMappingURL=percolate_synced-cron.js.map
