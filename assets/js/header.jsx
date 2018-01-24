import React from 'react'
import ReactDom from 'react-dom'
import CreateReactClass from 'create-react-class'
import { sideNav } from '../../components/bower_components/materialize/dist/js/materialize.min.js'

export default class Header extends React.Component{

    componentDidMount(){
        $('.button-collapse').sideNav();
    }

    render(){
        return(
            <header>
                <div className="navbar-fixed">
                    <nav className="deep-purple darken-2 white-text">
                        <div className="row">
                            <div className="col l12 m12 s12">
                                <div className="nav-wrapper">
                                    <a href="#!" className="brand-logo">Nome Projeto</a>
                                    <a href="#" data-activates="mobile-demo" className="button-collapse"><i className="material-icons">menu</i></a>
                                    <ul className="right hide-on-med-and-down">
                                        <li><a href="#como-funciona">Como Funciona?</a></li>
                                        <li><a href="#comecar">Começar</a></li>
                                        <li><a href="#quem-somos">Quem Somos?</a></li>
                                        <li><a href="#!">Login</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
                <ul className="side-nav" id="mobile-demo">
                    <li><a href="#como-funciona">Como Funciona?</a></li>
                    <li><a href="#comecar">Começar</a></li>
                    <li><a href="#quem-somos">Quem Somos?</a></li>
                    <li><a href="#!">Login</a></li>
                </ul>
            </header>
        )
    }
}