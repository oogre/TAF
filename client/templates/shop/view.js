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
			window.open(file);
		});
	},
	"click .maintenanceToPdf" : function(event){
		var workId = $(event.target).attr("data-work-id");

		Meteor.call("maintenanceToPdf", workId, function(err, file){
			if(err)console.error(err);
			window.open(file);
		});
	},
})
Template.shopview.helpers({
	location : function(){
		return this.location;
	},
	modules : function(){
		if(this.modules){
			return	_
					.chain(
						this.modules
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
	},
	works : function(){
		var tmp = _
				.chain(
					Works
					.find({
						"shop._id" : this._id
					}, {
						sort : {
							rdv : -1
						}
					})
					.fetch()
				)
				.map(function(work){
					work.rdv = moment(work.rdv).format("DD/MM/YY HH:mm");
					return work;
				})
				.groupBy(function(work){
					return work.end;
				})
				.value();
				var unfinished = tmp.undefined || [];
				var torun = [];
				unfinished = 	unfinished
								.map(function(work){
									
									if( _
										.chain(work.schedular)
										.keys()
										.map(function(worker){
											return  work.schedular[worker].length > 0;
										})
										.some()
										.value()
									){
										return work;
									}else{
										torun.push(work);
										return false;
									}
								});
				unfinished = _.compact(unfinished)

				delete tmp.undefined;		
		return{
			torun : torun.reverse(),
			unfinished : unfinished,
			finished : 	_
						.chain(tmp)
						.values()
						.flatten()
						.map(function(work){
							work.depannage = work.type == "dépannage";
							work.installation = work.type == "installation";
							work.entretien = work.type == "maintenance";
							return work;
						})
						.value()
		};
		
		
				; 
	},
});