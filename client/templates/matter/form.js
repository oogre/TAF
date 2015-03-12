"use strict";
/*global _ : false */
/*global $ : false */
/*global Units : false */
/*global Router : false */
/*global Meteor : false */
/*global Modules : false */
/*global Template : false */

Template.matterform.helpers({
	units : function(){
		var self = this;
		var units = Units.find().fetch().map(function(unit){
			unit.selected = (self && self.matter && self.matter.unit === unit.shortname);
			return unit;
		});
		return units;
	},
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
						selected : self.matter && self.matter.moduletype === moduletype
					};
				})
				.sortBy(function(module){
					return module.moduletype;
				})
				.value();
	}
});
Template.matterform.events({
	"click button[type='submit']" : function(event, template){
		var button = template.find("button[type='submit']");
		var errors = template.find(".has-error");
		var _id = template.find("#_id");
		var name = template.find("#name");
		var unit = template.find("#unti");
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
			unit : unit.value,
			moduletype : moduletype.value.toLowerCase()
		};
		var next = function(error){
			if(error){
				console.log(error);
			}
			else{
				$(button)
				.removeClass("btn-primary")
				.addClass("btn-success");
				Router.go("matter.index");
			}
		};

		if(_id.value){
			Meteor.call("matterUpdator", _id.value, data, "button[type='submit']", next);
		}else{
			Meteor.call("matterCreator", data, "button[type='submit']", next);	
		}
		

		return false;
	}
});
