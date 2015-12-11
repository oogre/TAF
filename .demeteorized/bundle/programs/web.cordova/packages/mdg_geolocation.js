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
var ReactiveVar = Package['reactive-var'].ReactiveVar;

/* Package-scope variables */
var Geolocation;

(function(){

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
// packages/mdg_geolocation/geolocation.js                                            //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////
                                                                                      //
// is location refreshing currently on?                                               // 1
var watchingPosition = false;                                                         // 2
                                                                                      // 3
// current location variable and dependency                                           // 4
var location = new ReactiveVar(null);                                                 // 5
                                                                                      // 6
// error variable and dependency                                                      // 7
var error = new ReactiveVar(null);                                                    // 8
                                                                                      // 9
// options for watchPosition                                                          // 10
var options = {                                                                       // 11
  enableHighAccuracy: true,                                                           // 12
  maximumAge: 0,                                                                      // 13
  timeout: 10000                                                                      // 14
};                                                                                    // 15
                                                                                      // 16
var onError = function (newError) {                                                   // 17
  error.set(newError);                                                                // 18
};                                                                                    // 19
                                                                                      // 20
var onPosition = function (newLocation) {                                             // 21
  location.set(newLocation);                                                          // 22
  error.set(null);                                                                    // 23
};                                                                                    // 24
                                                                                      // 25
var startWatchingPosition = function () {                                             // 26
  if (! watchingPosition && navigator.geolocation) {                                  // 27
    navigator.geolocation.watchPosition(onPosition, onError, options);                // 28
    watchingPosition = true;                                                          // 29
  }                                                                                   // 30
};                                                                                    // 31
                                                                                      // 32
// exports                                                                            // 33
                                                                                      // 34
/**                                                                                   // 35
 * @summary The namespace for all geolocation functions.                              // 36
 * @namespace                                                                         // 37
 */                                                                                   // 38
Geolocation = {                                                                       // 39
  /**                                                                                 // 40
   * @summary Get the current geolocation error                                       // 41
   * @return {PositionError} The                                                      // 42
   * [position error](https://developer.mozilla.org/en-US/docs/Web/API/PositionError)
   * that is currently preventing position updates.                                   // 44
   */                                                                                 // 45
  error: function () {                                                                // 46
    startWatchingPosition();                                                          // 47
    return error.get();                                                               // 48
  },                                                                                  // 49
                                                                                      // 50
  /**                                                                                 // 51
   * @summary Get the current location                                                // 52
   * @return {Position | null} The                                                    // 53
   * [position](https://developer.mozilla.org/en-US/docs/Web/API/Position)            // 54
   * that is reported by the device, or null if no position is available.             // 55
   */                                                                                 // 56
  currentLocation: function () {                                                      // 57
    startWatchingPosition();                                                          // 58
    return location.get();                                                            // 59
  },                                                                                  // 60
  // simple version of location; just lat and lng                                     // 61
                                                                                      // 62
  /**                                                                                 // 63
   * @summary Get the current latitude and longitude                                  // 64
   * @return {Object | null} An object with `lat` and `lng` properties,               // 65
   * or null if no position is available.                                             // 66
   */                                                                                 // 67
  latLng: function () {                                                               // 68
    var loc = Geolocation.currentLocation();                                          // 69
                                                                                      // 70
    if (loc) {                                                                        // 71
      return {                                                                        // 72
        lat: loc.coords.latitude,                                                     // 73
        lng: loc.coords.longitude                                                     // 74
      };                                                                              // 75
    }                                                                                 // 76
                                                                                      // 77
    return null;                                                                      // 78
  }                                                                                   // 79
};                                                                                    // 80
                                                                                      // 81
////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['mdg:geolocation'] = {
  Geolocation: Geolocation
};

})();
