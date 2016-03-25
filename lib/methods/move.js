"use strict";
/*global $ : false */
/*global Router : false */
/*global Meteor : false */
/*global Moves : false */

Meteor.methods({
	moveDestroyer: function (moveId) {
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();
		return Moves.remove(moveId);
	}
});