(function(){
Template.__checkName("originshow");
Template["originshow"] = new Template("Template.originshow", (function() {
  var view = this;
  return [ HTML.DIV({
    "class": "row matterTransfert"
  }, "\n		", HTML.Raw('<label class="col-sm-2">Transferts</label>'), "\n		", HTML.DIV({
    "class": "col-sm-10"
  }, "\n			", HTML.DIV({
    "class": "input-group col-sm-12"
  }, "\n				", HTML.LABEL({
    "class": "input-group-addon autowidth",
    "for": "matter"
  }, "\n					", HTML.INPUT({
    "class": "typeahead input-lg",
    name: "matter",
    id: "matter",
    type: "text",
    disabled: "",
    value: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("."), "matter", "name"));
    }
  }), "\n						\n					", HTML.SELECT({
    name: "destiny",
    "class": "form-control input-lg barcode"
  }, "\n						", HTML.Raw('<option disabled="" selected="" value="">destination</option>'), "\n						", Blaze.If(function() {
    return Spacebars.call(view.lookup("isMobile"));
  }, function() {
    return [ "\n							", HTML.OPTION({
      value: "barcode"
    }, "~ Scan ~"), "\n						" ];
  }), "\n						", Blaze.Each(function() {
    return Spacebars.call(view.lookup("destins"));
  }, function() {
    return [ "\n							", HTML.OPTION({
      value: function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("."), "_id"));
      }
    }, Blaze.View("lookup:..ref", function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("."), "ref"));
    })), "\n						" ];
  }), "\n					"), "\n				"), "\n				", HTML.Raw('<input class="form-control input-lg input-xl z-index-auto" type="number" step="any" min="0" name="quantity" placeholder="Quantité" value="">'), "\n				", HTML.LABEL({
    "class": "input-group-addon autowidth"
  }, "\n					", HTML.SELECT({
    disabled: "",
    "class": "form-control input-lg lowercase z-index-auto",
    id: "unit",
    name: "unit"
  }, "\n						", HTML.OPTION({
    selected: ""
  }, Blaze.View("lookup:..matter.unit", function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("."), "matter", "unit"));
  })), "\n					"), "\n				"), "\n			"), "\n		"), "\n	"), HTML.Raw("\n	<hr>\n	"), HTML.DIV({
    "class": "row"
  }, "\n		", HTML.Raw('<label class="col-sm-2">Traçabilité</label>'), "\n		", HTML.DIV({
    "class": "col-sm-10"
  }, "\n			", HTML.DIV({
    "class": "col-sm-6"
  }, "\n				Sorties\n				", HTML.TABLE({
    "class": "table",
    "data-db-table-name": "Origin"
  }, "\n					", HTML.THEAD("\n						", HTML.TR("\n							", HTML.TH("\n								Quantité\n							"), "\n							", HTML.TH("\n								Travails / Clients\n							"), "\n							", HTML.TH("\n								Dest. Réf.\n							"), "\n							", HTML.TH("\n								Date\n							"), "\n						"), "\n					"), "\n					", HTML.TBODY("\n						", Blaze.Each(function() {
    return Spacebars.call(view.lookup("movesFrom"));
  }, function() {
    return [ "\n							", Blaze.View("lookup:setCurrent", function() {
      return Spacebars.mustache(view.lookup("setCurrent"), view.lookup("destinyId"));
    }), "\n							", HTML.TR("\n								", HTML.TD({
      "class": "td-lg"
    }, "\n									", HTML.STRONG(Blaze.View("lookup:quantity", function() {
      return Spacebars.mustache(view.lookup("quantity"));
    }), " ", Blaze.View("lookup:unit", function() {
      return Spacebars.mustache(view.lookup("unit"));
    })), "\n								"), "\n								", HTML.TD("\n									", Blaze.If(function() {
      return Spacebars.call(view.lookup("work"));
    }, function() {
      return [ "\n										", HTML.A({
        href: function() {
          return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
            route: "work.show",
            workId: Spacebars.dot(view.lookup("work"), "_id")
          }));
        },
        "class": ""
      }, "\n											", Blaze.View("lookup:work.myId", function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("work"), "myId"));
      }), "\n										"), "\n									" ];
    }, function() {
      return "\n									-\n									";
    }), "\n									", HTML.BR(), "\n									", Blaze.If(function() {
      return Spacebars.call(view.lookup("shop"));
    }, function() {
      return [ "\n										", HTML.A({
        href: function() {
          return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
            route: "shop.view",
            shopId: Spacebars.dot(view.lookup("shop"), "_id")
          }));
        },
        "class": ""
      }, "\n											", Blaze.View("lookup:shop.name", function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("shop"), "name"));
      }), " - ", Blaze.View("lookup:shop.brand", function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("shop"), "brand"));
      }), "\n										"), "\n									" ];
    }, function() {
      return "\n									-\n									";
    }), "\n								"), "\n								", HTML.TD("\n									", Blaze.If(function() {
      return Spacebars.call(view.lookup("module"));
    }, function() {
      return [ "\n										", Blaze.View("lookup:module.serial", function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("module"), "serial"));
      }), " ", Blaze.View("lookup:module.type", function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("module"), "type"));
      }), " ", Blaze.View("lookup:module.name", function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("module"), "name"));
      }), "\n									" ];
    }, function() {
      return [ "\n										", Blaze.If(function() {
        return Spacebars.call(view.lookup("origine"));
      }, function() {
        return [ "\n											", HTML.A({
          href: function() {
            return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
              route: "origin.show",
              originId: Spacebars.dot(view.lookup("origine"), "_id")
            }));
          },
          "class": ""
        }, "\n												", Blaze.View("lookup:origine.ref", function() {
          return Spacebars.mustache(Spacebars.dot(view.lookup("origine"), "ref"));
        }), "\n											"), "\n										" ];
      }), "\n									" ];
    }), "\n								"), "\n								", HTML.TD("\n									", HTML.SMALL(Blaze.View("lookup:formatize", function() {
      return Spacebars.mustache(view.lookup("formatize"), view.lookup("dateTime"));
    })), "\n								"), "\n							"), "\n						" ];
  }), "\n					"), "\n				"), "\n			"), "\n\n\n			", HTML.DIV({
    "class": "col-sm-6"
  }, "\n				Entrées\n				", HTML.TABLE({
    "class": "table",
    "data-db-table-name": "Origin"
  }, "\n					", HTML.THEAD("\n						", HTML.TR("\n							", HTML.TH("\n								Quantité\n							"), "\n							", HTML.TH("\n								Clients\n							"), "\n							", HTML.TH("\n								Orig. Réf.\n							"), "\n							", HTML.TH("\n								Date\n							"), "\n						"), "\n					"), "\n					", HTML.TBODY("\n						", Blaze.Each(function() {
    return Spacebars.call(view.lookup("movesTo"));
  }, function() {
    return [ "\n							", Blaze.View("lookup:setCurrent", function() {
      return Spacebars.mustache(view.lookup("setCurrent"), view.lookup("originId"));
    }), "\n							", HTML.TR("\n								", HTML.TD({
      "class": "td-lg"
    }, "\n									", HTML.STRONG(Blaze.View("lookup:quantity", function() {
      return Spacebars.mustache(view.lookup("quantity"));
    }), " ", Blaze.View("lookup:unit", function() {
      return Spacebars.mustache(view.lookup("unit"));
    })), "\n								"), "\n								", HTML.TD("\n									", Blaze.If(function() {
      return Spacebars.call(view.lookup("shop"));
    }, function() {
      return [ "\n										", HTML.A({
        href: function() {
          return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
            route: "shop.view",
            shopId: Spacebars.dot(view.lookup("shop"), "_id")
          }));
        },
        "class": ""
      }, "\n											", Blaze.View("lookup:shop.name", function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("shop"), "name"));
      }), " - ", Blaze.View("lookup:shop.brand", function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("shop"), "brand"));
      }), "\n										"), "\n									" ];
    }, function() {
      return "\n										-\n									";
    }), "\n								"), "\n								", HTML.TD("\n									", Blaze.If(function() {
      return Spacebars.call(view.lookup("module"));
    }, function() {
      return [ "\n										", Blaze.View("lookup:module.serial", function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("module"), "serial"));
      }), "\n									" ];
    }, function() {
      return [ "\n										", Blaze.If(function() {
        return Spacebars.call(view.lookup("origine"));
      }, function() {
        return [ "\n											", HTML.A({
          href: function() {
            return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
              route: "origin.show",
              originId: Spacebars.dot(view.lookup("origine"), "_id")
            }));
          },
          "class": ""
        }, "\n												", Blaze.View("lookup:origine.ref", function() {
          return Spacebars.mustache(Spacebars.dot(view.lookup("origine"), "ref"));
        }), "\n											"), "\n										" ];
      }), "\n									" ];
    }), "\n								"), "\n								", HTML.TD("\n									", HTML.SMALL(Blaze.View("lookup:formatize", function() {
      return Spacebars.mustache(view.lookup("formatize"), view.lookup("dateTime"));
    })), "\n								"), "\n							"), "\n						" ];
  }), "\n					"), "\n				"), "\n			"), "\n		"), "\n	") ];
}));

}).call(this);
