import React from 'react'
import ReactDom from 'react-dom'
import 'materialize-css'
import 'materialize-css/dist/css/materialize.min.css'
import '../css/main.css'
import { BrowserRouter, Route, Link } from 'react-router-dom'

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
                                            <li>
                                                <Link to="/ayron">Ayron</Link>
                                            </li>
                                            <li>
                                                <Link to="/felipe">Felipe</Link>
                                            </li>
                                            <li>
                                                <Link to="/carvalho">Carvalho</Link>
                                            </li>
                                        </ul>
                                        <ul className="side-nav" id="mobile-demo">
                                            <li>
                                                <Link to="/ayron">Ayron</Link>
                                            </li>
                                            <li>
                                                <Link to="/felipe">Felipe</Link>
                                            </li>
                                            <li>
                                                <Link to="/carvalho">Carvalho</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </header>
                    <main>
                        <Route path="/ayron" component={ Ayron } />
                        <Route path="/felipe" component={ Felipe } />
                        <Route path="/carvalho" component={ Carvalho } />
                    </main>
                </div>
            </BrowserRouter>
        )
    }
}

class Ayron extends React.Component{
    render(){
        return(
            <h1>Ayron</h1>
        )
    }
}

class Felipe extends React.Component{
    render(){
        return(
            <h1>Felipe</h1>
        )
    }
}

class Carvalho extends React.Component{
    render(){
        return(
            <h1>Carvalho</h1>
        )
    }
}

ReactDom.render(
    <Home />, document.getElementById('home')
)