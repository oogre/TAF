(function(){"use strict";
/*global _ : false */
/*global Picts : false */
/*global Meteor : false */
/*global global : false */


Meteor.methods({
	pictureCreator: function (picture, link) {
		this.unblock();
		
		var pictId =	Picts.insert({
							data : picture, 
							raw : _.isString(picture),
							linkTo : link
						});
		var Collection = this.isSimumation ? window[link.collection] : global[link.collection];
		
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

})();
