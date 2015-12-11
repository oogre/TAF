(function(){
Template.__checkName("taskaction");
Template["taskaction"] = new Template("Template.taskaction", (function() {
  var view = this;
  return [ HTML.Raw("<h3>Créer une tâche</h3>\n	"), HTML.UL({
    "class": "list-unstyled text-center"
  }, "\n		", HTML.LI("\n			", HTML.A({
    "class": "btn btn-lg btn-block btn-default",
    href: function() {
      return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
        route: "task.new"
      }));
    }
  }, "Créer"), "\n		"), "\n	") ];
}));

}).call(this);
