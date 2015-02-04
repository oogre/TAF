"use strict";
/*global Meteor : false */
/*global Session : false */


if(Meteor.isClient){
	Meteor.MENU_KEY 				= "navOpen";
	Meteor.CONTEXT_MENU_KEY 		= "contextMenuOpen";
	Meteor.FILL_CONTEXT_MENU_KEY 	= "fillContextMenu";
	Meteor.NEW_SHOP_KEY 			= "newShop";
	Meteor.CHANGE_PWD_KEY 			= "changepwd";

	Session.setDefault(Meteor.MENU_KEY, false);
	Session.setDefault(Meteor.CONTEXT_MENU_KEY, false);
	Session.setDefault(Meteor.FILL_CONTEXT_MENU_KEY, false);
	Session.setDefault(Meteor.CHANGE_PWD_KEY, false);
	Session.setDefault(Meteor.CHANGE_PWD_KEY, false);
}