"use strict";
/*global $ : false */
/*global _ : false */
/*global Wikis : false */
/*global Meteor : false */
/*global Session : false */
/*global Template : false */
/*global MeteorCamera : false */


Template.wikiform.rendered = function(){
	$("textarea").autosize();
};

Template.wikiform.helpers({
	photo: function () {
		var wiki = Wikis.findOne(Session.get(Meteor.WIKI_CURRENT_KEY));
		var photos = [];
		if(wiki){
			photos = 	wiki
						.uploads
						.map(function(upload){
							if(_.isString(upload)) return upload;
							return Meteor.serverIP+"/upload/"+upload.path;
						});
		}
		return photos;
	}
});

Template.wikiform.events({
	"blur textarea" : function(event, template){
		Meteor.call("wikiUpdator", Session.get(Meteor.WIKI_CURRENT_KEY), {
			description : template.find("textarea").value
		});
	},
	"click .wikiEdit": function(){
		if(!Session.get(Meteor.WIKI_CURRENT_KEY)){
			Meteor.call("wikiCreator", $("[data-work-id]").attr("data-work-id"), function(err, currentWiki){
				if(err) throw new Meteor.Error(err);
				Session.set(Meteor.WIKI_CURRENT_KEY, currentWiki);
			});
		}
		else{
			Session.set(Meteor.WIKI_CURRENT_KEY, false);
		}
		return false;
	},
	"click button.photoShoot": function () {
		MeteorCamera.getPicture({quality : 100}, function (error, data) {
			if(error) throw new Meteor.Error(error);
			uploadImage(Session.get(Meteor.WIKI_CURRENT_KEY), data);
		});
		return false;
	},
	"change input[type='file']" : function(event){
		
		var success = function(e) {
			var image  = new Image();
			image.src = e.target.result;
			uploadImage(Session.get(Meteor.WIKI_CURRENT_KEY), e.target.result);
		};
		for(var i = 0 ; i < event.target.files.length ; i ++ ){
			var file = event.target.files[i];
			var FR= new FileReader();
			FR.onloadend = success;
			FR.readAsDataURL(file);
		}
		return true;
	}
});

Template.wikiform.wiki = function(template, next){
	var wiki = ($("textarea").val() || $(".pictureList").children().length) ? Session.get(Meteor.WIKI_CURRENT_KEY) : null;
	if(_.isFunction(next)){
		next(null, wiki);
	}
	var deferred = new $.Deferred();
	deferred.resolve(wiki);
	return deferred;
};
function uploadImage(wikiId, photo){
	var formData = new FormData();
	formData.append("directoryName", "images");
	formData.append("_id", wikiId);
	
	if(!Meteor.status().connected){
		Meteor.call("wikiUploadUpdator", wikiId, photo);
		return ;
	}
	
	Meteor.b64toBlob(photo, function success(blob) {
		formData.append("file[]", blob);
		$.ajax({
			url: Meteor.serverIP+"/upload",
			type: "POST",
			data: formData,
			cache: false,
			contentType: false,
			processData: false
		})
		.fail(function(){
			Meteor.call("wikiUploadUpdator", wikiId, photo);
		});
	}, function error(err){
		if(err) throw new Meteor.Error(err);
	});
}

