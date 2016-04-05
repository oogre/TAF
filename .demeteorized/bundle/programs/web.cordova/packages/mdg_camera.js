(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Template = Package.templating.Template;
var Session = Package.session.Session;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var Spacebars = Package.spacebars.Spacebars;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var MeteorCamera;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/mdg_camera/template.photo.js                                                                        //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
                                                                                                                // 1
Template.__checkName("camera");                                                                                 // 2
Template["camera"] = new Template("Template.camera", (function() {                                              // 3
  var view = this;                                                                                              // 4
  return [ HTML.Raw('<div class="camera-overlay">\n    \n  </div>\n\n  '), HTML.DIV({                           // 5
    "class": function() {                                                                                       // 6
      return [ "camera-popup ", Blaze.If(function() {                                                           // 7
        return Spacebars.call(view.lookup("permissionDeniedError"));                                            // 8
      }, function() {                                                                                           // 9
        return "camera-popup-wide";                                                                             // 10
      }) ];                                                                                                     // 11
    }                                                                                                           // 12
  }, "\n    ", Blaze.If(function() {                                                                            // 13
    return Spacebars.call(view.lookup("error"));                                                                // 14
  }, function() {                                                                                               // 15
    return [ "\n      ", Blaze.If(function() {                                                                  // 16
      return Spacebars.call(view.lookup("permissionDeniedError"));                                              // 17
    }, function() {                                                                                             // 18
      return [ "\n        ", Spacebars.include(view.lookupTemplate("permissionDenied")), "\n      " ];          // 19
    }, function() {                                                                                             // 20
      return [ "\n        ", Blaze.If(function() {                                                              // 21
        return Spacebars.call(view.lookup("browserNotSupportedError"));                                         // 22
      }, function() {                                                                                           // 23
        return [ "\n          ", Blaze._TemplateWith(function() {                                               // 24
          return {                                                                                              // 25
            message: Spacebars.call("Sorry, this browser is currently not supported for camera functionality.")
          };                                                                                                    // 27
        }, function() {                                                                                         // 28
          return Spacebars.include(view.lookupTemplate("genericError"));                                        // 29
        }), "\n        " ];                                                                                     // 30
      }, function() {                                                                                           // 31
        return [ "\n          ", Blaze._TemplateWith(function() {                                               // 32
          return {                                                                                              // 33
            message: Spacebars.call("There was an error accessing the camera.")                                 // 34
          };                                                                                                    // 35
        }, function() {                                                                                         // 36
          return Spacebars.include(view.lookupTemplate("genericError"));                                        // 37
        }), "\n        " ];                                                                                     // 38
      }), "\n      " ];                                                                                         // 39
    }), "\n    " ];                                                                                             // 40
  }, function() {                                                                                               // 41
    return [ "\n      ", Blaze.If(function() {                                                                  // 42
      return Spacebars.call(view.lookup("photo"));                                                              // 43
    }, function() {                                                                                             // 44
      return [ "\n        ", HTML.DIV({                                                                         // 45
        "class": "center"                                                                                       // 46
      }, "\n          ", HTML.IMG({                                                                             // 47
        src: function() {                                                                                       // 48
          return Spacebars.mustache(view.lookup("photo"));                                                      // 49
        },                                                                                                      // 50
        "class": "photo-preview"                                                                                // 51
      }), "\n          ", HTML.DIV("\n            ", HTML.BUTTON({                                              // 52
        "class": "button use-photo"                                                                             // 53
      }, "Use Photo"), "\n            ", HTML.BUTTON({                                                          // 54
        "class": "button new-photo"                                                                             // 55
      }, "Take New Photo"), "\n          "), "\n        "), "\n      " ];                                       // 56
    }, function() {                                                                                             // 57
      return [ "\n        ", Spacebars.include(view.lookupTemplate("viewfinder")), "\n      " ];                // 58
    }), "\n    " ];                                                                                             // 59
  }), "\n  ") ];                                                                                                // 60
}));                                                                                                            // 61
                                                                                                                // 62
Template.__checkName("viewfinder");                                                                             // 63
Template["viewfinder"] = new Template("Template.viewfinder", (function() {                                      // 64
  var view = this;                                                                                              // 65
  return [ HTML.DIV({                                                                                           // 66
    "class": "viewfinder"                                                                                       // 67
  }, "\n    ", HTML.VIDEO({                                                                                     // 68
    id: "video",                                                                                                // 69
    "class": function() {                                                                                       // 70
      return Blaze.If(function() {                                                                              // 71
        return Spacebars.call(view.lookup("waitingForPermission"));                                             // 72
      }, function() {                                                                                           // 73
        return "hidden";                                                                                        // 74
      });                                                                                                       // 75
    }                                                                                                           // 76
  }, "\n      "), "\n    \n    ", HTML.DIV("\n      ", Blaze.If(function() {                                    // 77
    return Spacebars.call(view.lookup("waitingForPermission"));                                                 // 78
  }, function() {                                                                                               // 79
    return [ "\n        ", HTML.P("Waiting for camera permissions..."), "\n      " ];                           // 80
  }, function() {                                                                                               // 81
    return [ "\n        ", HTML.BUTTON({                                                                        // 82
      "class": "button shutter"                                                                                 // 83
    }, "Take Photo"), "\n      " ];                                                                             // 84
  }), "\n      ", HTML.Raw('<button class="button cancel">Cancel</button>'), "\n    "), "\n  "), HTML.Raw('\n\n  <canvas id="canvas" style="visibility: hidden"></canvas>') ];
}));                                                                                                            // 86
                                                                                                                // 87
Template.__checkName("genericError");                                                                           // 88
Template["genericError"] = new Template("Template.genericError", (function() {                                  // 89
  var view = this;                                                                                              // 90
  return HTML.DIV({                                                                                             // 91
    "class": "generic-error"                                                                                    // 92
  }, "\n    ", HTML.P(Blaze.View("lookup:message", function() {                                                 // 93
    return Spacebars.mustache(view.lookup("message"));                                                          // 94
  })), HTML.Raw('\n    <button class="button cancel">Close Popup</button>\n  '));                               // 95
}));                                                                                                            // 96
                                                                                                                // 97
Template.__checkName("permissionDenied");                                                                       // 98
Template["permissionDenied"] = new Template("Template.permissionDenied", (function() {                          // 99
  var view = this;                                                                                              // 100
  return HTML.Raw('<div class="permission-denied-error">\n    <h2>Camera Permissions Denied</h2>\n\n    <p>\n      You have denied this app permission to use your camera.\n      If you would like to allow permissions, follow the directions for your\n      browser below.\n    </p>\n\n    <dl class="permissions-howto">\n      <dt>Google Chrome</dt>\n        <dd>Go to Settings > "Show advanced settings..." >\n          "Content settings..." > Media heading > "Manage exceptions...",\n          then find this website in the list and allow video capture.</dd>\n      <dt>Mozilla Firefox</dt>\n        <dd>Reload the page and try again.</dd>\n      <dt>Opera</dt>\n        <dd>Go to Preferences > Websites > Media heading >\n          "Manage exceptions...", then find this website in the list and\n          allow video capture.</dd>\n    </dl>\n\n    <button class="button cancel">Close Popup</button>\n  </div>');
}));                                                                                                            // 102
                                                                                                                // 103
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/mdg_camera/photo.js                                                                                 //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
MeteorCamera = {};                                                                                              // 1
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/mdg_camera/photo-cordova.js                                                                         //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
MeteorCamera.getPicture = function (options, callback) {                                                        // 1
  // if options are not passed                                                                                  // 2
  if (! callback) {                                                                                             // 3
    callback = options;                                                                                         // 4
    options = {};                                                                                               // 5
  }                                                                                                             // 6
                                                                                                                // 7
  var success = function (data) {                                                                               // 8
    callback(null, "data:image/jpeg;base64," + data);                                                           // 9
  };                                                                                                            // 10
                                                                                                                // 11
  var failure = function (error) {                                                                              // 12
    callback(new Meteor.Error("cordovaError", error));                                                          // 13
  };                                                                                                            // 14
                                                                                                                // 15
  navigator.camera.getPicture(success, failure,                                                                 // 16
    _.extend(options, {                                                                                         // 17
      quality: options.quality || 49,                                                                           // 18
      targetWidth: options.width || 640,                                                                        // 19
      targetHeight: options.height || 480,                                                                      // 20
      destinationType: Camera.DestinationType.DATA_URL                                                          // 21
    })                                                                                                          // 22
  );                                                                                                            // 23
};                                                                                                              // 24
                                                                                                                // 25
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['mdg:camera'] = {}, {
  MeteorCamera: MeteorCamera
});

})();
