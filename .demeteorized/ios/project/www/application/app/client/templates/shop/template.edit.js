(function(){
Template.__checkName("shopedit");
Template["shopedit"] = new Template("Template.shopedit", (function() {
  var view = this;
  return Blaze._TemplateWith(function() {
    return {
      shop: Spacebars.call(view.lookup("."))
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("shopform"));
  });
}));

}).call(this);
