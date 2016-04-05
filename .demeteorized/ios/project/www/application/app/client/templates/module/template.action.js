(function(){
Template.__checkName("moduleaction");
Template["moduleaction"] = new Template("Template.moduleaction", (function() {
  var view = this;
  return [ HTML.Raw("<h3>Créer un module</h3>\n	"), HTML.UL({
    "class": "list-unstyled text-center"
  }, "\n		", HTML.LI("\n			", HTML.A({
    "class": "btn btn-lg btn-block btn-default",
    href: function() {
      return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
        route: "module.new"
      }));
    }
  }, "Créer"), "\n		"), "\n	") ];
}));

}).call(this);
