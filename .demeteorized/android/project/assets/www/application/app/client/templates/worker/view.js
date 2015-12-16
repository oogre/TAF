(function(){

Template.workerview.helpers({
	workingAt: function(){
		return this.working && Works.findOne(this.working);
	}
})

}).call(this);
