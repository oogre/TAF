(function(){Meteor.lockers = {};

Meteor.lock = function(methodName, id){
	if(Meteor.isLock(methodName, id)) return;
	Meteor.lockers[methodName] = Meteor.lockers[methodName] || [];
	Meteor.lockers[methodName].push(id);
	console.log(methodName+" is locked for "+id);
};

Meteor.isLock = function(methodName, id){
	Meteor.lockers[methodName] = Meteor.lockers[methodName] || [];
	return Meteor.lockers[methodName].indexOf(id) > -1;
};

Meteor.whilelock = function(methodName, id){
	var t0 = new Date().getTime();
	while(Meteor.isLock(methodName, id)){
		if(new Date() - t0 > 5000){
			throw new Meteor.Error("method loked for too long", methodName+" is locked for "+id);
		}
	}
};

Meteor.unLock = function(methodName, id){
	Meteor.lockers[methodName] = Meteor.lockers[methodName] || [];
	var item = Meteor.lockers[methodName].indexOf(id)
	Meteor.lockers[methodName].splice(item, 1);
	console.log(methodName+" is unlocked for "+id);
};
}).call(this);
