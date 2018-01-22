import React from 'react'
import ReactDom from 'react-dom'
import CreateReactClass from 'create-react-class'
import $ from 'jquery'

export default class Main extends React.Component{
    render(){
        return(
            <main>
                <div className="section deep-purple white-text"></div>
                <div className="section deep-purple lighten-4 white-text"></div>
            </main>
        )
    }
}