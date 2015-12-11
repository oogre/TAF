(function(){
Template.__checkName("matteredit");
Template["matteredit"] = new Template("Template.matteredit", (function() {
  var view = this;
  return Blaze._TemplateWith(function() {
    return {
      matter: Spacebars.call(view.lookup("."))
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("matterform"));
  });
}));

}).call(this);
