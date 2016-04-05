(function(){
Template.__checkName("moduleedit");
Template["moduleedit"] = new Template("Template.moduleedit", (function() {
  var view = this;
  return Blaze._TemplateWith(function() {
    return {
      module: Spacebars.call(view.lookup("."))
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("moduleform"));
  });
}));

}).call(this);
