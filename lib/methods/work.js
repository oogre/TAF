"use strict";
/*global $ : false */
/*global _ : false */
/*global Works : false */
/*global Router : false */
/*global Meteor : false */
/*global Workers : false */
/*global Matters : false */

Meteor.methods({
/* WORK */
	workCreator : function(shop, type, rdv, workers, modules){
		if (! Meteor.userId()) {
			return new Meteor.Error("not-authorized");
		}

		var worker = Workers.findOne(Meteor.userId());

		var date = moment().format("YYMMDD");
		var workCreatedToday = [date, 0];

		worker.workCreatedToday = (worker.workCreatedToday && worker.workCreatedToday[0]==date) ? worker.workCreatedToday : workCreatedToday;
		

		var myId = worker.profile.firstname+"_"+worker.profile.lastname+"_"+moment().format("YYMMDD");

		this.unblock();

		var schedule = 	(workers||[])
						.map(function(id){
							return {
								workerId : id,
								timetable : []
							}
						});


		var result;
		if(_.isArray(rdv)){
			result = rdv.map(function(_rdv){
				worker.workCreatedToday[1]++;
				Workers.update(worker._id, {
					$set : { 
						workCreatedToday : worker.workCreatedToday
					}
				});
				return Works.insert({
					shop : shop,
					type : type,
					rdv : _rdv,
					schedule : schedule,
					modules : modules,
					myId : myId+"_"+worker.workCreatedToday[1]
				});
			})[0];
		}else{
			result = Works.insert({
				shop : shop,
				type : type,
				rdv : rdv,
				schedule : schedule,
				modules : modules,
				myId : myId+"_"+worker.workCreatedToday[1]
			});
			worker.workCreatedToday[1]++;
			Workers.update(worker._id, {
				$set : { 
					workCreatedToday : worker.workCreatedToday
				}
			});
		}

		if(this.isSimulation){
			Router.go("work.show", {workId : result});
		}
		return result;
	},
	workAddWorker : function(workId, workerId){
		this.unblock();
		var work = Works.findOne(workId);
		workerId.map(function(id){
			work.schedule = (work.schedule||[]).map(function(item){
				if(item.workerId == id){
					item.timetable = (item.timetable||[]).map(function(elem){
						if(elem.start && !elem.stop){
							elem.stop = moment().toISOString()
						}
						return elem;
					});
				}
				return item;
			});
			work.schedule.push({workerId : id});

			Workers.update(id, {
				$set : {
					working : false
				}
			});


			Works.update(workId, {
				$set : {
					schedule : 	work.schedule
				}
			});
		});
	},
	workCloser : function(workId, end){
		this.unblock();
		/* STOP ALL WORKING + SAVE END DATE */
		var work = Works.findOne(workId);
		
		_
		.chain(work.schedule || [])
		.pluck('workerId')
		.uniq()
		.map(function(id){
			Workers.update(id, {
				$set : {
					working : false
				}
			});
		});		

		work.schedule = (work.schedule||[])
						.map(function(item){
							item.timetable = (item.timetable||[]).map(function(elem){
								if(elem.start && !elem.stop){
									elem.stop = end;
								}
								return elem;
							})
							return item;
						});
		return Works.update(work._id, {
			$set : {
				schedule : work.schedule,
				end : end
			}
		});
	},
	workReopener : function(workId){
		this.unblock();
		return Works.update(workId, {
			$unset : {
				end : "",
				//signatures : {},
				//raw : false,
				maintenance : "",
				summary : ""
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

		Workers.update({
			working : id
		}, {
			$set : {
				working : false
			}
		});

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
	workMatter : function(workId, matter, inputReset){
		var work = Works.findOne(workId);
		if(!work){
			return false;
		}
		
		if(!matter._id){
			matter._id = Matters.insert({
				name : matter.name,
				unit : matter.unit
			});
		}

		work.matters = work.matters || [];
		var index = _.indexOf(_.pluck(work.matters, "_id"), matter._id);
		if(index<0){
			index = work.matters.push(matter) - 1;
		}
		else{
			work.matters[index].quantity = parseFloat(work.matters[index].quantity)||0;
			matter.quantity = parseFloat(matter.quantity)||0;
			work.matters[index].quantity += matter.quantity;
			if(work.matters[index].quantity == 0){
				work.matters.splice(index, 1);
			}
		}
		Works.update(workId, {
			$set : {
				matters : work.matters
			}
		});
		if(Meteor.isSimulation){
			$(inputReset).val("");
		}
		return ;
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