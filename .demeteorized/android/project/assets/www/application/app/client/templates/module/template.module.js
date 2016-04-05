(function(){
Template.__checkName("module");
Template["module"] = new Template("Template.module", (function() {
  var view = this;
  return Blaze.If(function() {
    return Spacebars.call(view.lookup("modulOpen"));
  }, function() {
    return [ "\n		", HTML.DIV({
      "class": "module open"
    }, "\n			", HTML.BUTTON({
      "class": " btn btn-default dropdown-toggle btn-lg btn-module"
    }, "\n				", Blaze.View("lookup:module.type", function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("module"), "type"));
    }), " - ", Blaze.View("lookup:module.name", function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("module"), "name"));
    }), HTML.CharRef({
      html: "&emsp;",
      str: " "
    }), HTML.I({
      "class": "fa fa-caret-down"
    }), "\n			"), "\n			", Blaze.If(function() {
      return Spacebars.call(view.lookup("showRemove"));
    }, function() {
      return [ "\n				", HTML.BUTTON({
        "class": "btn btn-danger btn-lg removeModule"
      }, "\n					", HTML.I({
        "class": "fa fa-trash"
      }), "\n				"), "\n			" ];
    }), "\n			", Blaze._TemplateWith(function() {
      return {
        raw: Spacebars.call(true),
        task_ids: Spacebars.call(view.lookup("taskIds")),
        shopId: Spacebars.call(Spacebars.dot(view.lookup("shop"), "_id")),
        moduleId: Spacebars.call(Spacebars.dot(view.lookup("module"), "_id")),
        key: Spacebars.call(view.lookup("key")),
        forced_id: Spacebars.call(view.lookup("forced_id"))
      };
    }, function() {
      return Spacebars.include(view.lookupTemplate("taskselector"));
    }), "\n			\n			\n		"), "\n	" ];
  }, function() {
    return [ "\n		", HTML.DIV({
      "class": "module"
    }, "\n			", HTML.BUTTON({
      "class": " btn btn-default dropdown-toggle btn-lg btn-module"
    }, "\n				", Blaze.View("lookup:module.type", function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("module"), "type"));
    }), " - ", Blaze.View("lookup:module.name", function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("module"), "name"));
    }), HTML.CharRef({
      html: "&emsp;",
      str: " "
    }), HTML.I({
      "class": "fa fa-caret-right"
    }), "\n			"), "\n		"), "\n	" ];
  });
}));

}).call(this);
