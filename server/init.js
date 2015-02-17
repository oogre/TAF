"use strict";
/*global Meteor : false */
/*global process : false */
/*global UploadServer : false */
/*global Npm : false */


Meteor.startup(function () {
	var os = Npm.require("os");
	var ifaces = os.networkInterfaces();

	Object.keys(ifaces).forEach(function (ifname) {
		ifaces[ifname].forEach(function (iface) {
			if ("IPv4" !== iface.family || iface.internal !== false) {
	  			// skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
	  			return;
			}
	  		Meteor.serverIP = iface.address;
		});
	});

	UploadServer.init({
		tmpDir : process.env.PWD + "/.uploads/tmp",
		uploadDir : process.env.PWD + "/.uploads/",
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
				Meteor.call("wikiUploadUpdator", formData._id, fileInfo);
			}
		}
	});
});