"use strict";
/*global $ : false */
/*global console : false */
/*global Meteor : false */
/*global Template : false */
/*global Wikis : false */
/*global Uploader : false */
/*global Session : false */
/*global Tracker : false */

Template.wikiform.helpers({
	wikiEdit : function(){
		return Session.get(Meteor.WIKI_CURRENT_KEY);
	},
	image : function(){
		return Wikis.findOne({_id: Session.get(Meteor.WIKI_CURRENT_KEY)});
	},
	myFormData: function() {
		return { directoryName: "images", prefix: this.name, _id: this._id };
	},
	filesToUpload: function() {
		return Uploader.info.get();
	}
});

Template.wikiform.events({
	"click .wikiEdit": function(){
		if(!Session.get(Meteor.WIKI_CURRENT_KEY)){
			Meteor.call("wikiCreator", {name: (new Date()).getTime(), uploads: [], title : "", description:""}, function(err, currentWiki){
				if(err) return console.log(err);
				console.log(currentWiki);
				Session.set(Meteor.WIKI_CURRENT_KEY, currentWiki);
			});
		}
		else{
			Session.set(Meteor.WIKI_OLD_KEY, Session.get(Meteor.WIKI_CURRENT_KEY));
			Session.set(Meteor.WIKI_CURRENT_KEY, false);
		}
		return false;
	}
});

Template.wikiform.wiki = function(template, next){
	var deferred = new $.Deferred();
	saveWiki(template, function(error, wiki){
		if(error){
			deferred.reject(error);
			return next(error);
		}
		deferred.resolve(wiki);
		return next(null, wiki);
	});
	return deferred;
};

var saveWiki = function(template, next){
	if(Session.get(Meteor.WIKI_CURRENT_KEY)){
		validator(template, function(error, values){
			if(error) return next(error);
			Meteor.call("wikiUpdator", Session.get(Meteor.WIKI_CURRENT_KEY), values, function(err, wiki){
				if(error){
					return next(error);
				}
				else{
					var saveWiki = template.find(".saveWiki");
					$(saveWiki)
					.removeClass("btn-primary")
					.addClass("btn-success");
					return next(null, wiki);
				}
			});
		});
	}else{
		return next(null, null);
	}
};

var validator = function(template, next){
	var wikiName = template.find("#wikiname");
	var wikiDescription = template.find("#"+Session.get(Meteor.WIKI_CURRENT_KEY));
	var errors = template.find(".wikiform .has-error");
	
	$(errors)
	.removeClass("has-error");

	var validation = function(element){
		console.log(element);
		console.log(element.value);
		if(!element.value){
			$(element)
			.parents(".form-group")
			.first()
			.addClass("has-error");
			return true;
		}
		return false;
	};
	if(	validation(wikiName) || validation(wikiDescription)){
		return next(new Meteor.Error("validation-error"));
	}
	return next(null, {
		title : wikiName.value,
		description : wikiDescription.value,
	});
};