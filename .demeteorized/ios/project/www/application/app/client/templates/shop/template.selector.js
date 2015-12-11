(function(){
Template.__checkName("shopselector");
Template["shopselector"] = new Template("Template.shopselector", (function() {
  var view = this;
  return [ HTML.Raw('<label class="col-sm-2">Client/Magasin</label>\n	<div class="form-group col-sm-10">\n		<div class="input-group col-sm-12">\n			<label class="input-group-addon" for="shopName">Nom</label>\n\n			<input class="typeahead input-lg" name="shopName" id="shopName" type="text" placeholder="Client/Magasin" autocomplete="off" spellcheck="off" data-source="shops" data-highlight="true" required="">\n		</div>\n	</div>\n'), Blaze.If(function() {
    return Spacebars.call(view.lookup("newShop"));
  }, function() {
    return [ "\n	", HTML.DIV({
      "class": "form-group col-sm-offset-2 col-sm-10"
    }, "\n		", HTML.DIV({
      "class": "input-group col-sm-12"
    }, "\n			", HTML.LABEL({
      "class": "input-group-addon",
      "for": "contact"
    }, "Contact"), "\n			", HTML.INPUT({
      type: "text",
      "class": "form-control input-lg",
      id: "contact",
      name: "contact",
      autocomplete: "off",
      required: ""
    }), "\n		"), "\n	"), "\n" ];
  }) ];
}));

}).call(this);
