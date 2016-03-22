(function(){"use strict";
/*global $ : false */
/*global Router : false */
/*global Meteor : false */
/*global Origins : false */

Meteor.methods({
	originDestroyer : function(originId){
	if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();
		return Origins.remove(originId);	
	}
});
}).call(this);

//# sourceMappingURL=origins.js.map
