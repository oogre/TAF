(function(){
Template.__checkName("position");
Template["position"] = new Template("Template.position", (function() {
  var view = this;
  return [ Blaze.If(function() {
    return Spacebars.call(view.lookup("mapReady"));
  }, function() {
    return [ "\n		", HTML.DIV({
      "class": "btn-margin-bottom"
    }, "\n			", HTML.BUTTON({
      "class": "btn btn-lg btn-default mapSizer"
    }, "\n				", Blaze.If(function() {
      return Spacebars.call(view.lookup("isLarge"));
    }, function() {
      return "\n					Rétrécir\n				";
    }, function() {
      return "\n					Agrandir\n				";
    }), "\n			"), "\n			", Blaze.If(function() {
      return Spacebars.call(view.lookup("routingReady"));
    }, function() {
      return [ "\n				", HTML.BUTTON({
        "class": "btn btn-lg btn-default mapRouting"
      }, "\n					Commencer\n				"), "\n			" ];
    }, function() {
      return [ "\n				", HTML.BUTTON({
        "class": "btn btn-lg btn-default mapRouter"
      }, "\n					Itinéraire\n				"), "\n			" ];
    }), "\n			", Blaze.Unless(function() {
      return Spacebars.call(view.lookup("followCenter"));
    }, function() {
      return [ "\n				", HTML.BUTTON({
        "class": "btn btn-lg btn-default mapResume"
      }, "\n					Recentrer\n				"), "\n			" ];
    }), "\n		"), "\n	" ];
  }), "\n	", Blaze.If(function() {
    return Spacebars.call(view.lookup("duration"));
  }, function() {
    return [ "\n		", HTML.DIV({
      "class": "col-sm-12 btn-margin-bottom"
    }, "\n			Vous vous trouvez à ", Blaze.View("lookup:duration", function() {
      return Spacebars.mustache(view.lookup("duration"));
    }), " de votre destination\n		"), "\n	" ];
  }), HTML.Raw('\n	<div id="map-canvas" class="disable-swipe"></div>') ];
}));

}).call(this);
