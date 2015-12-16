(function(){/* WORKER */

Router.route("/worker", {
	controller : "CleanController",
	name: "worker.index",
	action : function () {
		Session.set(Meteor.PAGE_TITLE, "List des travailleurs");
		this.render("workerindex");
		if(Meteor.isBoss()){
			Session.set(Meteor.FILL_CONTEXT_MENU_KEY, true);
			this.render("workeraction", {to : "action"}); //contextmenu.action
		}
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
		Session.set(Meteor.PAGE_TITLE, "Nouveau travailleurs");
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
		var data = this.data();
		if(data){
			Session.set(Meteor.PAGE_TITLE, "Editer la fiche de : "+s.capitalize(data.profile.firstname)+" "+s.capitalize(data.profile.lastname));	
		}
		this.render("workeredit");
	}	
});



Router.route("/worker/:workerId", {
	controller : "CleanController",
	name: "worker.view",
	data : function(){
		return Workers.findOne(this.params.workerId); 
	},
	action : function () {
		var data = this.data();
		if(data){
			Session.set(Meteor.PAGE_TITLE, s.capitalize(data.profile.firstname)+" "+s.capitalize(data.profile.lastname));	
		}
		this.render("workerview");
	}	
});
}).call(this);
