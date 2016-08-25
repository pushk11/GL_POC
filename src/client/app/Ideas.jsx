import React from 'react';
import Nodata from './Nodata.jsx';

var API = {
	list: 'http://localhost:8081/ideas',
	add: 'http://localhost:8081/ideas/new',
	del: 'http://localhost:8081/ideas/delete',
	update: 'http://localhost:8081/ideas/update'
}

var callbackIdeas = (response, _this)=> {
	if ('ok' == response.status) {
		_this.setState({ideas: response.data});
		if (typeof(Storage) !== "undefined") {
			localStorage.setItem('ideas', response.data);
		}
	} else {
		// handle failed cases here or get data from localStorage
		if (typeof(Storage) !== "undefined" && localStorage.getItem('ideas')) {
			_this.setState({ideas: localStorage.getItem('ideas')});
		} else {
			_this.setState({ideas: []});
		}
	}
}

class Ideas extends React.Component {
   constructor(props){
  	super(props);
  	this.state = {ideas: [], error: '', body: '', title: '', id: 0, sortBy: 'date_desc'};

  	this.addIt = this.addIt.bind(this);
  	this.updateIt = this.updateIt.bind(this);
  	this.sortIt = this.sortIt.bind(this);
  	this.deleteIt = this.deleteIt.bind(this);
  	this.handleBody = this.handleBody.bind(this);
  	this.handleTitle = this.handleTitle.bind(this);
  	this.editIt = this.editIt.bind(this);
  }

  componentDidMount() {

  	this.serverRequest = $.ajax({
		url: API.list,
		method: 'GET',
		data: {},
		success: function(response) {
			callbackIdeas(response, this);
		}.bind(this)
	});
  }

  componentWillUnmount() {
  	 this.serverRequest.abort();
  }

  addIt(e) {
  	this.setState({error: ""});
  	$("#addBtn").addClass("hide");
  	$("#memoForm").removeClass("hide");
  	
  	this.serverRequest = $.ajax({
		url: API.add,
		method: 'POST',
		data: {},
		success: function(response) {
			if ('ok' == response.status) {
				this.setState({id: response.data.insertId});
			}
		}.bind(this)
	});
  }

  editIt(e) {
  	$("#memoForm").removeClass("hide");

  	//console.log(e.target.id, $("#"+e.target.id).data("title"), $("#"+e.target.id).data("body"));

  	this.setState({id: e.target.id, 
  		title: $("#"+e.target.id).data("title"), 
  		body:$("#"+e.target.id).data("body") 
  	});

  }

  updateIt(e) {

   let id = this.state.id;
   let title =this.state.title;
   let body = this.state.body;

   if (0 == id || 'undefined' == id || '' == title.trim()) {
   	 this.setState({error: "Title can not be blank"});
   	 console.log("ID/title undefined"+ id);
   	 return false;
   }

  	this.serverRequest = $.ajax({
		url: API.update,
		method: 'POST',
		data: {id: id, title: title, body: body },
		success: function(response) {
			if ('ok' == response.status) {
				$("#addBtn").removeClass("hide");
				$("#memoForm").addClass("hide");
				this.setState({body: '', id: 0, title: ''});
				callbackIdeas(response, this);
			}
		}.bind(this)
	});
  }

  deleteIt(e) {
  	this.serverRequest = $.ajax({
		url: API.del+"/"+e.target.value,
		method: 'DELETE',
		data: {id: e.target.value},
		success: function(response) {
			//this.setState({ideas: response});
			callbackIdeas(response, this);

		}.bind(this)
	});
  }

  sortIt(e) {
  	var sortBy = e.target.value;

  	this.setState({sortBy: sortBy});

  	this.serverRequest = $.ajax({
		url: API.list,
		method: 'GET',
		data: {sortBy: sortBy},
		success: function(response) {
			//this.setState({ideas: response});
			callbackIdeas(response, this);
		}.bind(this)
	});
  }

  handleBody(e) {
	this.setState({body: e.target.value});
  }

  handleTitle(e) {
	this.setState({title: e.target.value});
  }

  render () {

  	var ideas = this.state.ideas.map( (i) => {
  			return (
  					<div key={i.id} className="keepLeft">
						<div className="panel panel-primary tileFormat">
							<button className="keepRight btn btn-xs btn-warning" value={i.id} onClick={this.deleteIt}>X</button>
							<div className="panel-heading">{i.title}</div>
							<div className="panel-body cursorPointer" id={i.id} data-body={i.body} data-title={i.title} onClick={this.editIt}>{i.body}</div>
						</div>
    				</div>
  				)
  		}, this);


    return (
    	<div>
    		<div>
    			<div className="keepRight">
    				<button className="btn btn-xs btn-default clear" onClick={this.addIt} id="addBtn">Add</button>
    			</div>
    			<div className="col-sm-4 hide" id="memoForm">
    			    <div className={( this.state.title.length == 0 && this.state.error.length > 0) ? 'alert alert-warning clear' : 'hide clear'} >{this.state.error}</div>
    				<div className="form-group">
    				  <input type="hidden" id="id" ref="id" value={this.state.id} />
					  <label for="title">Title:</label>
					  <input type="text" className="form-control" ref="title" id="title" placeholder="title" value={this.state.title} onChange={this.handleTitle}/>
					</div>
					<div className="form-group">
					  <label for="body">Body:</label>
					  <textarea className="form-control" ref="body" id= "body" placeholder="body" rows="10" cols="10" value={this.state.body} onChange={this.handleBody}/>
					  <div className="clear">{this.state.body.length < 15 ? this.state.body.length : ''}</div>
					</div>
					<div className="form-group">
						<button className="btn btn-sm-default btn-info" onClick={this.updateIt} id="updateBtn">Update</button>
					</div>
    			</div>
    		</div>
    		
	    	<div className="tileContainer">
		    	<div className="clear">
	    			<div className="col-sm-4 ">
	    				<div className="form-group">
						  	<label for="usr">Sort By: </label>
			    			<select className="form-control" ref="sort" onChange={this.sortIt} value={this.state.sortBy}>
			    				<option value="title">Title</option>
			    				<option value="date_asc">Created Date Asc</option>
			    				<option value="date_desc">Created Date Desc</option>
			    			</select>
			    		</div>
			    	</div>	
	    		</div>
	    		<div className="clear">
			    	{ideas}
			    	<Nodata show={ideas.length > 0 ? false : true } />
		    	</div>
			</div>
			<div className="tileContainerView hide">
		    	
			</div>
		</div>
		);
  }
}

export default Ideas;