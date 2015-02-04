"use strict";
/*global Template : false */
/*global Session : false */
/*global Meteor : false */
/*global $ : false */

var MENU_KEY = "navOpen";
Session.setDefault(MENU_KEY, false);

var CONTEXT_MENU_KEY = "contextMenuOpen";
Session.setDefault(CONTEXT_MENU_KEY, false);

Meteor.startup(function () {
  // set up a swipe left / right handler
  $(document.body).touchwipe({
    wipeLeft: function () {
      Session.set(MENU_KEY, false);
    },
    wipeRight: function () {
      Session.set(MENU_KEY, true);
    },
    wipeBottom: function () {
      Session.set(CONTEXT_MENU_KEY, true);
    },
    wipeTop: function () {
      Session.set(CONTEXT_MENU_KEY, false);
    },
    preventDefaultEvents: false
  });
});

Template.layout.helpers({
  menuOpen: function() {
    return Session.get(MENU_KEY) ? function(){
      Session.set(CONTEXT_MENU_KEY, false);
      return "cbp-spmenu-open";
    }() : "";
  },
  contextMenuOpen: function() {
    return Session.get(CONTEXT_MENU_KEY) ? function(){
      Session.set(MENU_KEY, false);
      return "cbp-spmenu-open";
    }() : "";
  },
  pushToRight : function(){
    return Session.get(MENU_KEY) ? "cbp-spmenu-push-toright" : "";
  },
  pushToBottom : function(){
    return Session.get(CONTEXT_MENU_KEY) ? "cbp-spmenu-push-tobottom" : "";
  },
  isMenuOpen : function(){
    return Session.get(MENU_KEY) ? "active" : "";
  },
  isContextMenuOpen : function(){
    return Session.get(CONTEXT_MENU_KEY) ? "active" : "";
  }
});

Template.layout.events({
  "click .toggle-main-menu": function() {
    Session.set(MENU_KEY, ! Session.get(MENU_KEY));
  },
  "click .toggle-context-menu": function() {
    Session.set(CONTEXT_MENU_KEY, ! Session.get(CONTEXT_MENU_KEY));
  }
});