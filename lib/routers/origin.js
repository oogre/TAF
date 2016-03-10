Router.route("/origin/:originId", {
	controller : "ApplicationController",
	name: "origin.show",
	data : function(){

		var origin = Origins.findOne(this.params.originId);
		var movesFrom = Moves.find({
							originId : this.params.originId
						},{
							sort : {
								dateTime : -1
							} 
						})
						.fetch();
		var movesTo = 	Moves.find({
							destinyId : this.params.originId
						},{
							sort : {
								dateTime : -1
							} 
						})
						.fetch();
		var matter = Matters.findOne(origin.matter);
		movesFrom = movesFrom.map(function(item){
			item.unit = matter.unit;
			return item;
		});
		movesTo = movesTo.map(function(item){
			item.unit = matter.unit;
			return item;
		});
		return {
			origin : origin	,
			movesFrom : movesFrom,
			movesTo : 	movesTo,
			matter : matter
		}
	},
	action : function () {
		var data = this.data();
		if(data){
			Session.set(Meteor.PAGE_TITLE, "Détail du conteneur : "+s.capitalize(data.origin.ref));
		}
		this.render("originshow");
	}
});