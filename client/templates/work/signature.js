"use strict";
/*global _ : false */
/*global $ : false */
/*global Meteor : false */
/*global Session : false */
/*global Template : false */
/*global SignaturePad : false */

var signaturePad = {};

Template.workSignature.destroyed = function(){
	Session.set(Meteor.SIGNATURE, {});
	Session.set(Meteor.SIGNATURE_OPEN, false);
};

Template.workSignature.rendered = function(){
	var name = this.data.client ? "Client" : "ADF";

	var canvas = $(this.lastNode).find("canvas.signature");
	var popupParent = canvas.parents(".popup");
	var groupParent = popupParent.find(".input-group");

	if(canvas[0]){
		canvas[0].width = popupParent.width() - canvas.parent().offset().left;
		canvas[0].height = popupParent.height() - groupParent.offset().top;
		signaturePad[name] = new SignaturePad(canvas[0], {
			onEnd : function(){
				var signature = Session.get(Meteor.SIGNATURE);
				signature[name] = true;
				Session.set(Meteor.SIGNATURE, signature);
			}
		});
	}
};

Template.workSignature.helpers({
	name : function(){
		return this.client ? "Client" : "ADF";
	},
	drawn : function(){
		var name = this.client ? "Client" : "ADF";
		var signature = Session.get(Meteor.SIGNATURE);
		if(this && this.work && this.work.signatures && this.work.signatures[name.toLowerCase()]){
			var image = this.work.signatures[name.toLowerCase()];
			if(_.isString(image) || image.path) return "disabled";
		}
		return signature[name] ? "" : "disabled";
	},
	saved : function(){
		var name = this.client ? "Client" : "ADF";
		if(this && this.work && this.work.signatures && this.work.signatures[name.toLowerCase()]){
			var image = this.work.signatures[name.toLowerCase()];
			if(_.isString(image)) return image;
			else if(image.path){
				return Meteor.pictureServer+"/"+image.path;
			}
		}
		return false;
	}
});

Template.workSignature.events({
	"click button.reset" : function(){
		var name = this.client ? "Client" : "ADF";
		signaturePad[name].clear();
		var signature = Session.get(Meteor.SIGNATURE);
		signature[name] = false;
		Session.set(Meteor.SIGNATURE, signature);
		return false;
	},
	"click button.save" : function(){
		var name = this.client ? "Client" : "ADF";
		signaturePad[name]._ctx.fillStyle = "black";
		signaturePad[name]._ctx.font = "64px Arial";
		signaturePad[name]._ctx.fillText($("#"+name.toLowerCase()+"_name").val(), 100, 100);
		uploadImage(this.work._id, name, signaturePad[name].toDataURL());
		return false;
	},
	"click button.exit" : function(){
		Session.set(Meteor.SIGNATURE_OPEN, false);
		return false;
	}
});

function uploadImage(workId, prefix, photo){
	var formData = new FormData();
	formData.append("directoryName", "signatures");
	formData.append("_id", workId);
	formData.append("prefix", prefix);
	formData.append("next", "workSignature");
	if(!Meteor.status().connected){
		Meteor.call("workSignature", workId, prefix, photo, function(error, data){
			if(error) return Session.set("errorMessage", error.reason );
			Session.set("successMessage", data );
		});
		
		return ;
	}
	Meteor.b64toBlob(photo, function success(blob) {
		formData.append("file[]", blob);
		$.ajax({
			url: Meteor.pictureUploadServer,
			type: "POST",
			data: formData,
			cache: false,
			contentType: false,
			processData: false
		})
		.fail(function(){
			Meteor.call("workSignature", workId, prefix, photo, function(error, data){
				if(error) return Session.set("errorMessage", error.reason );
				Session.set("successMessage", data );
			});
		});
	}, function error(err){
		if(error) return Session.set("errorMessage", error.reason );
	});
}