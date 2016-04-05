(function(){
Template.__checkName("shopcontacts");
Template["shopcontacts"] = new Template("Template.shopcontacts", (function() {
  var view = this;
  return Blaze.Each(function() {
    return Spacebars.call(view.lookup("."));
  }, function() {
    return [ "\n		", HTML.FIELDSET({
      "class": "row"
    }, "\n			", HTML.DIV({
      "class": "form-group col-sm-offset-2 col-sm-10"
    }, "\n				", HTML.DIV({
      "class": "input-group col-sm-12"
    }, "\n					", HTML.LABEL({
      "class": "input-group-addon"
    }, "Contact"), "\n					", HTML.INPUT({
      "class": "form-control input-lg",
      type: "text",
      name: "contact",
      placeholder: "",
      value: function() {
        return Spacebars.mustache(view.lookup("."));
      }
    }), "\n				"), "\n			"), "\n		"), "\n	" ];
  });
}));

}).call(this);
