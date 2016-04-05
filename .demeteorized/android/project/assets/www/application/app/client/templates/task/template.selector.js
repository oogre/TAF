(function(){
Template.__checkName("taskselector");
Template["taskselector"] = new Template("Template.taskselector", (function() {
  var view = this;
  return HTML.DIV("\n			", HTML.SELECT({
    "class": "input-lg",
    multiple: "multiple",
    "data-key": function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("."), "key"));
    },
    name: "tasks"
  }), "\n		");
}));

}).call(this);
