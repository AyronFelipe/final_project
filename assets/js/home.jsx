import React from 'react'
import ReactDom from 'react-dom'

class Main extends React.Component{
    render(){
        return(
            <h1>Olá mundo!</h1>
        )
    }
}

ReactDom.render(
    <Main />, document.getElementById('app')
)