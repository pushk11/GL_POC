import React from 'react';
import Nodata from './Nodata.jsx';
import ReactDOM from 'react-dom';
import CommonClass from './Common.jsx';

class IdeasContent extends CommonClass {
  render() {
    return (
      <div key={this.props.content._id} className="keepLeft">
            <div className="panel panel-primary tileFormat tileFormatMore">
              <button className="keepRight btn btn-xs btn-warning" value={this.props.content._id} onClick={this.props.parentThis.deleteIt.bind(null,this.props.content)}>X</button>
              <div className="panel-heading">{this.props.content.title}</div>
              <div className="panel-body">{this.props.content.body}</div>
              <div className="panel-footer cursorPointer" onClick={this.props.parentThis.editIt.bind(null,this.props.content)}>Edit It</div>
            </div>
      </div>
    );
  }
}

class Ideas extends CommonClass {
   constructor(props){
  	super(props);
  	this.state = {ideas: [], 
  		error: '', 
  		body: '', 
  		title: '', 
  		id: 0, 
  		sortBy: 'date_desc',
  		addEditAction: ''
  	};

  	this.addIt = this.addIt.bind(this);
  	this.updateIt = this.updateIt.bind(this);
  	this.sortIt = this.sortIt.bind(this);
  	this.deleteIt = this.deleteIt.bind(this);
  	this.handleBody = this.handleBody.bind(this);
  	this.handleTitle = this.handleTitle.bind(this);
  	this.editIt = this.editIt.bind(this);
  	this.callbackIdeas = this.callbackIdeas.bind(this);
    this.callbackAdd = this.callbackAdd.bind(this);
    this.callbackUpdate = this.callbackUpdate.bind(this);
    this.callbackDelete = this.callbackDelete.bind(this);
    this.callbackSortIt = this.callbackSortIt.bind(this);
  	this.cancelIt = this.cancelIt.bind(this);
  }

  callbackIdeas(response) {
  	if ('ok' == response.status) {
  		this.setState({ideas: response.data});
  		if (typeof(Storage) !== "undefined") {
  			localStorage.setItem('ideas', response.data);
  		}
  	} else {
    		// handle failed cases here or get data from localStorage
    		if (typeof(Storage) !== "undefined" && localStorage.getItem('ideas')) {
    			this.setState({ideas: localStorage.getItem('ideas')});
    		} else {
    			this.setState({ideas: []});
    		}
  	}
  }

  componentDidMount() {
    let callbackInfo = {obj: this, callback: 'callbackIdeas'};
    this.serverRequest = this.http(this.props.apiList,'GET',{}, callbackInfo);
  }

  componentWillUnmount() {
  	 this.serverRequest.abort();
  }

  resetFieldFieldsBlank() {
  	this.setState({title:'', body:'', error: '', addEditAction: ''});
  }

  addIt(e) {
  	this.resetFieldFieldsBlank();

  	this.setState({addEditAction: 'ADD'});

  	$("#addBtn").addClass("hide");
  	$("#memoForm").removeClass("hide");

  	//$('#myFile').val('');

  	ReactDOM.findDOMNode(this.refs.title).focus();

    let callbackInfo = {obj: this, callback: 'callbackAdd'};
    this.http(this.props.apiAdd,'POST', {}, callbackInfo);

  }

  callbackAdd(response) {
    if ('ok' == response.status) {
      this.setState({id: response.data.insertId});
    }
  }

  editIt(obj) {
  	$("#memoForm").removeClass("hide");
  	this.resetFieldFieldsBlank();

  	this.setState({addEditAction: 'EDIT'});

  	this.setState({id: obj._id, 
  		title: obj.title, 
  		body: obj.body
  	});

  	//$('#myFile').val('');

  	$("#title").focus();

  }

  updateIt(e) {

  	e.preventDefault();

   var id = this.state.id;
   var title =this.state.title;
   var body = this.state.body;

   if (0 == id || 'undefined' == id || '' == title.trim()) {
   	 this.setState({error: "Title can not be blank"});
   	 console.log("ID/title undefined"+ id);
   	 return false;
   }

   var fd = new FormData();
   fd.append('id', id);
   fd.append('title', title);
   fd.append('body', body);

   /*if ($('#myFile').val() != "") {
   	fd.append('myFile', $('#myFile')[0].files[0]);
   }*/

   console.log(fd);

   let callbackInfo = {obj: this, callback: 'callbackUpdate'};
   this.http(this.props.apiUpdate,'POST', fd, callbackInfo);
  }

  callbackUpdate(response) {
    if ('ok' == response.status) {
      $("#addBtn").removeClass("hide");
      $("#memoForm").addClass("hide");
      this.setState({body: '', id: 0, title: ''});
      this.callbackIdeas(response);
    } else {
      this.setState({error: response.msg});
    }
  }

  deleteIt(obj) {
  	//e.preventDefault();
  	var id = obj._id;
    let callbackInfo = {obj: this, callback: 'callbackDelete'};
    this.http(this.props.apiDelete+"/"+id,'DELETE', {id: id}, callbackInfo);
  }

  callbackDelete(response) {
    this.callbackIdeas(response);
  }

  sortIt(e) {
  	var sortBy = e.target.value;

  	this.setState({sortBy: sortBy});

    let callbackInfo = {obj: this, callback: 'callbackSortIt'};
    this.http(this.props.apiList,'GET', {sortBy: sortBy}, callbackInfo);

  }

  callbackSortIt(response) {
    this.callbackIdeas(response);
  }

  handleBody(e) {
	this.setState({body: e.target.value});
  }

  handleTitle(e) {
  	if (e.target.value.length > 0) {
  		this.setState({error: ""});
  	}
	this.setState({title: e.target.value});
  }

  cancelIt(e) {
  	e.preventDefault();
  	$("#memoForm").addClass("hide");
  	$("#addBtn").removeClass("hide");

  	if ('ADD' == this.state.addEditAction) {
  		// call delete
  		this.deleteIt({_id: this.state.id});
  	}
  }

  render () {

  	var ideas = this.state.ideas.map( (i, index) => {
  			return (
            <IdeasContent content={i} key={index} parentThis={this} />
  				)
  		}, this);


    return (
    	<div>
    		<div>
    			<div className="keepRight">
    				<button className="btn btn-xs btn-default clear" onClick={this.addIt} id="addBtn">Add</button>
    			</div>
    			<div className="col-sm-4 hide" id="memoForm">
    			   <form method="post" encType="multipart/form-data" name="ideasForm">
	    			    <div className={( this.state.error.length > 0) ? 'alert alert-warning clear' : 'hide clear'} >{this.state.error}</div>
	    				<div className="form-group">
	    				  <input type="hidden" id="id" ref="id" value={this.state.id} />
	    				  <input type="hidden" id="addEditAction" ref="addEditAction" value={this.state.addEditAction} />
						  <label htmlFor="title">Title:</label>
						  <input type="text" className="form-control" ref="title" id="title" placeholder="title" value={this.state.title} onChange={this.handleTitle}/>
						</div>
						<div className="form-group">
						  <label htmlFor="body">Body:</label>
						  <textarea className="form-control" ref="body" id= "body" placeholder="body" rows="10" cols="10" value={this.state.body} onChange={this.handleBody}/>
						  <div className="clear">{this.state.body.length < 15 ? this.state.body.length : ''}</div>
						</div>
						{/*<div className="form-group">
						  <label htmlFor="myFile">File:</label>
						  <input type="file" className="form-control" ref="myFile" id= "myFile" />
						</div> */}
						<div className="form-group">
							<button className="btn btn-sm-default btn-info marginSml" onClick={this.updateIt} id="updateBtn">Update</button>
							<button className="btn btn-sm-default btn-warning marginSml" onClick={this.cancelIt} id="cancelBtn">Cancel</button>
						</div>
					</form>
    			</div>
    		</div>
    		
	    	<div className="tileContainer">
		    	<div className="clear">
	    			<div className="col-sm-4 ">
	    				<div className="form-group">
						  	<label htmlFor="sort">Sort By: </label>
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
		</div>
		);
  }
}

export default Ideas;