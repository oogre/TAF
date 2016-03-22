(function(){
Template.__checkName("taskindex");
Template["taskindex"] = new Template("Template.taskindex", (function() {
  var view = this;
  return Blaze.If(function() {
    return Spacebars.call(view.lookup("tasks"));
  }, function() {
    return [ "\n		", HTML.DIV({
      "class": "row"
    }, "\n			", HTML.DIV({
      "class": "col-sm-12"
    }, "\n				", HTML.TABLE({
      "class": "table",
      "data-db-table-name": "tasks"
    }, "\n					", HTML.THEAD("\n						", HTML.TR("\n							", HTML.TH({
      "data-db-row-name": "task_name"
    }, "\n								Catégorie\n							"), "\n							", HTML.TH("\n								Nom\n							"), "\n						"), "\n					"), "\n					", HTML.TBODY("\n						", Blaze.Each(function() {
      return Spacebars.call(view.lookup("tasks"));
    }, function() {
      return [ "\n							", Spacebars.include(view.lookupTemplate("taskgroup")), "\n						" ];
    }), "\n					"), "\n				"), "\n			"), "\n		"), "\n	" ];
  });
}));

Template.__checkName("taskgroup");
Template["taskgroup"] = new Template("Template.taskgroup", (function() {
  var view = this;
  return HTML.TR({
    "data-task-id": function() {
      return Spacebars.mustache(view.lookup("_id"));
    }
  }, "\n		", HTML.TD({
    "class": "td-lg"
  }, "\n			", Blaze.View("lookup:category", function() {
    return Spacebars.mustache(view.lookup("category"));
  }), "\n		"), "\n		", HTML.TD("\n			", Blaze.Each(function() {
    return Spacebars.call(view.lookup("tasks"));
  }, function() {
    return [ "\n				", Spacebars.include(view.lookupTemplate("taskitem")), "\n			" ];
  }), "\n		"), "\n	");
}));

Template.__checkName("taskitem");
Template["taskitem"] = new Template("Template.taskitem", (function() {
  var view = this;
  return HTML.TR({
    "data-task-id": function() {
      return Spacebars.mustache(view.lookup("_id"));
    }
  }, "\n		", HTML.TD({
    "class": "td-lg"
  }, "\n			", Blaze.View("lookup:name", function() {
    return Spacebars.mustache(view.lookup("name"));
  }), "\n		"), "\n		", HTML.TD("\n			", Blaze.If(function() {
    return Spacebars.call(view.lookup("isChief"));
  }, function() {
    return [ "\n				", HTML.A({
      href: function() {
        return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
          route: "task.edit",
          taskId: view.lookup("_id")
        }));
      },
      "class": "btn btn-lg btn-default"
    }, "\n					Modifier\n				"), "\n				", Blaze._TemplateWith(function() {
      return {
        method: Spacebars.call("taskDestroyer"),
        _id: Spacebars.call(view.lookup("_id"))
      };
    }, function() {
      return Spacebars.include(view.lookupTemplate("buttondestroy"));
    }), "\n			" ];
  }), "\n		"), "\n	");
}));

}).call(this);
