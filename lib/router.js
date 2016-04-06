/*global _ : true */
/*global s : true */
/*global Picts : true */
/*global Works : true */
/*global Wikis : true */
/*global Shops : false */
/*global Tasks : false */
/*global Meteor : false */
/*jshint strict : false */
/*global Router : false */
/*global Modules : false */
/*global Matters : false */
/*global Workers : false */
/*global console : false */
/*global Session : false */
/*global BaseController : true */
/*global RouteController : true */
/*global CleanController : true */
/*global ApplicationController : true */


var IR_BeforeHooks = {
	isLoggedIn: function(router) {
		return Meteor.loggingIn() || Meteor.user()
	},
	resetWiki: function() { 
		Session.set(Meteor.WIKI_CURRENT_KEY, false);
		Session.set(Meteor.WIKI_OPEN_LIST, false);
		Session.set(Meteor.WIKI_LIST, false);
	},
	resetMenu: function() { 
		Session.set(Meteor.FILL_CONTEXT_MENU_KEY, false);
		if(Router.current().route._path != "/shop"){
			Session.set(Meteor.CONTEXT_MENU_KEY, false);
		}
		Session.set(Meteor.SUCCESS_MESSAGE, false);
		Session.set(Meteor.ERROR_MESSAGE, false);

		Session.set(Meteor.ADD_WORKER, false);
		/*Session.set(Meteor.MAP_LARGE, false);
   		Session.set(Meteor.MAP_FOLLOW_CENTER, true);
   		Session.set(Meteor.MAP_READY, false);
   		Session.set(Meteor.MAP_ROUTING_DURATION, false);
   		Session.set(Meteor.MAP_ROUTING, false);
   		Session.set(Meteor.ORIGIN_REF, "");
   		Session.set(Meteor.MODULE_OPEN, false);
   		Session.set(Meteor.MATTER, false);
   		Session.set(Meteor.USER_ERROR, false);
 		Session.set(Meteor.PWD_ERROR, false);
 		Session.set(Meteor.CONTACT_LIST , [""]);
 		Session.set(Meteor.SHOP_ID, false);
 		Session.set(Meteor.NEW_SHOP_KEY, false);
 		Session.set(Meteor.TASK_INPUT_TEXT, false);
 		Session.set(Meteor.WIKI_OPEN_LIST, false);
 		Session.set(Meteor.SHOP_ID, false);
   		Session.set(Meteor.ADD_MODULE, false);
   		Session.set(Meteor.ADD_MATTER, false);
   		Session.set(Meteor.WIKI_CURRENT_KEY, false);
   		Session.set(Meteor.SIGNATURE, {});
   		Session.set(Meteor.SIGNATURE_OPEN, false);
   		Session.set(Meteor.SIGNATURE_NAMED, 0);
   		Session.set(Meteor.TASK_SELECTED, {});
   		Session.set(Meteor.MODULE_SELECTED, false);
   		Session.set(Meteor.CHANGE_PWD_KEY, false);*/
	}
};

BaseController = RouteController.extend({
	layoutTemplate: "layout",
	before: function () {
		IR_BeforeHooks.resetMenu();
		this.next();
	},
	action: function () {
		console.log("this should be overridden!");
	}
});

ApplicationController = BaseController.extend({
	before: function () {
		if( ! IR_BeforeHooks.isLoggedIn()){
			this.redirect("signin");
		}
		this.next();
	},
	action: function () {
		console.log("this should be overridden!");
	}
});

CleanController = ApplicationController.extend({
	before: function () {
		IR_BeforeHooks.resetWiki();
		this.next();
	},
});

Router.configure({
});
// FOR SPECIFIC ROUTES TAKE A LOOK IN lib/routers/[model].js















