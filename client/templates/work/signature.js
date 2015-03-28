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
};

Template.workSignature.rendered = function(){
	var name = this.data.client ? "Client" : "ADF";

	var canvas = $(this.lastNode).find("canvas.signature");
	if(canvas[0]){
		canvas[0].width = canvas.width();
		canvas[0].height = 210;
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
		return this.client ? "Client" : "Atelier du froid";
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
			if(image.path) return "/upload/"+image.path;
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
		uploadImage(this.work._id, name, signaturePad[name].toDataURL());
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
		Meteor.call("workSignature", workId, prefix, photo);
		return ;
	}
	
	Meteor.b64toBlob(photo, function success(blob) {
		formData.append("file[]", blob);
		$.ajax({
			url: "/upload",
			type: "POST",
			data: formData,
			cache: false,
			contentType: false,
			processData: false
		})
		.fail(function(){
			Meteor.call("workSignature", workId, prefix, photo);
		});
	}, function error(err){
		if(err) throw new Meteor.Error(err);
	});
}