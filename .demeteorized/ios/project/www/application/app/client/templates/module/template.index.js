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
      return Spacebars.mustache(view.lookup("id"));
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
    return [ "\n				", Blaze._TemplateWith(function() {
      return {
        route: Spacebars.call("module.edit"),
        _id: Spacebars.call(view.lookup("id")),
        "class": Spacebars.call("pull-right")
      };
    }, function() {
      return Spacebars.include(view.lookupTemplate("buttonmodifier"));
    }), "\n				", Blaze._TemplateWith(function() {
      return {
        method: Spacebars.call("moduleDestroyer"),
        _id: Spacebars.call(view.lookup("id"))
      };
    }, function() {
      return Spacebars.include(view.lookupTemplate("buttondestroy"));
    }), "\n			" ];
  }), "\n		"), "\n	");
}));

}).call(this);
