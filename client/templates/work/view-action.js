"use strict";
/*global $ : false */

/*global Works : false */
/*global Router : false */
/*global Meteor : false */
/*global moment : false */
/*global Session : false */
/*global console : false */
/*global Template : false */

Template["work-viewaction"].helpers({
	reopenable : function(){
		if(Meteor.isChief()){
			var work = Works.findOne(this._id);
			//if( !work || !work.signatures || !work.signatures.client || !work.signatures.adf){
				
			//}
			return true;
		}
		Session.set(Meteor.FILL_CONTEXT_MENU_KEY, false);
		return false;
	}
});

Template["work-viewaction"].events({
	"click .workClose" : function(){
		var workId = $("[data-work-id]").first().attr("data-work-id");
		Meteor.call("workCloser", workId, moment().toISOString(), function(error){
			if(error) return console.log(error);
			Session.set(Meteor.CONTEXT_MENU_KEY, false);
			Router.go("work.show", {workId : workId});
		});
		return false;
	},
	"click .workReopen" : function(){
		var workId = $("[data-work-id]").first().attr("data-work-id");
		Meteor.call("workReopener", workId, function(error){
			if(error) return console.log(error);
			Session.set(Meteor.CONTEXT_MENU_KEY, false);
			Router.go("work.show", {workId : workId});
		});
		return false;
	},
	"click .workDestructor" : function(){
		var workId = $("[data-work-id]").first().attr("data-work-id");
		Meteor.call("workDestructor", workId, function(error){
			if(error) return console.log(error);
			Session.set(Meteor.CONTEXT_MENU_KEY, false);
			Router.go("home");
		});
	}
});