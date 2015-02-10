/*jshint strict : false */
/*global Router : false */
/*global console : false */
/*global Meteor : false */
/*global Session : false */
/*global RouteController : true */
/*global BaseController : true */
/*global ApplicationController : true */
/*global CleanController : true */
/*global Works : true */


var IR_BeforeHooks = {
	isLoggedIn: function(router) {
		if (!Meteor.user()) {
			router.redirect("signin");
		}
	},
	resetWiki: function() { 
		Session.set(Meteor.WIKI_OLD_KEY, Session.get(Meteor.WIKI_CURRENT_KEY));
		Session.set(Meteor.WIKI_CURRENT_KEY, false);

		Session.set(Meteor.ADD_WORKER, false);
	},
	resetMenu: function() { 
		Session.set(Meteor.FILL_CONTEXT_MENU_KEY, false);
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
		IR_BeforeHooks.isLoggedIn(this);
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


Router.route("/signout", {
	controller : "CleanController",
	name: "user.signout",
	action : function () {
		Meteor.logout();
		this.redirect("/");
	}
});


Router.route("/signup", {
	controller : "BaseController",
	name: "user.signup",
	action : function () {
		this.render("signup");
	}
});


Router.route("/signin", {
	controller : "BaseController",
	name: "signin",
	action : function () {
		this.render("signin");
	}
});


Router.route("/", {
	controller : "CleanController",
	name: "home",
	action : function () {
		Session.set(Meteor.FILL_CONTEXT_MENU_KEY, true);
		this.render("work-index");
		this.render("work-action", {to : "action"}); //contextmenu.action
	}
});


Router.route("/worker", {
	controller : "CleanController",
	name: "user.index",
	action : function () {
		Session.set(Meteor.FILL_CONTEXT_MENU_KEY, true);
		this.render("workerindex");
		this.render("workeraction", {to : "action"}); //contextmenu.action
	}	
});


Router.route("/worker/edit", {
	controller : "CleanController",
	name: "user.edit",
	action : function () {
		this.render("workeredit");
	}	
});


Router.route("/work/new", {
	controller : "ApplicationController",
	name: "work.new",
	data : function(){
		return this.params;
	},
	action : function () {
		this.render("work-new");
	}
});


Router.route("/work/:workId", {
	controller : "ApplicationController",
	name: "work.show",
	data : function(){
		return Works.findOne(this.params.workId); 
	},
	action : function () {
		this.render("work-view");
	}
});