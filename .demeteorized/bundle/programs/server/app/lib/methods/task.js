(function(){"use strict";
/*global $ : false */
/*global Router : false */
/*global Meteor : false */
/*global Tasks : false */

Meteor.methods({
	taskCreator : function(task, button){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();

		var taskId = Tasks.insert(task);
		
		if(this.isSimulation){
			$(button)
			.removeClass("btn-primary")
			.addClass("btn-success");
			Router.go("task.index");
		}
		return taskId;
	},
	taskUpdator : function(taskId, task, button){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();
		
		Tasks.update(taskId, task);

		if(this.isSimulation){
			$(button)
			.removeClass("btn-primary")
			.addClass("btn-success");
			Router.go("task.index");
		}
		return true;
	}
});
}).call(this);

//# sourceMappingURL=task.js.map
