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
// Stop processing and remove ALL jobs                                             // 166
SyncedCron.stop = function() {                                                     // 167
  _.each(this._entries, function(entry, name) {                                    // 168
    SyncedCron.remove(name);                                                       // 169
  });                                                                              // 170
  this.running = false;                                                            // 171
}                                                                                  // 172
                                                                                   // 173
// The meat of our logic. Checks if the specified has already run. If not,         // 174
// records that it's running the job, runs it, and records the output              // 175
SyncedCron._entryWrapper = function(entry) {                                       // 176
  var self = this;                                                                 // 177
                                                                                   // 178
  return function(intendedAt) {                                                    // 179
    var jobHistory = {                                                             // 180
      intendedAt: intendedAt,                                                      // 181
      name: entry.name,                                                            // 182
      startedAt: new Date()                                                        // 183
    };                                                                             // 184
                                                                                   // 185
    // If we have a dup key error, another instance has already tried to run       // 186
    // this job.                                                                   // 187
    try {                                                                          // 188
      jobHistory._id = self._collection.insert(jobHistory);                        // 189
    } catch(e) {                                                                   // 190
      // http://www.mongodb.org/about/contributors/error-codes/                    // 191
      // 11000 == duplicate key error                                              // 192
      if (e.name === 'MongoError' && e.code === 11000) {                           // 193
        log.info('Not running "' + entry.name + '" again.');                       // 194
        return;                                                                    // 195
      }                                                                            // 196
                                                                                   // 197
      throw e;                                                                     // 198
    };                                                                             // 199
                                                                                   // 200
    // run and record the job                                                      // 201
    try {                                                                          // 202
      log.info('Starting "' + entry.name + '".');                                  // 203
      var output = entry.job(intendedAt); // <- Run the actual job                 // 204
                                                                                   // 205
      log.info('Finished "' + entry.name + '".');                                  // 206
      self._collection.update({_id: jobHistory._id}, {                             // 207
        $set: {                                                                    // 208
          finishedAt: new Date(),                                                  // 209
          result: output                                                           // 210
        }                                                                          // 211
      });                                                                          // 212
    } catch(e) {                                                                   // 213
      log.info('Exception "' + entry.name +'" ' + e.stack);                        // 214
      self._collection.update({_id: jobHistory._id}, {                             // 215
        $set: {                                                                    // 216
          finishedAt: new Date(),                                                  // 217
          error: e.stack                                                           // 218
        }                                                                          // 219
      });                                                                          // 220
    }                                                                              // 221
  };                                                                               // 222
}                                                                                  // 223
                                                                                   // 224
// for tests                                                                       // 225
SyncedCron._reset = function() {                                                   // 226
  this._entries = {};                                                              // 227
  this._collection.remove({});                                                     // 228
  this.running = false;                                                            // 229
}                                                                                  // 230
                                                                                   // 231
// ---------------------------------------------------------------------------     // 232
// The following two functions are lifted from the later.js package, however       // 233
// I've made the following changes:                                                // 234
// - Use Meteor.setTimeout and Meteor.clearTimeout                                 // 235
// - Added an 'intendedAt' parameter to the callback fn that specifies the precise // 236
//   time the callback function *should* be run (so we can co-ordinate jobs)       // 237
//   between multiple, potentially laggy and unsynced machines                     // 238
                                                                                   // 239
// From: https://github.com/bunkat/later/blob/master/src/core/setinterval.js       // 240
SyncedCron._laterSetInterval = function(fn, sched) {                               // 241
                                                                                   // 242
  var t = SyncedCron._laterSetTimeout(scheduleTimeout, sched),                     // 243
      done = false;                                                                // 244
                                                                                   // 245
  /**                                                                              // 246
  * Executes the specified function and then sets the timeout for the next         // 247
  * interval.                                                                      // 248
  */                                                                               // 249
  function scheduleTimeout(intendedAt) {                                           // 250
    if(!done) {                                                                    // 251
      fn(intendedAt);                                                              // 252
      t = SyncedCron._laterSetTimeout(scheduleTimeout, sched);                     // 253
    }                                                                              // 254
  }                                                                                // 255
                                                                                   // 256
  return {                                                                         // 257
                                                                                   // 258
    /**                                                                            // 259
    * Clears the timeout.                                                          // 260
    */                                                                             // 261
    clear: function() {                                                            // 262
      done = true;                                                                 // 263
      t.clear();                                                                   // 264
    }                                                                              // 265
                                                                                   // 266
  };                                                                               // 267
                                                                                   // 268
};                                                                                 // 269
                                                                                   // 270
// From: https://github.com/bunkat/later/blob/master/src/core/settimeout.js        // 271
SyncedCron._laterSetTimeout = function(fn, sched) {                                // 272
                                                                                   // 273
  var s = Later.schedule(sched), t;                                                // 274
  scheduleTimeout();                                                               // 275
                                                                                   // 276
  /**                                                                              // 277
  * Schedules the timeout to occur. If the next occurrence is greater than the     // 278
  * max supported delay (2147483647 ms) than we delay for that amount before       // 279
  * attempting to schedule the timeout again.                                      // 280
  */                                                                               // 281
  function scheduleTimeout() {                                                     // 282
    var now = Date.now(),                                                          // 283
        next = s.next(2, now),                                                     // 284
        diff = next[0].getTime() - now,                                            // 285
        intendedAt = next[0];                                                      // 286
                                                                                   // 287
    // minimum time to fire is one second, use next occurrence instead             // 288
    if(diff < 1000) {                                                              // 289
      diff = next[1].getTime() - now;                                              // 290
      intendedAt = next[1];                                                        // 291
    }                                                                              // 292
                                                                                   // 293
    if(diff < 2147483647) {                                                        // 294
      t = Meteor.setTimeout(function() { fn(intendedAt); }, diff);                 // 295
    }                                                                              // 296
    else {                                                                         // 297
      t = Meteor.setTimeout(scheduleTimeout, 2147483647);                          // 298
    }                                                                              // 299
  }                                                                                // 300
                                                                                   // 301
  return {                                                                         // 302
                                                                                   // 303
    /**                                                                            // 304
    * Clears the timeout.                                                          // 305
    */                                                                             // 306
    clear: function() {                                                            // 307
      Meteor.clearTimeout(t);                                                      // 308
    }                                                                              // 309
                                                                                   // 310
  };                                                                               // 311
                                                                                   // 312
};                                                                                 // 313
// ---------------------------------------------------------------------------     // 314
                                                                                   // 315
/////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['percolate:synced-cron'] = {
  SyncedCron: SyncedCron
};

})();

//# sourceMappingURL=percolate_synced-cron.js.map
