(function(){
Template.__checkName("shopview");
Template["shopview"] = new Template("Template.shopview", (function() {
  var view = this;
  return [ Blaze.If(function() {
    return Spacebars.call(view.lookup("location"));
  }, function() {
    return [ "\n		", HTML.DIV({
      "class": "row"
    }, "\n			", HTML.LABEL({
      "class": "col-sm-2"
    }, "Carte"), "\n			", HTML.DIV({
      "class": "col-sm-10"
    }, "\n				", Blaze._TemplateWith(function() {
      return Spacebars.call(view.lookup("shop"));
    }, function() {
      return Spacebars.include(view.lookupTemplate("position"));
    }), "\n			"), "\n		"), "\n\n		", HTML.HR(), "\n	" ];
  }), "\n\n	", HTML.DIV({
    "class": "row"
  }, "\n		", HTML.Raw('<label class="col-sm-2">Adresse</label>'), "\n		", HTML.DIV({
    "class": "col-sm-10"
  }, "\n			", HTML.DIV({
    "class": "col-sm-12"
  }, "\n				", HTML.ADDRESS("\n					", HTML.STRONG(Blaze.View("lookup:zone", function() {
    return Spacebars.mustache(view.lookup("zone"));
  })), HTML.Raw("<br>"), "\n					", HTML.STRONG(Blaze.View("lookup:shop.name", function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("shop"), "name"));
  }), " - ", Blaze.View("lookup:shop.brand", function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("shop"), "brand"));
  })), HTML.Raw("<br>"), "\n					", Spacebars.With(function() {
    return Spacebars.call(Spacebars.dot(view.lookup("shop"), "address"));
  }, function() {
    return [ "\n						", Blaze.View("lookup:street", function() {
      return Spacebars.mustache(view.lookup("street"));
    }), " ", Blaze.View("lookup:number", function() {
      return Spacebars.mustache(view.lookup("number"));
    }), HTML.BR(), "\n						", Blaze.View("lookup:zipcode", function() {
      return Spacebars.mustache(view.lookup("zipcode"));
    }), " ", Blaze.View("lookup:city", function() {
      return Spacebars.mustache(view.lookup("city"));
    }), "\n					" ];
  }), HTML.Raw("<br>"), "\n					\n				"), "\n			"), "\n		"), "\n	"), HTML.Raw("\n\n	<hr>\n	\n	"), HTML.DIV({
    "class": "row"
  }, "\n		", HTML.Raw('<label class="col-sm-2">Contact</label>'), "\n		", HTML.DIV({
    "class": "col-sm-10"
  }, "\n			", HTML.DIV({
    "class": "col-sm-12"
  }, "\n				", Blaze.Each(function() {
    return Spacebars.call(Spacebars.dot(view.lookup("shop"), "contacts"));
  }, function() {
    return [ "\n					", Blaze.View("lookup:.", function() {
      return Spacebars.mustache(view.lookup("."));
    }), " ", HTML.BR(), "\n				" ];
  }), "\n			"), "\n		"), "\n	"), HTML.Raw("\n\n	<hr>\n	\n	"), HTML.DIV({
    "class": "row"
  }, "\n		", HTML.Raw('<label class="col-sm-2">Modules</label>'), "\n		", HTML.DIV({
    "class": "col-sm-10"
  }, "\n			", HTML.DIV({
    "class": "col-sm-12"
  }, "\n				", Blaze._TemplateWith(function() {
    return {
      modules: Spacebars.call(view.lookup("modules")),
      view: Spacebars.call(true)
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("moduleindex"));
  }), "\n			"), "\n		"), "\n	"), HTML.Raw("\n\n	<hr>\n	\n	"), HTML.DIV({
    "class": "row"
  }, "\n		", HTML.Raw('<label class="col-sm-2">Travaux</label>'), "\n		", HTML.DIV({
    "class": "col-sm-10"
  }, "\n			", HTML.DIV({
    "class": "col-sm-12"
  }, "\n				", Blaze._TemplateWith(function() {
    return {
      shopId: Spacebars.call(Spacebars.dot(view.lookup("shop"), "_id")),
      works: Spacebars.call(view.lookup("works"))
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("workIndex"));
  }), "\n			"), "\n		"), "\n	") ];
}));

}).call(this);
