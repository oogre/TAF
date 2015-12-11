(function(){
Template.__checkName("shopaction");
Template["shopaction"] = new Template("Template.shopaction", (function() {
  var view = this;
  return [ HTML.Raw("<h3>Créer/Rechercher un Magasin/Client</h3>\n	"), HTML.UL({
    "class": "list-unstyled text-center"
  }, "\n		", HTML.LI("\n			", HTML.A({
    "class": "btn btn-lg btn-block btn-default",
    href: function() {
      return Spacebars.mustache(view.lookup("pathFor"), Spacebars.kw({
        route: "shop.new"
      }));
    }
  }, "Créer"), "\n		"), "\n		", HTML.LI("\n			", HTML.DIV({
    "class": "input-group col-sm-12"
  }, "\n				", HTML.Raw('<label class="input-group-addon" for="reasearch"><i class="fa fa-search"></i></label>'), "\n				", HTML.INPUT({
    "class": "form-control input-lg",
    type: "text",
    id: "reasearch",
    name: "reasearch",
    value: function() {
      return Spacebars.mustache(view.lookup("search"));
    }
  }), "\n				", HTML.Raw('<span class="input-group-btn">\n					<button class="btn btn-lg btn-default" data-target="input[name=\'reasearch\']" data-action="clear" type="button"><i class="fa fa-times"></i></button>\n				</span>'), "\n			"), "\n		"), "			\n	") ];
}));

}).call(this);
