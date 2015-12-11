(function(){
Template.__checkName("buttondestroy");
Template["buttondestroy"] = new Template("Template.buttondestroy", (function() {
  var view = this;
  return Blaze.If(function() {
    return Spacebars.call(view.lookup("isBoss"));
  }, function() {
    return [ "\n		", HTML.BUTTON({
      "class": "btn btn-lg btn-danger",
      "data-method": function() {
        return Spacebars.mustache(view.lookup("method"));
      },
      "data-id": function() {
        return Spacebars.mustache(view.lookup("_id"));
      },
      "data-selector": function() {
        return Spacebars.mustache(view.lookup("selector"));
      }
    }, HTML.I({
      "class": "fa fa-trash"
    })), "\n	" ];
  });
}));

}).call(this);
