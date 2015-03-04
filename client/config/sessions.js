"use strict";
/*global Meteor : false */
/*global Session : false */

Meteor.MENU_KEY					= "navOpen";
Meteor.CONTEXT_MENU_KEY			= "contextMenuOpen";
Meteor.FILL_CONTEXT_MENU_KEY	= "fillContextMenu";
Meteor.CHANGE_PWD_KEY			= "changepwd";
Meteor.WIKI_CURRENT_KEY			= "currentWiki";
Meteor.WIKI_OPEN_LIST			= "wikiOpenList";
Meteor.WIKI_LIST				= "wikiList";
Meteor.ADD_WORKER				= "addWorker";
Meteor.LIST_CALENDAR_SWITCHER	= "listCalSwitch";
Meteor.CONTACT_LIST				= "contactList";
Meteor.MAP_LARGE				= "mapSize";

Session.setDefault(Meteor.MENU_KEY, false);
Session.setDefault(Meteor.CONTEXT_MENU_KEY, false);
Session.setDefault(Meteor.FILL_CONTEXT_MENU_KEY, false);
Session.setDefault(Meteor.CHANGE_PWD_KEY, false);
Session.setDefault(Meteor.WIKI_CURRENT_KEY, false);
Session.setDefault(Meteor.WIKI_OPEN_LIST, false);
Session.setDefault(Meteor.WIKI_LIST, false);
Session.setDefault(Meteor.ADD_WORKER, false);
Session.setDefault(Meteor.LIST_CALENDAR_SWITCHER, false);
Session.setDefault(Meteor.CONTACT_LIST, [""]);
Session.setDefault(Meteor.MAP_LARGE, false);