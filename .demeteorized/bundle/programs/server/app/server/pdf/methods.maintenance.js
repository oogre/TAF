(function(){"use strict";
/*global _ : false */
/*global s : false */
/*global Npm : false */
/*global Works : false */
/*global Wikis : false */
/*global Shops : false */
/*global Meteor : false */
/*global moment : false */
/*global Workers : false */
/*global process : false */


// meteor run android-device --mobile-server http://ogre.local:3000

Meteor.methods({
	maintenanceToPdf : function(workId){
		this.unblock();

		var Future = Npm.require("fibers/future");
		var myFuture = new Future();

		var currentUser = Meteor.user();
		var work = Works.findOne(workId);
		if(!work){
			console.log("BUG_1");
			return false;
		}
		var shop = Shops.findOne(work.shop._id);
		if(!shop){
			console.log("BUG_2");
			return false;
		}

		var filename = shop.brand.replace(" ", "-") + "/" + moment().format("YYYY-MM-DD") + "-maintenance-" + workId + ".pdf";
					
		var dest = process.env.PWD + "/.uploads/pdf/";

		var fs = Npm.require("fs");			
		if (fs.existsSync(dest+filename)) {
			return "/upload/pdf/"+filename;
		}


		var tasks =	_(work.modules||[]).chain()
					.map(function(module){
						return (module.tasks||[]).map(function(task){
							return task.name;
						})
					})
					.flatten()
					.unique()
					.sort()
					.value();
		var modules = 	_(work.modules||[]).chain()
						.map(function(module){
							return _([
								module.serial||"noSerial",
								tasks
								.map(function(task){
									task = _(module.tasks).chain().where({name: task}).first().value();
									if(_.isObject(task)){
										if(task.checked === true) return "V";
										else if(task.checked == null || task.checked == "") return ".";
										else return task.checked
									}
									else return "";
								})
							]).flatten();
						})
						.value();
		
		HTTP.call("GET", "http://pdftaf.ogre.be/ogre/maintenane.php", {
			params: {
				filename : filename,
				dest : dest,
				tasks : JSON.stringify(tasks),
				modules : JSON.stringify(modules)
			}
		}, function (error, result) {
			if(error) myFuture.throw(error);
			if(result.statusCode != 200) myFuture.throw(new Meteor.Error("statusCode-"+result.statusCode));
			try{
				Works.update({
					_id:workId
				}, {
					$set : {
						maintenance : result.data
					}
				});
				myFuture.return(result.data);
			}catch(e){
				myFuture.throw(new Meteor.Error("non_valid_VAT"));
			}
		});

		
		return myFuture.wait();
	}
});
}).call(this);

//# sourceMappingURL=methods.maintenance.js.map
