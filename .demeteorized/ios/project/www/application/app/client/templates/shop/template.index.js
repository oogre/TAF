(function(){
Template.__checkName("shopindex");
Template["shopindex"] = new Template("Template.shopindex", (function() {
  var view = this;
  return Blaze.If(function() {
    return Spacebars.call(view.lookup("shops"));
  }, function() {
    return [ "\n\n		", Blaze.If(function() {
      return Spacebars.call(view.lookup("isNav"));
    }, function() {
      return [ "\n			", HTML.DIV({
        "class": "row"
      }, "\n				", HTML.DIV({
        "class": "col-sm-12"
      }, "\n					", HTML.NAV("\n						", Blaze.If(function() {
        return Spacebars.call(view.lookup("isFiltered"));
      }, function() {
        return [ "\n							", HTML.SPAN({
          "class": "btn-group pull-left"
        }, "\n								", HTML.A({
          href: function() {
            return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
              route: "shop.index"
            }));
          },
          "class": "btn btn-lg btn-warning"
        }, 'Recherche : "', Blaze.View("lookup:filter", function() {
          return Spacebars.mustache(view.lookup("filter"));
        }), '"'), "\n							"), "\n						" ];
      }), "\n						", Blaze.If(function() {
        return Spacebars.call(view.lookup("isPager"));
      }, function() {
        return [ "\n							", HTML.UL({
          "class": "pagination pagination-lg pull-right no-margin"
        }, "\n								", Blaze.Each(function() {
          return Spacebars.call(view.lookup("pager"));
        }, function() {
          return [ "\n									", Blaze.If(function() {
            return Spacebars.call(view.lookup("first"));
          }, function() {
            return [ "\n										", HTML.LI("\n											", HTML.A({
              href: function() {
                return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
                  route: "shop.index",
                  query: view.lookup("query")
                }));
              },
              "aria-label": "Previous"
            }, "\n												", HTML.I({
              "class": "fa fa-angle-double-left"
            }), "\n											"), "\n										"), "\n									" ];
          }, function() {
            return [ "\n										", Blaze.If(function() {
              return Spacebars.call(view.lookup("last"));
            }, function() {
              return [ "\n											", HTML.LI("\n												", HTML.A({
                href: function() {
                  return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
                    route: "shop.index",
                    query: view.lookup("query")
                  }));
                },
                "aria-label": "Next"
              }, "\n													", HTML.I({
                "class": "fa fa-angle-double-right"
              }), "\n												"), "\n											"), "\n										" ];
            }, function() {
              return [ "\n											", HTML.LI({
                "class": function() {
                  return Spacebars.mustache(view.lookup("active"));
                }
              }, "\n												", HTML.A({
                href: function() {
                  return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
                    route: "shop.index",
                    query: view.lookup("query")
                  }));
                }
              }, Blaze.View("lookup:key", function() {
                return Spacebars.mustache(view.lookup("key"));
              })), "\n											"), "\n										" ];
            }), "\n									" ];
          }), "\n								" ];
        }), "\n							"), "\n						" ];
      }), "	\n					"), "\n				"), "\n			"), "\n\n			", HTML.HR(), "\n		" ];
    }), "\n		\n\n		", HTML.DIV({
      "class": "row"
    }, "\n			", HTML.DIV({
      "class": "col-sm-12"
    }, "\n				", HTML.TABLE({
      "class": "table",
      "data-db-table-name": "shop"
    }, "\n					", HTML.THEAD("\n						", HTML.TR("\n							", HTML.TH({
      "data-db-row-name": "shop_name"
    }, "\n								Nom\n							"), "\n							", HTML.TH("\n								Action\n							"), "\n						"), "\n					"), "\n					", HTML.TBODY("\n						", Blaze.Each(function() {
      return Spacebars.call(view.lookup("shops"));
    }, function() {
      return [ "\n							", Spacebars.include(view.lookupTemplate("shopitem")), "\n						" ];
    }), "\n					"), "\n				"), "\n			"), "\n		"), "\n	" ];
  });
}));

Template.__checkName("shopitem");
Template["shopitem"] = new Template("Template.shopitem", (function() {
  var view = this;
  return HTML.TR({
    "data-shop-id": function() {
      return Spacebars.mustache(view.lookup("_id"));
    }
  }, "\n		", HTML.TD({
    "class": "td-lg"
  }, "\n			", HTML.A({
    href: function() {
      return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
        route: "shop.view",
        id: view.lookup("_id")
      }));
    },
    "class": "btn btn-lg btn-link"
  }, "\n				", Blaze.View("lookup:brand", function() {
    return Spacebars.mustache(view.lookup("brand"));
  }), " - ", Blaze.View("lookup:name", function() {
    return Spacebars.mustache(view.lookup("name"));
  }), "\n			"), "\n		"), "\n		", HTML.TD("\n			", Blaze._TemplateWith(function() {
    return {
      route: Spacebars.call("shop.edit"),
      _id: Spacebars.call(view.lookup("_id"))
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("buttonmodifier"));
  }), "\n			", Blaze._TemplateWith(function() {
    return {
      method: Spacebars.call("shopDestroyer"),
      _id: Spacebars.call(view.lookup("_id"))
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("buttondestroy"));
  }), "\n		"), "\n	");
}));

}).call(this);
