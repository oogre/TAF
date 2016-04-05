(function(){"use strict";
/*global $ : false */

/*global Works : false */
/*global Router : false */
/*global Meteor : false */
/*global moment : false */
/*global Session : false */
/*global console : false */
/*global Template : false */


Template["work-viewaction"].events({
	"click .workClose" : function(){
		var sefl = this;
		Meteor.call("workCloser", this._id, moment().toISOString(), function(error, data){
			if(error) return Session.set("errorMessage", error.reason );
			Session.set(Meteor.CONTEXT_MENU_KEY, false);
			Router.go("work.show", {workId : sefl._id});
			Session.set("successMessage", data );
		});
		return false;
	},
	"click .workReopen" : function(){
		Meteor.call("workReopener", this._id, function(error, data){
			if(error) return Session.set("errorMessage", error.reason );
			Session.set(Meteor.CONTEXT_MENU_KEY, false);
			Router.go("work.show", {workId : sefl._id});
			Session.set("successMessage", data );
		});
		return false;
	},
	
	"click .print" : function(){
		Meteor.call("workToPdf", this._id, function(err, file){
			if(err) return console.error(err);
			else window.open(file);
		});
		return false;
	}

});
}).call(this);
