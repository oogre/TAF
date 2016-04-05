(function(){
Template.__checkName("workEdit");
Template["workEdit"] = new Template("Template.workEdit", (function() {
  var view = this;
  return HTML.DIV({
    "data-work-id": function() {
      return Spacebars.mustache(view.lookup("_id"));
    }
  }, "\n		", HTML.FORM({
    "class": "form-inline",
    role: "form"
  }, " \n			", HTML.FIELDSET({
    "class": "rdvPicker"
  }, "\n				", Blaze._TemplateWith(function() {
    return {
      rdv: Spacebars.call(view.lookup("rdv")),
      workId: Spacebars.call(view.lookup("_id"))
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("rdvPicker"));
  }), "\n			"), "\n			\n			", HTML.Raw("<hr>"), "\n\n			", HTML.FIELDSET({
    "class": "row"
  }, "\n				", HTML.Raw('<label class="col-sm-2">Client/Magasin</label>'), "\n				", HTML.DIV({
    "class": "form-group col-sm-10"
  }, "\n					", HTML.A({
    href: function() {
      return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
        route: "shop.view",
        id: Spacebars.dot(view.lookup("shop"), "_id")
      }));
    },
    "class": ""
  }, Blaze.View("lookup:shop.name", function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("shop"), "name"));
  }), " - ", Blaze.View("lookup:shop.brand", function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("shop"), "brand"));
  })), "\n				"), "\n			"), "\n			\n			", HTML.Raw("<hr>"), "\n\n			", HTML.FIELDSET({
    "class": "row worker"
  }, "\n				", HTML.Raw('<label class="col-sm-2">Hommes</label>'), "\n					", HTML.DIV({
    "class": "col-sm-10"
  }, "\n						", Blaze.If(function() {
    return Spacebars.call(view.lookup("canAddWorker"));
  }, function() {
    return [ "\n							", Blaze.If(function() {
      return Spacebars.call(view.lookup("addWorker"));
    }, function() {
      return [ "\n								", Blaze._TemplateWith(function() {
        return {
          autoAdd: Spacebars.call(true)
        };
      }, function() {
        return Spacebars.include(view.lookupTemplate("workerselector"));
      }), "\n							" ];
    }, function() {
      return [ "\n								", HTML.BUTTON({
        "class": "btn btn-default btn-lg workerAdd"
      }, "Ajouter"), "\n							" ];
    }), "\n						" ];
  }), "\n						", Blaze._TemplateWith(function() {
    return {
      origine: Spacebars.call("shop"),
      schedular: Spacebars.call(true),
      worker_ids: Spacebars.call(view.lookup("worker_ids")),
      workId: Spacebars.call(view.lookup("_id"))
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("workerindex"));
  }), "\n					"), "\n			"), "\n			\n			", Blaze.If(function() {
    return Spacebars.call(view.lookup("showTasks"));
  }, function() {
    return [ "\n				", HTML.HR(), "\n				", HTML.FIELDSET({
      "class": "row modules"
    }, "\n					", HTML.LABEL({
      "class": "col-sm-2"
    }, "Tâches"), "\n					", HTML.DIV({
      "class": "form-group col-sm-10"
    }, "\n						", Blaze.If(function() {
      return Spacebars.call(view.lookup("addModule"));
    }, function() {
      return [ "\n							", Blaze._TemplateWith(function() {
        return {
          shop: Spacebars.call(view.lookup("shop")),
          work: Spacebars.call(view.lookup("."))
        };
      }, function() {
        return Spacebars.include(view.lookupTemplate("workmodules"));
      }), "\n						" ];
    }, function() {
      return [ "\n							", Blaze._TemplateWith(function() {
        return {
          work: Spacebars.call(view.lookup("."))
        };
      }, function() {
        return Spacebars.include(view.lookupTemplate("workmodules"));
      }), "\n						" ];
    }), "\n					"), "\n				"), "\n				", Blaze.If(function() {
      return Spacebars.call(view.lookup("isBoss"));
    }, function() {
      return [ "\n					", HTML.FIELDSET({
        "class": "row"
      }, "\n						", HTML.DIV({
        "class": "form-group col-sm-offset-2 col-sm-10"
      }, "\n							", Blaze.If(function() {
        return Spacebars.call(view.lookup("addModule"));
      }, function() {
        return [ "\n								", HTML.BUTTON({
          "class": "btn btn-primary btn-lg moduleAdd"
        }, "Enregistrer"), "\n							" ];
      }, function() {
        return [ "\n								", HTML.BUTTON({
          "class": "btn btn-default btn-lg moduleAdd"
        }, "Modifier"), "\n							" ];
      }), "\n						"), "\n					"), "\n				" ];
    }), "\n			" ];
  }), "\n\n			", Blaze.If(function() {
    return Spacebars.call(view.lookup("showMatters"));
  }, function() {
    return [ "\n			", HTML.HR(), "\n\n			", HTML.FIELDSET({
      "class": "row modules"
    }, "\n				", HTML.LABEL({
      "class": "col-sm-2"
    }, "Matériel"), "\n				", HTML.DIV({
      "class": "form-group col-sm-10"
    }, "\n					", Blaze._TemplateWith(function() {
      return {
        work: Spacebars.call(view.lookup("."))
      };
    }, function() {
      return Spacebars.include(view.lookupTemplate("matterlist"));
    }), "\n					", Blaze._TemplateWith(function() {
      return {
        work: Spacebars.call(view.lookup("."))
      };
    }, function() {
      return Spacebars.include(view.lookupTemplate("matterselector"));
    }), "\n				"), "\n			"), "\n			" ];
  }), "\n			", HTML.Raw("<hr>"), "\n\n			", HTML.FIELDSET({
    "class": "row"
  }, "\n				", HTML.Raw('<label class="col-sm-2">Description</label>'), "\n				", HTML.DIV({
    "class": "form-group col-sm-10"
  }, "\n					", Blaze._TemplateWith(function() {
    return {
      wikis: Spacebars.call(view.lookup("wikis"))
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("wikilist"));
  }), "\n					", Blaze._TemplateWith(function() {
    return {
      workId: Spacebars.call(Spacebars.dot(view.lookup("."), "_id"))
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("wikiform"));
  }), "\n				"), "\n			"), "\n			", HTML.Raw("<hr>"), "\n\n			", HTML.FIELDSET({
    "class": "row"
  }, "\n				", HTML.Raw('<label class="col-sm-2">Photos</label>'), "\n				", HTML.DIV({
    "class": "form-group col-sm-10"
  }, "\n					", Blaze._TemplateWith(function() {
    return {
      selector: Spacebars.call(view.lookup("pictureSelector"))
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("buttonpicture"));
  }), "\n					", Blaze._TemplateWith(function() {
    return Spacebars.call(view.lookup("pictures"));
  }, function() {
    return Spacebars.include(view.lookupTemplate("pictureList"));
  }), "\n				"), "\n			"), "\n\n			", HTML.Raw("<hr>"), "\n			\n		"), "\n	");
}));

}).call(this);
