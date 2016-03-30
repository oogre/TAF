Router.route("/origin/:originId", {
	controller : "ApplicationController",
	name: "origin.show",
	data : function(){
		var date = moment(this.params.query.date || undefined);
		date = moment([date.year(), date.month()]);

		Session.set(Meteor.MOVES_DATE, date.toISOString());
		
		var start = _.clone(date).startOf('month').toISOString();
		var stop = _.clone(date).endOf('month').toISOString();

		var origin = Origins.findOne(this.params.originId);
		if(!origin){
			return {
				date : date.toISOString(),
				origin : origin	,
				movesFrom : [],
				movesTo : [],
				matter : matter
			}
		}
		var movesFrom = Moves.find({
							originId : this.params.originId,
							dateTime : {
								$gte: start,
								$lte: stop
							}
						},{
							sort : {
								dateTime : -1
							} 
						})
						.fetch();
		var movesTo = 	Moves.find({
							destinyId : this.params.originId,
							dateTime : {
								$gte: start,
								$lte: stop
							}
						},{
							sort : {
								dateTime : -1
							} 
						})
						.fetch();
		var matter = Matters.findOne(origin.matter);
		if(!matter){
			return {
				date : date.toISOString(),
				origin : origin	,
				movesFrom : [],
				movesTo : [],
				matter : matter
			}
		}
		movesFrom = movesFrom.map(function(item){
			item.unit = matter.unit;
			return item;
		});
		movesTo = movesTo.map(function(item){
			item.unit = matter.unit;
			return item;
		});
		return {
			date : date.toISOString(),
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