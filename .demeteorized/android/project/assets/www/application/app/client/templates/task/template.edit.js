(function(){
Template.__checkName("taskedit");
Template["taskedit"] = new Template("Template.taskedit", (function() {
  var view = this;
  return Blaze._TemplateWith(function() {
    return {
      task: Spacebars.call(view.lookup("."))
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("taskform"));
  });
}));

}).call(this);
