import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import PrivateRoute from './privateroute';
import { isAuthenticated } from './auth';
import InternNav from './internnav';
import DonationsMain from './donations_main';

class Home extends React.Component{

    constructor(props){
        super(props)
        this.state = { authenticated: isAuthenticated() }
    }

    render(){
        return(
            <BrowserRouter>
                <div className="wrapper overlay-sidebar">
                    <div className="main-header">
                        <PrivateRoute authenticated={this.state.authenticated} component={InternNav} />
                    </div>
                    <div className="main-panel">
                        <PrivateRoute exact authenticated={this.state.authenticated} path="/donations/" component={DonationsMain} />
                    </div>
                </div>
            </BrowserRouter>
        )
    }
}

ReactDom.render(
    <Home />, document.getElementById('home')
)