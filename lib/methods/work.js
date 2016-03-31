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
		if((type == "dépannage" && !Meteor.isWorker()) && !Meteor.userId()){
			throw new Meteor.Error("not authorized", "Vous devez être un Travailleur pour créer un dépannage");
		}
		if((type == "maintenance" || type == "installation") && !Meteor.isBoss() && !Meteor.userId()){
			throw new Meteor.Error("not authorized", "Vous devez être un boss pour créer une "+ type);
		}
		if(!Match.test(shop, Match.Where(function(shop){
			return 	Match.test(shop, Object) &&
					Match.test(shop.name, String) &&
					Match.test(shop._id, String)
		}))){
			throw new Meteor.Error("wrong formatting object", "Les donnée reçue au sujet du client sont éronnée");
		}
		var _shop = Shops.find({
						_id : shop._id
					});
		if(!_shop){
			delete shop._id;
			Meteor.call("easyShopCreator", shop, function(error, data){
				if(error) throw error;
				_shop = hops.find({
							_id : data
						});
			});
		}
		this.unblock();

		var worker = Workers.findOne(Meteor.userId());
		var date = moment().format("YYMMDD");
		var workCreatedToday = [date, 0];
		worker.workCreatedToday = (worker.workCreatedToday && worker.workCreatedToday[0]==date) ? worker.workCreatedToday : workCreatedToday;
		var myId = worker.profile.firstname+"_"+worker.profile.lastname+"_"+moment().format("YYMMDD");
		var workers = workers||[];
		var schedule = 	workers
						.map(function(id){
							return {
								workerId : id,
								timetable : []
							}
						});
		var result;
		if(_.isArray(rdv)){
			result = 	rdv
						.map(function(_rdv){
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
		}
		else{
			result = 	Works.insert({
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
		if(!Meteor.isWorker()){
			throw new Meteor.Error("not authorized", "Vous devez être un Travailleur pour ajouter un travailleur à ce travail");
		}
		if(!Match.test(workId, Match.Where(function(id){
			return 	Match.test(id, String) &&
					Works.findOne(id);
		}))){
			throw new Meteor.Error("unknown work", "Le travail que vous voulez modifier n'existe pas");
		}
		if(!Match.test(workerId, Match.Where(function(ids){
			return 	Match.test(ids, [String]) &&
					_.every(ids
							.map(function(id){
								return Workers.findOne(id)
							}));
					
		}))){
			throw new Meteor.Error("unknown worker", "Le travailleur que vous voulez ajouter n'existe pas");
		}
		
		this.unblock();
		var work = Works.findOne(workId);
		var dateTime = moment().toISOString();
		work.schedule = work.schedule || [];
		workerId = workerId || [];
		workerId
		.map(function(id){
			work.schedule = work.schedule
							.map(function(item){
								if(item.workerId == id){
									item.timetable = item.timetable || [];
									item.timetable = 	item.timetable
														.map(function(elem){
															if(elem.start && !elem.stop){
																elem.stop = dateTime
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
		
		if(workerId.length==1){
			if(this.isSimulation){
				Session.set("successMessage", "Un travailleur a été ajouté à ce travail" );
			}
			return "Un travailleur a été ajouté à ce travail";
		}
		else{
			if(this.isSimulation){
				Session.set("successMessage", "Des travailleurs ont été ajouté à ce travail" );
			}
			return "Des travailleurs ont été ajouté à ce travail";
		}
	},
	workCloser : function(workId, dateTime){
		if(!Meteor.isChief()){
			throw new Meteor.Error("not authorized", "Vous devez être un chef pour cloturer un travail");
		}
		if(!Match.test(workId, Match.Where(function(id){
			return 	Match.test(id, String) &&
					Works.findOne(id);
		}))){
			throw new Meteor.Error("unknown work", "Le travail que vous voulez cloturer n'existe pas");
		}
		if(!Match.test(dateTime, Match.Where(function(date){
			return 	moment(date).isValid()
		}))){
			throw new Meteor.Error("wrong formatting dateTime", "Le date transmise est incompréhanssible : "+dateTime);
		}
		dateTime = moment(dateTime).toISOString();

		this.unblock();
		/* STOP ALL WORKING + SAVE END DATE */
		var work = Works.findOne(workId);
		work.schedule = work.schedule || [];
		_
		.chain(work.schedule)
		.pluck('workerId')
		.uniq()
		.map(function(id){
			Workers.update(id, {
				$set : {
					working : false
				}
			});
		});		

		work.schedule = work.schedule
						.map(function(item){
							item.timetable = (item.timetable||[]).map(function(elem){
								if(elem.start && !elem.stop){
									elem.stop = dateTime;
								}
								return elem;
							})
							return item;
						});
		Works.update(work._id, {
			$set : {
				schedule : work.schedule,
				end : dateTime
			}
		});
		if(this.isSimulation){
			Session.set("successMessage", "Ce travail est cloturé" );
		}
		return "Ce travail est cloturé";
	},
	workReopener : function(workId){
		if(!Meteor.isChief()){
			throw new Meteor.Error("not authorized", "Vous devez être un chef pour réouvrir un travail");
		}
		if(!Match.test(workId, Match.Where(function(id){
			return 	Match.test(id, String) &&
					Works.findOne(id);
		}))){
			throw new Meteor.Error("unknown work", "Le travail que vous voulez réouvrir n'existe pas");
		}

		this.unblock();
		Works.update(workId, {
			$unset : {
				end : "",
				//signatures : {},
				//raw : false,
				maintenance : "",
				summary : ""
			}
		});
		if(this.isSimulation){
			Session.set("successMessage", "Ce travail est réouvert" );
		}
		return "Ce travail est réouvert";
	},
	workRdvUpadtor : function(workId, dateTime){
		if(!Meteor.isWorker()){
			throw new Meteor.Error("not authorized", "Vous devez être un travailleur pour changer la date du rendez-vous");
		}
		if(!Match.test(workId, Match.Where(function(id){
			return 	Match.test(id, String) &&
					Works.findOne(id);
		}))){
			throw new Meteor.Error("unknown work", "Le travail que vous voulez modifier n'existe pas");
		}
		if(!Match.test(dateTime, Match.Where(function(date){
			return 	moment(date).isValid()
		}))){
			throw new Meteor.Error("wrong formatting dateTime", "Le date transmise est incompréhanssible : "+dateTime);
		}
		dateTime = moment(dateTime).toISOString();

		this.unblock();
		Works.update(workId, {$set : {rdv : dateTime}});
		if(this.isSimulation){
			Session.set("successMessage", "La date du rendez-vous est modifiée  : " + moment(dateTime).format("dd-DD/MM/YY HH:mm"));
		}
		return "La date du rendez-vous est modifiée  : " + moment(dateTime).format("DD/MM/YYYY à HH:mm");
	},
	workDestructor : function(id){
		if (! Meteor.isBoss()) {
			return new Meteor.Error("not authorized", "Vous devez être un Boss pour supprimer un travail");
		}
		var work = Works.findOne(id);
		if(!Match.test(id, Match.Where(function(id){
			return 	Match.test(id, String) &&
					work;
		}))){
			throw new Meteor.Error("unknown shop", "Le travail que vous voulez supprimer n'existe pas");
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
			Session.set("successMessage", "Le travail à été supprimé" );
		}
		return "Le travail à été supprimé";
	},
	workTaskChecker : function(workId, moduleKey, taskId, value){
		if(!Meteor.isWorker()){
			throw new Meteor.Error("not authorized", "Vous devez être un travailleur pour activer une tâche");
		}
		if(!Match.test(workId, Match.Where(function(id){
			return 	Match.test(id, String) &&
					Works.findOne(workId);
		}))){
			throw new Meteor.Error("unknown shop", "Le travail que vous voulez modifier n'existe pas");
		}
		var work = Works.findOne(workId);
		moduleKey = parseInt(moduleKey);
		if(!Match.test(work.modules, Match.Where(function(modules){
			return 	Match.test(modules, [Object]) &&
					Match.test(moduleKey, Match.Integer) &&
					moduleKey < modules.length &&
					moduleKey > -1 && 
					Match.test(modules[moduleKey], Object);
		}))){
			throw new Meteor.Error("unknown moduleKey", "Le module pour lequel vous voulez activer une tâche n'existe pas");
		}
		if(!Match.test(work.modules[moduleKey].tasks, [Object])){
			throw new Meteor.Error("unknown moduleKey", "Ce module n'a aucune tâche");
		}

		
		for(var key = 0 ; key < work.modules[moduleKey].tasks.length ; key ++){
			if(work.modules[moduleKey].tasks[key]._id != taskId) continue;
			if(_.isString(value)){
				work.modules[moduleKey].tasks[key].checked = value;
			}
			else if(work.modules[moduleKey].tasks[key].checked){
				work.modules[moduleKey].tasks[key].checked = false;
			}else{
				work.modules[moduleKey].tasks[key].checked = true;
			}
		}

		Works.update(workId, {
			$set : {
				modules : work.modules
			}
		});

		if(this.isSimulation){
			Session.set("successMessage", "Une tâche à été modifiée avec succes" );
		}
		return "Une tâche à été modifiée avec succes";
	},
	workModuleTaskUpdator : function(workId, modules){
		if (! Meteor.isBoss()) {
			return new Meteor.Error("not authorized", "Vous devez être un Boss pour modifier les modules liés à ce travail");
		}
		var work = Works.findOne(workId);
		if(!Match.test(workId, Match.Where(function(id){
			return 	Match.test(id, String) &&
					work;
		}))){
			throw new Meteor.Error("unknown work", "Le travail que vous voulez modifier n'existe pas");
		}
		var work = Works.findOne(workId);
		if (work.type != "maintenance") {
			return new Meteor.Error("not authorized", "Un travail de maintenance est nécéssaire pour lui lier des modules");
		}

		if(!Match.test(modules, [Object])){
			throw new Meteor.Error("unknown modules", "Les données relatives au module sont incompréhanssibles");
		}

		work.modules = 	modules
						.map(function(new_module){
							var old_module = _
											.find(work.modules, function(old_module){
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
	
		if(this.isSimulation){
			Session.set("successMessage", "Les modules ont été modifiées avec succes" );
		}
		return "Les modules ont été modifiées avec succes";
	},
	workMatter : function(workId, matter, inputReset){
		if(!Meteor.isWorker()){
			throw new Meteor.Error("not authorized", "Vous devez être un travailleur pour ajouter un matériel à ce travail");
		}
		if(!Match.test(workId, Match.Where(function(id){
			return 	Match.test(id, String) &&
					Works.findOne(workId);
		}))){
			throw new Meteor.Error("unknown shop", "Le travail que vous voulez modifier n'existe pas");
		}
		var work = Works.findOne(workId);
		
		if(!matter._id){
			Meteor.call("matterCreator", matter, null, function(error, data){
				if(error) throw error;
				matter._id = data;
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
			Session.set("successMessage", "Le matériel à été ajouté avec succes" );
		}
		return "Le matériel à été ajouté avec succes";
	},
	workSignature : function(workId, prefix, photo){
		if(!Match.test(workId, Match.Where(function(id){
			return 	Match.test(id, String) &&
					Works.findOne(workId);
		}))){
			throw new Meteor.Error("unknown shop", "Le travail que vous voulez signer n'existe pas");
		}
		if(!Match.test(photo, Match.Where(function(picture){
			return 	(	Match.test(picture, String) &&
						(	picture.indexOf("data:image/jpeg;base64") == 0 || 
							picture.indexOf("data:image/png;base64") == 0	
						) ||
						(	Match.test(picture, Object) &&
							Match.test(picture.name, String) &&
							Match.test(picture.path, String)
						)
					) ;
		}))){
			return new Meteor.Error("wrong formatting picture", "La signature doit être au format JPEG ou PNG");
		}
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
		if(this.isSimulation){
			Session.set("successMessage", "Ce travail à bien reçu une signature" );
		}
		return "Ce travail à bien reçu une signature";
	}
});