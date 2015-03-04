/*global Works : true */
/*global Meteor : false */
/*jshint strict : false */
/*global Router : false */
/*global Shops : false */
/*global Router : false */
/*global Workers : false */
/*global console : false */
/*global Session : false */
/*global BaseController : true */
/*global RouteController : true */
/*global CleanController : true */
/*global ApplicationController : true */




var IR_BeforeHooks = {
	isLoggedIn: function(router) {
		if (!(Meteor.loggingIn() || Meteor.user())) {
			router.redirect("signin");
		}
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


/* HOME */
	Router.route("/", {
		controller : "CleanController",
		name: "home",
		action : function () {
			Session.set(Meteor.FILL_CONTEXT_MENU_KEY, true);
			this.render("work-index");
			this.render("work-action", {to : "action"}); //contextmenu.action
		}
	});


/* SIGN */
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


/* SHOP */
	Router.route("/shop", {
		controller : "CleanController",
		name: "shop.index",
		action : function () {
			Session.set(Meteor.FILL_CONTEXT_MENU_KEY, true);
			this.render("shopindex");
			this.render("shopaction", {to : "action"}); //contextmenu.action
		},
		data : function(){
			return {
				shops : Shops.find()
			};
		}
	});

	Router.route("/shop/new", {
		controller : "ApplicationController",
		name: "shop.new",
		action : function () {
			this.render("shopnew");
		}
	});

	Router.route("/shop/edit/:shopId", {
		controller : "ApplicationController",
		name: "shop.edit",
		data : function(){
			return Shops.findOne(this.params.shopId); 
		},
		action : function () {
			this.render("shopedit");
		}
	});

	Router.route("/shop/:shopId", {
		controller : "ApplicationController",
		name: "shop.view",
		data : function(){
			return Shops.findOne(this.params.shopId);
		},
		action : function () {
			this.render("shopview");
		}
	});


/* WORKER */
	Router.route("/worker", {
		controller : "CleanController",
		name: "worker.index",
		action : function () {
			Session.set(Meteor.FILL_CONTEXT_MENU_KEY, true);
			this.render("workerindex");
			this.render("workeraction", {to : "action"}); //contextmenu.action
		},
		data : function(){
			return {
				worker_ids : Workers.find().fetch().map(function(worker){return worker._id;})
			};
		}
	});

	Router.route("/worker/new", {
		controller : "ApplicationController",
		name: "user.new",
		data : function(){
			return this.params;
		},
		action : function () {
			this.render("workernew");
		}
	});

	Router.route("/worker/:workerId", {
		controller : "CleanController",
		name: "user.edit",
		data : function(){
			return Workers.findOne(this.params.workerId); 
		},
		action : function () {
			this.render("workeredit");
		}	
	});


/* WORK */
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
			Session.set(Meteor.FILL_CONTEXT_MENU_KEY, true);
			this.render("work-view");
			this.render("work-viewaction", {to : "action"}); //contextmenu.action
		}
	});
