(function(){
Template.__checkName("work-view");
Template["work-view"] = new Template("Template.work-view", (function() {
  var view = this;
  return Blaze.If(function() {
    return Spacebars.call(view.lookup("end"));
  }, function() {
    return [ "\n		", Blaze._TemplateWith(function() {
      return Spacebars.call(view.lookup("."));
    }, function() {
      return Spacebars.include(view.lookupTemplate("workSummary"));
    }), "\n	" ];
  }, function() {
    return [ "\n		", Blaze._TemplateWith(function() {
      return Spacebars.call(view.lookup("."));
    }, function() {
      return Spacebars.include(view.lookupTemplate("workEdit"));
    }), "\n	" ];
  });
}));

}).call(this);
