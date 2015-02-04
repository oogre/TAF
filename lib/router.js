"use strict";
/*global Router : false */
/*global Meteor : false */

Router.configure({
	layoutTemplate: "layout"
});

Router.map(function() {
	this.route("/", function () {
		if(Meteor.user()){
			this.render("work-index");
			this.render("work-action", {to : "action"}); //contextmenu.action
		}
		else{
			this.render("signin");
		}
  	}, {
		name: "home"
	});

	this.route("/signout", function () {
		Meteor.logout();
		this.redirect("/");
	},{
		name: "user.signout"
	});

	this.route("/signup", function () {
		this.render("signup");
	}, {
		name: "user.signup"
	});


	this.route("/worker", function () {
		this.render("workerindex");
		this.render("workeraction", {to : "action"}); //contextmenu.action
	}, {
		name: "user.index"
	});

	this.route("/worker/edit", function () {
		this.render("workeredit");
	}, {
		name: "user.edit"
	});

	this.route("/work/new", function () {
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