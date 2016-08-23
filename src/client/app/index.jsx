import React from 'react';
import {render} from 'react-dom';
import Ideas from './Ideas.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

class App extends React.Component {
  render () {
    return (<div className="container"> 
    			<Header />
    			<Ideas />
    			<Footer />
    		</div>
    		);
  }
}

render(<App/>, document.getElementById('app'));
