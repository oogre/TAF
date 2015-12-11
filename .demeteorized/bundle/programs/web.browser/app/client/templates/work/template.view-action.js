(function(){
Template.__checkName("work-viewaction");
Template["work-viewaction"] = new Template("Template.work-viewaction", (function() {
  var view = this;
  return [ HTML.Raw("<h3>Fiche de travail</h3>\n	"), HTML.UL({
    "class": "list-unstyled text-center"
  }, "\n		", Blaze.If(function() {
    return Spacebars.call(view.lookup("isAdmin"));
  }, function() {
    return [ "\n			", HTML.LI("\n				", HTML.BUTTON({
      "class": "btn btn-lg btn-block btn-danger workDestructor"
    }, "Supprimer"), "\n			"), "\n		" ];
  }), "\n		", Blaze.If(function() {
    return Spacebars.call(view.lookup("reopenable"));
  }, function() {
    return [ "\n			", HTML.LI("\n				", Blaze.If(function() {
      return Spacebars.call(view.lookup("end"));
    }, function() {
      return [ "\n					", HTML.BUTTON({
        "class": "btn btn-lg btn-block btn-default workReopen"
      }, "Réouvrir"), "\n				" ];
    }, function() {
      return [ "\n					", HTML.BUTTON({
        "class": "btn btn-lg btn-block btn-default workClose"
      }, "Cloturer"), "\n				" ];
    }), "\n			"), "\n		" ];
  }), "\n	") ];
}));

}).call(this);
