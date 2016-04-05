(function(){
Template.__checkName("errorMessage");
Template["errorMessage"] = new Template("Template.errorMessage", (function() {
  var view = this;
  return Blaze.If(function() {
    return Spacebars.call(view.lookup("warning"));
  }, function() {
    return [ "\n		", HTML.DIV({
      "class": "alert alert-warning"
    }, "\n	        ", HTML.A({
      href: "#",
      "class": "close",
      "data-dismiss": "alert"
    }, HTML.CharRef({
      html: "&times;",
      str: "×"
    })), "\n	        ", HTML.STRONG("Attention !"), " ", Blaze.View("lookup:message", function() {
      return Spacebars.makeRaw(Spacebars.mustache(view.lookup("message")));
    }), "\n	    "), "\n    " ];
  });
}));

Template.__checkName("successMessage");
Template["successMessage"] = new Template("Template.successMessage", (function() {
  var view = this;
  return Blaze.If(function() {
    return Spacebars.call(view.lookup("warning"));
  }, function() {
    return [ "\n		", HTML.DIV({
      "class": "alert alert-success"
    }, "\n	        ", HTML.A({
      href: "#",
      "class": "close",
      "data-dismiss": "alert"
    }, HTML.CharRef({
      html: "&times;",
      str: "×"
    })), "\n	        ", HTML.STRONG("Super !"), " ", Blaze.View("lookup:message", function() {
      return Spacebars.makeRaw(Spacebars.mustache(view.lookup("message")));
    }), "\n	    "), "\n    " ];
  });
}));

}).call(this);
