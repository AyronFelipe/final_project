import React from 'react'
import ReactDom from 'react-dom'
import CreateReactClass from 'create-react-class'
import $ from 'jquery'

export default class Header extends React.Component{
    render(){
        return(
            <header>
                <nav className="deep-purple darken-2 white-text">
                    <div className="row">
                        <div className="col s12">
                            <div className="nav-wrapper">
                                <a href="#!" className="brand-logo">Nome Projeto</a>
                                <a href="#" data-activates="mobile-demo" className="button-collapse"><i className="material-icons">menu</i></a>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        )
    }
}