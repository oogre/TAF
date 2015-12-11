(function(){
Template.__checkName("moduleindex");
Template["moduleindex"] = new Template("Template.moduleindex", (function() {
  var view = this;
  return Blaze.If(function() {
    return Spacebars.call(view.lookup("modules"));
  }, function() {
    return [ "\n		", HTML.DIV({
      "class": "row"
    }, "\n			", HTML.DIV({
      "class": "col-sm-12"
    }, "\n				", HTML.TABLE({
      "class": "table",
      "data-db-table-name": "modules"
    }, "\n					", HTML.THEAD("\n						", HTML.TR("\n							", HTML.TH({
      "data-db-row-name": "module_name"
    }, "\n								Type\n							"), "\n							", HTML.TH("\n								", Blaze.If(function() {
      return Spacebars.call(view.lookup("view"));
    }, function() {
      return "\n									N°Série - \n								";
    }), "\n								Nom\n							"), "\n						"), "\n					"), "\n					", HTML.TBODY("\n						", Blaze.Each(function() {
      return Spacebars.call(view.lookup("modules"));
    }, function() {
      return [ "\n							", Spacebars.include(view.lookupTemplate("modulegroupe")), "\n						" ];
    }), "\n					"), "\n				"), "\n			"), "\n		"), "\n	" ];
  });
}));

Template.__checkName("modulegroupe");
Template["modulegroupe"] = new Template("Template.modulegroupe", (function() {
  var view = this;
  return HTML.TR("\n		", HTML.TD({
    "class": "td-lg"
  }, "\n			", Blaze.View("lookup:type", function() {
    return Spacebars.mustache(view.lookup("type"));
  }), "\n		"), "\n		", HTML.TD("\n			", Blaze.Each(function() {
    return Spacebars.call(view.lookup("modules"));
  }, function() {
    return [ "\n				", Spacebars.include(view.lookupTemplate("moduleitem")), "\n			" ];
  }), "\n		"), "\n	");
}));

Template.__checkName("moduleitem");
Template["moduleitem"] = new Template("Template.moduleitem", (function() {
  var view = this;
  return HTML.TR({
    "data-shop-id": function() {
      return Spacebars.mustache(view.lookup("_id"));
    }
  }, "\n		", HTML.TD({
    "class": "td-lg"
  }, "\n			", Blaze.If(function() {
    return Spacebars.call(view.lookup("serial"));
  }, function() {
    return [ "\n				", Blaze.View("lookup:serial", function() {
      return Spacebars.mustache(view.lookup("serial"));
    }), " - \n			" ];
  }), "\n			", Blaze.View("lookup:name", function() {
    return Spacebars.mustache(view.lookup("name"));
  }), "\n		"), "\n		", HTML.TD("\n			", Blaze.Unless(function() {
    return Spacebars.call(view.lookup("view"));
  }, function() {
    return [ "\n				", Blaze.If(function() {
      return Spacebars.call(view.lookup("isChief"));
    }, function() {
      return [ "\n					", HTML.A({
        href: function() {
          return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
            route: "module.edit",
            moduleId: view.lookup("_id")
          }));
        },
        "class": "btn btn-lg btn-default pull-right"
      }, "\n						Modifier\n					"), "\n				" ];
    }), "\n			" ];
  }), "\n		"), "\n	");
}));

}).call(this);
