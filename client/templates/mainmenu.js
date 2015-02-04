
"use strict";
/*global Template : false */
/*global Session : false */

var MENU_KEY = "navOpen";

Template.mainmenu.events({
  "click a": function() {
    Session.set(MENU_KEY, false);
  },
});