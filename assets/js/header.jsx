import React from 'react';
import NameProject from './nameproject';
import { Link } from 'react-router-dom';

export default class Header extends React.Component{

    render(){
        return(
            <div className="main-header no-box-shadow" data-background-color="blue">
                <div className="nav-top">
                    <div className="container d-flex flex-row">
                        <button className="navbar-toggler sidenav-toggler2 ml-auto" type="button" data-toggle="collapse" data-target="collapse" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon">
                                <i className="icon-menu"></i>
                            </span>
                        </button>
                        <button className="topbar-toggler more"><i className="icon-options-vertical"></i></button>
                        <a href="index.html" className="logo d-flex align-items-center alimentai-name">
                            <h1><NameProject /></h1>
                        </a>
                        <nav className="navbar navbar-header-left navbar-expand-lg p-0">
                            <ul className="navbar-nav page-navigation pl-md-3">
                                <h3 className="title-menu d-flex d-lg-none">
                                    Menu
                                    <div className="close-menu"> <i className="flaticon-cross"></i></div>
                                </h3>
                            </ul>
                        </nav>
                        <nav className="navbar navbar-header navbar-expand-lg p-0">
                            <div className="container-fluid p-0">
                                <ul className="navbar-nav topbar-nav ml-md-auto align-items-center">
                                    <li className="nav-item">
                                        <Link to="/accounts/login/">
                                            <button className="btn btn-info btn-round"><i className="icon-login mr-1"></i> Login</button>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        );
    }
}