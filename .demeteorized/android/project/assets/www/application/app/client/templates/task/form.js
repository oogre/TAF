(function(){"use strict";
/*global _ : false */
/*global $ : false */
/*global Router : false */
/*global Meteor : false */
/*global Session : false */
/*global Modules : false */
/*global Template : false */

Template.taskform.destroyed = function(){
	Session.set(Meteor.TASK_INPUT_TEXT, false);
};
Template.taskform.rendered = function(){
	// initializes all typeahead instances
	Meteor.typeahead.inject();
	$(".twitter-typeahead").addClass("form-control");
};

Template.taskform.helpers({
	moduletypes : function(){
		var self = this;
		return 	_
				.chain(Modules.find().fetch())
				.groupBy(function(module){ 
					return module.type;
				})
				.keys()
				.map(function(moduletype){
					return {
						moduletype : moduletype,
						selected : self.task && self.task.moduletype === moduletype
					};
				})
				.sortBy(function(module){
					return module.moduletype;
				})
				.value();
	},
	checked : function(){
		return Session.get(Meteor.TASK_INPUT_TEXT) ? "checked" : "";
	}
});
Template.taskform.events({
	"click #value" : function(){
		Session.set(Meteor.TASK_INPUT_TEXT, !Session.get(Meteor.TASK_INPUT_TEXT));
		return false;
	},
	"click button[type='submit']" : function(event, template){
		var button = template.find("button[type='submit']");
		var errors = template.find(".has-error");
		var _id = template.find("#_id");
		var name = template.find("#name");
		var value = template.find("#value");
		var moduletype = template.find("#moduletype");
		
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
		
		if( validation(name)){
			return false;
		}
		var data = {
			name : name.value.toLowerCase(),
			value : $(value).hasClass("checked"),
			moduletype : moduletype.value.toLowerCase()
		};
		var next = function(error, data){
			if(error) return Session.set("errorMessage", error.reason);
			
			$(button)
			.removeClass("btn-primary")
			.addClass("btn-success");
			Router.go("task.index");
			Session.set("successMessage", data);
		};

		if(_id.value){
			Meteor.call("taskUpdator", _id.value, data, "button[type='submit']", next);
		}else{
			Meteor.call("taskCreator", data, "button[type='submit']", next);	
		}
		

		return false;
	}
});

}).call(this);
