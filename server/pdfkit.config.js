"use strict";
/*global Meteor : false */
/*global process : false */

Meteor.pdfkitConfig = {
	param : {
		filename : "default.pdf",
		page : {
			size : "A4",
			margins : {
				left : 15,
				top : 15,
				right : 15,
				bottom : 15
			},
			colomn : 7
		},
		line : {
			height : 9,
			padding : 2,
			margin : 5
		},
		stroke : {
			bold : 2,
			thin : 0.2
		},
		fill : {
			grey : "#dedede",
			black : "#000000"
		},
		fonts : [{
				name : "DejaVuSans",
				file : process.env.PWD + "/public/fonts/dejavu/DejaVuSans.ttf"
			},{
				name : "DejaVuSans-Bold",
				file : process.env.PWD + "/public/fonts/dejavu/DejaVuSans-Bold.ttf"
			},{
				name : "DejaVuSansMono",
				file : process.env.PWD + "/public/fonts/dejavu/DejaVuSansMono.ttf"
			},{
				name : "DejaVuSansMono-Bold",
				file : process.env.PWD + "/public/fonts/dejavu/DejaVuSansMono-Bold.ttf"
			}]
	},
	templates : function(pdf){
		return 	pdf
				.template("header", function(doc, data){
					var x = doc.param.page.margins.left;
					var y = doc.param.page.margins.top;
					var h = 75;
					doc.image(data, x, y, {height: h});
					doc.oogre.position = [x, y+h];
				})
				.template("row", function(doc, data){
					/*if(doc.oogre.hasToNextPage()){
						doc.oogre.addPage(data.hasToAddPage);
					}*/
					var prev = 0;
					data.x = data.x||doc.param.page.margins.left;
					data.y = data.y||doc.y;

					(data.content||[]).map(function(content){
						doc.x = data.x + (prev * doc.oogre.colWidth);
						doc.y = data.y;
						pdf.template("cel", content);
						prev += content.size;
					});
					var line = Math.ceil((doc.y-data.y)/(doc.param.line.height+doc.param.line.padding));
					doc.x = data.x;
					doc.y = data.y += (line * (doc.param.line.height+doc.param.line.padding));
				})
				.template("cel", function(doc, data){
					var _width = parseInt(data.size) * doc.oogre.colWidth;
					var _tmpY = doc.y;
					doc
					.fill(doc.param.fill.black)
					.fontSize(8);
					data.text.map(function(txt){
						if(txt.folio){
							doc.oogre.setGet("folio", {
								position : {
									x : doc.x,
									y : doc.y
								},
								width : _width,
								align : txt.align
							});
						}
						if(txt.align === "center"){
							txt.value.split(/<b>|<\/b>/)
							.map(function(t, key){
								if(key%2===0){
									doc
									.font("DejaVuSans");
								}else{
									doc
									.font("DejaVuSans-Bold");
								}
								doc.y --;
								doc.text(t, {
									width : _width,
									align: txt.align
								});
							});
						}
						else{
							doc.x += doc.param.line.padding;
							txt.value.split(/<b>|<\/b>/)
							.map(function(t, key){
								if(key%2===0){
									doc
									.font("DejaVuSans");
								}else{
									doc
									.font("DejaVuSans-Bold");
								}
								doc.y --;
								doc.text(t);
								doc.y = _tmpY;
								doc.x -= doc.param.line.padding;
							});
						}
					});
					var line = Math.ceil((doc.y-_tmpY)/(doc.param.line.height+doc.param.line.padding));
					if(data.border!==false){
						doc
						.lineWidth(doc.param.stroke.thin)
						.rect(	doc.x, 
								_tmpY - doc.param.line.padding, 
								_width, 
								line * (doc.param.line.height+doc.param.line.padding))
						.stroke();
					}
				})
				.template("footer", function(doc, data){
					data = {
						x : doc.param.page.margins.left,
						y : doc.page.height - doc.page.margins.bottom - 50,
						content : data
					};
					
					doc
					.moveTo(data.x, data.y)
					.lineWidth(doc.param.stroke.bold)
					.lineTo(data.x+doc.oogre.usedWidth, data.y)
					.stroke();

					data.y += doc.param.line.margin;
					pdf.template("row", data);
				})
				.template("title", function(doc, data){
					data = {
						x : doc.oogre.position[0],
						y : doc.oogre.position[1]+15,
						content : data
					};

					doc
					.lineWidth(doc.param.stroke.thin)
					.rect(	data.x, 
							data.y - doc.param.line.padding, 
							doc.oogre.usedWidth, 
							doc.param.line.height+doc.param.line.padding )
					.fill(doc.param.fill.grey)
					.stroke();
					
					pdf.template("row", data);
					doc.y += doc.param.line.margin;
				})
				.template("newSection", function(doc, data){
					data.x = data.x||doc.param.page.margins.left;
					data.y = data.y||doc.y;

					doc.y += doc.param.line.margin;
					doc
					.moveTo(doc.x, doc.y)
					.lineWidth(doc.param.stroke.bold)
					.lineTo(data.x+doc.oogre.usedWidth, doc.y)
					.stroke();
					doc.y += doc.param.stroke.bold;
				});

	}

};