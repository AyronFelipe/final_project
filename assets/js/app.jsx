
import React from 'react'
import ReactDom from 'react-dom'
import CreateReactClass from 'create-react-class'
import Header from './header'
import Main from './main'
import Footer from './footer'
import '../css/main.css'
import { BrowserRouter, Route } from 'react-router-dom'
import Login from './login'

class Initial extends React.Component{
    render(){
        return(
            <div>
                <Header />
                <Main />   
                <Footer />
            </div>
        )
    }
}

class App extends React.Component{
    render(){
        return(
            <div>
                <Route exact path="/" component={ Initial } />
                <Route path="/accounts/login" component={ Login } />
            </div>
        )
    }
}

ReactDom.render((
    <BrowserRouter>
        <div>
            <App />
        </div>
    </BrowserRouter>), document.getElementById('app')
);