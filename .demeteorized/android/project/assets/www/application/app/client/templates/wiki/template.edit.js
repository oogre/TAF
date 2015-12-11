(function(){
Template.__checkName("wikiform");
Template["wikiform"] = new Template("Template.wikiform", (function() {
  var view = this;
  return HTML.FIELDSET({
    "class": "margin-bottom"
  }, "\n			", HTML.DIV({
    "class": "input-group col-xs-12"
  }, "\n				", HTML.LABEL({
    "class": "input-group-addon",
    "for": function() {
      return Spacebars.mustache(view.lookup("wikiEdit"));
    }
  }, "Description"), "\n				", HTML.TEXTAREA({
    "class": "form-control input-lg",
    id: function() {
      return Spacebars.mustache(view.lookup("wikiEdit"));
    },
    name: function() {
      return Spacebars.mustache(view.lookup("wikiEdit"));
    },
    required: ""
  }), "\n			"), "\n	");
}));

}).call(this);
