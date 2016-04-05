(function(){
Template.__checkName("moduleform");
Template["moduleform"] = new Template("Template.moduleform", (function() {
  var view = this;
  return HTML.FORM({
    "class": "form-inline",
    role: "form"
  }, " \n		", HTML.INPUT({
    type: "hidden",
    id: "_id",
    name: "_id",
    value: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("module"), "_id"));
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
      return Spacebars.mustache(Spacebars.dot(view.lookup("module"), "name"));
    }
  }), "\n				"), "\n			"), "\n		"), "\n		", HTML.FIELDSET({
    "class": "row"
  }, "\n			", HTML.DIV({
    "class": "form-group col-sm-offset-2 col-sm-10"
  }, "\n				", HTML.DIV({
    "class": "input-group col-sm-12"
  }, "\n					", HTML.Raw('<label class="input-group-addon" for="type">Type</label>'), "\n					", HTML.INPUT({
    "class": "typeahead input-lg",
    name: "type",
    id: "type",
    type: "text",
    value: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("module"), "type"));
    },
    autocomplete: "off",
    spellcheck: "off",
    "data-source": "types",
    "data-highlight": "true"
  }), "\n				"), "\n			"), "\n		"), HTML.Raw('\n\n		<hr>\n\n		<fieldset class="row">\n			<div class="form-group col-sm-offset-2 col-sm-10">\n				<button type="submit" name="submit" class="btn btn-lg btn-block btn-primary">Enregistrer</button>\n			</div>\n		</fieldset>\n	'));
}));

}).call(this);
