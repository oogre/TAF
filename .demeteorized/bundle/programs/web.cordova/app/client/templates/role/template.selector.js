(function(){
Template.__checkName("roleselector");
Template["roleselector"] = new Template("Template.roleselector", (function() {
  var view = this;
  return HTML.FIELDSET({
    "class": "row"
  }, "\n		", HTML.DIV({
    "class": "form-group col-sm-offset-2 col-sm-5"
  }, "\n			", HTML.DIV({
    "class": "input-group col-sm-12"
  }, "\n				", HTML.Raw('<label class="input-group-addon" for="role">Rôle</label>'), "\n				", HTML.SELECT({
    "class": "form-control input-lg",
    id: "role",
    name: "role"
  }, "\n					", Blaze.Each(function() {
    return Spacebars.call(view.lookup("roles"));
  }, function() {
    return [ "\n						", Spacebars.include(view.lookupTemplate("roleoption")), "\n					" ];
  }), "\n				"), "\n			"), "\n		"), "\n	");
}));

Template.__checkName("roleoption");
Template["roleoption"] = new Template("Template.roleoption", (function() {
  var view = this;
  return HTML.OPTION({
    value: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("."), "level"));
    },
    selected: function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("."), "selected"));
    }
  }, Blaze.View("lookup:..name", function() {
    return Spacebars.mustache(Spacebars.dot(view.lookup("."), "name"));
  }));
}));

}).call(this);
