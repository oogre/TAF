(function(){
Template.__checkName("pictureList");
Template["pictureList"] = new Template("Template.pictureList", (function() {
  var view = this;
  return HTML.UL({
    "class": "list-inline pictureList"
  }, "\n		", Blaze.Each(function() {
    return Spacebars.call(view.lookup("."));
  }, function() {
    return [ "\n			", HTML.LI("\n				", HTML.IMG({
      src: function() {
        return Spacebars.mustache(view.lookup("."));
      },
      alt: function() {
        return Spacebars.mustache(view.lookup("."));
      },
      "class": "img-responsive img-thumbnail"
    }), "\n			"), "\n		" ];
  }), "\n	");
}));

}).call(this);
