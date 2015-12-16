(function(){
Template.__checkName("workerview");
Template["workerview"] = new Template("Template.workerview", (function() {
  var view = this;
  return Blaze.View("lookup:data", function() {
    return Spacebars.mustache(view.lookup("data"));
  });
}));

}).call(this);
