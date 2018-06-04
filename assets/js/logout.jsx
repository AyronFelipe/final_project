import React from 'react'
import ReactDom from 'react-dom'
import 'materialize-css'
import 'materialize-css/dist/css/materialize.min.css'
import '../css/main.css'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import Login from './login'
import { logout } from './auth'

export default class Logout extends React.Component{

    constructor(props){
        super(props);
        this.logoutHandler = this.logoutHandler.bind(this);
    }

    logoutHandler(){
        logout();
        window.location.href = '/accounts/login/';
    }

    render(){
        return(
            <a className="btn waves-effect waves-light indigo accent-2 white-text" onClick={ this.logoutHandler }>Sair</a>
        )
    }
}