(function(){
Template.__checkName("matterform");
Template["matterform"] = new Template("Template.matterform", (function() {
  var view = this;
  return HTML.FORM({
    "class": "form-inline",
    role: "form"
  }, " \n		", HTML.INPUT({
    type: "hidden",
    id: "_id",
    name: "_id",
    value: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("matter"), "_id"));
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
      return Spacebars.mustache(Spacebars.dot(view.lookup("matter"), "name"));
    }
  }), "\n				"), "\n			"), "\n		"), HTML.Raw("\n		\n		<hr>\n\n		"), HTML.FIELDSET({
    "class": "row"
  }, "\n			", HTML.Raw('<label class="col-sm-2">Unité</label>'), "\n			", HTML.DIV({
    "class": "form-group col-sm-10"
  }, "\n				", HTML.DIV({
    "class": "input-group col-sm-12"
  }, "\n					", HTML.Raw('<label class="input-group-addon" for="unti">Unité</label>'), "\n					", HTML.SELECT({
    "class": "form-control input-lg",
    id: "unti",
    name: "unti"
  }, "\n						", HTML.Raw('<option selected="" value="">Aucune</option>'), "\n						", Blaze.Each(function() {
    return Spacebars.call(view.lookup("units"));
  }, function() {
    return [ "\n							", HTML.OPTION({
      value: function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("."), "shortname"));
      },
      selected: function() {
        return Spacebars.mustache(Spacebars.dot(view.lookup("."), "selected"));
      }
    }, Blaze.View("lookup:..name", function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("."), "name"));
    })), "\n						" ];
  }), "\n					"), "\n				"), "\n			"), "\n		"), HTML.Raw('\n\n\n		<fieldset class="row">\n			<div class="form-group col-sm-offset-2 col-sm-10">\n				<button type="submit" name="submit" class="btn btn-lg btn-block btn-primary">Enregistrer</button>\n			</div>\n		</fieldset>\n	'));
}));

}).call(this);
