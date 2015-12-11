(function(){
Template.__checkName("workSignature");
Template["workSignature"] = new Template("Template.workSignature", (function() {
  var view = this;
  return [ HTML.DIV({
    "class": "btn-margin-bottom btn-margin-top"
  }, "\n		", HTML.BUTTON(HTML.Attrs({
    "class": "btn btn-lg btn-danger reset"
  }, function() {
    return Spacebars.attrMustache(view.lookup("drawn"));
  }), "\n			Effacer\n		"), "\n		", HTML.BUTTON(HTML.Attrs({
    "class": "btn btn-lg btn-primary save"
  }, function() {
    return Spacebars.attrMustache(view.lookup("drawn"));
  }), "\n			Valider\n		"), "\n	"), "\n\n	", HTML.DIV({
    "class": "input-group col-sm-12"
  }, "\n		", HTML.LABEL({
    "class": "input-group-addon vertical-label"
  }, HTML.DIV(Blaze.View("lookup:name", function() {
    return Spacebars.mustache(view.lookup("name"));
  }))), "\n		", HTML.DIV({
    "class": "modules form-control input-lg no-padding"
  }, "\n			", Blaze.If(function() {
    return Spacebars.call(view.lookup("saved"));
  }, function() {
    return [ "\n				", HTML.IMG({
      src: function() {
        return Spacebars.mustache(view.lookup("saved"));
      }
    }), "\n			" ];
  }, function() {
    return [ "\n				", HTML.CANVAS({
      "class": "signature disable-swipe"
    }), "\n			" ];
  }), "\n		"), "\n	") ];
}));

}).call(this);
