"use strict";
/*global _ : false */
/*global Shops : false */
/*global Wikis : false */
/*global Works : false */
/*global Roles : false */
/*global Tasks : false */
/*global Units : false */
/*global Picts : false */
/*global Meteor : false */
/*global moment : false */
/*global Matters : false */
/*global Workers : false */
/*global Modules : false */

Meteor.startup(function () {
	Meteor.publish("shops", function() {
		this.ready();
		return(Shops.find({}));
	});
	Meteor.publish("picts", function() {
		this.ready();
		return Picts.find({});
	});
	Meteor.publish("mattersOriginsUnits", function() {
		this.ready();
		return [Matters.find({}), Origins.find({}), Units.find({})];
	});
	Meteor.publish("workers", function() {
		this.ready();
		return Workers.find({});
	});

	Meteor.publish("moves", function(date){

		var date = moment(date || undefined);
		date = moment([date.year(), date.month()]);

		var start = moment(date.toISOString()).startOf('month').toISOString();
		var stop = moment(date.toISOString()).endOf('month').toISOString();
		this.ready();
		return Moves.find({
			dateTime : {
				$gte: start,
				$lte: stop
			}
		});
	}),
	Meteor.publish("works&wikis", function(data) {
		
		if(_.isObject(data)){
			var works =	Works
						.find({
							"shop._id" : data.shopId
						});
			var wikis = Wikis.find({
						_id : {
							$in : 	_(works.fetch())
									.chain()
									.pluck("wikis")
									.flatten()
									.without(undefined, null)
									.value()
						}
					});
			this.ready();
			return [works, wikis];
		}

		var date = moment(data || undefined);
		date = moment([date.year(), date.month()]);

		var start = moment(date.toISOString()).subtract(2, "month").startOf('month').toISOString();
		var stop = moment(date.toISOString()).add(1, "month").endOf('month').toISOString();

		var works =	Works
					.find({
						$or : [{
							rdv : {
								$gte: start,
								$lte: stop
							}
						},{
							end : {
								$exists: false
							}
						},{
							end : ""
						},{
							end : {
								$gte: start,
								$lte: stop
							}
						}]
					});
		var wikis = Wikis.find({
						_id : {
							$in : 	_(works.fetch())
									.chain()
									.pluck("wikis")
									.flatten()
									.without(undefined, null)
									.value()
						}
					});
		this.ready();
		return [works, wikis];
	});
	Meteor.publish("roles", function() {
		this.ready();
		return Roles.find({});
	});
	Meteor.publish("tasks", function() {
		this.ready();
		return Tasks.find({});
	});
	Meteor.publish("modules", function() {
		this.ready();
		return Modules.find({});
	});
});