(function(){"use strict";
/*global $ : false */
/*global Meteor : false */
/*global Template : false */
/*global MeteorCamera : false */

Template.buttonpicture.events({
	"click button.photoShoot": function () {
		var selector = this.selector;

		if(!(selector && selector)){
			return false;
		}
		MeteorCamera.getPicture({quality : 100}, function (error, data) {
			if(error) throw new Meteor.Error(error);
			uploadImage(data, selector);
		});
		return false;
	},
	"change input[type='file']" : function(event){
		var selector = this.selector;
		
		if(!(selector && selector.collection && selector._id)){
			return false;
		}

		var success = function(e) {
			var image  = new Image();
			image.src = e.target.result;
			uploadImage(e.target.result, selector);
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

function uploadImage(photo, selector){
	var formData = new FormData();
	formData.append("directoryName", "images");
	formData.append("_id", selector._id);
	formData.append("collection", selector.collection);


	if(!Meteor.status().connected){
		Meteor.call("pictureCreator", photo, {
			collection : formData.collection,
			_id : formData._id,
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
			Meteor.call("pictureCreator", photo, {
				collection : formData.collection,
				_id : formData._id,
			});
		});
	}, function error(err){
		if(err) throw new Meteor.Error(err);
	});
}


}).call(this);
