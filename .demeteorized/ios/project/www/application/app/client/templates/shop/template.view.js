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
      return Spacebars.call(view.lookup("."));
    }, function() {
      return Spacebars.include(view.lookupTemplate("position"));
    }), "\n			"), "\n		"), "\n\n		", HTML.HR(), "\n	" ];
  }), "\n\n	", HTML.DIV({
    "class": "row"
  }, "\n		", HTML.Raw('<label class="col-sm-2">Adresse</label>'), "\n		", HTML.DIV({
    "class": "col-sm-10"
  }, "\n			", HTML.DIV({
    "class": "col-sm-12"
  }, "\n				", HTML.ADDRESS("\n					", HTML.STRONG(Blaze.View("lookup:name", function() {
    return Spacebars.mustache(view.lookup("name"));
  }), " - ", Blaze.View("lookup:brand", function() {
    return Spacebars.mustache(view.lookup("brand"));
  })), HTML.Raw("<br>"), "\n					", Spacebars.With(function() {
    return Spacebars.call(view.lookup("address"));
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
  }), "\n				"), "\n			"), "\n		"), "\n	"), HTML.Raw("\n\n	<hr>\n	\n	"), HTML.DIV({
    "class": "row"
  }, "\n		", HTML.Raw('<label class="col-sm-2">Contact</label>'), "\n		", HTML.DIV({
    "class": "col-sm-10"
  }, "\n			", HTML.DIV({
    "class": "col-sm-12"
  }, "\n				", Blaze.Each(function() {
    return Spacebars.call(view.lookup("contacts"));
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
      works: Spacebars.call(view.lookup("works"))
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("workIndex"));
  }), "\n			"), "\n		"), "\n	") ];
}));

}).call(this);
