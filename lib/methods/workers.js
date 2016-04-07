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
		if( (!Meteor.isChief()) ? workerid != Meteor.userId() : !Meteor.isChief()){
			throw new Meteor.Error("not authorized", "Pour modifier ce travailleur, vous devez être ce travailleur ou vous devez être un Chef ");
		}
		if(!Match.test(workerid, Match.Where(function(id){
			return 	Match.test(id, String) &&
					Workers.findOne(id);
		}))){
			throw new Meteor.Error("unknown work", "Le travailleur que vous voulez modifier n'existe pas");
		}
		if(!Match.test(worker, Match.Where(function(worker){
			return 	Match.test(worker, Object) &&
					Match.test(worker.firstname, String) &&
					Match.test(worker.lastname, String) &&
					Match.test(worker.phone, String) &&
					Match.test(worker.role, Match.Integer) &&
					Match.test(worker.address, Object) &&
					Match.test(worker.address.city, String) &&
					Match.test(worker.address.country, String) &&
					Match.test(worker.address.number, String) &&
					Match.test(worker.address.street, String) &&
					Match.test(worker.address.zipcode, String)
		}))){
			throw new Meteor.Error("wrong formatting object", "Les donnée reçue sont incomplète");
		}
		worker.firstname = worker.firstname.toLowerCase();
		worker.lastname = worker.lastname.toLowerCase();
		worker.firstname = worker.firstname.toLowerCase();
		worker.lastname = worker.lastname.toLowerCase();
		
		if(Workers.findOne({
			_id : {
				$ne : workerid
			},
			$or : [{
				firstname : worker.firstname,
				lastname : worker.lastname
			},{
				firstname : worker.lastname,
				lastname : worker.firstname
			}]
		})){
			throw new Meteor.Error("unknown work", "Un travailleur porte déjà ce nom et ce prénom");
		}
		// this.unblock();
		Workers.update(workerid, {$set : {profile : worker}});
		if(this.isSimulation){
			Session.set("successMessage", "Le travailleur a été modifier" );
		}
		return "Le travailleur a été modifier";
	},
	workerDestroyer: function (workerid) {
		if(!Meteor.isBoss()){
			throw new Meteor.Error("not authorized", "Vous devez être un Boss pour supprimer un travailleur");
		}
		if(!Match.test(workerid, Match.Where(function(id){
			return 	Match.test(id, String) &&
					Workers.findOne(id);
		}))){
			throw new Meteor.Error("unknown work", "Le travailleur que vous voulez supprmer n'existe pas");
		}

		// this.unblock();
		Workers.remove(workerid);
		if(Meteor.isSimulation){
			Session.set("successMessage", "Le travailleur à été supprimé" );
		}
		return "Le travailleur à été supprimé";
	},
	workerCreator: function (worker, button) {
		if(!Meteor.isBoss()){
			throw new Meteor.Error("not authorized", "Vous devez être un Boss pour créer un travailleur");
		}

		if(!Match.test(worker, Match.Where(function(worker){
			return 	Match.test(worker, Object) &&
					Match.test(worker.email, Match.Where(function(email){
						var re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
						return 	Match.test(email, String) &&
								re.test(email);
					})) &&
					Match.test(worker.profile, Object) &&
					Match.test(worker.profile.firstname, String) &&
					Match.test(worker.profile.lastname, String) &&
					Match.test(worker.profile.phone, String) &&
					Match.test(worker.profile.role, Match.Integer) &&
					Match.test(worker.profile.address, Object) &&
					Match.test(worker.profile.address.city, String) &&
					Match.test(worker.profile.address.country, String) &&
					Match.test(worker.profile.address.number, String) &&
					Match.test(worker.profile.address.street, String) &&
					Match.test(worker.profile.address.zipcode, String)
		}))){
			throw new Meteor.Error("wrong formatting object", "Les donnée reçue sont incomplète");
		}
		worker.email = worker.email.toLowerCase();
		worker.profile.firstname = worker.profile.firstname.toLowerCase();
		worker.profile.lastname = worker.profile.lastname.toLowerCase();

		if(Workers.findOne({
				$or : [{
					"profile.firstname" : worker.profile.firstname,
					"profile.lastname" : worker.profile.lastname
				},{
					"profile.firstname" : worker.profile.lastname,
					"profile.lastname" : worker.profile.firstname
				}]
		})){
			throw new Meteor.Error("unknown work", "Un travailleur porte déjà ce nom et ce prénom");
		}


		// this.unblock();

		if(Meteor.isServer){
			worker.password = "gdutaf";
			Accounts.createUser(worker);

			var worker = Workers.findOne({
				emails : {
					$elemMatch: { 
						address : worker.email
					}
				}
			});
			return "Le travailleur à été créé : <a href='"+Router.path("worker.view", {id : worker._id})+"'>Voir</a>";
		}
		
		if(this.isSimulation){
			$(button)
			.removeClass("btn-primary")
			.addClass("btn-success");
			Router.go("home");
			Session.set("successMessage", "Le travailleur à été créé" );
		}
	},
	workerSchedule : function( workId, workerId, action, datetime){
		if(!Meteor.isWorker()){
			throw new Meteor.Error("not authorized", "Vous devez être un Travailleur pour ajouter un travailleur à ce travail");
		}
		if(!Match.test(workId, Match.Where(function(id){
			return 	Match.test(id, String) &&
					Works.findOne(id);
		}))){
			throw new Meteor.Error("unknown work", "Le travail que vous voulez modifier n'existe pas");
		}
		if(!Match.test(workerId, Match.Where(function(id){
			return 	Match.test(id, String) &&
					Workers.findOne(id)
					
		}))){
			throw new Meteor.Error("unknown worker", "Ce travailleur n'existe pas");
		}
		if(!Match.test(workerId, Match.Where(function(id){
			return 	Match.test(id, String) &&
					Works.findOne({
						_id : workId,
						schedule : {
							$elemMatch: {
								workerId : id
							}
						}
					})		
		}))){
			throw new Meteor.Error("unknown worker", "Ce travailleur ne participe pas à ce travail'");
		}
		if(!Match.test(datetime, Match.Where(function(date){
			return 	moment(date).isValid()
		}))){
			throw new Meteor.Error("wrong formatting datetime", "Le date transmise est incompréhanssible : "+datetime);
		}
		datetime = moment(datetime).toISOString();

		// this.unblock();

		//STOP WORKER WORKING
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

if ( Meteor.isClient ) {
	Ground.methodResume([
		"workerUpdator",
		"workerDestroyer",
		"workerCreator",
		"workerSchedule"
	]);
}