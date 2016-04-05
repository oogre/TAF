(function(){
Template.__checkName("matterindex");
Template["matterindex"] = new Template("Template.matterindex", (function() {
  var view = this;
  return Blaze.If(function() {
    return Spacebars.call(view.lookup("matters"));
  }, function() {
    return [ "\n		", HTML.DIV({
      "class": "row"
    }, "\n			", HTML.DIV({
      "class": "col-sm-12"
    }, "\n				", HTML.TABLE({
      "class": "table",
      "data-db-table-name": "matters"
    }, "\n					", HTML.THEAD("\n						", HTML.TR("\n							", HTML.TH({
      "data-db-row-name": "matter_name"
    }, "\n								Nom\n							"), "\n							", HTML.TH("\n								Action\n							"), "\n						"), "\n					"), "\n					", HTML.TBODY("\n						", Blaze.Each(function() {
      return Spacebars.call(view.lookup("matters"));
    }, function() {
      return [ "\n							", Spacebars.include(view.lookupTemplate("matteritem")), "\n						" ];
    }), "\n					"), "\n				"), "\n			"), "\n		"), "\n	" ];
  });
}));

Template.__checkName("matteritem");
Template["matteritem"] = new Template("Template.matteritem", (function() {
  var view = this;
  return HTML.TR({
    "data-matter-id": function() {
      return Spacebars.mustache(view.lookup("_id"));
    }
  }, "\n		", HTML.TD({
    "class": "td-lg"
  }, "\n			", HTML.A({
    href: function() {
      return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
        route: "matter.show",
        id: view.lookup("_id")
      }));
    },
    "class": ""
  }, "\n				", Blaze.View("lookup:name", function() {
    return Spacebars.mustache(view.lookup("name"));
  }), "\n			"), "\n		"), "\n		", HTML.TD("\n			", Blaze._TemplateWith(function() {
    return {
      route: Spacebars.call("matter.edit"),
      _id: Spacebars.call(view.lookup("_id"))
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("buttonmodifier"));
  }), "\n			", Blaze._TemplateWith(function() {
    return {
      method: Spacebars.call("matterDestroyer"),
      _id: Spacebars.call(view.lookup("_id"))
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("buttondestroy"));
  }), "\n		"), "\n	");
}));

}).call(this);
