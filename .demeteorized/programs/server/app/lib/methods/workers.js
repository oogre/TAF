(function(){"use strict";
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
		return Workers.remove(workerid);
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
			var url = "https://passwordwolf.com/api/?upper=off&special=off&length=10&repeat=1";



			HTTP.get(url, {
				followRedirects : true
			}, function (error, result) {
				if(error) myFuture.throw(error);
				if(result.statusCode != 200) myFuture.throw(new Meteor.Error("statusCode-"+result.statusCode));
				try{
					var body = JSON.parse(result.content);
					worker.password = body[0].password;

					var account = Accounts.createUser(worker);

					Email.send({
						to: worker.email,
						from: "robot@taf.com",
						subject: "Welcom on TAF",
						text: "GO and connect on TAF. email : "+worker.email+" password : "+worker.password
					});

					myFuture.return(account);
				}catch(e){
					myFuture.throw(new Meteor.Error("statusCode-"+result.statusCode));
				}
			});
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
		//STOP WORKER WORKING AT ANY WORK 
		Works
		.find({
			$where : function(){
				return _.find(this.schedular[workerId], function(schedule){
					return schedule.start && !schedule.stop;
				});
			}
		})
		.fetch()
		.map(function(work){
			var schedular = work.schedular || {};
			schedular[workerId] = schedular[workerId] || [];
			schedular[workerId] =	schedular[workerId]
									.map(function(schedule){
										schedule.stop = schedule.stop || datetime;
										return schedule;
									});
			Works
			.update(work._id, {
				$set : {
					schedular : schedular
				}
			});
		});
		
		//START WORKER WORKING
		var work = Works.findOne(workId);
		var schedular = work.schedular || {};
		schedular[workerId] = schedular[workerId] || [];
		if(action === "start"){
			schedular[workerId].push({
				start : datetime
			});
		}

		Workers.update(workerId, {
			$set : {
				working : (action === "start")
			}
		});
		return Works.update(workId, {$set : {schedular : schedular}});
	}
});

})();
