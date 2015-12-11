(function(){
Template.__checkName("shopform");
Template["shopform"] = new Template("Template.shopform", (function() {
  var view = this;
  return HTML.FORM({
    "class": "form-inline",
    role: "form"
  }, " \n		", HTML.INPUT({
    type: "hidden",
    id: "_id",
    name: "_id",
    value: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("shop"), "_id"));
    }
  }), "\n		", HTML.FIELDSET({
    "class": "row"
  }, "\n			", HTML.Raw('<label class="col-sm-2">Identification</label>'), "\n			", HTML.DIV({
    "class": "form-group col-sm-10"
  }, "\n				", HTML.DIV({
    "class": "input-group col-sm-12"
  }, "\n					", HTML.Raw('<label class="input-group-addon" for="tva">N°TVA</label>'), "\n					", HTML.INPUT({
    "class": "form-control input-lg",
    type: "text",
    id: "tva",
    name: "tva",
    placeholder: "ex : BE0849725938",
    value: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("shop"), "tva"));
    }
  }), "\n				"), "\n			"), "\n		"), "\n		", HTML.FIELDSET({
    "class": "row"
  }, "\n			", HTML.DIV({
    "class": "form-group col-sm-offset-2 col-sm-10"
  }, "\n				", HTML.DIV({
    "class": "input-group col-sm-12"
  }, "\n					", HTML.Raw('<label class="input-group-addon" for="brand">Enseigne</label>'), "\n					", HTML.INPUT({
    "class": "form-control input-lg",
    type: "text",
    id: "brand",
    name: "brand",
    placeholder: "ex : Point Chaud",
    value: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("shop"), "brand"));
    }
  }), "\n				"), "\n			"), "\n		"), "\n		", HTML.FIELDSET({
    "class": "row"
  }, "\n			", HTML.DIV({
    "class": "form-group col-sm-offset-2 col-sm-10"
  }, "\n				", HTML.DIV({
    "class": "input-group col-sm-12"
  }, "\n					", HTML.Raw('<label class="input-group-addon" for="name">Nom</label>'), "\n					", HTML.INPUT({
    "class": "form-control input-lg",
    type: "text",
    id: "name",
    name: "name",
    placeholder: "ex : Point Chaud Waremme",
    value: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("shop"), "name"));
    }
  }), "\n				"), "\n			"), "\n		"), HTML.Raw("\n		\n		<hr>\n\n		"), HTML.FIELDSET({
    "class": "row"
  }, "\n			", HTML.Raw('<label class="col-sm-2">Adresse</label>'), "\n			", HTML.DIV({
    "class": "form-group col-sm-10"
  }, "\n				", HTML.DIV({
    "class": "input-group col-sm-12"
  }, "\n					", HTML.Raw('<label class="input-group-addon" for="address_street">Rue</label>'), "\n					", HTML.INPUT({
    "class": "form-control input-lg",
    type: "text",
    id: "address_street",
    name: "address_street",
    placeholder: "",
    value: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("shop"), "address", "street"));
    }
  }), "\n				"), "\n			"), "\n		"), "\n		", HTML.FIELDSET({
    "class": "row"
  }, "\n			", HTML.DIV({
    "class": "form-group col-sm-offset-2 col-sm-10"
  }, "\n				", HTML.DIV({
    "class": "input-group col-sm-12"
  }, "\n					", HTML.Raw('<label class="input-group-addon" for="address_number">Numéro</label>'), "\n					", HTML.INPUT({
    "class": "form-control input-lg",
    type: "text",
    id: "address_number",
    name: "address_number",
    placeholder: "",
    value: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("shop"), "address", "number"));
    }
  }), "\n				"), "\n			"), "\n		"), "\n		", HTML.FIELDSET({
    "class": "row"
  }, "\n			", HTML.DIV({
    "class": "form-group col-sm-offset-2 col-sm-10"
  }, "\n				", HTML.DIV({
    "class": "input-group col-sm-12"
  }, "\n					", HTML.Raw('<label class="input-group-addon" for="address_city">Ville</label>'), "\n					", HTML.INPUT({
    "class": "form-control input-lg",
    type: "text",
    id: "address_city",
    name: "address_city",
    placeholder: "",
    value: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("shop"), "address", "city"));
    }
  }), "\n				"), "\n			"), "\n		"), "\n		", HTML.FIELDSET({
    "class": "row"
  }, "\n			", HTML.DIV({
    "class": "form-group col-sm-offset-2 col-sm-10"
  }, "\n				", HTML.DIV({
    "class": "input-group col-sm-12"
  }, "\n					", HTML.Raw('<label class="input-group-addon" for="address_zipcode">Code postals</label>'), "\n					", HTML.INPUT({
    "class": "form-control input-lg",
    type: "text",
    id: "address_zipcode",
    name: "address_zipcode",
    placeholder: "",
    value: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("shop"), "address", "zipcode"));
    }
  }), "\n				"), "\n			"), "\n		"), HTML.Raw('\n		\n		<hr>\n\n	\n		<fieldset class="row">\n			<label class="col-sm-2">Contacts</label>\n		</fieldset>\n		'), Blaze._TemplateWith(function() {
    return Spacebars.call(view.lookup("contacts"));
  }, function() {
    return Spacebars.include(view.lookupTemplate("shopcontacts"));
  }), HTML.Raw('\n		<fieldset class="row">\n			<div class="form-group col-sm-offset-2 col-sm-10">\n				<div class="input-group col-sm-12">\n					<button class="btn btn-lg btn-default addContact">Ajouter</button>\n				</div>\n			</div>\n		</fieldset>\n		\n		<fieldset class="row">\n			<div class="form-group col-sm-offset-2 col-sm-10">\n				<button type="submit" name="submit" class="btn btn-lg btn-block btn-primary">Enregistrer</button>\n			</div>\n		</fieldset>\n	'));
}));

}).call(this);
