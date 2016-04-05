(function(){
Template.__checkName("contextmenu");
Template["contextmenu"] = new Template("Template.contextmenu", (function() {
  var view = this;
  return HTML.DIV({
    id: "contextactions"
  }, Blaze._TemplateWith(function() {
    return "action";
  }, function() {
    return Spacebars.include(view.lookupTemplate("yield"));
  }));
}));

}).call(this);
