import React from 'react'
import ReactDom from 'react-dom'

class Home extends React.Component{
    render(){
        return(
            <h1>Olá mundo!</h1>
        )
    }
}

ReactDom.render(
    <Home />, document.getElementById('home')
)