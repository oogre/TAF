(function(){
Template.__checkName("workerselector");
Template["workerselector"] = new Template("Template.workerselector", (function() {
  var view = this;
  return Blaze.If(function() {
    return Spacebars.call(view.lookup("workers"));
  }, function() {
    return [ "\n		", HTML.DIV({
      "class": "input-group col-sm-12"
    }, "\n			", HTML.LABEL({
      "class": "input-group-addon",
      "for": "workers"
    }, "Nom"), "\n			", HTML.SELECT({
      "class": "input-lg",
      multiple: "multiple",
      id: "workers",
      name: "workers"
    }), "\n		"), "\n		", Blaze.View("lookup:initMultiselector", function() {
      return Spacebars.mustache(view.lookup("initMultiselector"));
    }), "\n	" ];
  });
}));

}).call(this);
