 "use strict";
/*global Workers : false */
/*global Works : false */
/*global Meteor : false */
/*global Template : false */
/*global moment : false */
/*global $ : false */

Template.workerlist.helpers({
	
	workers : function(){
		var self = this;
		if(!this.worker_ids)return [];

		return Workers.find({_id : {$in : this.worker_ids}}).fetch().map(function(worker){
			if(self.schedular){
				var work = Works.findOne(self.workId);
				worker.schedular = self.schedular;
				if(work.schedular && work.schedular[worker._id]){
					var current = work.schedular[worker._id].pop();
					worker.working = current ? !current.stop : false;
				}
			}
			return worker;
		});
	}
});

Template.workerlist.events({
	"click .schedule" : function(event){
		var $this = $(event.target);
		var workerId = $this.parents("[data-worker-id]").first().attr("data-worker-id");
		var workId = $this.parents("[data-work-id]").first().attr("data-work-id");
		Meteor.call("workerSchedule", workId, workerId, ($this.hasClass("start") ? "start" : "stop"), moment().toISOString(), function(error){
			if(error) console.log(error);
		});
		return false;
	}
});