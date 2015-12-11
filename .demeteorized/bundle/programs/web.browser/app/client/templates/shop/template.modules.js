(function(){
Template.__checkName("shopmodules");
Template["shopmodules"] = new Template("Template.shopmodules", (function() {
  var view = this;
  return [ HTML.DIV({
    "class": "row"
  }, "\n		", HTML.Raw('<label class="col-sm-2">Modules</label>'), "\n		", HTML.DIV({
    "class": "form-group col-sm-10"
  }, "\n			", HTML.DIV({
    "class": "input-group col-sm-12"
  }, "\n				", HTML.Raw('<label class="input-group-addon">Modules</label>'), "\n				", HTML.DIV({
    "class": "modules form-control input-lg"
  }, "\n					", Blaze.Each(function() {
    return Spacebars.call(view.lookup("shopModules"));
  }, function() {
    return [ "\n						", Spacebars.include(view.lookupTemplate("shopmodule")), "\n					" ];
  }), "\n				"), "\n			"), "\n		"), "\n	"), "\n	", HTML.DIV({
    "class": "row"
  }, "\n		", HTML.Raw('<label class="col-sm-2">Tous les Modules</label>'), "\n		", HTML.DIV({
    "class": "form-group col-sm-10"
  }, "\n			", Blaze._TemplateWith(function() {
    return {
      modules: Spacebars.call(view.lookup("modules")),
      shopId: Spacebars.call(Spacebars.dot(view.lookup("shop"), "_id"))
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("moduleselector"));
  }), "\n		"), "\n	") ];
}));

Template.__checkName("shopmodule");
Template["shopmodule"] = new Template("Template.shopmodule", (function() {
  var view = this;
  return HTML.DIV({
    "class": function() {
      return [ "module ", Blaze.If(function() {
        return Spacebars.call(view.lookup("modulOpen"));
      }, function() {
        return "open";
      }) ];
    }
  }, "\n		", HTML.HEADER("\n			", Blaze.If(function() {
    return Spacebars.call(view.lookup("serial"));
  }, function() {
    return [ Blaze.View("lookup:serial", function() {
      return Spacebars.mustache(view.lookup("serial"));
    }), " : " ];
  }), Blaze.View("lookup:type", function() {
    return Spacebars.mustache(view.lookup("type"));
  }), " - ", Blaze.View("lookup:name", function() {
    return Spacebars.mustache(view.lookup("name"));
  }), HTML.Raw("&emsp;"), HTML.Raw('<i class="fa fa-caret-down"></i>'), HTML.Raw('<i class="fa fa-caret-right"></i>'), "\n		"), "\n		", Blaze.If(function() {
    return Spacebars.call(view.lookup("modulOpen"));
  }, function() {
    return [ "\n			", HTML.SECTION("\n				", HTML.DIV({
      "class": "input-group col-sm-12"
    }, "\n					", HTML.LABEL({
      "class": "input-group-addon",
      "for": "serial"
    }, "Identifiant"), "\n					", HTML.INPUT({
      "class": "form-control input-lg",
      type: "text",
      id: "serial",
      name: "serial",
      value: function() {
        return Spacebars.mustache(view.lookup("serial"));
      }
    }), "\n					", HTML.SPAN({
      "class": "input-group-btn"
    }, "\n						", Blaze._TemplateWith(function() {
      return {
        method: Spacebars.call("shopModuleDestroyer"),
        selector: Spacebars.call(view.lookup("selector"))
      };
    }, function() {
      return Spacebars.include(view.lookupTemplate("buttondestroy"));
    }), "\n					"), "\n				"), "\n			"), "\n		" ];
  }), "\n	");
}));

}).call(this);
