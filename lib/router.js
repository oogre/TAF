/*global Works : true */
/*global Shops : false */
/*global Tasks : false */
/*global Meteor : false */
/*jshint strict : false */
/*global Router : false */
/*global Modules : false */
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
		controller : "CleanController",
		name: "shop.edit",
		data : function(){
			return Shops.findOne(this.params.shopId); 
		},
		action : function () {
			Session.set(Meteor.FILL_CONTEXT_MENU_KEY, true);
			this.render("shopedit");
			this.render("shopeditaction", {to : "action"}); //contextmenu.action
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

	Router.route("/shop/module/:shopId", {
		controller : "ApplicationController",
		name: "shop.module",
		data : function(){
			return {
				shop : Shops.findOne(this.params.shopId),
				modules : Modules.find()
			};
		},
		action : function () {
			this.render("shopmodule");
		}
	});

/* MODULES */
	Router.route("/module/new", {
		controller : "ApplicationController",
		name: "module.new",
		data : function(){
			return {
				tasks : Tasks.find().fetch()
			};
		},
		action : function () {
			this.render("modulenew");
		}
	});

	Router.route("/module", {
		controller : "CleanController",
		name: "module.index",
		data : function(){
			return Modules.find().fetch();
		},
		action : function () {
			Session.set(Meteor.FILL_CONTEXT_MENU_KEY, true);
			this.render("moduleindex");
			this.render("moduleaction", {to : "action"}); //contextmenu.action
		}
	});

/* TASKS */
	Router.route("/task/new", {
		controller : "ApplicationController",
		name: "task.new",
		action : function () {
			this.render("tasknew");
		}
	});

	Router.route("/task", {
		controller : "CleanController",
		name: "task.index",
		data : function(){
			return Tasks.find().fetch();
		},
		action : function () {
			Session.set(Meteor.FILL_CONTEXT_MENU_KEY, true);
			this.render("taskindex");
			this.render("taskaction", {to : "action"}); //contextmenu.action
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

	Router.route("/worker/edit/:workerId", {
		controller : "CleanController",
		name: "user.edit",
		data : function(){
			return Workers.findOne(this.params.workerId); 
		},
		action : function () {
			this.render("workeredit");
		}	
	});


	Router.route("/worker/:workerId", {
		controller : "CleanController",
		name: "user.view",
		data : function(){
			return Workers.findOne(this.params.workerId); 
		},
		action : function () {
			this.render("workerview");
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
