
import React from 'react'
import ReactDom from 'react-dom'
import CreateReactClass from 'create-react-class'
import $ from 'jquery'
import Header from './header'
import Main from './main'

class App extends React.Component{
    render(){
        return(
            <div>
                <Header />
                <Main />   
            </div>
        )
    }
}

ReactDom.render(<App />, document.getElementById('app'));