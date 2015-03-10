"use strict";
/*global _ : false */
/*global Works : false */
/*global Router : false */
/*global Meteor : false */


Meteor.methods({
/* WORK */
	workCreator : function(shop, type, rdv, workers, modules, wiki){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();
		var schedular = (function(keys){
			var obj ={};
			(keys||[]).map(function(key){
				obj[key] = [];
			});
			return obj;
		}(workers));

		var result;
		if(_.isArray(rdv)){
			result = rdv.map(function(_rdv){
				return Works.insert({
					shop : shop,
					type : type,
					rdv : _rdv,
					worker_ids : workers,
					modules : modules,
					wiki_id : wiki?[wiki] : [],
					schedular : schedular
				});
			})[0];
		}else{
			result = Works.insert({
				shop : shop,
				type : type,
				rdv : rdv,
				worker_ids : workers,
				modules : modules,
				wiki_id : wiki?[wiki] : [],
				schedular : schedular
			});
		}

		if(this.isSimulation){
			Router.go("work.show", {workId : result});
		}
		return result;
	},
	workAddWorker : function(workId, workerId){
		var works = Works.findOne(workId);
		this.unblock();
		return Works.update(workId, {
			$set : {
				worker_ids : (works.worker_ids||[]).concat(workerId)
			}
		});
	},
	workCloser : function(workId, end){
		this.unblock();
		/* STOP ALL WORKING + SAVE END DATE */
		var work = Works.findOne(workId);
		work.schedular = work.schedular||{};
		_
		.keys(work.schedular)
		.map(function(workerId){
			work.schedular[workerId] = work.schedular[workerId].map(function(schedule){
				schedule.stop = schedule.stop || end;
				return schedule;
			});
		});
		return Works.update(work._id, {
			$set : {
				schedular : work.schedular,
				end : end
			}
		});
	},
	workReopener : function(workId){
		this.unblock();
		/* STOP ALL WORKING + SAVE END DATE */
		return Works.update(workId, {
			$unset : {
				end : ""
			}
		});
	},
	workRdvUpadtor : function(workId, date){
		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();
		return Works.update(workId, {$set : {rdv : date}});
	},
	workDestructor : function(id){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}
		this.unblock();
		Works.remove(id);
		if(Meteor.isSimulation){
			Router.go("home");
		}
	}
});