 "use strict";
/*global s : false */
/*global $ : false */
/*global Works : false */
/*global Meteor : false */
/*global moment : false */
/*global Workers : false */
/*global Template : false */

Template.workeritem.helpers({
	humanizer : function(value){
		if(!value) return;
		return moment(value).format("DD/MM/YY HH:mm");
	}

})


Template.workerindex.helpers({
	workers2 : function(){
		var self = this;
		var work = Works.findOne(self.workId);

		if(!work)return [];
		work.schedule = work.schedule || [];
		var workers = work.schedule.map(function(worker){
			worker = _.extend(worker, Workers.findOne(worker.workerId));
			var timetable = worker.timetable || [];
			worker.working = _.last(timetable) && _.last(timetable).start && !_.last(timetable).stop;
			worker.schedular = true;

			return worker;
		});

		var knownId = [];
		return 	workers
				.reverse()
				.map(function(worker){
					if(_.contains(knownId, worker._id)){
						worker.schedular = false;
					}else{
						knownId.push(worker._id);
					}
					return worker;
				})
				.reverse();
	},
	workers : function(){
		var self = this;
		if(!self.worker_ids)return [];
		var work = Works.findOne(self.workId);
		if(!work)return [];
		var workers = 	Workers
						.find({
							_id : {
								$in : self.worker_ids
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
								if(self.schedular && self.schedular[worker._id]){
									self
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

		workers = self.worker_ids.map(function(id){
			return _.clone(_.find(workers, function(worker){ return worker._id  == id ; }));
		});


		var knownId = [];

		workers = workers
				.reverse()
				.map(function(worker){
					if(_.contains(knownId, worker._id)){
						delete worker.schedular;
					}else{
						knownId.push(worker._id);
					}
					return worker;
				})
				.reverse();

				console.log(workers);
				return workers;

	}
});

Template.workerindex.events({
	"click .schedule" : function(event){
		var $this = $(event.target);
		var workerId = $this.parents("[data-worker-id]").first().attr("data-worker-id");
		var workId = $this.parents("[data-work-id]").first().attr("data-work-id");
		Meteor.call("workerSchedule2", workId, workerId, ($this.hasClass("start") ? "start" : "stop"), moment().toISOString(), function(error){
			if(error) console.log(error);
		});
		return false;
	}
});
Template.workeritem.helpers({
	isEditAndDestroyVisible : function(){
		return Router.current().route._path == "/worker" && Meteor.user().profile.role >= 80;
	}
});