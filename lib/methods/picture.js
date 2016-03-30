"use strict";
/*global _ : false */
/*global Picts : false */
/*global Meteor : false */
/*global global : false */


Meteor.methods({
	/*
	picture : { 
			name: String,
   			path: String,
   			size: Integer,
   			type: String : 'image/png', 'image/jpeg',
   			subDirectory: String,
   			baseUrl: String,
   			url: String
   		}, String : data:image/jpeg;base64..., String : data:image/png;base64...

 	link : { 
 			collection: String : Collection._name, 
 			_id: String : Collection._id
 		}
 	*/
	pictureCreator: function (picture, link) {
		var self = this;
 		if(!Match.test(picture, Match.Where(function(picture){
			return 	(	Match.test(picture, String) &&
						(	picture.indexOf("data:image/jpeg;base64") == 0 || 
							picture.indexOf("data:image/png;base64") == 0	
						) 
					) ||
					(	Match.test(picture, Object) &&
						Match.test(picture.name, String) &&
						Match.test(picture.path, String)
					);
		}))){
			return new Meteor.Error("wrong formatting picture", "picture should be StringB64File or FileInfoObject");
		}
		if(!Match.test(link, Object)){
			return new Meteor.Error("wrong formatting linkObject");
		}
		if(!Match.test(link.collection, Match.Where(function(collection){
			return 	Match.test(collection, String) && 
					(	self.isSimumation && 
						typeof(window) == "object"  &&
						window[collection] ) ||
					(	typeof(global) == "object" &&
						global[collection]
					)

		}))){
			return new Meteor.Error("wrong formatting link.collection", "link.collection must match with a collection name");
		}
		var Collection = this.isSimumation ? window[link.collection] : global[link.collection];
		if(!Match.test(link._id, Match.Where(function(id){
			return 	!Match.test(id, String) ||
					!Collection.findOne({
						_id : id
					})
		}))){
			return new Meteor.Error("unknown "+Collection._name+" for link.id : "+link.id, "You probably type a wrong link.id : "+link.id);
		}
		this.unblock();

		var Collection = this.isSimumation ? window[link.collection] : global[link.collection];
		var raw = test(picture, String);
		
		var pictId =	Picts.insert({
							data : picture, 
							raw : raw,
							linkTo : link
						});
		
		Collection.update({
			_id : link._id
		}, {
			$push : {
				pictures : pictId
			}
		});
		return pictId;
	}
});