import React from 'react'
import ReactDom from 'react-dom'
import 'materialize-css'
import 'materialize-css/dist/css/materialize.min.css'
import '../css/main.css'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import Donations from './donations'
import Donation from './donation'

class Home extends React.Component{

    componentDidMount(){
        $('.button-collapse').sideNav()
    }

    render(){
        return(
            <BrowserRouter>
                <div>
                    <header>
                        <nav className="deep-purple darken-2 white-text">
                            <div className="row">
                                <div className="col s12">
                                    <div className="nav-wrapper">
                                        <a href="#" className="brand-logo">Nome do Projeto</a>
                                        <a href="#" data-activates="mobile-demo" className="button-collapse"><i className="material-icons">menu</i></a>
                                        <ul id="nav-mobile" className="right hide-on-med-and-down">
                                        </ul>
                                        <ul className="side-nav" id="mobile-demo">
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </header>
                    <main>
                        <Route exact path="/donations/" component={ Donations } />
                        <Route path="/donations/new-donation/" component={ Donation } />
                    </main>
                </div>
            </BrowserRouter>
        )
    }
}

ReactDom.render(
    <Home />, document.getElementById('home')
)