import React from 'react';

class Common extends React.Component {
  constructor(props) {
  	super(props);
  }

  http(url, method, data, callbackInfo) {
  	return $.ajax({
		url: url,
		method: method,
		data: ('GET' == method) ? $.param(data) : data,
		processData: false,
  		contentType: false, // to consider content type for file upload
		success: function(response) {
			for(let objAttr in callbackInfo.obj) {
				if (callbackInfo.callback == objAttr) {
				  callbackInfo.obj[objAttr](response);
				  return;
				}
			 };
		}
	});
  }
}

var host = "http://localhost:8081";

Common.defaultProps = {
   apiList: host + "/ideas",
   apiAdd: host + "/ideas/new",
   apiDelete: host + "/ideas/delete",
   apiUpdate: host + "/ideas/update"
}

export default Common;