
import React from 'react'
import ReactDom from 'react-dom'
import CreateReactClass from 'create-react-class'
import Header from './header'
import Main from './main'
import Footer from './footer'
import '../css/main.css'

class App extends React.Component{
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

ReactDom.render(<App />, document.getElementById('app'));