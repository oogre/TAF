(function(){
Template.__checkName("buttonmodifier");
Template["buttonmodifier"] = new Template("Template.buttonmodifier", (function() {
  var view = this;
  return Blaze.If(function() {
    return Spacebars.call(view.lookup("isConnected"));
  }, function() {
    return [ "\n		", Blaze.If(function() {
      return Spacebars.call(view.lookup("disableischief"));
    }, function() {
      return [ "\n			", HTML.A({
        href: function() {
          return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
            route: view.lookup("route"),
            id: view.lookup("_id")
          }));
        },
        "class": function() {
          return [ "btn btn-lg btn-default ", Spacebars.mustache(view.lookup("class")) ];
        }
      }, "\n				", Blaze.If(function() {
        return Spacebars.call(view.lookup("html"));
      }, function() {
        return [ "\n					", Blaze.View("lookup:html", function() {
          return Spacebars.mustache(view.lookup("html"));
        }), " \n				" ];
      }, function() {
        return "\n					Modifier\n				";
      }), "\n			"), "\n		" ];
    }, function() {
      return [ "\n			", Blaze.If(function() {
        return Spacebars.call(view.lookup("isChief"));
      }, function() {
        return [ "\n				", HTML.A({
          href: function() {
            return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
              route: view.lookup("route"),
              id: view.lookup("_id")
            }));
          },
          "class": function() {
            return [ "btn btn-lg btn-default ", Spacebars.mustache(view.lookup("class")) ];
          }
        }, "\n					", Blaze.If(function() {
          return Spacebars.call(view.lookup("html"));
        }, function() {
          return [ "\n						", Blaze.View("lookup:html", function() {
            return Spacebars.mustache(view.lookup("html"));
          }), " \n					" ];
        }, function() {
          return "\n						Modifier\n					";
        }), "\n				"), "\n			" ];
      }), "\n		" ];
    }), "\n	" ];
  });
}));

}).call(this);
