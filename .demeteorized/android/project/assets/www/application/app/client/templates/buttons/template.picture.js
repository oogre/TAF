(function(){
Template.__checkName("buttonpicture");
Template["buttonpicture"] = new Template("Template.buttonpicture", (function() {
  var view = this;
  return Blaze.If(function() {
    return Spacebars.call(view.lookup("isMobile"));
  }, function() {
    return [ "\n		", HTML.BUTTON({
      "class": "btn btn-default btn-lg photoShoot btn-margin-bottom"
    }, "Prendre une photo"), "\n	" ];
  }, function() {
    return [ "\n		", HTML.SPAN({
      "class": "btn btn-default btn-lg btn-file photoLoad"
    }, "Ajouter images\n			", HTML.INPUT({
      type: "file",
      multiple: ""
    }), "\n		"), "\n	" ];
  });
}));

}).call(this);
