import React from 'react'
import NameProject from './nameproject'
import { Link } from 'react-router-dom'

export default class Header extends React.Component{

    render(){
        return(
            <header className="main-header">
                <div className="logo-header" data-background-color="blue2">
                    <a href="#" className="logo">
                        <NameProject />
                    </a>
                    <button className="navbar-toggler sidenav-toggler ml-auto" type="button" data-toggle="collapse" data-target="collapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon">
                            <i className="icon-menu"></i>
                        </span>
                    </button>
                    <button className="topbar-toggler more"><i className="icon-options-vertical"></i></button>
                    <div className="nav-toggle">
                        <button className="btn btn-toggle toggle-sidebar"><i className="icon-menu"></i></button>
                    </div>
                    <nav className="navbar navbar-header navbar-expand-lg" data-background-color="blue2">
                        <div className="container-fluid">
                            <ul className="navbar-nav topbar-nav ml-md-auto align-items-center">
                                <li className="nav-item">
                                    <Link to="/accounts/login/">
                                        <button className="btn btn-primary btn-border btn-round">Login</button>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </header>
        )
    }
}