(function(){
Template.__checkName("workmodules");
Template["workmodules"] = new Template("Template.workmodules", (function() {
  var view = this;
  return HTML.DIV({
    "class": "input-group col-sm-12"
  }, HTML.Raw('\n		<label class="input-group-addon vertical-label"><div>Meubles<br>Chambre</div></label>\n		'), HTML.DIV({
    "class": "modules form-control input-lg"
  }, "\n			", Blaze.Each(function() {
    return Spacebars.call(view.lookup("workModules"));
  }, function() {
    return [ "\n				", Spacebars.include(view.lookupTemplate("workmodule")), "\n			" ];
  }), "\n		"), "\n	");
}));

Template.__checkName("workmodule");
Template["workmodule"] = new Template("Template.workmodule", (function() {
  var view = this;
  return HTML.DIV({
    id: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("."), "key"));
    },
    "class": function() {
      return [ "module ", Spacebars.mustache(view.lookup("moduleSelected")), " ", Spacebars.mustache(view.lookup("moduleOpened")), " ", Spacebars.mustache(view.lookup("taskCompleted")) ];
    }
  }, "\n		", HTML.HEADER("\n			", Blaze.If(function() {
    return Spacebars.call(view.lookup("serial"));
  }, function() {
    return [ Blaze.View("lookup:serial", function() {
      return Spacebars.mustache(view.lookup("serial"));
    }), " : " ];
  }), Blaze.View("lookup:type", function() {
    return Spacebars.mustache(view.lookup("type"));
  }), " - ", Blaze.View("lookup:name", function() {
    return Spacebars.mustache(view.lookup("name"));
  }), HTML.Raw("&emsp;"), HTML.Raw('<i class="fa fa-caret-down"></i>'), HTML.Raw('<i class="fa fa-caret-right"></i>'), "\n		"), "\n		", Blaze.If(function() {
    return Spacebars.call(view.lookup("moduleSelected"));
  }, function() {
    return [ "\n			", HTML.SECTION("\n				", HTML.DIV({
      "class": "input-group col-sm-12"
    }, "\n					", HTML.LABEL({
      "class": "input-group-addon",
      "for": "selected"
    }, "Tâches"), "\n					", Blaze._TemplateWith(function() {
      return {
        key: Spacebars.call(view.lookup("key")),
        taskIds: Spacebars.call(view.lookup("taskIds"))
      };
    }, function() {
      return Spacebars.include(view.lookupTemplate("taskselector"));
    }), "\n				"), "\n			"), "\n		" ];
  }), "\n		", Blaze.If(function() {
    return Spacebars.call(view.lookup("moduleOpened"));
  }, function() {
    return [ "\n			", HTML.SECTION("\n				", Blaze.Each(function() {
      return Spacebars.call(view.lookup("tasks"));
    }, function() {
      return [ "\n					", HTML.FIELDSET({
        "class": "row"
      }, "\n						", HTML.DIV({
        "class": "form-group col-sm-12"
      }, "\n							", HTML.DIV({
        "class": "input-group col-sm-12"
      }, "\n								", HTML.LABEL({
        "class": "input-group-addon",
        "for": function() {
          return [ Spacebars.mustache(view.lookup("moduleKey")), "_", Spacebars.mustache(view.lookup("_id")) ];
        }
      }, Blaze.View("lookup:name", function() {
        return Spacebars.mustache(view.lookup("name"));
      })), "\n								", Blaze.If(function() {
        return Spacebars.call(view.lookup("value"));
      }, function() {
        return [ "\n									", HTML.INPUT(HTML.Attrs({
          "class": "form-control input-lg",
          type: "number",
          id: function() {
            return [ Spacebars.mustache(view.lookup("moduleKey")), "_", Spacebars.mustache(view.lookup("_id")) ];
          },
          name: "checkbox",
          value: function() {
            return Spacebars.mustache(view.lookup("checked"), view.lookup("moduleKey"), view.lookup("_id"));
          }
        }, function() {
          return Spacebars.attrMustache(view.lookup("disabled"));
        })), "\n								" ];
      }, function() {
        return [ "\n									", HTML.BUTTON(HTML.Attrs({
          id: function() {
            return [ Spacebars.mustache(view.lookup("moduleKey")), "_", Spacebars.mustache(view.lookup("_id")) ];
          },
          "class": function() {
            return [ "btn btn-lg btn-default btn-block checkbox ", Spacebars.mustache(view.lookup("checked"), view.lookup("moduleKey"), view.lookup("_id")) ];
          }
        }, function() {
          return Spacebars.attrMustache(view.lookup("disabled"));
        }), "\n										", HTML.I({
          "class": "fa fa-2x fa-square-o"
        }), "\n										", HTML.I({
          "class": "fa fa-2x fa-check-square-o"
        }), "\n									"), "\n								" ];
      }), "\n							"), "\n						"), "\n					"), "\n				" ];
    }), "\n			"), "\n		" ];
  }), "\n	");
}));

}).call(this);
