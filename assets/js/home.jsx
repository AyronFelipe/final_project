import React from 'react'
import ReactDom from 'react-dom'
import 'materialize-css'
import 'materialize-css/dist/css/materialize.min.css'
import '../css/main.css'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import Donations from './donations'
import Donation from './donation'
import PrivateRoute from './privateroute'
import Login from './login'
import { isAuthenticated } from './auth'
import InternNav from './internnav'

class Home extends React.Component{

    constructor(props){
        super(props)
        this.state = {authenticated: isAuthenticated()}
    }

    componentDidMount(){
        $('.button-collapse').sideNav()
    }

    render(){
        return(
            <BrowserRouter>
                <div>
                    <header>
                        <PrivateRoute authenticated={ this.state.authenticated } component={ InternNav } />
                    </header>
                    <main>
                        <Route exact path="/accounts/login/" component={ Login } />
                        <PrivateRoute exact authenticated={ this.state.authenticated } path="/donations/" component={ Donations } />
                        <PrivateRoute authenticated={ this.state.authenticated } path="/donations/new-donation/" component={ Donation } />
                    </main>
                </div>
            </BrowserRouter>
        )
    }
}

ReactDom.render(
    <Home />, document.getElementById('home')
)