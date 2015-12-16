(function(){/* TASKS */

Router.route("/task/new", {
	controller : "ApplicationController",
	name: "task.new",
	action : function () {
		Session.set(Meteor.PAGE_TITLE, "Nouvelle tâche");
		this.render("tasknew");
	}
});



Router.route("/task", {
	controller : "CleanController",
	name: "task.index",
	data : function(){
		return {
			tasks : _
					.chain(Tasks.find().fetch())
					.groupBy(function(task){
						return task.moduletype;
					})
					.map(function(tasks){
						return {
							category : tasks[0].moduletype || "-",
							tasks : tasks
						};
					})
					.sortBy(function(task){
						return task.category;
					})
					.value()
		};
	},
	action : function () {
		Session.set(Meteor.PAGE_TITLE, "Liste des tâches");
		this.render("taskindex");
		if(Meteor.isBoss()){
			Session.set(Meteor.FILL_CONTEXT_MENU_KEY, true);
			this.render("taskaction", {to : "action"}); //contextmenu.action
		}
	}
});



Router.route("/task/edit/:taskId", {
	controller : "ApplicationController",
	name: "task.edit",
	data : function(){
		return Tasks.findOne(this.params.taskId);
	},
	action : function () {
		var data = this.data();
		if(data){
			Session.set(Meteor.TASK_INPUT_TEXT, data.value);
			Session.set(Meteor.PAGE_TITLE, "Edition de la tâche : "+s.capitalize(data.name));
		}
		this.render("taskedit");
	}
});
}).call(this);

//# sourceMappingURL=task.js.map
