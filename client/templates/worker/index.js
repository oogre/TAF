 "use strict";
/*global s : false */
/*global $ : false */
/*global Works : false */
/*global Meteor : false */
/*global moment : false */
/*global Workers : false */
/*global Template : false */

Template.workerindex.helpers({
	workers : function(){
		var self = this;
		if(!this.worker_ids)return [];
		var work = Works.findOne(self.workId);
		return 	Workers
				.find({
					_id : {
						$in : this.worker_ids
					}
				})
				.fetch()
				.map(function(worker){
					if(self.schedular){
						worker.schedular = self.schedular;
						if(work.schedular && work.schedular[worker._id]){
							var current = work.schedular[worker._id].pop();
							worker.working = current ? !current.stop : false;
						}
					}
					if(self.schedularSummary){
						var currentDuration =	moment.duration();
						if(work.schedular && work.schedular[worker._id]){
							work
							.schedular[worker._id]
							.map(function(schedule){
								return moment(schedule.stop).diff(moment(schedule.start));
							})
							.map(function(duration){
								currentDuration.add(duration);
							});
						}
						worker.schedularSummary = s.pad(Math.floor(currentDuration.asHours()), 2, "0")+":"+s.pad(currentDuration.minutes(), 2, "0");
					}
					return worker;
				});
	}
});

Template.workerindex.events({
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
Template.workeritem.helpers({
	actions : function(){
		return !this.schedularSummary && !this.schedular && Meteor.user().profile.role >= 80;
	}
});