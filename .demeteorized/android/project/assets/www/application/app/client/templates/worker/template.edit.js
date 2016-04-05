(function(){
Template.__checkName("workeredit");
Template["workeredit"] = new Template("Template.workeredit", (function() {
  var view = this;
  return HTML.FORM({
    "class": "form-inline",
    role: "form"
  }, " \n		", HTML.INPUT({
    type: "hidden",
    id: "_id",
    name: "_id",
    value: function() {
      return Spacebars.mustache(view.lookup("_id"));
    }
  }), "\n		", HTML.FIELDSET({
    "class": "row"
  }, "\n			", HTML.Raw('<label class="col-sm-2">Identification</label>'), "\n			", HTML.DIV({
    "class": "form-group col-sm-10"
  }, "\n				", HTML.DIV({
    "class": "input-group col-sm-12"
  }, "\n					", HTML.Raw('<label class="input-group-addon" for="firstname">Prénom</label>'), "\n					", HTML.INPUT({
    "class": "form-control input-lg",
    type: "text",
    id: "firstname",
    name: "firstname",
    value: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("profile"), "firstname"));
    }
  }), "\n				"), "\n			"), "\n		"), "\n		", HTML.FIELDSET({
    "class": "row"
  }, "\n			", HTML.DIV({
    "class": "form-group col-sm-offset-2 col-sm-10"
  }, "\n				", HTML.DIV({
    "class": "input-group col-sm-12"
  }, "\n					", HTML.Raw('<label class="input-group-addon" for="lastname">Nom</label>'), "\n					", HTML.INPUT({
    "class": "form-control input-lg",
    type: "text",
    id: "lastname",
    name: "lastname",
    value: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("profile"), "lastname"));
    }
  }), "\n				"), "\n			"), "\n		"), "\n		", HTML.FIELDSET({
    "class": "row"
  }, "\n			", HTML.DIV({
    "class": "form-group col-sm-offset-2 col-sm-10"
  }, "\n				", Blaze.Each(function() {
    return Spacebars.call(view.lookup("emails"));
  }, function() {
    return [ "\n				", HTML.DIV({
      "class": "input-group col-sm-12"
    }, "\n					", HTML.LABEL({
      "class": "input-group-addon",
      "for": "emails"
    }, "email"), "\n					", HTML.INPUT({
      "class": "form-control input-lg",
      type: "email",
      id: "emails",
      name: "emails[0].address",
      value: function() {
        return Spacebars.mustache(view.lookup("address"));
      },
      disabled: ""
    }), "\n				"), "\n				" ];
  }), "\n			"), "\n		"), HTML.Raw("\n\n		<hr>\n\n		"), Blaze._TemplateWith(function() {
    return {
      currentrole: Spacebars.call(Spacebars.dot(view.lookup("profile"), "role"))
    };
  }, function() {
    return Spacebars.include(view.lookupTemplate("roleselector"));
  }), HTML.Raw("\n\n		<hr>\n\n		"), HTML.FIELDSET({
    "class": "row"
  }, "\n			", HTML.Raw('<label class="col-sm-2">Contact</label>'), "\n			", HTML.DIV({
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
      return Spacebars.mustache(Spacebars.dot(view.lookup("profile"), "address", "street"));
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
      return Spacebars.mustache(Spacebars.dot(view.lookup("profile"), "address", "number"));
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
      return Spacebars.mustache(Spacebars.dot(view.lookup("profile"), "address", "city"));
    }
  }), "\n				"), "\n			"), "\n		"), "\n		", HTML.FIELDSET({
    "class": "row"
  }, "\n			", HTML.DIV({
    "class": "form-group col-sm-offset-2 col-sm-10"
  }, "\n				", HTML.DIV({
    "class": "input-group col-sm-12"
  }, "\n					", HTML.Raw('<label class="input-group-addon" for="address_zipcode">Code Postale</label>'), "\n					", HTML.INPUT({
    "class": "form-control input-lg",
    type: "text",
    id: "address_zipcode",
    name: "address_zipcode",
    placeholder: "",
    value: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("profile"), "address", "zipcode"));
    }
  }), "\n				"), "\n			"), "\n		"), "\n		", HTML.FIELDSET({
    "class": "row"
  }, "\n			", HTML.DIV({
    "class": "form-group col-sm-offset-2 col-sm-10"
  }, "\n				", HTML.DIV({
    "class": "input-group col-sm-12"
  }, "\n					", HTML.Raw('<label class="input-group-addon" for="address_country">Pays</label>'), "\n					", HTML.INPUT({
    "class": "form-control input-lg",
    type: "text",
    id: "address_country",
    name: "address_country",
    placeholder: "",
    value: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("profile"), "address", "country"));
    }
  }), "\n				"), "\n			"), "\n		"), "\n		", HTML.FIELDSET({
    "class": "row"
  }, "\n			", HTML.DIV({
    "class": "form-group col-sm-offset-2 col-sm-10"
  }, "\n				", HTML.DIV({
    "class": "input-group col-sm-12"
  }, "\n					", HTML.Raw('<label class="input-group-addon" for="phone">Téléphone</label>'), "\n					", HTML.INPUT({
    "class": "form-control input-lg",
    type: "text",
    id: "phone",
    name: "phone",
    placeholder: "",
    value: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("profile"), "phone"));
    }
  }), "\n				"), "\n			"), "\n		"), HTML.Raw("\n\n\n		<hr>\n		\n		"), Blaze.If(function() {
    return Spacebars.call(view.lookup("changepwd"));
  }, function() {
    return [ "\n			", HTML.FIELDSET({
      "class": "row pwd"
    }, "\n				", HTML.LABEL({
      "class": "col-sm-2"
    }, "Mot de passe"), "\n				", HTML.DIV({
      "class": "form-group col-sm-10"
    }, "\n					", HTML.DIV({
      "class": "input-group col-sm-12"
    }, "\n						", HTML.LABEL({
      "class": "input-group-addon",
      "for": "old_pwd"
    }, "Ancien mot de passe"), "\n						", HTML.INPUT({
      "class": "form-control input-lg",
      type: "password",
      id: "old_pwd",
      name: "old_pwd"
    }), "\n					"), "\n				"), "\n			"), "\n			", HTML.FIELDSET({
      "class": "row pwd"
    }, "\n				", HTML.DIV({
      "class": "form-group col-sm-offset-2 col-sm-10"
    }, "\n					", HTML.DIV({
      "class": "input-group col-sm-12"
    }, "\n						", HTML.LABEL({
      "class": "input-group-addon",
      "for": "new_pwd"
    }, "Nouveau mot de passe"), "\n						", HTML.INPUT({
      "class": "form-control input-lg",
      type: "password",
      id: "new_pwd",
      name: "new_pwd"
    }), "\n					"), "\n				"), "\n			"), "\n			", HTML.FIELDSET({
      "class": "row pwd"
    }, "\n				", HTML.DIV({
      "class": "form-group col-sm-offset-2 col-sm-10"
    }, "\n					", HTML.DIV({
      "class": "input-group col-sm-12 repwd"
    }, "\n						", HTML.LABEL({
      "class": "input-group-addon",
      "for": "re_pwd"
    }, "Réécrivez mot de passe"), "\n						", HTML.INPUT({
      "class": "form-control input-lg",
      type: "password",
      id: "re_pwd",
      name: "re_pwd"
    }), "\n					"), "\n				"), "\n			"), "\n			", HTML.FIELDSET({
      "class": "row pwd"
    }, "\n				", HTML.DIV({
      "class": "form-group col-sm-offset-2 col-sm-10"
    }, "\n					", HTML.DIV({
      "class": "input-group col-sm-12"
    }, "\n						", HTML.BUTTON({
      type: "submit",
      name: "submit",
      "class": "btn btn-lg btn-primary savepwd"
    }, "Modifier"), "\n						", HTML.BUTTON({
      "class": "btn btn-danger btn-lg changepwd"
    }, "Annuler"), "\n					"), "\n				"), "\n			"), "\n		" ];
  }, function() {
    return [ "\n			", HTML.FIELDSET({
      "class": "row pwd"
    }, "\n				", HTML.LABEL({
      "class": "col-sm-2"
    }, "Mot de passe"), "\n				", HTML.DIV({
      "class": "form-group col-sm-10"
    }, "\n						", HTML.BUTTON({
      "class": "btn btn-default btn-lg changepwd"
    }, "Changer"), "\n				"), "\n			"), "\n		" ];
  }), HTML.Raw('\n		\n		<hr>\n		\n		<fieldset class="row">\n			<div class="form-group col-sm-offset-2 col-sm-10">\n				<button type="submit" name="submit" class="btn btn-lg btn-block btn-primary updateUser">Enregistrer</button>\n			</div>\n		</fieldset>\n	'));
}));

}).call(this);
