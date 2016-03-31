"use strict";
/*global $ : false */
/*global Router : false */
/*global Meteor : false */
/*global Tasks : false */

Meteor.methods({
	taskCreator : function(task, button){
		if (! Meteor.isBoss()) {
			throw new Meteor.Error("not authorized", "Vous devez être un Boss pour créer une tâche");
		}
		if(!Match.test(task, Object) || _.isEmpty(task)){
			throw new Meteor.Error("wrong formatting object", "Aucune donnée reçue");
		}
		if(!Match.test(task.name, String) || _.isEmpty(task.name)){
			throw new Meteor.Error("wrong formatting object.name", "Ajouter au moins un nom pour cette tâche");
		}
		if(!Match.test(task.moduletype, String)){
			throw new Meteor.Error("wrong formatting object.moduletype", "Ajouter au moins un type de module pour cette tâche");
		}
		task.name = task.name.toLowerCase();
		task.moduletype = task.moduletype.toLowerCase();

		if(Match.test(task, Match.Where(function(task){
			return 	Tasks.findOne({
				name : task.name,
				moduletype : task.moduletype
			});
		}))){
			throw new Meteor.Error("non unique task", "La tâche que vous voulez créer existe déjà");
		}

		if(!Match.test(task.value, Boolean)){
			throw new Meteor.Error("wrong formatting object.value", "Le type de réponse attendue pour cette tâche est incompréhanssible");
		}
		
		this.unblock();

		var taskId = Tasks.insert(task);
		
		if(this.isSimulation){
			$(button)
			.removeClass("btn-primary")
			.addClass("btn-success");
			Router.go("task.index");
			Session.set("successMessage", "La tâche à été ajouter") ;
		}
		return "La tâche à été ajouter"
	},
	taskDestroyer: function (taskId) {
		if (! Meteor.isBoss()) {
			throw new Meteor.Error("not authorized", "Vous devez être un Boss pour supprimer une tâche");
		}
		this.unblock();
		Tasks.remove(taskId);
		
		if(this.isSimulation){
			Session.set("successMessage", "La tâche à été supprimée" );
		}
		return "La tâche à été supprimée";
	},
	taskUpdator : function(taskId, task, button){
		if (! Meteor.isBoss()) {
			throw new Meteor.Error("not authorized", "Vous devez être un Boss pour modifier une tâche");
		}
		if(!Match.test(taskId, Match.Where(function(id){
			return 	Match.test(id, String) &&
					Tasks.findOne(id);
		}))){
			throw new Meteor.Error("unknown task", "La tâche que vous voulez modifier n'existe pas");
		}
		if(!Match.test(task, Object) || _.isEmpty(task)){
			throw new Meteor.Error("wrong formatting object", "Aucune donnée reçue");
		}
		if(!Match.test(task.name, String) || _.isEmpty(task.name)){
			throw new Meteor.Error("wrong formatting object.name", "Ajouter au moins un nom pour cette tâche");
		}
		if(!Match.test(task.moduletype, String)){
			throw new Meteor.Error("wrong formatting object.moduletype", "Ajouter au moins un type de module pour cette tâche");
		}
		task.name = task.name.toLowerCase();
		task.moduletype = task.moduletype.toLowerCase();

		if(Match.test(task, Match.Where(function(task){
			return 	Tasks.findOne({
				id : {
					$ne : taskId
				},
				name : task.name,
				moduletype : task.moduletype
			});
		}))){
			throw new Meteor.Error("non unique task", "La tâche que vous voulez modifier existe déjà");
		}
		task.name = task.name.toLowerCase();
		if(!Match.test(task.value, Boolean)){
			throw new Meteor.Error("wrong formatting object.value", "Le type de réponse attendue pour cette tâche est incompréhanssible");
		}
		this.unblock();
		
		Tasks.update(taskId, task);

		if(this.isSimulation){
			$(button)
			.removeClass("btn-primary")
			.addClass("btn-success");
			Router.go("task.index");
			Session.set("successMessage", "La tâche à été modifier" );
		}
		return "La tâche à été modifier";
	}
});