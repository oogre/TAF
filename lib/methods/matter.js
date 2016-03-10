"use strict";
/*global $ : false */
/*global Router : false */
/*global Meteor : false */
/*global Matters : false */

Meteor.methods({
	matterCreator : function(matter, button){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();

		var matterId = Matters.insert(matter);
		
		if(this.isSimulation){
			$(button)
			.removeClass("btn-primary")
			.addClass("btn-success");
			Router.go("matter.index");
		}
		return matterId;
	},
	matterDestroyer: function (matterId) {
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();
		return Matters.remove(matterId);
	},
	matterUpdator : function(matterId, matter, button){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();
		
		Matters.update(matterId, matter);

		if(this.isSimulation){
			$(button)
			.removeClass("btn-primary")
			.addClass("btn-success");
			Router.go("matter.index");
		}
		return true;
	},
	addOriginToMatter : function(matterId, ref){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();
		Origins.insert({
			ref : ref,
			matter : matterId
		});

		return true;
	},
	matterOriginsTransfert : function(quantity, originId, destinyId, dateTime){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();
		if(!originId || !destinyId)return false;
		Moves.insert({
			originId : originId,
			destinyId : destinyId,
			dateTime : dateTime,
			quantity : quantity
		});
	}
});