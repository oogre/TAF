(function(){"use strict";
/*global $ : false */
/*global Router : false */
/*global Meteor : false */
/*global Modules : false */

Meteor.methods({
	moduleCreator : function(module, button){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();

		var moduleId = Modules.insert(module);
		
		if(this.isSimulation){
			$(button)
			.removeClass("btn-primary")
			.addClass("btn-success");
			Router.go("module.index");
		}
		return moduleId;
	},
	moduleUpdator : function(moduleId, module, button){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();
		
		Modules.update(moduleId, module);

		if(this.isSimulation){
			$(button)
			.removeClass("btn-primary")
			.addClass("btn-success");
			Router.go("module.index");
		}
		return true;
	}
});
}).call(this);
