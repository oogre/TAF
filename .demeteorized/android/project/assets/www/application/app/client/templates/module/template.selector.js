(function(){
Template.__checkName("moduleselector");
Template["moduleselector"] = new Template("Template.moduleselector", (function() {
  var view = this;
  return HTML.DIV({
    "class": "input-group col-sm-12"
  }, HTML.Raw('\n		<label class="input-group-addon" for="modules">Modules</label>\n		'), HTML.SELECT({
    "class": "form-control input-lg",
    id: "modules",
    name: "modules",
    "data-shopid": function() {
      return Spacebars.mustache(view.lookup("shopId"));
    }
  }, "\n			", HTML.Raw('<option disabled="" selected="" value="">Ajouter</option>'), "\n			", Blaze.Each(function() {
    return Spacebars.call(view.lookup("modules"));
  }, function() {
    return [ "\n				", HTML.OPTION({
      value: function() {
        return Spacebars.mustache(view.lookup("id"));
      }
    }, Blaze.If(function() {
      return Spacebars.call(view.lookup("serial"));
    }, function() {
      return [ Blaze.View("lookup:serial", function() {
        return Spacebars.mustache(view.lookup("serial"));
      }), " : " ];
    }), Blaze.View("lookup:type", function() {
      return Spacebars.mustache(view.lookup("type"));
    }), " - ", Blaze.View("lookup:name", function() {
      return Spacebars.mustache(view.lookup("name"));
    })), "\n			" ];
  }), "\n		"), "\n	");
}));

}).call(this);
