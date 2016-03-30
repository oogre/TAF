"use strict";
/*global _ : false */
/*global $ : false */
/*global Npm : false */
/*global HTTP : false */
/*global Email : false */
/*global Works : false */
/*global Router : false */
/*global Meteor : false */
/*global Workers : false */
/*global Accounts : false */


Meteor.methods({
	workerUpdator: function (workerid, worker) {
		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();
		return Workers.update(workerid, {$set : {profile : worker}});
	},
	workerDestroyer: function (workerid) {
		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();
		Workers.remove(workerid);
		if(Meteor.isSimulation){
			Session.set("successMessage", "Le travailleur à été supprimé" );
		}
		return "Le travailleur à été supprimé";
	},
	workerCreator: function (worker, button) {
		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();

		if(Meteor.isServer){
			var Future = Npm.require("fibers/future");
			var myFuture = new Future();
			//var url = "https://passwordwolf.com/api/?upper=off&special=off&length=10&repeat=1";



			//HTTP.get(url, {
			//	followRedirects : true
			//}, function (error, result) {
				//if(error) myFuture.throw(error);
				//if(result.statusCode != 200) myFuture.throw(new Meteor.Error("statusCode-"+result.statusCode));
				//try{
					//var body = JSON.parse(result.content);
					worker.password = "gdutaf";

					var account = Accounts.createUser(worker);

					/*Email.send({
						to: worker.email,
						from: "robot@taf.com",
						subject: "Welcom on TAF",
						text: "GO and connect on TAF. email : "+worker.email+" password : "+worker.password
					});*/

					myFuture.return(account);
				//}catch(e){
				//	myFuture.throw(new Meteor.Error("statusCode-"+result.statusCode));
				//}
			//});
			return myFuture.wait();
		}
		
		if(this.isSimulation){
			$(button)
			.removeClass("btn-primary")
			.addClass("btn-success");
			Router.go("home");
		}
	},
	workerSchedule : function( workId, workerId, action, datetime){
		this.unblock();
		Works
		.find({
			$where : function(){
				return _.find(this.schedule, function(item){
					var timetable = item.timetable || [];
					return item.workerId === workerId && _.last(timetable) && _.last(timetable).start && !_.last(timetable).stop ;
				});
			}
		})
		.fetch()
		.map(function(work){
			var schedule = work.schedule || [];
			for(var k = schedule.length-1 ; k >= 0 ; k -- ){
				if(!_.isArray(schedule[k].timetable))continue;
				var timetable = schedule[k].timetable || [];
				if(schedule[k].workerId == workerId && _.last(timetable) && _.last(timetable).start && !_.last(timetable).stop){
					schedule[k].timetable[schedule[k].timetable.length-1].stop = datetime;
					break;
				}
			}
			Works
			.update(work._id, {
				$set : {
					schedule : schedule
				}
			});
			
		});
		/**/


		//START WORKER WORKING
		var work = Works.findOne(workId);
		if(!work) return false;
		var schedule = work.schedule || [];

		if(action === "start"){
			for(var k = schedule.length-1 ; k >= 0 ; k -- ){
				if(schedule[k].workerId === workerId && !schedule[k].start){
					schedule[k].timetable = schedule[k].timetable || [];
					schedule[k].timetable.push({start : datetime});
					break;
				}
			}
		}
		
		Workers.update(workerId, {
			$set : {
				working : action === "start" ? workId : false
			}
		});

		Works.update(workId, {
			$set : {
				schedule : schedule
			}
		});
		/**/
	}
});