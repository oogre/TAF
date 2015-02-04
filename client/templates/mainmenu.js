
"use strict";
/*global Meteor : false */
/*global Session : false */
/*global Template : false */



Template.mainmenu.events({
  "click a": function() {
    Session.set(Meteor.MENU_KEY, false);
    Session.set(Meteor.CONTEXT_MENU_KEY, false);
  },
});