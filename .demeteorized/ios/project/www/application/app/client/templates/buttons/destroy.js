(function(){ "use strict";
/*global _ : false */
/*global $ : false */
/*global Meteor : false */
/*global Template : false */

Template.buttondestroy.events({

	"click button.btn-danger" : function(event){
		if(window.prompt("Ecrivez \"SUPPRIMER\" : ")==="SUPPRIMER"){
			var _id = $(event.target).attr("data-id");
			var method = $(event.target).attr("data-method");
			var selector = $(event.target).attr("data-selector");
			if(_.isJson(selector)){
				selector = JSON.parse(selector);
				Meteor.call(method, selector, function(error, data){
					if(error) return Session.set("errorMessage", error);
					Session.set("successMessage", data);
				});
			}
			else{
				Meteor.call(method, _id, function(error, data){
					if(error) return Session.set("errorMessage", error);
					Session.set("successMessage", data);
				});
			}
		}
		return false;		
	}
});

}).call(this);
