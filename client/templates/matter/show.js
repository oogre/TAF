


Template.mattershow.destroyed = function(){
	Session.set(Meteor.ORIGIN_REF, "");
}

Template.mattershow.helpers({
	originList : function(){
		var ref = Session.get(Meteor.ORIGIN_REF);
		if(ref){
			return Origins.find({
				matter : this.matter._id,
				ref : {
						$regex : ".*"+ref.toLowerCase().replace(/\.|\\|\+|\*|\?|\[|\^|\]|\$|\(|\)|\{|\}|\=|\!|\>|\||\:|\-/g, "")+".*"
					}
			}).fetch()
		}else{
			return Origins.find({
				matter : this.matter._id,
			}).fetch()
		}
	},
	disable : function(){
		return Session.equals(Meteor.ORIGIN_REF, "") ? "disabled" : "";
	}
});
Template.mattershow.events({
	"keyup input#ref" : function(event){
		var ref = $(event.target).val().trim();
		Session.set(Meteor.ORIGIN_REF, ref);
	},
	"click .add" : function(event){
		var ref = $("input#ref").val().trim();
		if(!ref)return false;
		Meteor.call("addOriginToMatter", this.matter._id, ref);
		return false;
	},
	"click .barcode" : function(event){
		if(Meteor.isCordova){
			cordova.plugins.barcodeScanner.scan(
				function (result) {
					$("input#ref").val(result.text);
					Session.set(Meteor.ORIGIN_REF, result.text);
				}, 
				function (error) {
					alert("Scanning failed: " + error);
				}
			);
		}
	}
});