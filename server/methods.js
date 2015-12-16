"use strict";
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
	getServerIp : function(){
		this.unblock();
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