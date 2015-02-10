"use strict";
/*global Template : false */
/*global Session : false */
/*global Meteor : false */
/*global $ : false */



Meteor.startup(function () {
  // set up a swipe left / right handler
  $(document.body).touchwipe({
    wipeLeft: function () {
      Session.set(Meteor.MENU_KEY, false);
    },
    wipeRight: function () {
      Session.set(Meteor.MENU_KEY, true);
    },
    wipeUp : function () {
      if(Session.get(Meteor.FILL_CONTEXT_MENU_KEY))
        Session.set(Meteor.CONTEXT_MENU_KEY, true);
    },
    wipeDown: function () {
      if(Session.get(Meteor.FILL_CONTEXT_MENU_KEY))
        Session.set(Meteor.CONTEXT_MENU_KEY, false);
    },
    preventDefaultEvents: false
  });
});

Template.layout.helpers({
  menuOpen: function() {
    return Session.get(Meteor.MENU_KEY) ? function(){
      Session.set(Meteor.CONTEXT_MENU_KEY, false);
      return "cbp-spmenu-open";
    }() : "";
  },
  contextMenuOpen: function() {
    return Session.get(Meteor.CONTEXT_MENU_KEY) ? function(){
      Session.set(Meteor.MENU_KEY, false);
      return "cbp-spmenu-open";
    }() : "";
  },
  pushToRight : function(){
    return Session.get(Meteor.MENU_KEY) ? "cbp-spmenu-push-toright" : "";
  },
  pushToBottom : function(){
    return Session.get(Meteor.CONTEXT_MENU_KEY) ? "cbp-spmenu-push-tobottom" : "";
  },
  isMenuOpen : function(){
    return Session.get(Meteor.MENU_KEY) ? "active" : "";
  },
  isContextMenuOpen : function(){
    return Session.get(Meteor.CONTEXT_MENU_KEY) ? "active" : "";
  },
  isContextMenu : function(){
    return Session.get(Meteor.FILL_CONTEXT_MENU_KEY);
  }
});

Template.layout.events({
  "click .toggle-main-menu": function() {
    Session.set(Meteor.MENU_KEY, ! Session.get(Meteor.MENU_KEY));
  },
  "click .toggle-context-menu": function() {
    Session.set(Meteor.CONTEXT_MENU_KEY, ! Session.get(Meteor.CONTEXT_MENU_KEY));
  }
});