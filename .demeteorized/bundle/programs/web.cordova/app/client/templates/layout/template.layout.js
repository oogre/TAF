(function(){
Template.__checkName("layout");
Template["layout"] = new Template("Template.layout", (function() {
  var view = this;
  return [ HTML.NAV({
    "class": function() {
      return [ "cbp-spmenu cbp-spmenu-horizontal cbp-spmenu-top ", Spacebars.mustache(view.lookup("contextMenuOpen")) ];
    },
    id: "cbp-spmenu-s3"
  }, "\n		", Spacebars.include(view.lookupTemplate("contextmenu")), "\n	"), "\n	", HTML.NAV({
    "class": function() {
      return [ "cbp-spmenu cbp-spmenu-vertical cbp-spmenu-left ", Spacebars.mustache(view.lookup("menuOpen")) ];
    },
    id: "cbp-spmenu-s1"
  }, "\n		", Spacebars.include(view.lookupTemplate("mainmenu")), "\n	"), "\n	", HTML.DIV({
    "class": function() {
      return [ "cbp-spmenu-push ", Spacebars.mustache(view.lookup("pushToRight")), " ", Spacebars.mustache(view.lookup("pushToBottom")) ];
    }
  }, "\n		", HTML.HEADER({
    "class": "navbar navbar-static-top bs-docs-nav",
    id: "top",
    role: "banner"
  }, "\n			", HTML.DIV({
    "class": "navbar-header"
  }, "\n				", HTML.BUTTON({
    type: "button",
    "class": function() {
      return [ "pull-left btn-lg btn btn-default toggle-main-menu ", Spacebars.mustache(view.lookup("isMenuOpen")) ];
    }
  }, "\n					", HTML.Raw('<i class="fa fa-2x fa-bars"></i>'), "\n				"), "\n				", HTML.BUTTON({
    type: "button",
    "class": function() {
      return [ "pull-left btn-lg btn btn-default toggle-context-menu ", Spacebars.mustache(view.lookup("isContextMenuOpen")), " ", Blaze.Unless(function() {
        return Spacebars.call(view.lookup("isContextMenu"));
      }, function() {
        return "hide";
      }) ];
    }
  }, "\n					", HTML.Raw('<i class="fa fa-2x fa-cog"></i>'), "\n				"), "\n				", HTML.H3({
    "class": "text-center"
  }, Blaze.View("lookup:title", function() {
    return Spacebars.mustache(view.lookup("title"));
  })), "\n			"), "\n		"), "\n		", HTML.Raw("<hr>"), "\n		", HTML.DIV({
    "class": "container main"
  }, "\n			", HTML.SECTION("	\n				", Spacebars.include(view.lookupTemplate("yield")), "\n			"), "\n		"), "\n	") ];
}));

}).call(this);
