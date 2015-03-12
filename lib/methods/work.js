"use strict";
/*global _ : false */
/*global Works : false */
/*global Router : false */
/*global Meteor : false */
/*global Matters : false */

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
				end : "",
				signatures : {},
				raw : false
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
	},
	workTaskChecker : function(workId, moduleKey, taskId, value){
		var work = Works.findOne(workId);
		work.modules[moduleKey].tasks.map(function(task, key){
			if(task._id == taskId){
				if(_.isString(value)){
					work.modules[moduleKey].tasks[key].checked = value;
				}
				else if(task.checked){
					work.modules[moduleKey].tasks[key].checked = false;
				}else{
					work.modules[moduleKey].tasks[key].checked = true;
				}
			}
		});
		Works.update(workId, {
			$set : {
				modules : work.modules
			}
		});
	},
	workModuleTaskUpdator : function(workId, modules){
		var work = Works.findOne(workId);
		work.modules = modules.map(function(new_module){
			var old_module = _.find(work.modules, function(old_module){
				return old_module.moduleKey == new_module.moduleKey;
			});
			if(old_module){
				new_module.tasks = 	new_module.tasks
									.map(function(new_task){
										var old_task = 	_
														.find(old_module.tasks, function(old_task){
															return old_task._id == new_task._id;
														});
										if(old_task){
											new_task.checked = old_task.checked;
										}
										return new_task;
									});
			}
			return new_module;
		});
		Works.update(workId, {
			$set : {
				modules : work.modules
			}
		});
	},
	workModuleUpdator: function(workId, moduleKey, matterId, value){
		value = parseFloat(value);
		if (!_.isNumber(value)){
			return false;
		}
		var work = Works.findOne(workId);
		var matter = Matters.findOne(matterId);
		if(!work || ! matter){
			return false;
		}
		work.moduleMatters = work.moduleMatters || [];

		var findIndexOrPush = function(collection, propertyName, needle, element){
			var array = _.pluck(collection, propertyName) ;
			var index = _.indexOf(array, needle);
			if(index<0){
				index = collection.push(element) - 1;
			}
			return index;
		};

		var moduleIndex = findIndexOrPush(	work.moduleMatters,	
											"moduleKey",
											moduleKey,
											{
												moduleKey : moduleKey, 
												matters : []
											});

		var matterIndex = findIndexOrPush(	work.moduleMatters[moduleIndex].matters,
											"_id",
											matterId,
											matter);

		work.moduleMatters[moduleIndex].matters[matterIndex].quantity = value;
		
		Works.update(workId, {
			$set : {
				moduleMatters : work.moduleMatters
			}
		});
	},
	workSignature : function(workId, prefix, photo){
		this.unblock();
		var work = Works.findOne(workId);
		var raw = _.isString(photo) || (work && (true === work.raw));
		work.signatures = work.signatures||{};
		work.signatures[prefix.toLowerCase()] = photo;
		Works.update({_id: workId}, { 
			$set : {
				signatures : work.signatures,
				raw : raw
			} 
		});
	}
});