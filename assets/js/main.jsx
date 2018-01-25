import React from 'react'
import ReactDom from 'react-dom'
import CreateReactClass from 'create-react-class'

export default class Main extends React.Component{

    render(){
        return(
            <div>
                <main>
                    <div className="section deep-purple white-text" id="como-funciona">
                        <h1 className="center-align ">Como Funciona?</h1>
                    </div>
                    <div className="section deep-purple lighten-4 white-text" id="comecar">
                        <h1 className="center-align">Começar</h1>
                    </div>
                    <div className="section deep-purple white-text" id="quem-somos">
                        <h1 className="center-align">Quem Somos?</h1>
                    </div>
                </main>
            </div>     
        )
    }
}