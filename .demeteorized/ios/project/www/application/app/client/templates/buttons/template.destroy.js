(function(){
Template.__checkName("buttondestroy");
Template["buttondestroy"] = new Template("Template.buttondestroy", (function() {
  var view = this;
  return Blaze.If(function() {
    return Spacebars.call(view.lookup("isConnected"));
  }, function() {
    return [ "\n		", Blaze.If(function() {
      return Spacebars.call(view.lookup("isBoss"));
    }, function() {
      return [ "\n			", HTML.BUTTON({
        "class": function() {
          return [ "btn btn-lg btn-danger ", Spacebars.mustache(view.lookup("class")) ];
        },
        "data-method": function() {
          return Spacebars.mustache(view.lookup("method"));
        },
        "data-id": function() {
          return Spacebars.mustache(view.lookup("_id"));
        },
        "data-selector": function() {
          return Spacebars.mustache(view.lookup("selector"));
        }
      }, "\n				", Blaze.If(function() {
        return Spacebars.call(view.lookup("html"));
      }, function() {
        return [ "\n					", Blaze.View("lookup:html", function() {
          return Spacebars.mustache(view.lookup("html"));
        }), " \n				" ];
      }, function() {
        return [ "\n					", HTML.I({
          "class": "fa fa-trash"
        }), "\n				" ];
      }), "\n			"), "\n		" ];
    }), "\n	" ];
  });
}));

}).call(this);
