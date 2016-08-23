"use strict"
var mysql = require('node-mysql/node_modules/mysql');

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

		     let result = Object.assign({}, Ideas.result, {status: 'ok', data: rowsData, msg: "Success - Listing Data"});

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
		var con = db();
		var input = req.body;
		if (input.id.trim() == '' || input.title.trim() == '' || input.body.trim() == '') {
			let result = Object.assign({}, Ideas.result, { msg: "Failed - Invalid data - provide Title/Body/ID required data"});
	 	 	res.json(result);
			return;
		}

		let data = { title: input.title, body : input.body};
		let where = {id: input.id};

		con.query('UPDATE idea SET ? WHERE ? ', [data, where], function(checkError, rows, fields) {
			if (!checkError ) {
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