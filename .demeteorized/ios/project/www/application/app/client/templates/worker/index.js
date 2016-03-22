(function(){ "use strict";
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

		if(self.origine == "shop"){

			var work = Works.findOne(self.workId);

			if(!work)return [];
			work.schedule = work.schedule || [];
			var workers = work.schedule.map(function(worker){
				worker = _.extend(worker, Workers.findOne(worker.workerId));
				var timetable = worker.timetable || [];
				worker.working = _.last(timetable) && _.last(timetable).start && !_.last(timetable).stop;
				worker.schedular = true;
				worker.summary = self.summary;
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
		}else{
			return Workers.find();
		}
	},
	isEditAndDestroyVisible : function(){
		return Router.current().route._path == "/worker" && Meteor.user().profile.role >= 80;
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
	isEditAndDestroyVisible : function(){
		return Router.current().route._path == "/worker" && Meteor.user().profile.role >= 80;
	},
	humanizer : function(start, stop){
		var t = "";
		if(!start) return t ;
		t += moment(start).format("DD/MM/YY HH:mm");
		if(!stop) return t ;
		t += " - "+ moment(stop).format("DD/MM/YY HH:mm");
		return t ;
	},
	summarize : function(timetable){
		timetable = timetable || [];
		var duration = 0 ;
		for(var k =0 ; k < timetable.length ;k++){
			var start = timetable[k].start;
			var stop = timetable[k].stop || moment();
			duration += moment.duration(moment(stop).diff(moment(start))).asSeconds()
		}
		var nf = function(value, len){
			var t = value+"";
			while(t.length < len){
				t = "0"+t;
			}
			return t;
		};

		var min = ((Math.ceil(duration / 60) * 60) / 60)%60;
		var heure = Math.floor((Math.ceil(duration / 60) * 60) / 60 /60);
		
		return nf(heure, 2)+":"+nf(min, 2);
	}
});
}).call(this);
