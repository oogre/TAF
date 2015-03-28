"use strict";
/*global $ : false */
/*global Shops : false */
/*global Meteor : false */
/*global Router : false */
/*global moment : false */
/*global Session : false */
/*global console : false */
/*global Template : false */

Template["work-new"].helpers({
	rendezvous : function(){
		if(this.hash === "installation" ) return true;
		return false;
	},
	planner : function(){
		if(this.hash === "maintenance" ) return true;
		return false;
	},
	worker : function(){
		if(this.hash === "dépannage" ) return true;
		return false;
	},
	shop : function(){
		if(Session.get(Meteor.SHOP_ID)){
			return Shops.findOne(Session.get(Meteor.SHOP_ID));
		}
	}
});

Template["work-new"].events({
	"click .workSave" : function(event, template){

		$.when(
			Template.shopselector.shop(template, function(error){
				if(error) return console.log(error);
			}),

			Template.rdvPicker.date(template, function(error){
				if(error) return console.log(error);
			}),

			Template.rdvPlanner.dates(template, function(error){
				if(error) return console.log(error);
			}),

			Template.workerselector.workers(template, function(error){
				if(error) return console.log(error);
			})
		)
		.done(function(shop, rdvPicker, rdvPlanner, workers){
			var rdv = rdvPicker ? rdvPicker : rdvPlanner;
			rdv = rdv || moment().toISOString();
			Session.set(Meteor.WIKI_CURRENT_KEY, false);

			var modules = Template.workmodule.modules();

			Meteor.call("workCreator", shop, template.find("#workType").value, rdv, workers, modules, function(error, workId){
				if(error) return console.log(error);
				Router.go("work.show", {workId : workId});
			});
		});
		return false;

	}
});