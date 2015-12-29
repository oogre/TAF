(function(){"use strict";
/*global Meteor : false */
/*global Roles : false */
/*global Tasks : false */
/*global Shops : false */
/*global Wikis : false */
/*global Units : false */
/*global Works : false */
/*global Picts : false */
/*global Matters : false */
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
			console.log("getDirectory");
			if (formData && formData.directoryName) {
				return formData.directoryName;
			}
			return "";
		},
		getFileName: function(fileInfo, formData) {
			console.log("getFileName");
			var ext = fileInfo.type.split("/").pop();
			var filename = (new Date()).getTime() + "." + ext;
			if (formData && formData._id) filename = formData._id + "-" + filename;
			if (formData && formData.prefix) filename = formData.prefix + "-" + filename;
			return filename;
		},
		finished: function(fileInfo, formData) {
			console.log(formData);
			console.log(fileInfo);
			console.log("fileInfo");
			if (formData && formData._id) {
				if(formData.next === "workSignature"){
					Meteor.call("workSignature", formData._id, formData.prefix, fileInfo);
				}else{
					Meteor.call("pictureCreator", fileInfo, {
						collection : formData.collection,
						_id : formData._id,
					});
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

var expandItmModuleToAllITMShop = function(){
	var modules = Shops.findOne("ifhkrkmHQaY47e4iW").modules;
	Shops.find({
		name:/.*itm.*/
	})
	.fetch()
	.map(function(shop){
		if(shop._id === "ifhkrkmHQaY47e4iW")return ;
		Shops.update(shop._id, {
			$set : {
				modules : modules
			}
		});
	});
};

var clean = function(){
	Modules.remove({});
	Matters.remove({});
	Works.remove({});
	Picts.remove({});
	Tasks.remove({});
	Wikis.remove({});
};

WebApp.connectHandlers.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  return next();
});


Meteor.startup(function () {
	uploadServerInit();
	rolesInit();
	unitsInit();
	process.env.KEY_GOOGLE = process.env.KEY_GOOGLE || "AIzaSyCVOeZt_PwTAqSjIv-7DBc5JZCuiZTp-Co";
});
}).call(this);

//# sourceMappingURL=init.js.map
