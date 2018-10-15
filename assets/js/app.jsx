import React from 'react'
import ReactDom from 'react-dom'
import Header from './header'
import Main from './main'
import Footer from './footer'
import '../css/main.css'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import Login from './login'
import Person from './person'
import Institution from './institution'
import 'materialize-css'
import 'materialize-css/dist/css/materialize.min.css'
import { isAuthenticated } from './auth'
import Home from './home2'
import PrivateRoute from './privateroute'

class Initial extends React.Component{
    render(){
        return(
            <div>
                <Header />
                <Main />
                <Footer />
            </div>
        )
    }
}

class App extends React.Component{

    constructor(props){
        super(props)
        this.state = {authenticated: isAuthenticated()}
    }

    render(){
        if (this.state.authenticated == true) {
            return(
                <Switch>
                    <PrivateRoute exact authenticated={this.state.authenticated} path="/donations/" component={ Home } />
                    <Redirect to="/donations/" />
                </Switch>
            )
        } else {
            return(
                <div className="deep-purple white-text">
                    <Route exact path="/" component={ Initial } />
                    <Route path="/accounts/login/" component={ Login } />
                    <Route path="/accounts/new-person/" component={ Person } />
                    <Route path="/accounts/new-institution/" component={ Institution } />
                </div>
            )
        }
    }
}

ReactDom.render((
    <BrowserRouter>
        <div>
            <App />
        </div>
    </BrowserRouter>), document.getElementById('app')
);