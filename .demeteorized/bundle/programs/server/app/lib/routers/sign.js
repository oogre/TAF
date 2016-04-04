(function(){/* SIGN */

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
}).call(this);
