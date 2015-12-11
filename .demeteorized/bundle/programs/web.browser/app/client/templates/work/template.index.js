(function(){
Template.__checkName("workIndex");
Template["workIndex"] = new Template("Template.workIndex", (function() {
  var view = this;
  return Blaze.If(function() {
    return Spacebars.call(view.lookup("listView"));
  }, function() {
    return [ "\n		", HTML.TABLE({
      "class": "table",
      "data-db-table-name": "worker"
    }, "\n				", HTML.THEAD("\n					", HTML.TR("\n						", HTML.TH({
      "data-db-row-name": "work_rdv"
    }, "\n							RDV\n						"), "\n						", HTML.TH({
      "data-db-row-name": "work_type"
    }, "\n							Type\n						"), "\n						", Blaze.If(function() {
      return Spacebars.dataMustache(view.lookup("isConnected"), view.lookup("isChief"));
    }, function() {
      return [ "\n						", HTML.TH("\n							Actions\n						"), "\n						" ];
    }), "\n					"), "\n				"), "\n				", HTML.TBODY("\n					", Blaze.If(function() {
      return Spacebars.call(Spacebars.dot(view.lookup("works"), "unfinished"));
    }, function() {
      return [ "\n						", HTML.TR("\n							", HTML.TH({
        colspan: "3"
      }, "Travaux en cours :"), "\n						"), "\n					" ];
    }), "\n					", Blaze.Each(function() {
      return Spacebars.call(Spacebars.dot(view.lookup("works"), "unfinished"));
    }, function() {
      return [ "\n						", HTML.TR("\n							", HTML.TD(Blaze.View("lookup:rdv", function() {
        return Spacebars.mustache(view.lookup("rdv"));
      })), "\n							", HTML.TD(HTML.A({
        href: function() {
          return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
            route: "work.show",
            workId: view.lookup("_id")
          }));
        }
      }, Blaze.View("lookup:type", function() {
        return Spacebars.mustache(view.lookup("type"));
      })), HTML.BR()), "\n							", Blaze.If(function() {
        return Spacebars.dataMustache(view.lookup("isConnected"), view.lookup("isChief"));
      }, function() {
        return [ "\n							", HTML.TD(), "\n							" ];
      }), "\n						"), "\n					" ];
    }), "\n					", Blaze.If(function() {
      return Spacebars.call(Spacebars.dot(view.lookup("works"), "torun"));
    }, function() {
      return [ "\n						", HTML.TR("\n							", HTML.TH({
        colspan: "3"
      }, "Travaux à venir :"), "\n						"), "\n					" ];
    }), "\n					", Blaze.Each(function() {
      return Spacebars.call(Spacebars.dot(view.lookup("works"), "torun"));
    }, function() {
      return [ "\n						", HTML.TR("\n							", HTML.TD(Blaze.View("lookup:rdv", function() {
        return Spacebars.mustache(view.lookup("rdv"));
      })), "\n							", HTML.TD(HTML.A({
        href: function() {
          return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
            route: "work.show",
            workId: view.lookup("_id")
          }));
        }
      }, Blaze.View("lookup:type", function() {
        return Spacebars.mustache(view.lookup("type"));
      })), HTML.BR()), "\n							", Blaze.If(function() {
        return Spacebars.dataMustache(view.lookup("isConnected"), view.lookup("isChief"));
      }, function() {
        return [ "\n							", HTML.TD(Blaze._TemplateWith(function() {
          return {
            method: Spacebars.call("workDestructor"),
            _id: Spacebars.call(view.lookup("_id"))
          };
        }, function() {
          return Spacebars.include(view.lookupTemplate("buttondestroy"));
        })), "\n							" ];
      }), "\n						"), "\n					" ];
    }), "\n					", Blaze.If(function() {
      return Spacebars.call(Spacebars.dot(view.lookup("works"), "finished"));
    }, function() {
      return [ "\n						", HTML.TR("\n							", HTML.TH({
        colspan: "3"
      }, "Travaux cloturés :"), "\n						"), "\n					" ];
    }), "\n					", Blaze.Each(function() {
      return Spacebars.call(Spacebars.dot(view.lookup("works"), "finished"));
    }, function() {
      return [ "\n						", HTML.TR("\n							", HTML.TD(Blaze.View("lookup:rdv", function() {
        return Spacebars.mustache(view.lookup("rdv"));
      })), "\n							", HTML.TD(HTML.A({
        href: function() {
          return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
            route: "work.show",
            workId: view.lookup("_id")
          }));
        }
      }, Blaze.View("lookup:type", function() {
        return Spacebars.mustache(view.lookup("type"));
      })), HTML.BR()), "\n							", Blaze.If(function() {
        return Spacebars.dataMustache(view.lookup("isConnected"), view.lookup("isChief"));
      }, function() {
        return [ "\n							", HTML.TD("\n								", Blaze.If(function() {
          return Spacebars.call(view.lookup("depannage"));
        }, function() {
          return [ "\n										", HTML.BUTTON({
            "data-work-id": function() {
              return Spacebars.mustache(view.lookup("_id"));
            },
            "class": "workToPdf btn btn-md btn-default"
          }, "Fiche de travail"), "\n									", Blaze.If(function() {
            return Spacebars.call(view.lookup("summary"));
          }, function() {
            return [ "\n										", HTML.A({
              href: function() {
                return Spacebars.mustache(view.lookup("summary"));
              },
              target: "_blank",
              "class": "btn btn-md btn-primary"
            }, HTML.I({
              "class": "fa fa-file-pdf-o"
            })), "\n									" ];
          }), "\n								" ];
        }), "\n								", Blaze.If(function() {
          return Spacebars.call(view.lookup("entretien"));
        }, function() {
          return [ "\n									", HTML.BUTTON({
            "data-work-id": function() {
              return Spacebars.mustache(view.lookup("_id"));
            },
            "class": "maintenanceToPdf btn btn-md btn-default"
          }, "Fiche d'entretien"), "\n								" ];
        }), "\n							"), "\n							" ];
      }), "\n						"), "\n					" ];
    }), "\n				"), "\n			"), "\n	" ];
  }, function() {
    return [ "\n		", Blaze._TemplateWith(function() {
      return Spacebars.call(view.lookup("works"));
    }, function() {
      return Spacebars.include(view.lookupTemplate("calendar"));
    }), "\n	" ];
  });
}));

Template.__checkName("workItem");
Template["workItem"] = new Template("Template.workItem", (function() {
  var view = this;
  return HTML.A({
    href: function() {
      return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
        route: "work.show",
        workId: view.lookup("_id")
      }));
    }
  }, Blaze.View("lookup:type", function() {
    return Spacebars.mustache(view.lookup("type"));
  }), " chez ", Blaze.View("lookup:shop.name", function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("shop"), "name"));
  }));
}));

}).call(this);
