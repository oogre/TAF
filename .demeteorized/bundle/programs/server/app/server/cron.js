(function(){"use strict";
/*global _ : false */
/*global Npm : false */
/*global Works : false */
/*global Picts : false */
/*global Meteor : false */
/*global Buffer : false */
/*global process : false */
/*global SyncedCron : false */

Meteor.startup(function () {
	
	SyncedCron.add({
		name: "Turn Base64 Picts to files",
		schedule: function(parser) {
			return parser.recur().on("03:05:00").time();
		}, 
		job: function() {
			function b64toArrayBuffer(b64){
				b64 = b64.split(",")[1];
				var res = new Buffer(b64, "base64").toString("binary");
				var buffer = new ArrayBuffer( res.length );
				var view   = new Uint8Array( buffer );
				var len    = view.length;
				for (var i = 0 ; i < len; i++) {
					view[i] = res[i].charCodeAt(0);
				}
				return view;
			}
			var fs = Npm.require("fs");
			Picts
			.find({
				raw : true
			})
			.fetch()
			.map(function(pict){
				if(_.isString(pict.data)){
					var arrayBuffer = b64toArrayBuffer(pict.data);
					var data = pict.data.split(";")[0];
					var ext = data.split("/")[1];
					var filename = pict._id + "-" + (new Date()).getTime() + "." + ext;
					fs.writeFileSync(process.env.PWD+"/.uploads/images/"+filename, new Buffer(arrayBuffer), {encoding : "binary"});
					Picts.update(pict._id, {
						$set : {
							data : {
								type : data.split(":")[1],
								size : arrayBuffer.length,
								name : filename,
								path : "images/"+filename
							},
							raw : false
						}
					});
				}
			});
		}
	});

	SyncedCron.add({
		name: "Turn Base64 Works signature to files",
		schedule: function(parser) {
			return parser.recur().on("03:010:00").time();
		}, 
		job: function() {
			function b64toArrayBuffer(b64){
				b64 = b64.split(",")[1];
				var res = new Buffer(b64, "base64").toString("binary");
				var buffer = new ArrayBuffer( res.length );
				var view   = new Uint8Array( buffer );
				var len    = view.length;
				for (var i = 0 ; i < len; i++) {
					view[i] = res[i].charCodeAt(0);
				}
				return view;
			}
			var fs = Npm.require("fs");
			Works
			.find({
				raw : true
			})
			.fetch()
			.map(function(work){
				var updates = {};
				var arrayBuffer;
				var data;
				var ext;
				var filename;
				if(work.signatures && _.isString(work.signatures.client)){
					arrayBuffer = b64toArrayBuffer(work.signatures.client);
					data = work.signatures.client.split(";")[0];
					ext = data.split("/")[1];
					filename = "client-"+work._id + "-" + (new Date()).getTime() + "." + ext;
					fs.writeFileSync(process.env.PWD+"/.uploads/signatures/"+filename, new Buffer(arrayBuffer), {encoding : "binary"});
					updates["signatures.client"] = {
						type : data.split(":")[1],
						size : arrayBuffer.length,
						name : filename,
						path : "signatures/"+filename
					};
				}
				if(work.signatures && _.isString(work.signatures.adf)){
					arrayBuffer = b64toArrayBuffer(work.signatures.adf);
					data = work.signatures.adf.split(";")[0];
					ext = data.split("/")[1];
					filename = "adf-"+work._id + "-" + (new Date()).getTime() + "." + ext;
					fs.writeFileSync(process.env.PWD+"/.uploads/signatures/"+filename, new Buffer(arrayBuffer), {encoding : "binary"});
					updates["signatures.adf"] = {
						type : data.split(":")[1],
						size : arrayBuffer.length,
						name : filename,
						path : "signatures/"+filename
					};
				}
				updates.raw=false;
				Works.update(work._id, {
					$set : updates
				});
			});
		}
	});

	SyncedCron.start();
});
}).call(this);
