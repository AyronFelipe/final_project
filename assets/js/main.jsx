import React from 'react'
import ReactDom from 'react-dom'
import CreateReactClass from 'create-react-class'
import { Link } from 'react-router-dom'

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
                        <div className="container">
                            <h5 className="center-align">Comece agora a fazer parte de nossa comunidade e a ajudar aqueles que estão precisando</h5>
                            <div className="row">
                                <div className="col s6">
                                    <Link to="/accounts/new-person/"><button className="btn-large waves-effect waves-light indigo accent-2 wihte-text">Sou uma pessoa normal. Quero ajudar!</button></Link>
                                </div>
                                <div className="col s6">
                                    <Link to="/accounts/new-institution/"><button className="btn-large waves-effect waves-light indigo accent-2 wihte-text">Sou uma empresa. Quero ajudar!</button></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="section deep-purple white-text" id="quem-somos">
                        <h1 className="center-align">Quem Somos?</h1>
                    </div>
                </main>
            </div>     
        )
    }
}