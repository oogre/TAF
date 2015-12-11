(function(){
Template.__checkName("shopnew");
Template["shopnew"] = new Template("Template.shopnew", (function() {
  var view = this;
  return [ HTML.Raw("<h3>Créer un Magasin/Client</h3>\n	<hr>\n	"), Spacebars.include(view.lookupTemplate("shopform")) ];
}));

}).call(this);
