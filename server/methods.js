"use strict";
/*global Npm : false */
/*global Meteor : false */

Meteor.methods({
	getServerIp : function(){
		var Future = Npm.require("fibers/future");
		var myFuture = new Future();
		var exec = Npm.require("child_process").exec;
		exec("ifconfig", function (error, stdout) {
			try{
				stdout = stdout.split("en1").pop();
				stdout = stdout.split("en2").shift();
				stdout = stdout.split("inet ").pop();
				myFuture.return(stdout.split(" netmask").shift());
			}catch(e){
				myFuture.return("");
			}
		});
		return myFuture.wait();
	}
});