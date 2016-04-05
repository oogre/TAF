(function(){
Template.__checkName("matteraction");
Template["matteraction"] = new Template("Template.matteraction", (function() {
  var view = this;
  return [ HTML.Raw("<h3>Créer un matériel</h3>\n	"), HTML.UL({
    "class": "list-unstyled text-center"
  }, "\n		", HTML.LI("\n			", HTML.A({
    "class": "btn btn-lg btn-block btn-default",
    href: function() {
      return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
        route: "matter.new"
      }));
    }
  }, "Créer"), "\n		"), "\n	") ];
}));

}).call(this);
