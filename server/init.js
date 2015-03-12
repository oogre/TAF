"use strict";
/*global Meteor : false */
/*global Roles : false */
/*global Tasks : false */
/*global Wikis : false */
/*global Units : false */
/*global Modules : false */
/*global process : false */
/*global UploadServer : false */

var uploadServerInit = function(){
	UploadServer.init({
		tmpDir : process.env.PWD + "/.uploads/tmp",
		uploadDir : process.env.PWD + "/.uploads/",
		minFileSize : 20,
		checkCreateDirectories : true, //create the directories for you
		getDirectory: function(fileInfo, formData) {
			if (formData && formData.directoryName) {
				return formData.directoryName;
			}
			return "";
		},
		getFileName: function(fileInfo, formData) {
			var ext = fileInfo.type.split("/").pop();
			var filename = (new Date()).getTime() + "." + ext;
			if (formData && formData._id) filename = formData._id + "-" + filename;
			if (formData && formData.prefix) filename = formData.prefix + "-" + filename;
			return filename;
		},
		finished: function(fileInfo, formData) {
			if (formData && formData._id) {
				if(formData.next === "workSignature"){
					Meteor.call("workSignature", formData._id, formData.prefix, fileInfo);
				}else{
					Meteor.call("wikiUploadUpdator", formData._id, fileInfo);	
				}
			}
		}
	});
};

var rolesInit = function(){
	if(Roles.find().count() === 0 ){
		Roles.insert({
			level : 100,
			name : "administrator"
		});
		Roles.insert({
			level : 90,
			name : "boss"
		});
		Roles.insert({
			level : 80,
			name : "chef"
		});
		Roles.insert({
			level : 60,
			name : "travailleur"
		});
		Roles.insert({
			level : 50,
			name : "visiteur"
		});
	}	
};

var unitsInit = function(){
	if(Units.find().count() === 0 ){
		Units.insert({
			name : "gramme",
			shortname : "g"
		});
		Units.insert({
			name : "kilogramme",
			shortname : "kg"
		});
		Units.insert({
			name : "litre",
			shortname : "l"
		});
		Units.insert({
			name : "centimètre",
			shortname : "cm"
		});
		Units.insert({
			name : "mètre",
			shortname : "m"
		});
	}	
};

var clean = function(){
	Modules.remove({});
	Tasks.remove({});
	Wikis.remove({});
};

Meteor.startup(function () {
	uploadServerInit();
	rolesInit();
	unitsInit();
});