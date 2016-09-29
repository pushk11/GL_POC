import React from 'react';

class Common extends React.Component {
  constructor(props) {
  	super(props);
  }

  http(url, method, data, callbackInfo) {
  	//console.log("I am Common being called");

  	this.serverRequest = $.ajax({
		url: url,
		method: method,
		data: data,
		processData: false,
  		contentType: false,
		success: function(response) {
			//console.log(callbackInfo.obj, this);
			for(let i in callbackInfo.obj) {
				if (callbackInfo.callback == i) {
				  callbackInfo.obj[i](response);
				  return;
				}
			 };

		}
	});
  }
}

export default Common;