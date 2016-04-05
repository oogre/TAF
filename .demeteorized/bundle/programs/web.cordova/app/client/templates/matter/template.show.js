(function(){
Template.__checkName("mattershow");
Template["mattershow"] = new Template("Template.mattershow", (function() {
  var view = this;
  return [ HTML.DIV({
    "class": "row"
  }, "\n		", HTML.Raw('<label class="col-sm-2">Identification</label>'), "\n		", HTML.DIV({
    "class": "col-sm-10"
  }, "\n			", HTML.DIV({
    "class": "col-sm-12"
  }, "\n				", Blaze.View("lookup:matter.name", function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("matter"), "name"));
  }), "\n			"), "\n		"), "\n	"), HTML.Raw("\n\n	<hr>\n	\n	"), HTML.DIV({
    "class": "row"
  }, "\n		", HTML.Raw('<label class="col-sm-2">Unité</label>'), "\n		", HTML.DIV({
    "class": "col-sm-10"
  }, "\n			", HTML.DIV({
    "class": "col-sm-12"
  }, "\n				", Blaze.View("lookup:matter.unit", function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("matter"), "unit"));
  }), "\n			"), "\n		"), "\n	"), HTML.Raw("\n\n	<hr>\n	\n	"), HTML.DIV({
    "class": "row"
  }, "\n		", HTML.Raw('<label class="col-sm-2">Origines</label>'), "\n		", HTML.DIV({
    "class": "col-sm-10"
  }, "\n			", HTML.DIV({
    "class": "col-sm-12"
  }, "\n				", HTML.DIV({
    "class": "input-group col-sm-12"
  }, "\n					", HTML.Raw('<label class="input-group-addon" for="ref">Ajouter/Trouver</label>'), "\n					", HTML.Raw('<input class="form-control input-lg" type="text" id="ref" name="ref" value="">'), "\n					", HTML.SPAN({
    "class": "input-group-btn"
  }, "\n					 	", HTML.BUTTON(HTML.Attrs({
    "class": "btn btn-lg btn-default add"
  }, function() {
    return Spacebars.attrMustache(view.lookup("disable"));
  }), "\n							Ajouter\n						"), "\n						", Blaze.If(function() {
    return Spacebars.call(view.lookup("isMobile"));
  }, function() {
    return [ "\n							", HTML.BUTTON({
      "class": "btn btn-lg btn-warning barcode"
    }, "\n								~ Scan ~\n							"), "\n						" ];
  }), "\n					"), "\n				"), "\n			"), "\n		"), "\n	"), "\n	", HTML.DIV({
    "class": "row"
  }, "\n		", HTML.DIV({
    "class": "col-sm-offset-2 col-sm-10"
  }, "\n			", HTML.DIV({
    "class": "col-sm-12"
  }, "\n				", HTML.TABLE({
    "class": "table",
    "data-db-table-name": "Origin"
  }, "\n					", HTML.THEAD("\n						", HTML.TR("\n							", HTML.TH("\n								Origine Ref\n							"), "\n							", HTML.TH("\n								Action\n							"), "\n						"), "\n					"), "\n					", HTML.TBODY("\n						", Blaze.If(function() {
    return Spacebars.call(view.lookup("originList"));
  }, function() {
    return [ "\n							", Blaze.Each(function() {
      return Spacebars.call(view.lookup("originList"));
    }, function() {
      return [ "\n								", HTML.TR("\n									", HTML.TD({
        "class": "td-lg"
      }, "\n										", HTML.A({
        href: function() {
          return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
            route: "origin.show",
            originId: view.lookup("_id")
          }));
        },
        "class": "btn btn-link btn-lg"
      }, Blaze.View("lookup:ref", function() {
        return Spacebars.mustache(view.lookup("ref"));
      })), "\n									"), "\n									", HTML.TD("\n										", Blaze._TemplateWith(function() {
        return {
          method: Spacebars.call("originDestroyer"),
          _id: Spacebars.call(view.lookup("_id"))
        };
      }, function() {
        return Spacebars.include(view.lookupTemplate("buttondestroy"));
      }), "\n									"), "\n								"), "\n							" ];
    }), "\n						" ];
  }, function() {
    return [ "\n							", HTML.TR("\n								", HTML.TD({
      "class": "td-lg"
    }, "\n									Cette liste est vide\n								"), "\n								", HTML.TD("\n								"), "\n							"), "\n						" ];
  }), "\n						\n					"), "\n				"), "\n			"), "\n		"), "\n	") ];
}));

}).call(this);
