(function(){
Template.__checkName("workeraction");
Template["workeraction"] = new Template("Template.workeraction", (function() {
  var view = this;
  return [ HTML.Raw("<h3>Actions</h3>\n	"), HTML.UL({
    "class": "list-unstyled text-center"
  }, "\n		", HTML.LI("\n			", Blaze._TemplateWith(function() {
    return {
      route: Spacebars.call("user.edit"),
      _id: Spacebars.call(Spacebars.dot(view.lookup("currentUser"), "_id")),
      html: Spacebars.call("Modifier votre compte"),
      "class": Spacebars.call("btn-block"),
      disableischief: Spacebars.call(true)
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("buttonmodifier"));
  }), "\n		"), "\n		", Blaze.If(function() {
    return Spacebars.call(view.lookup("isConnected"));
  }, function() {
    return [ "\n			", Blaze.If(function() {
      return Spacebars.call(view.lookup("isBoss"));
    }, function() {
      return [ "\n				", HTML.LI("\n					", HTML.A({
        "class": "btn btn-lg btn-block btn-default",
        href: function() {
          return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
            route: "user.new"
          }));
        }
      }, "Créer un travailleur"), "\n				"), "\n			" ];
    }), "\n		" ];
  }), "\n	") ];
}));

}).call(this);
