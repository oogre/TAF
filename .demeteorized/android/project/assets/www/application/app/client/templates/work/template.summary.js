(function(){
Template.__checkName("workSummary");
Template["workSummary"] = new Template("Template.workSummary", (function() {
  var view = this;
  return HTML.DIV({
    "data-work-id": function() {
      return Spacebars.mustache(view.lookup("_id"));
    }
  }, "\n		", HTML.FORM({
    "class": "form-inline",
    role: "form"
  }, " \n\n			", HTML.FIELDSET({
    "class": "row"
  }, "\n				", HTML.Raw('<label class="col-sm-2">Client/Magasin</label>'), "\n				", HTML.DIV({
    "class": "form-group col-sm-10"
  }, "\n					", HTML.A({
    href: function() {
      return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
        route: "shop.view",
        shopId: Spacebars.dot(view.lookup("."), "shop", "_id")
      }));
    },
    "class": "btn btn-link btn-lg"
  }, Blaze.View("lookup:..shop.name", function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("."), "shop", "name"));
  }), " - ", Blaze.View("lookup:..shop.brand", function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("."), "shop", "brand"));
  })), "\n				"), "\n			"), "\n			\n			", HTML.Raw("<hr>"), "\n\n			", HTML.FIELDSET({
    "class": "row"
  }, "\n				", HTML.Raw('<label class="col-sm-2">Planning</label>'), "\n				", HTML.DIV({
    "class": "form-group col-sm-10"
  }, "\n					", HTML.DIV({
    "class": "input-group col-sm-12"
  }, "\n						", HTML.Raw('<label class="input-group-addon" for="rendezvous">Date début</label>'), "\n						", HTML.INPUT({
    "class": "form-control input-lg",
    type: "text",
    name: "rendezvous",
    id: "rendezvous",
    value: function() {
      return Spacebars.mustache(view.lookup("rdv"));
    },
    disabled: ""
  }), "\n					"), "\n				"), "\n				", HTML.DIV({
    "class": "form-group col-sm-offset-2 col-sm-10"
  }, "\n					", HTML.DIV({
    "class": "input-group col-sm-12"
  }, "\n						", HTML.Raw('<label class="input-group-addon" for="rendezvous">Date fin</label>'), "\n						", HTML.INPUT({
    "class": "form-control input-lg",
    type: "text",
    name: "rendezvous",
    id: "rendezvous",
    value: function() {
      return Spacebars.mustache(view.lookup("end"));
    },
    disabled: ""
  }), "\n					"), "\n				"), "\n			"), "\n			\n			", HTML.Raw("<hr>"), "\n\n			", HTML.FIELDSET({
    "class": "row worker"
  }, "\n				", HTML.Raw('<label class="col-sm-2">Hommes</label>'), "\n					", HTML.DIV({
    "class": "col-sm-10"
  }, "\n						", Blaze._TemplateWith(function() {
    return {
      schedularSummary: Spacebars.call(true),
      worker_ids: Spacebars.call(view.lookup("worker_ids")),
      workId: Spacebars.call(view.lookup("_id"))
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("workerindex"));
  }), "\n					"), "\n			"), "\n\n			", Blaze.If(function() {
    return Spacebars.call(view.lookup("showTasks"));
  }, function() {
    return [ "\n				", HTML.HR(), "\n				\n				", HTML.FIELDSET({
      "class": "row modules"
    }, "\n					", HTML.LABEL({
      "class": "col-sm-2"
    }, "Modules"), "\n					", HTML.DIV({
      "class": "form-group col-sm-10"
    }, "\n						", Blaze._TemplateWith(function() {
      return {
        work: Spacebars.call(view.lookup(".")),
        abortUpdateTask: Spacebars.call(true)
      };
    }, function() {
      return Spacebars.include(view.lookupTemplate("workmodules"));
    }), "\n					"), "\n				"), "\n			" ];
  }), "\n\n			", Blaze.If(function() {
    return Spacebars.call(view.lookup("showMatters"));
  }, function() {
    return [ "\n\n				", HTML.HR(), "\n\n				", HTML.FIELDSET({
      "class": "row modules"
    }, "\n					", HTML.LABEL({
      "class": "col-sm-2"
    }, "Matériel"), "\n					", HTML.DIV({
      "class": "form-group col-sm-10"
    }, "\n						", Blaze._TemplateWith(function() {
      return {
        work: Spacebars.call(view.lookup("."))
      };
    }, function() {
      return Spacebars.include(view.lookupTemplate("matterlist"));
    }), "\n					"), "\n				"), "\n			" ];
  }), "\n			\n			", HTML.Raw("<hr>"), "\n\n			", HTML.FIELDSET({
    "class": "row"
  }, "\n				", HTML.Raw('<label class="col-sm-2">Description</label>'), "\n				", HTML.DIV({
    "class": "form-group col-sm-10"
  }, "\n					", Blaze._TemplateWith(function() {
    return {
      wikis: Spacebars.call(view.lookup("wikis")),
      view: Spacebars.call(true)
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("wikilist"));
  }), "\n				"), "\n			"), "\n			", HTML.Raw("<hr>"), "\n\n			", HTML.FIELDSET({
    "class": "row"
  }, "\n				", HTML.Raw('<label class="col-sm-2">Photos</label>'), "\n				", HTML.DIV({
    "class": "form-group col-sm-10"
  }, "\n					", Blaze._TemplateWith(function() {
    return Spacebars.call(view.lookup("pictures"));
  }, function() {
    return Spacebars.include(view.lookupTemplate("pictureList"));
  }), "\n				"), "\n			"), "\n\n			", HTML.Raw("<hr>"), "\n\n			", HTML.FIELDSET({
    "class": "row"
  }, "\n				", HTML.Raw('<label class="col-sm-2">Signature</label>'), "\n				", HTML.DIV({
    "class": "form-group col-sm-5"
  }, "\n					", Blaze._TemplateWith(function() {
    return {
      work: Spacebars.call(view.lookup(".")),
      client: Spacebars.call(true)
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("workSignature"));
  }), "\n				"), "\n				", HTML.DIV({
    "class": "form-group col-sm-5"
  }, "\n					", Blaze._TemplateWith(function() {
    return {
      work: Spacebars.call(view.lookup(".")),
      client: Spacebars.call(false)
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("workSignature"));
  }), "\n				"), "\n			"), "\n\n			", HTML.Raw("<hr>"), "\n\n		"), "\n	");
}));

}).call(this);
