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
        $('ul.tabs').tabs();
        $('.indicator').css('background-color', '#512da8');
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
                        <div className="row">
                            <div className="col s12">
                                <br/>
                                <ul className="tabs">
                                    <li className="tab col s5 offset-s1"><a className="active purple-text" href="#doacoes">Doações</a></li>
                                    <li className="tab col s5"><a className="purple-text" href="#pedidos">Pedidos</a></li>
                                </ul>
                            </div>
                            <div id="doacoes">
                                <PrivateRoute exact authenticated={ this.state.authenticated } path="/donations/" component={ Donations } />
                                <PrivateRoute authenticated={ this.state.authenticated } path="/donations/new-donation/" component={ Donation } />
                            </div>
                            <div id="pedidos">
                                <div className="row">
                                    <div className="col s12">
                                        <h4>Aqui vão ficar os pedidos</h4>
                                    </div>
                                </div>
                            </div>
                        </div>            
                    </main>
                </div>
            </BrowserRouter>
        )
    }
}

ReactDom.render(
    <Home />, document.getElementById('home')
)