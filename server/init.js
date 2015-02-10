"use strict";
/*global Meteor : false */
/*global process : false */
/*global UploadServer : false */
/*global Wikis : false */

Meteor.startup(function () {

	Wikis.remove({
		title : "",
		description : "",
	});

	UploadServer.init({
		tmpDir : process.env.PWD + "/.uploads/tmp",
		uploadDir : process.env.PWD + "/.uploads/",
		checkCreateDirectories : true, //create the directories for you
		getDirectory: function(fileInfo, formData) {
			if (formData && formData.directoryName !== null) {
				return formData.directoryName;
			}
			return "";
		},
		getFileName: function(fileInfo, formData) {
			if (formData && formData.prefix !== null) {
				return formData.prefix + "-" + formData._id + "-" + (new Date()).getTime() + "." + fileInfo.name.split(".").pop();
			}
			return (new Date()).getTime() + "." + fileInfo.name.split(".").pop();
		},
		finished: function(fileInfo, formData) {
			if (formData && formData._id !== null) {
				Wikis.update({_id: formData._id}, { $push: { uploads: fileInfo }});
			}
		}
	});
});