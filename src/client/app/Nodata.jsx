import React from 'react';

export default class Nodata extends React.Component {
  render () {
    return (
    		<div className={this.props.show ? 'tileFormat show' : 'tileFormat hide' }>
				<div className="panel panel-primary">
					<div className="panel-heading">No Idea</div>
					<div className="panel-body">No detail found</div>
				</div>
			</div>
			);
  }
}