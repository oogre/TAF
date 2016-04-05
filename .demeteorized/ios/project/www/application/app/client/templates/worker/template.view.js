(function(){
Template.__checkName("workerview");
Template["workerview"] = new Template("Template.workerview", (function() {
  var view = this;
  return [ HTML.DIV({
    "class": "row"
  }, "\n		", HTML.Raw('<label class="col-sm-2">En ce moment</label>'), "\n		", HTML.DIV({
    "class": "col-sm-10"
  }, "\n			", HTML.DIV({
    "class": "col-sm-12"
  }, "\n				", Blaze.If(function() {
    return Spacebars.call(view.lookup("working"));
  }, function() {
    return [ "				\n					", HTML.A({
      href: function() {
        return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
          route: "work.show",
          workId: Spacebars.dot(view.lookup("workingAt"), "_id")
        }));
      }
    }, "\n						", Blaze.View("lookup:workingAt.type", function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("workingAt"), "type"));
    }), " chez ", Blaze.View("lookup:workingAt.shop.name", function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("workingAt"), "shop", "name"));
    }), "\n					"), "\n				" ];
  }, function() {
    return "\n					non référencé comme en train de travailler \n				";
  }), "\n			"), "\n		"), "\n	"), HTML.Raw("\n	<hr>\n	"), HTML.DIV({
    "class": "row"
  }, "\n		", HTML.Raw('<label class="col-sm-2">Adresse</label>'), "\n		", HTML.DIV({
    "class": "col-sm-10"
  }, "\n			", HTML.DIV({
    "class": "col-sm-12"
  }, "\n				", HTML.ADDRESS("\n					", HTML.STRONG(Blaze.View("lookup:profile.firstname", function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("profile"), "firstname"));
  }), " - ", Blaze.View("lookup:profile.lastname", function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("profile"), "lastname"));
  })), HTML.Raw("<br>"), "\n					", Spacebars.With(function() {
    return Spacebars.call(Spacebars.dot(view.lookup("profile"), "address"));
  }, function() {
    return [ " \n						", Blaze.View("lookup:street", function() {
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
    return Spacebars.call(view.lookup("emails"));
  }, function() {
    return [ "\n					", Blaze.View("lookup:address", function() {
      return Spacebars.mustache(view.lookup("address"));
    }), " ", HTML.BR(), "\n				" ];
  }), "\n				", Blaze.View("lookup:profile.phone", function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("profile"), "phone"));
  }), "\n			"), "\n		"), "\n	"), HTML.Raw("\n\n	<hr>") ];
}));

}).call(this);
