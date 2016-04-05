(function(){
Template.__checkName("rdvPicker");
Template["rdvPicker"] = new Template("Template.rdvPicker", (function() {
  var view = this;
  return HTML.FIELDSET({
    "class": "row"
  }, HTML.Raw('\n			<label class="col-sm-2">Planning</label>\n			'), HTML.DIV({
    "class": "form-group col-sm-10"
  }, "\n				", HTML.DIV({
    "class": "input-group col-sm-12"
  }, "\n					", HTML.LABEL({
    "class": "input-group-addon",
    "for": "rendezvous"
  }, Blaze.If(function() {
    return Spacebars.call(view.lookup("rdv"));
  }, function() {
    return "Rendez-vous";
  }, function() {
    return "Début";
  })), "\n					", HTML.INPUT({
    "class": "form-control input-lg",
    type: "text",
    name: "rendezvous",
    id: "rendezvous",
    value: "",
    "data-date-format": function() {
      return Spacebars.mustache(view.lookup("dateFormat"));
    },
    readonly: "",
    autocomplete: "off",
    required: ""
  }), "\n				"), "\n			"), "\n		");
}));

}).call(this);
