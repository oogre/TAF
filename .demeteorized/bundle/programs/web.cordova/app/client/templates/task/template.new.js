(function(){
Template.__checkName("tasknew");
Template["tasknew"] = new Template("Template.tasknew", (function() {
  var view = this;
  return Spacebars.include(view.lookupTemplate("taskform"));
}));

}).call(this);
