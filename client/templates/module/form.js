"use strict";
/*global _ : false */
/*global $ : false */
/*global Router : false */
/*global Meteor : false */
/*global Modules : false */
/*global Template : false */

Template.moduleform.rendered = function(){
	// initializes all typeahead instances
	Meteor.typeahead.inject();
	$(".twitter-typeahead").addClass("form-control");
};

Template.moduleform.helpers({
	types : function(){
		return 	_
				.chain(Modules.find().fetch())
				.groupBy(function(module){ 
					return module.type;
				})
				.keys()
				.value();
	}
});

Template.moduleform.events({
	"click button[type='submit']" : function(event, template){
		var button = template.find("button[type='submit']");
		var errors = template.find(".has-error");
		var _id = template.find("#_id");
		var name = template.find("#name");
		var type = template.find("#type");
		
		$(errors)
		.removeClass("has-error");

		var validation = function(element){
			if(!element.value){
				$(element)
				.parent()
				.addClass("has-error");
				return true;
			}
			return false;
		};
		
		if( validation(name) || validation(type)){
			return false;
		}

		var data = {
			name : name.value.toLowerCase(),
			type : type.value.toLowerCase()
		};
		var next = function(error, data){
			if(error) return Session.set("errorMessage", error.reason);
			Session.set("successMessage", data);
			$(button)
			.removeClass("btn-primary")
			.addClass("btn-success");
			Router.go("module.index");
		};

		if(_id.value) Meteor.call("moduleUpdator", _id.value, data, "button[type='submit']", next);
		else Meteor.call("moduleCreator", data, "button[type='submit']", next);

		return false;

	}
});
