(function(){
Template.__checkName("workeraction");
Template["workeraction"] = new Template("Template.workeraction", (function() {
  var view = this;
  return [ HTML.Raw("<h3>Actions</h3>\n	"), HTML.UL({
    "class": "list-unstyled text-center"
  }, "\n		", HTML.LI("\n			", HTML.A({
    "class": "btn btn-lg btn-block btn-default",
    href: function() {
      return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
        route: "user.edit",
        workerId: Spacebars.dot(view.lookup("currentUser"), "_id")
      }));
    }
  }, "Modifier votre compte"), "\n		"), "\n		", Blaze.If(function() {
    return Spacebars.call(view.lookup("isBoss"));
  }, function() {
    return [ "\n			", HTML.LI("\n				", HTML.A(HTML.Attrs({
      "class": "btn btn-lg btn-block btn-default",
      href: function() {
        return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
          route: "user.new"
        }));
      }
    }, function() {
      return Spacebars.attrMustache(view.lookup("connected"));
    }), "Créer un travailleur"), "\n			"), "\n		" ];
  }), "\n	") ];
}));

}).call(this);
