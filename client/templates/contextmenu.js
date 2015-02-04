
"use strict";
/*global Template : false */
/*global Session : false */

var CONTEXT_MENU_KEY = "contextMenuOpen";

Template.contextmenu.events({
  "click a": function() {
    Session.set(CONTEXT_MENU_KEY, false);
  }
});
