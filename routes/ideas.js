"use strict"
var mysql = require('node-mysql/node_modules/mysql');
var path = require('path');
var express = require('express');
var fse = require('fs-extra');

//var app = express();

var db = () => {
	return mysql.createConnection({
	   host     : 'localhost',
	   user     : 'root',
	   password : '',
	   database : 'memo'
	 });

////
};

var Ideas = {
	result: {status: 'failed', data: [], msg: ""},
	uploadPath: path.join(__dirname, '../public/uploads/'),

	getList: function(req, res) {

		    console.log(req.query.sortBy);

		    let sortBy = ' ORDER BY created_date DESC';
		    let qtrSortBy = (req.query.sortBy) ? req.query.sortBy.trim() : '';
		    if ('' != qtrSortBy) {
		    	switch(qtrSortBy) {
		    		case 'title':
		    		 sortBy = ' ORDER BY title';
		    		 break;
		    		case 'date_asc':
		    		 sortBy = ' ORDER BY created_date ASC';
		    		 break;
		    	}
		    }

		   let con = db();	
	 	   con.query('SELECT id, title, body, created_date FROM idea ' + sortBy, function(err, rows) {
		   if (!err) {
		     let len = rows.length;
		     let rowsData = [];
		     for(let i=0; i<len; i++) {
		     	rowsData.push(rows[i]);
		     }

		     let result = Object.assign({}, this.result, {status: 'ok', data: rowsData, msg: "Success - Listing Data"});

		 	 res.json(result);

		 	} else {
		 	 res.json({error: "Error in getting data", desc: err});
		     console.log('Error while performing Query.');
		   }

		 });
	},
	addIt: function(req, res) {
		let con = db();	
		con.query('INSERT into idea(title)VALUES(?)', [''], function(checkError, rows, fields) {
			if (!checkError ) {
				//res.json({'status' : 'ok'});
				let result = Object.assign({}, Ideas.result, {status: 'ok', data: rows, msg: "Success - Added Data"});
	 	 		res.json(result);
				con.end();
			} else {
				//res.json({'status' : 'failed'});
				let result = Object.assign({}, Ideas.result, {msg: "Failed - Not Added"});
	 	 		res.json(result);
				con.end();
			}
		});
	},
	updateIt: function(req, res) {
		try {
                var multiparty = require("multiparty");
				var form = new multiparty.Form();

			    form.parse(req, function(err, fields, files) {

				   	//////////////////////////////////////////
				   	
					//var input = req.body;
					var id = fields.id[0];
					var title = fields.title[0];
					var body = fields.body[0];

					if ( (!id || !title) || (id && id.trim() == '') || (title && title.trim() == '') ) {
						let result = Object.assign({}, Ideas.result, { msg: "Failed - Invalid data - provide Title/Body/ID required data"});
				 	 	res.json(result);
						return;
					}

					var con = db();
					let data = { title: title, body : body};
					let where = {id: id};

					con.query('UPDATE idea SET ? WHERE ? ', [data, where], function(checkError, rows, fields) {
						if (!checkError ) {

							/*if (typeof files.myFile !== 'undefined' && files.myFile[0]) {
							  var extArr = files.myFile[0].originalFilename.split('.');
							  var newPath =  Ideas.uploadPath + id+ "."+extArr[extArr.length-1];

							  try {
							  	console.log("Uploading......"+ files.myFile[0].path + " .. to "+ newPath);
							    fse.copySync(files.myFile[0].path, newPath);
							  } catch(e) {
							  	console.error("error in file upload");
							  } 
					        }*/
							//res.json({'status' : 'ok'});
							Ideas.getList(req, res);
							con.end();
						} else {
							//res.json({'status' : 'failed'});
							let result = Object.assign({}, Ideas.result, {msg: "Failed - Not Updated"});
				 	 		res.json(result);
							con.end();
						}
					});
					/////////////////////////////////////////
					 
				});

			
		} catch(e) {
			let result = Object.assign({}, Ideas.result, { msg: "Failed- Invalid Form Data"});
		 	res.json(result);
		}
	},
	deleteIt: function(req, res) {
		
		var input = req.params;
		var id = input.id;
		console.log(id);

		if (!id) {
			let result = Object.assign({}, Ideas.result, {msg: "Delete failed - Invalid ID"});
		 	res.json(result);
		} else {
			let con = db();	
			con.query('DELETE FROM idea WHERE id IN (?) ', [id], function(checkError, result) {
				if (!checkError && (result.affectedRows > 0) ) {
					Ideas.getList(req, res);

					// delete file
					/*try{
					 fse.removeSync(Ideas.uploadPath+id+".*");
				    } catch(e) {
				    	console.log("The file could not be removed");
				    }*/

					//res.json({'status' : 'ok'});
					con.end();
				} else {
					//res.json({'status' : 'failed'});
					con.end();
				}
			});
		}
	}


};

module.exports = Ideas;