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
import { storageToken, isAuthenticated } from './auth'
import Home from './home2'
import PrivateRoute from './privateroute'
import 'gritter/js/jquery.gritter.min.js'
import 'gritter/css/jquery.gritter.css'

class Initial extends React.Component{
    render(){
        return(
            <React.Fragment>
                <Header />
                <Main />
                <Footer />
            </React.Fragment>
        )
    }
}

class App extends React.Component{

    constructor(props){
        super(props)
        this.state = {authenticated: false}
    }

    componentDidMount(){
        if ( localStorage.token == "" || localStorage.token == undefined ) {
            storageToken("")
            this.setState({authenticated: false})
        } else {
            storageToken(localStorage.token)
            this.setState({ authenticated: true })
        }
    }

    render(){
        if (localStorage.token == "" || localStorage.token == undefined) {
            return(
                <div className="wrapper">
                    <Route exact path="/" component={ Initial } />
                    <Route path="/accounts/login/" component={ Login } />
                    <Route path="/accounts/new-person/" component={ Person } />
                    <Route path="/accounts/new-institution/" component={ Institution } />
                </div>
            )
        } else {
            return(
                <div>
                    <Switch>
                        <PrivateRoute exact authenticated={this.state.authenticated} path="/donations/" component={ Home } />
                        <Redirect to="/donations/" />
                    </Switch>
                </div>
            )
        }
    }
}

ReactDom.render((
    <BrowserRouter>
        <React.Fragment>
            <App />
        </React.Fragment>
    </BrowserRouter>), document.getElementById('app')
);