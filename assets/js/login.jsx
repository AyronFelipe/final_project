import React from 'react'
import ReactDom from 'react-dom'
import Footer from './footer'

export default class Login extends React.Component{

    render(){
        return(
            <div className="deep-purple darken-2">
                <div className="valign-wrapper row">
                    <div className="col card hoverable s10 pull-s1 m6 pull-m3 l4 pull-l4 deep-purple white-text">
                        <form>
                            <div className="card-content">
                                <div className="white-text center-align"><h1>Nome do Projeto</h1></div>
                                <span className="card-title">Digite seus dados</span>
                                <div className="row">
                                    <div className="input-field col s12">
                                        <label htmlFor="email" className="white-text">Email</label>
                                        <input type="email" className="validate" name="email" id="email" />
                                    </div>
                                    <div className="input-field col s12">
                                        <label htmlFor="password" className="white-text">Senha</label>
                                        <input type="password" className="validate" name="password" id="password" />
                                    </div>
                                </div>
                            </div>
                            <div className="card-action right-align">
                                <button className="btn waves-effect waves-light indigo accent-2 white-text">Entrar</button>
                            </div>
                        </form>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}