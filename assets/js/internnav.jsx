import React from 'react'
import ReactDom from 'react-dom'
import 'materialize-css'
import 'materialize-css/dist/css/materialize.min.css'
import '../css/main.css'
import Logout from './logout'
import NameProject from './nameproject'

 export default class InternNav extends React.Component{

    render(){
        return(
            <nav className="deep-purple darken-2 white-text">
                <div className="row">
                    <div className="col s12">
                        <div className="nav-wrapper">
                            <a href="#" className="brand-logo"><NameProject /></a>
                            <a href="#" data-activates="mobile-demo" className="button-collapse"><i className="material-icons">menu</i></a>
                            <ul id="nav-mobile" className="right hide-on-med-and-down">
                                <Logout />
                            </ul>
                            <ul className="side-nav" id="mobile-demo">
                                <Logout />
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }
}