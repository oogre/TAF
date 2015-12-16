(function(){/*global _ : true */
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
		Session.set(Meteor.ADD_WORKER, false);
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
















}).call(this);
