(function(){
Template.__checkName("wikilist");
Template["wikilist"] = new Template("Template.wikilist", (function() {
  var view = this;
  return HTML.FIELDSET({
    "class": "margin-top"
  }, "\n		", HTML.DIV({
    "class": "input-group col-xs-12"
  }, "\n			", HTML.UL({
    "class": "list-unstyled wikilist"
  }, "\n				", Blaze.Each(function() {
    return Spacebars.call(view.lookup("wikis"));
  }, function() {
    return [ "\n					", HTML.LI("\n						", HTML.FIELDSET({
      "class": "row"
    }, "\n							", HTML.DIV({
      "class": "form-group col-xs-12"
    }, "\n								", HTML.DIV({
      "class": "input-group col-xs-12"
    }, "\n									", Blaze.If(function() {
      return Spacebars.call(view.lookup("removable"));
    }, function() {
      return [ "\n										", HTML.DIV({
        "class": "pull-right"
      }, "\n											", Blaze._TemplateWith(function() {
        return {
          method: Spacebars.call("wikiDestroyer"),
          _id: Spacebars.call(view.lookup("_id"))
        };
      }, function() {
        return Spacebars.include(view.lookupTemplate("buttondestroy"));
      }), "\n										"), "\n									" ];
    }), "\n									", HTML.DIV({
      "class": "wiki-created"
    }, "\n										", Blaze.View("lookup:createdAt", function() {
      return Spacebars.mustache(view.lookup("createdAt"));
    }), "\n									"), "							\n									", HTML.DIV({
      "class": "wiki-desc"
    }, "\n										", Blaze.View("lookup:description", function() {
      return Spacebars.mustache(view.lookup("description"));
    }), "\n									"), "\n									\n								"), "\n							"), "\n						"), "	\n					"), "\n				" ];
  }), "\n			"), "\n		"), "\n	");
}));

}).call(this);
