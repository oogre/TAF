/* HOME */

Router.route("/", {
	controller : "CleanController",
	name: "home",
	action : function () {
		if(Session.equals(Meteor.DATA_RECIEVED, false))
		{
			return this.render("loadingTemplate");
		}
		Session.set(Meteor.PAGE_TITLE, "TAF");
		this.render("workIndex");
		if(Meteor.isWorker()){
			Session.set(Meteor.FILL_CONTEXT_MENU_KEY, true);
			this.render("work-action", {to : "action"}); //contextmenu.action	
		}
	}
});