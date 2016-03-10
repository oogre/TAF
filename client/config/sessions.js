"use strict";
/*global Meteor : false */
/*global Session : false */
/*global moment : false */


Meteor.PAGE_TITLE				= "pageTitle";
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
Meteor.MAP_ROUTING				= "mapRouting";
Meteor.MAP_FOLLOW_CENTER		= "mapFollowCenter";
Meteor.MAP_READY				= "mapReady";
Meteor.MAP_ROUTING_DURATION		= "mapRoutingDuration";
Meteor.MODULE_OPEN				= "modulOpen";
Meteor.NEW_SHOP_KEY				= "newShopKey";
Meteor.SHOP_ID					= "shopId";
Meteor.TASK_INPUT_TEXT			= "taskInputText";
Meteor.MODULE_SELECTED			= "moduleSelected";
Meteor.TASK_SELECTED			= "taskSelected";
Meteor.ADD_MODULE				= "addModule";
Meteor.CALENDAR_CONF			= "currentDate";
Meteor.SIGNATURE				= "signature";
Meteor.MATTER					= "matter";
Meteor.PWD_ERROR				= "pwdError";
Meteor.USER_ERROR				= "userError";
Meteor.DATE_CONF				= "dateConf";
Meteor.SIGNATURE_OPEN			= "signatureOpen";
Meteor.SIGNATURE_NAMED			= "signatureNamed";
Meteor.ORIGIN_REF				= "originRef";

Session.setDefault(Meteor.PAGE_TITLE, false);
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
Session.setDefault(Meteor.MAP_ROUTING, null);
Session.setDefault(Meteor.MAP_FOLLOW_CENTER, true);
Session.setDefault(Meteor.MAP_READY, false);
Session.setDefault(Meteor.MAP_ROUTING_DURATION, false);
Session.setDefault(Meteor.MODULE_OPEN, false);
Session.setDefault(Meteor.NEW_SHOP_KEY, false);
Session.setDefault(Meteor.SHOP_ID, false);
Session.setDefault(Meteor.TASK_INPUT_TEXT, false);
Session.setDefault(Meteor.MODULE_SELECTED, false);
Session.setDefault(Meteor.TASK_SELECTED, {});
Session.setDefault(Meteor.ADD_MODULE, false);
Session.setDefault(Meteor.MATTER, false);
Session.setDefault(Meteor.PWD_ERROR, false);
Session.setDefault(Meteor.USER_ERROR, false);
Session.setDefault(Meteor.SIGNATURE, {});
Session.setDefault(Meteor.SIGNATURE_OPEN, false);
Session.setDefault(Meteor.SIGNATURE_NAMED, 0);
Session.setDefault(Meteor.ORIGIN_REF, "");
Session.setDefault(Meteor.DATE_CONF, moment().toISOString());
Session.set(Meteor.DATE_CONF, moment().toISOString());
Session.setDefault(Meteor.CALENDAR_CONF, {
	defaultDate : moment().toISOString(),
	defaultView : "basicDay"
});
Session.set(Meteor.CALENDAR_CONF, {
	defaultDate : moment().toISOString(),
	defaultView : "basicDay"
});

