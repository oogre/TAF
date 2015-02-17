"use strict";
/*global Meteor : false */
/*global Session : false */

Meteor.MENU_KEY					= "navOpen";
Meteor.CONTEXT_MENU_KEY			= "contextMenuOpen";
Meteor.FILL_CONTEXT_MENU_KEY	= "fillContextMenu";
Meteor.CHANGE_PWD_KEY			= "changepwd";
Meteor.WIKI_CURRENT_KEY			= "currentWiki";
Meteor.ADD_WORKER				= "addWorker";
Meteor.LIST_CALENDAR_SWITCHER	= "listCalSwitch";
Meteor.CONTACT_LIST				= "contactList";

Session.setDefault(Meteor.MENU_KEY, false);
Session.setDefault(Meteor.CONTEXT_MENU_KEY, false);
Session.setDefault(Meteor.FILL_CONTEXT_MENU_KEY, false);
Session.setDefault(Meteor.CHANGE_PWD_KEY, false);
Session.setDefault(Meteor.WIKI_CURRENT_KEY, false);
Session.setDefault(Meteor.ADD_WORKER, false);
Session.setDefault(Meteor.LIST_CALENDAR_SWITCHER, false);
Session.setDefault(Meteor.CONTACT_LIST, [""]);