"use strict";
/*global $ : false */
/*global Hammer : false */
/*global Meteor : false */
/*global Session : false */
/*global Template : false */



Meteor.startup(function () {
  // set up a swipe left / right handler
  
  new Hammer(document.body, {
    swipe_velocity : 0.10 // px/ms
  })
  .on("swipeleft", function(event) {
    if($(event.target).parents(".disable-swipe").length>0 || $(event.target).hasClass("disable-swipe")){
      return false;
    }
    Session.set(Meteor.MENU_KEY, false);
  })
  .on("swiperight", function(event) {
    if($(event.target).parents(".disable-swipe").length>0 || $(event.target).hasClass("disable-swipe")){
      return false;
    }
    Session.set(Meteor.MENU_KEY, true);
  })
  .on("swipedown", function() {
    if(Session.get(Meteor.FILL_CONTEXT_MENU_KEY) && $(".cbp-spmenu-push").get(0).scrollTop === 0)
        Session.set(Meteor.CONTEXT_MENU_KEY, true);
  })
  .on("swipeup", function() {
   if(Session.get(Meteor.FILL_CONTEXT_MENU_KEY))
        Session.set(Meteor.CONTEXT_MENU_KEY, false);
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
      $(".cbp-spmenu-push").one("scroll", function(){
        Session.set(Meteor.CONTEXT_MENU_KEY, false);
      });
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
  },
  title : function(){
    return Session.get(Meteor.PAGE_TITLE) || "Gestion DU Travail : Atelier du Froid";
  },
  absoluteUrl : function(){
    return Meteor.absoluteUrl();
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