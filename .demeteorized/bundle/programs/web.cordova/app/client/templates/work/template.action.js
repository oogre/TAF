(function(){
Template.__checkName("work-action");
Template["work-action"] = new Template("Template.work-action", (function() {
  var view = this;
  return [ HTML.Raw("<h3>Nouvelle fiche de travail</h3>\n	"), HTML.UL({
    "class": "list-unstyled text-center"
  }, "\n		", Blaze.If(function() {
    return Spacebars.call(view.lookup("isWorker"));
  }, function() {
    return [ "\n			", HTML.LI("\n				", HTML.A({
      "class": "btn btn-lg btn-block btn-default",
      href: function() {
        return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
          route: "work.new",
          hash: "dépannage"
        }));
      }
    }, "Dépannage"), "\n			"), "\n		" ];
  }), "\n		", Blaze.If(function() {
    return Spacebars.call(view.lookup("isBoss"));
  }, function() {
    return [ "\n			", HTML.LI("\n				", HTML.A({
      "class": "btn btn-lg btn-block btn-default",
      href: function() {
        return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
          route: "work.new",
          hash: "installation"
        }));
      }
    }, "Installation"), "\n			"), "\n			", HTML.LI("\n				", HTML.A({
      "class": "btn btn-lg btn-block btn-default",
      href: function() {
        return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
          route: "work.new",
          hash: "maintenance"
        }));
      }
    }, "Maintenance"), "\n			"), "\n		" ];
  }), "\n	") ];
}));

}).call(this);
