(function(){
Template.__checkName("work-new");
Template["work-new"] = new Template("Template.work-new", (function() {
  var view = this;
  return HTML.FORM({
    "class": "form-inline",
    role: "form"
  }, " \n		", HTML.INPUT({
    "class": "form-control",
    type: "hidden",
    id: "workType",
    name: "workType",
    value: function() {
      return Spacebars.mustache(view.lookup("hash"));
    }
  }), "\n		", HTML.FIELDSET({
    "class": "row shopselector"
  }, "\n			", Spacebars.include(view.lookupTemplate("shopselector")), "\n		"), "\n		", Blaze.If(function() {
    return Spacebars.call(view.lookup("rendezvous"));
  }, function() {
    return [ "\n			", HTML.HR(), "\n			", HTML.FIELDSET({
      "class": "rdvPicker"
    }, "\n				", Spacebars.include(view.lookupTemplate("rdvPicker")), "\n			"), "\n		" ];
  }), "\n		", Blaze.If(function() {
    return Spacebars.call(view.lookup("planner"));
  }, function() {
    return [ "\n			", HTML.HR(), "\n			", HTML.FIELDSET({
      "class": "rdvPlanner"
    }, "\n				", Spacebars.include(view.lookupTemplate("rdvPlanner")), "\n			"), "\n		" ];
  }), "\n		", Blaze.If(function() {
    return Spacebars.call(view.lookup("worker"));
  }, function() {
    return [ "\n			", HTML.HR(), "\n			", HTML.FIELDSET({
      "class": "row worker"
    }, "\n				", HTML.LABEL({
      "class": "col-sm-2"
    }, "Hommes"), "\n				", HTML.DIV({
      "class": "col-sm-10"
    }, "\n					", Spacebars.include(view.lookupTemplate("workerselector")), "\n				"), "\n			"), "\n		" ];
  }), "\n\n		", Blaze.If(function() {
    return Spacebars.call(view.lookup("planner"));
  }, function() {
    return [ "\n			", Blaze.If(function() {
      return Spacebars.call(view.lookup("shop"));
    }, function() {
      return [ "\n				", HTML.HR(), "\n				", HTML.DIV({
        "class": "row"
      }, "\n					", HTML.LABEL({
        "class": "col-sm-2"
      }, "Tâches"), "\n					", HTML.DIV({
        "class": "form-group col-sm-10"
      }, "\n						", Blaze._TemplateWith(function() {
        return {
          shop: Spacebars.call(view.lookup("shop"))
        };
      }, function() {
        return Spacebars.include(view.lookupTemplate("workmodules"));
      }), "\n					"), "\n				"), "\n			" ];
    }), "\n		" ];
  }), HTML.Raw("\n		<hr>\n		"), HTML.FIELDSET({
    "class": "row"
  }, "\n			", HTML.DIV({
    "class": "form-group col-sm-offset-2 col-sm-10"
  }, "\n				", HTML.BUTTON({
    "class": "btn btn-lg btn-block btn-primary workSave"
  }, "Créer ", Blaze.View("lookup:hash", function() {
    return Spacebars.mustache(view.lookup("hash"));
  })), "\n			"), "\n		"), "\n	");
}));

}).call(this);
