(function(){"use strict";
/*global $ : false */
/*global Router : false */
/*global Meteor : false */
/*global Matters : false */

Meteor.methods({
	/*
		matter : { 
			name: String uniq, 
			unit: Unit.shortname 
		},
		button : cssSelector
	*/
	matterCreator : function(matter, button){
		if (!Meteor.isWorker()) {
			throw new Meteor.Error("not authorized", "Vous devez être un Travailleur pour créer un matériel");
		}
		if(!Match.test(matter, Object)){
			throw new Meteor.Error("wrong formatting object", "Aucune donnée reçue");
		}
		if(!Match.test(matter.name, String)){
			throw new Meteor.Error("wrong formatting object.name", "Ajouter au moin un nom pour ce matériel");
		}
		if(!Match.test(matter.unit, Match.Where(function(unit){
			return 	Match.test(unit, String) &&
					Units.findOne({
						shortname : unit.toLowerCase()
					});
		}))){
			throw new Meteor.Error("wrong formatting object.unit", "Ajouter au moin une unité pour ce matériel");
		}

		// this.unblock();

		matter.name = matter.name.toLowerCase();
		matter.unit = matter.unit.toLowerCase();
		
		if(Match.test(matter.name, Match.Where(function(name){
			return 	Matters.findOne({
						name : name
					});
		}))){
			var matter = Matters.findOne({
				name : matter.name
			});
			throw new Meteor.Error("wrong formatting object.matter,name", "Un matériel porte déjà ce nom <a href='"+Router.path("matter.show", {id : matter._id})+"'>Voir</a>");
		} 
		
		var matterId = Matters.insert({
			name : matter.name,
			unit : matter.unit
		});
		
		if(this.isSimulation && button){
			$(button)
			.removeClass("btn-primary")
			.addClass("btn-success");
			Router.go("matter.index");
			Session.set("successMessage", "Le matériel à été créer <a href='"+Router.path("matter.show", {id : matterId})+"'>Voir</a>");
		}
		return matterId;
	},

	/*
		id : Matter._id
	*/
	matterDestroyer: function (id) {
		if (! Meteor.isBoss()) {
			throw new Meteor.Error("not authorized", "Vous devez être un Boss pour supprimer un matériel");
		}
		// this.unblock();
		Matters.remove(id);
		if(this.isSimulation){
			Session.set("successMessage", "Le matériel à été supprimé" );
		}
		return "Le matériel à été supprimé";
	},


	/*
		id : Matter._id,
		matter : { 
			name: String uniq, 
			unit: Unit.shortname 
		},
		button : cssSelector
	*/
	matterUpdator : function(id, matter, button){
		if (! Meteor.isChief()) {
			throw new Meteor.Error("not authorized", "Vous devez être un Travailleur pour créer un matériel");
		}
		if(!Match.test(id, Match.Where(function(id){
			return 	Match.test(id, String) &&
					Matters.findOne(id);
		}))){
			throw new Meteor.Error("unknown matter", "Le matériel que vous voulez modifier n'existe pas");
		}
		if(!Match.test(matter, Object)){
			throw new Meteor.Error("wrong formatting object", "Aucune donnée reçue");
		}
		if(!Match.test(matter.name, String)){
			throw new Meteor.Error("wrong formatting object.name", "Ajouter au moins un nom pour ce matériel");
		}
		if(!Match.test(matter.unit, Match.Where(function(unit){
			return 	Match.test(unit, String) &&
					Units.findOne({
						shortname : unit.toLowerCase()
					});
		}))){
			throw new Meteor.Error("wrong formatting object.unit", "Ajouter au moin une unité pour ce matériel");
		}
		// this.unblock();

		matter.name = matter.name.toLowerCase();
		matter.unit = matter.unit.toLowerCase();
		
		if(Match.test(matter.name, Match.Where(function(name){
			return 	Matters.findOne({
					_id : {
						$ne : id
					},
						name : name
					});
		}))){
			var matter = Matters.findOne({
				_id : {
					$ne : id
				},
				name : matter.name
			});
			throw new Meteor.Error("non uniq object.matter,name", "Un matériel porte déjà ce nom <a href='"+Router.path("matter.show", {id : matter._id})+"'>Voir</a>");
		} 

		Matters.update(id, matter);

		if(this.isSimulation && button){
			$(button)
			.removeClass("btn-primary")
			.addClass("btn-success");
			Router.go("matter.index");
			Session.set("successMessage", "Le matériel à été modifié <a href='"+Router.path("matter.show", {id : id})+"'>Voir</a>");
		}
		return id;
	}
});


if ( Meteor.isClient ) {
	Ground.methodResume([
		"matterCreator",
		"matterDestroyer",
		"matterUpdator"
	]);
}
}).call(this);
