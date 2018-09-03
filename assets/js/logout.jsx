import React from 'react'
import 'materialize-css'
import 'materialize-css/dist/css/materialize.min.css'
import '../css/main.css'
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