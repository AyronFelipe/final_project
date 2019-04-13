import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import Header from './header';
import Main from './main';
import Footer from './footer';
import Login from './login';
import NewPerson from './new_person';

class Initial extends React.Component {
    render(){
        return(
            <React.Fragment>
                <Header />
                <Main />
                <Footer />
            </React.Fragment>
        )
    }
}

class App extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="wrapper horizontal-layout-3">
                <Route exact path="/" component={Initial} />
                <Route exact path="/accounts/login/" component={Login} />
                <Route exact path="/accounts/new-person" component={NewPerson} />
            </div>
        )
    }
}

ReactDom.render((
    <BrowserRouter>
        <React.Fragment>
            <App />
        </React.Fragment>
    </BrowserRouter>), document.getElementById('app')
);

