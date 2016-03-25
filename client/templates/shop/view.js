"use strict";
/*global _ : false */
/*global Modules : false */
/*global Template : false */


Template.shopview.created = function(){
	Session.set(Meteor.LIST_CALENDAR_SWITCHER, true);
}
Template.shopview.rendered = function(){
	
}
Template.shopview.destroyed = function(){
	Session.set(Meteor.LIST_CALENDAR_SWITCHER, false);	
}

Template.shopview.events({
	"click .workToPdf" : function(event){
		var workId = $(event.target).attr("data-work-id");

		Meteor.call("workToPdf", workId, function(err, file){
			if(err)console.error(err);
			else window.open(file);
		});
	},
	"click .maintenanceToPdf" : function(event){
		var workId = $(event.target).attr("data-work-id");
		Meteor.call("maintenanceToPdf", workId, function(err, file){
			if(err)console.error(err);
			else window.open(file);
		});
	},
});

Template.shopview.helpers({
	zone : function(){
		var zone = this.shop.zone || Meteor.timeDistToZone(this.shop.timeDist);

		if(!this.shop.zone && zone){
			Shops.update(this.shop._id, {
				$set : {
					zone : zone
				}
			});
		}


		return " Zone : "+ zone;
	},
	location : function(){
		return this.shop.location;
	},
	modules : function(){
		if(this.shop.modules){
			return	_
					.chain(
						this.shop.modules
					)
					.groupBy(function(module){
						if(module)
							return module.type;
					})
					.map(function(modules,key){
						if(modules)
							return {
								type: key, 
								modules: modules.map(function(module){
									module.view = true;
									return module;
								})
							};
					})
					.sortBy(function(modules){
						if(modules)
							return modules.type;
					})
					.value();
		}
	}
});