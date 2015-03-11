"use strict";
/*global _ : false */
/*global Npm : false */
/*global Works : false */
/*global Wikis : false */
/*global Meteor : false */
/*global Buffer : false */
/*global process : false */
/*global SyncedCron : false */

Meteor.startup(function () {
	SyncedCron.add({
		name: "Clean empty wikis",
		schedule: function(parser) {
			return parser.recur().on("03:00:00").time();
		}, 
		job: function() {
			Wikis.remove({
				description : "",
				uploads : []
			});
		}
	});

	SyncedCron.add({
		name: "Turn Base64 Wiki pictures to files",
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
			Wikis
			.find({
				raw : true
			})
			.fetch()
			.map(function(wiki){
				var updates = {};
				wiki
				.uploads
				.map(function(upload, key){
					if(_.isString(upload)){
						var arrayBuffer = b64toArrayBuffer(upload);
						var data = upload.split(";")[0];
						var ext = data.split("/")[1];
						var filename = wiki._id + "-" + (new Date()).getTime() + "." + ext;
						fs.writeFileSync(process.env.PWD+"/.uploads/images/"+filename, new Buffer(arrayBuffer), {encoding : "binary"});
						updates["uploads."+key] = {
							type : data.split(":")[1],
							size : arrayBuffer.length,
							name : filename,
							path : "images/"+filename
						};
					}
				});
				updates.raw=false;
				Wikis.update(wiki._id, {
					$set : updates
				});
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