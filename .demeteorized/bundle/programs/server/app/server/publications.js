(function(){"use strict";
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
		return(Shops.find({}));
	});
	Meteor.publish("picts", function() {
		return Picts.find({});
	});
	Meteor.publish("mattersOriginsUnits", function() {
		return [Matters.find({}), Origins.find({}), Units.find({}), Moves.find({})];
	});
	Meteor.publish("workers", function() {
		return Workers.find({});
	});
	Meteor.publish("works&wikis", function(date) {
		var start = moment(date).subtract(1, "month").toISOString();
		var stop = moment(date).add(1, "month").toISOString();
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
		return [works, wikis];
	});
	Meteor.publish("roles", function() {
		return Roles.find({});
	});
	Meteor.publish("tasks", function() {
		return Tasks.find({});
	});
	Meteor.publish("modules", function() {
		return Modules.find({});
	});
});
}).call(this);

//# sourceMappingURL=publications.js.map
