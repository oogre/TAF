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

/* Package-scope variables */
var key, googlemaps;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/googlemaps/googlemaps.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var root = this;                                                                                                       // 1
                                                                                                                       // 2
root.GoogleMaps = root.GoogleMaps || {}                                                                                // 3
                                                                                                                       // 4
GoogleMaps.initialized = false;                                                                                        // 5
                                                                                                                       // 6
GoogleMaps.callbacks = [];                                                                                             // 7
GoogleMaps.callback = function() {                                                                                     // 8
    for (key in GoogleMaps.callbacks) {                                                                                // 9
        GoogleMaps.callbacks[key]();                                                                                   // 10
    }                                                                                                                  // 11
    GoogleMaps.callbacks = [];                                                                                         // 12
}                                                                                                                      // 13
                                                                                                                       // 14
GoogleMaps.init = function(parameters, callback) {                                                                     // 15
    if (typeof window.google === 'object' && typeof window.google.maps === 'object') {                                 // 16
        if ('function' == typeof callback) {                                                                           // 17
            callback();                                                                                                // 18
        }                                                                                                              // 19
        return;                                                                                                        // 20
    }                                                                                                                  // 21
                                                                                                                       // 22
    if ('function' == typeof callback) {                                                                               // 23
        GoogleMaps.callbacks.push(callback);                                                                           // 24
    }                                                                                                                  // 25
    if(GoogleMaps.initialized) {                                                                                       // 26
        return;                                                                                                        // 27
    }                                                                                                                  // 28
    GoogleMaps.initialized = true;                                                                                     // 29
                                                                                                                       // 30
    var script, firstScript;                                                                                           // 31
    script = document.createElement("script");                                                                         // 32
    script.type = "text/javascript";                                                                                   // 33
    script.async = !0;                                                                                                 // 34
    script.src = ("https:" === document.location.protocol ? "https:" : "http:") + '//maps.googleapis.com/maps/api/js';
                                                                                                                       // 36
    parameters = parameters || {};                                                                                     // 37
    if ('undefined' == typeof parameters['sensor']) {                                                                  // 38
        parameters['sensor'] = false;                                                                                  // 39
    };                                                                                                                 // 40
    parameters['callback'] = 'GoogleMaps.callback';                                                                    // 41
                                                                                                                       // 42
    var queryString = "?";                                                                                             // 43
    for (key in parameters) {                                                                                          // 44
        if (queryString != "?") {                                                                                      // 45
            queryString += "&"                                                                                         // 46
        }                                                                                                              // 47
        queryString += key + "=" + String(parameters[key]);                                                            // 48
    }                                                                                                                  // 49
                                                                                                                       // 50
    script.src += queryString;                                                                                         // 51
                                                                                                                       // 52
    firstScript = document.getElementsByTagName("script")[0];                                                          // 53
    firstScript.parentNode.insertBefore(script, firstScript);                                                          // 54
};                                                                                                                     // 55
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.googlemaps = {
  googlemaps: googlemaps
};

})();
