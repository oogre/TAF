"use strict";
/*global Router : false */
/*global Meteor : false */
/*global Session : false */

Router.configure({
	layoutTemplate: "layout"
});

Router.map(function() {
	this.route("/", function () {
		if(Meteor.user()){
			Session.set(Meteor.FILL_CONTEXT_MENU_KEY, true);
			this.render("work-index");
			this.render("work-action", {to : "action"}); //contextmenu.action
		}
		else{
			Session.set(Meteor.FILL_CONTEXT_MENU_KEY, false);
			this.render("signin");
		}
  	}, {
		name: "home"
	});

	this.route("/signout", function () {
		Session.set(Meteor.FILL_CONTEXT_MENU_KEY, false);
		Meteor.logout();
		this.redirect("/");
	},{
		name: "user.signout"
	});

	this.route("/signup", function () {
		Session.set(Meteor.FILL_CONTEXT_MENU_KEY, false);
		this.render("signup");
	}, {
		name: "user.signup"
	});


	this.route("/worker", function () {
		Session.set(Meteor.FILL_CONTEXT_MENU_KEY, true);
		this.render("workerindex");
		this.render("workeraction", {to : "action"}); //contextmenu.action
	}, {
		name: "user.index"
	});

	this.route("/worker/edit", function () {
		Session.set(Meteor.FILL_CONTEXT_MENU_KEY, false);
		this.render("workeredit");
	}, {
		name: "user.edit"
	});

	this.route("/work/new", function () {
		Session.set(Meteor.FILL_CONTEXT_MENU_KEY, false);
		switch(this.params.hash){
			case "installation" : 
				this.render("work-new-installation");
			break;
			case "maintenance" : 
				this.render("work-new-maintenance");
			break;
			default:
				this.render("work-new-depannage");
			break;
		}
	}, {
		name: "work.new"
	});
});