(function(){
Template.__checkName("matterselector");
Template["matterselector"] = new Template("Template.matterselector", (function() {
  var view = this;
  return [ HTML.DIV({
    "class": "row"
  }, "\n		", HTML.DIV({
    "class": "form-group col-sm-12"
  }, "\n			", HTML.DIV({
    "class": "input-group col-sm-12"
  }, "\n				", HTML.LABEL({
    "class": "input-group-addon autowidth",
    "for": "matter"
  }, "\n					", HTML.Raw('<input class="typeahead input-lg" name="matter" id="matter" type="text" placeholder="Matériel" autocomplete="off" spellcheck="off" data-source="matters" data-highlight="true" required="">'), "\n					", Blaze.If(function() {
    return Spacebars.call(view.lookup("origins"));
  }, function() {
    return [ "\n						", HTML.SELECT({
      name: "origin",
      "class": "form-control input-lg barcode"
    }, "\n							", HTML.OPTION({
      disabled: "",
      selected: ""
    }, "origin"), "\n							", Blaze.If(function() {
      return Spacebars.call(view.lookup("isMobile"));
    }, function() {
      return [ "\n								", HTML.OPTION({
        value: "barcode"
      }, "~ Scan ~"), "\n							" ];
    }), "\n							", Blaze.Each(function() {
      return Spacebars.call(view.lookup("origins"));
    }, function() {
      return [ "\n								", HTML.OPTION({
        value: function() {
          return Spacebars.mustache(Spacebars.dot(view.lookup("."), "_id"));
        }
      }, Blaze.View("lookup:..ref", function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("."), "ref"));
      })), "\n							" ];
    }), "\n						"), "\n\n						", Blaze.If(function() {
      return Spacebars.call(view.lookup("destins"));
    }, function() {
      return [ "\n							", HTML.SELECT({
        name: "destiny",
        "class": "form-control input-lg"
      }, "\n								", HTML.OPTION({
        disabled: "",
        selected: ""
      }, "destination"), "\n								", Blaze.Each(function() {
        return Spacebars.call(view.lookup("destins"));
      }, function() {
        return [ "\n									", HTML.OPTION({
          value: function() {
            return Spacebars.mustache(Spacebars.dot(view.lookup("."), "serial"));
          }
        }, Blaze.View("lookup:..serial", function() {
          return Spacebars.mustache(Spacebars.dot(view.lookup("."), "serial"));
        })), "\n								" ];
      }), "\n							"), "\n						" ];
    }), "\n					" ];
  }), "\n				"), "\n				", HTML.Raw('<input class="form-control input-lg input-xl z-index-auto" type="number" step="any" min="0" name="quantity" placeholder="Quantité" value="">'), "\n				", HTML.LABEL({
    "class": "input-group-addon autowidth"
  }, "\n					", HTML.SELECT({
    "class": "form-control input-lg lowercase z-index-auto",
    id: "unit",
    name: "unit"
  }, "\n						", HTML.Raw('<option selected="" disabled="">Unité</option>'), "\n						", HTML.Raw('<option value="">-</option>'), "\n						", Blaze.Each(function() {
    return Spacebars.call(view.lookup("units"));
  }, function() {
    return [ "\n							", HTML.OPTION({
      value: function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("."), "shortname"));
      },
      selected: function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("."), "selected"));
      }
    }, Blaze.View("lookup:..shortname", function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("."), "shortname"));
    })), "\n						" ];
  }), "\n					"), "\n				"), "\n			"), "\n		"), "\n	"), "\n	", Blaze.View("lookup:inti", function() {
    return Spacebars.mustache(view.lookup("inti"));
  }) ];
}));

Template.__checkName("matterlist");
Template["matterlist"] = new Template("Template.matterlist", (function() {
  var view = this;
  return Blaze.Each(function() {
    return Spacebars.call(Spacebars.dot(view.lookup("work"), "matters"));
  }, function() {
    return [ "\n	", HTML.DIV({
      "class": "row"
    }, "\n		", HTML.DIV({
      "class": "form-group col-sm-12"
    }, "\n			", HTML.DIV({
      "class": "input-group col-sm-12"
    }, "\n				", HTML.LABEL({
      "class": "input-group-addon"
    }, "\n					", Blaze.View("lookup:..name", function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("."), "name"));
    }), "\n				"), "\n				", HTML.INPUT({
      "class": "form-control input-lg z-index-auto",
      type: "text",
      disabled: "disabled",
      value: function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("."), "quantity"));
      }
    }), "\n				", HTML.LABEL({
      "class": "input-group-addon"
    }, "\n					", Blaze.View("lookup:..unit", function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("."), "unit"));
    }), "\n				"), "\n			"), "\n		"), "\n	"), "\n	" ];
  });
}));

}).call(this);
