(function(){
Template.__checkName("taskform");
Template["taskform"] = new Template("Template.taskform", (function() {
  var view = this;
  return HTML.FORM({
    "class": "form-inline",
    role: "form"
  }, " \n		", HTML.INPUT({
    type: "hidden",
    id: "_id",
    name: "_id",
    value: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("task"), "_id"));
    }
  }), "\n		", HTML.FIELDSET({
    "class": "row"
  }, "\n			", HTML.Raw('<label class="col-sm-2">Identification</label>'), "\n			", HTML.DIV({
    "class": "form-group col-sm-10"
  }, "\n				", HTML.DIV({
    "class": "input-group col-sm-12"
  }, "\n					", HTML.Raw('<label class="input-group-addon" for="name">Nom</label>'), "\n					", HTML.INPUT({
    "class": "form-control input-lg",
    type: "text",
    id: "name",
    name: "name",
    value: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("task"), "name"));
    }
  }), "\n				"), "\n			"), "\n		"), "\n		", HTML.FIELDSET({
    "class": "row"
  }, "\n			", HTML.DIV({
    "class": "form-group col-sm-offset-2 col-sm-10"
  }, "\n				", HTML.DIV({
    "class": "input-group col-sm-12"
  }, "\n					", HTML.Raw('<label class="input-group-addon" for="value">Champ texte</label>'), "\n					", HTML.BUTTON({
    id: "value",
    "class": function() {
      return [ "btn btn-lg btn-default btn-block checkbox ", Spacebars.mustache(view.lookup("checked")) ];
    }
  }, "\n						", HTML.Raw('<i class="fa fa-2x fa-square-o"></i>'), "\n						", HTML.Raw('<i class="fa fa-2x fa-check-square-o"></i>'), "\n					"), "\n				"), "\n			"), "\n		"), HTML.Raw("\n		\n		<hr>\n\n		"), HTML.FIELDSET({
    "class": "row"
  }, "\n			", HTML.Raw('<label class="col-sm-2">Catégories</label>'), "\n			", HTML.DIV({
    "class": "form-group col-sm-10"
  }, "\n				", HTML.DIV({
    "class": "input-group col-sm-12"
  }, "\n					", HTML.Raw('<label class="input-group-addon" for="moduletype">Catégories</label>'), "\n					", HTML.SELECT({
    "class": "form-control input-lg",
    id: "moduletype",
    name: "moduletype"
  }, "\n						", HTML.Raw('<option selected="" value="">Aucune</option>'), "\n						", Blaze.Each(function() {
    return Spacebars.call(view.lookup("moduletypes"));
  }, function() {
    return [ "\n							", HTML.OPTION({
      value: function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("."), "moduletype"));
      },
      selected: function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("."), "selected"));
      }
    }, Blaze.View("lookup:..moduletype", function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("."), "moduletype"));
    })), "\n						" ];
  }), "\n					"), "\n				"), "\n			"), "\n		"), HTML.Raw('\n\n		<fieldset class="row">\n			<div class="form-group col-sm-offset-2 col-sm-10">\n				<button type="submit" name="submit" class="btn btn-lg btn-block btn-primary">Enregistrer</button>\n			</div>\n		</fieldset>\n	'));
}));

}).call(this);
