(function(){
Template.__checkName("workerindex");
Template["workerindex"] = new Template("Template.workerindex", (function() {
  var view = this;
  return Blaze.If(function() {
    return Spacebars.call(view.lookup("workers"));
  }, function() {
    return [ "\n	", HTML.DIV({
      "class": "row"
    }, "\n		", HTML.DIV({
      "class": "col-sm-12"
    }, "\n			", HTML.TABLE({
      "class": "table",
      "data-db-table-name": "worker"
    }, "\n				", HTML.THEAD("\n					", HTML.TR("\n						", HTML.TH({
      "data-db-row-name": "worker_name"
    }, "\n							Nom\n						"), "\n						", Blaze.If(function() {
      return Spacebars.call(view.lookup("schedular"));
    }, function() {
      return [ "\n							", HTML.TH("\n								Travail\n							"), "\n						" ];
    }), "\n						", Blaze.If(function() {
      return Spacebars.call(view.lookup("schedularSummary"));
    }, function() {
      return [ "\n							", HTML.TH("\n								Temps de travail - hh:mm\n							"), "\n						" ];
    }), "\n						", Blaze.If(function() {
      return Spacebars.call(view.lookup("actions"));
    }, function() {
      return [ "\n							", HTML.TH("\n								Actions\n							"), "\n						" ];
    }), "\n					"), "\n				"), "\n				", HTML.TBODY("\n					", Blaze.Each(function() {
      return Spacebars.call(view.lookup("workers"));
    }, function() {
      return [ "\n						", Spacebars.include(view.lookupTemplate("workeritem")), "\n					" ];
    }), "\n				"), "\n			"), "\n		"), "\n	"), "\n	" ];
  });
}));

Template.__checkName("workeritem");
Template["workeritem"] = new Template("Template.workeritem", (function() {
  var view = this;
  return HTML.TR({
    "data-worker-id": function() {
      return Spacebars.mustache(view.lookup("_id"));
    }
  }, "\n		", Spacebars.With(function() {
    return Spacebars.call(view.lookup("profile"));
  }, function() {
    return [ "\n			", HTML.TD({
      "class": "td-lg"
    }, "\n				", HTML.A({
      href: function() {
        return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
          route: "worker.view",
          workerId: view.lookup("_id")
        }));
      },
      "class": "btn btn-lg btn-link"
    }, "\n					", Blaze.View("lookup:firstname", function() {
      return Spacebars.mustache(view.lookup("firstname"));
    }), " ", Blaze.View("lookup:lastname", function() {
      return Spacebars.mustache(view.lookup("lastname"));
    }), " \n				"), "\n			"), "\n		" ];
  }, function() {
    return [ "\n			", HTML.TD({
      "class": "td-lg"
    }, "\n				...\n			"), "\n		" ];
  }), "\n		", Blaze.If(function() {
    return Spacebars.call(view.lookup("schedular"));
  }, function() {
    return [ "\n			", HTML.TD("\n				", Blaze.If(function() {
      return Spacebars.call(view.lookup("working"));
    }, function() {
      return [ "\n					", HTML.BUTTON({
        "class": "btn btn-lg btn-danger btn-block schedule stop"
      }, "\n						", HTML.I({
        "class": "fa fa-cog fa-spin"
      }), HTML.CharRef({
        html: "&nbsp;",
        str: " "
      }), " Arrêter\n					"), "\n				" ];
    }, function() {
      return [ "\n					", HTML.BUTTON({
        "class": "btn btn-lg btn-default btn-block schedule start"
      }, "\n						", HTML.I({
        "class": "fa fa-play"
      }), HTML.CharRef({
        html: "&nbsp;",
        str: " "
      }), " Commencer\n					"), "\n				" ];
    }), "\n			"), "\n		" ];
  }), "\n		", Blaze.If(function() {
    return Spacebars.call(view.lookup("schedularSummary"));
  }, function() {
    return [ "\n			", HTML.TD({
      "class": "td-lg"
    }, "\n				", Blaze.View("lookup:schedularSummary", function() {
      return Spacebars.mustache(view.lookup("schedularSummary"));
    }), "\n			"), "\n		" ];
  }), "\n		\n		", Blaze.If(function() {
    return Spacebars.call(view.lookup("actions"));
  }, function() {
    return [ "\n				", HTML.TD("\n					", Blaze.If(function() {
      return Spacebars.call(view.lookup("isChief"));
    }, function() {
      return [ "\n						", HTML.A({
        "class": "btn btn-lg btn-default",
        href: function() {
          return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
            route: "user.edit",
            workerId: view.lookup("_id")
          }));
        }
      }, "Modifier"), "\n					" ];
    }), "\n					", Blaze._TemplateWith(function() {
      return {
        method: Spacebars.call("workerDestroyer"),
        _id: Spacebars.call(view.lookup("_id"))
      };
    }, function() {
      return Spacebars.include(view.lookupTemplate("buttondestroy"));
    }), "\n				"), "\n		" ];
  }), "\n	");
}));

}).call(this);
