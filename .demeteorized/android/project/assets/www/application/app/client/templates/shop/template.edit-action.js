(function(){
Template.__checkName("shopeditaction");
Template["shopeditaction"] = new Template("Template.shopeditaction", (function() {
  var view = this;
  return [ HTML.Raw("<h3>Ajouter des modules</h3>\n	"), HTML.UL({
    "class": "list-unstyled text-center"
  }, "\n		", HTML.LI("\n			", HTML.A({
    "class": "btn btn-lg btn-block btn-default",
    href: function() {
      return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
        route: "shop.modules",
        shopId: view.lookup("_id")
      }));
    }
  }, "Ajouter "), "\n		"), "\n	") ];
}));

}).call(this);
