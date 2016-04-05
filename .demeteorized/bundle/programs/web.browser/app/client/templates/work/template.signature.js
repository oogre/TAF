(function(){
Template.__checkName("workSignature");
Template["workSignature"] = new Template("Template.workSignature", (function() {
  var view = this;
  return HTML.DIV({
    "class": "popup"
  }, "\n		", HTML.DIV({
    "class": "btn-margin-bottom btn-margin-top"
  }, "\n			", HTML.Raw('<button class="btn btn-lg btn-default exit">\n				Fermer\n			</button>'), "\n			", HTML.BUTTON(HTML.Attrs({
    "class": "btn btn-lg btn-danger reset"
  }, function() {
    return Spacebars.attrMustache(view.lookup("drawn"));
  }), "\n				Effacer\n			"), "\n			", HTML.BUTTON(HTML.Attrs({
    "class": "btn btn-lg btn-primary save"
  }, function() {
    return Spacebars.attrMustache(view.lookup("drawn"));
  }), "\n				Valider\n			"), "\n		"), "\n\n		", HTML.DIV({
    "class": "input-group"
  }, "\n			", HTML.LABEL({
    "class": "input-group-addon vertical-label"
  }, HTML.DIV(Blaze.View("lookup:name", function() {
    return Spacebars.mustache(view.lookup("name"));
  }))), "\n			", HTML.Raw('<div class="modules form-control input-lg no-padding">\n				<canvas class="signature disable-swipe"></canvas>\n			</div>'), "\n		"), "\n");
}));

}).call(this);
