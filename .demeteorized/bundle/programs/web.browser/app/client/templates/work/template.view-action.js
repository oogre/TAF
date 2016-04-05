(function(){
Template.__checkName("work-viewaction");
Template["work-viewaction"] = new Template("Template.work-viewaction", (function() {
  var view = this;
  return [ HTML.Raw("<h3>Fiche de travail</h3>\n	"), HTML.UL({
    "class": "list-unstyled text-center"
  }, "\n		", HTML.LI("\n			", Blaze._TemplateWith(function() {
    return {
      method: Spacebars.call("workDestructor"),
      "class": Spacebars.call("btn-block"),
      html: Spacebars.call("Supprimer"),
      _id: Spacebars.call(view.lookup("_id"))
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("buttondestroy"));
  }), "\n		"), "\n		\n		", HTML.LI("\n			", Blaze.If(function() {
    return Spacebars.call(view.lookup("end"));
  }, function() {
    return [ "\n				", HTML.BUTTON({
      "class": "btn btn-lg btn-block btn-default workReopen"
    }, "Réouvrir"), "\n			" ];
  }, function() {
    return [ "\n				", HTML.BUTTON({
      "class": "btn btn-lg btn-block btn-default workClose"
    }, "Cloturer"), "\n			" ];
  }), "\n		"), "\n		\n		", Blaze.If(function() {
    return Spacebars.call(view.lookup("isConnected"));
  }, function() {
    return [ "\n			", Blaze.If(function() {
      return Spacebars.call(view.lookup("end"));
    }, function() {
      return [ "\n				", HTML.LI("\n					", HTML.BUTTON({
        "class": "btn btn-lg btn-block btn-default print"
      }, "Imprimer"), "\n				"), "\n			" ];
    }), "\n		" ];
  }), "\n	") ];
}));

}).call(this);
