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
			if (formData && formData.directoryName) {
				return "/"+formData.directoryName+"/";
			}
			return "";
		},
		getFileName: function(fileInfo, formData) {
			var ext = fileInfo.type.split("/").pop();
			var filename = (new Date()).getTime() + "." + ext;
			if (formData && formData._id) filename = formData._id + "-" + filename;
			if (formData && formData.prefix) filename = formData.prefix + "-" + filename;
			return 	filename;
		},
		finished: function(fileInfo, formData) {
			if (formData && formData._id) {
				if(formData.next === "workSignature"){
					Meteor.call("workSignature", formData._id, formData.prefix, fileInfo, function(error){
						if(error) throw error;
					});
				}else{
					Meteor.call("pictureCreator", fileInfo, {
						collection : formData.collection,
						_id : formData._id,
					}, function(error){
						if(error) throw error;
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
			name : "-",
			shortname : ""
		});
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
var initAdmin = function(){
	if(Workers.find().count() == 0){
		var id = Accounts.createUser({
					email : "vincent@ogre.be",
					password : "gdutaf",
					profile : {
						firstname : "vincent",
						lastname : "evrard",
						phone : "+32495876315",
						role : 100,
						address : {
							city: "bruxelles",
							country : "belgique",
							number : "11",
							street : "avenue télémaque",
							zipcode : "1190"
						}
					}
				});
		console.log("user created : "+id);
	}
	if(Shops.find().count() == 0){
		var shop = {
			brand : "ogre",
			name : "asbl productions associées",
			tva : "be0896755397",
			contacts : ["vincent@ogre.be"],
			address : {
				city: "bruxelles",
				country : "belgique",
				number : "11",
				street : "avenue télémaque",
				zipcode : "1190"
			}
		};
		var shopId = Shops.insert(shop);
		console.log("shop created : "+shopId);
		var address = shop.address.street+" "+shop.address.number+" "+shop.address.city+" "+shop.address.zipcode;
		Meteor.getLocationInfo(address, function(err, locationInfo){
			if(err) throw err;
			Shops.update(shopId, {
				$set : locationInfo
			});
			console.log("shop updated : "+shopId);
		});
	}
}

WebApp.connectHandlers.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  return next();
});


Meteor.startup(function () {
	moment.locale('fr');
	uploadServerInit();
	rolesInit();
	unitsInit();
	initAdmin();
	Meteor.QG = {
		location: {
			lat: 50.6797964,
			lng: 5.532689
		}
	};

	Meteor.config = {
		path : "/www/application/app" //"/public" // /programs/web.browser/app/ // /www/application/app
	}
	process.env.KEY_GOOGLE = process.env.KEY_GOOGLE;
});
}).call(this);
