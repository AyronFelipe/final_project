import React from 'react'
import Footer from './footer'

export default class Person extends React.Component{

    render(){
        return(
            <div className="deep-purple darken-2 white-text">
                <div className="row">
                    <div className="container">
                        <div className="col s12">
                            <h4 className="center-align">E aí, tranquilo? Põe as suas informações aí embaixo para gente poder cadastrar você!</h4>
                            <form id="form-person">
                                <div className="row">
                                    <div className="input-field col s6">
                                        <input id="email" name="email" type="text" />
                                        <label htmlFor="email">Email</label>
                                    </div>
                                    <div className="input-field col s6">
                                        <input id="password" name="password" type="password" />
                                        <label htmlFor="email">Senha</label>
                                    </div> 
                                </div>
                                <div className="row">
                                    <div className="input-field col s6">
                                        <input id="first_name" name="first_name" type="text" />
                                        <label htmlFor="first_name">Nome</label>
                                    </div>
                                    <div className="input-field col s6">
                                        <input id="last_name" name="last_name" type="text" />
                                        <label htmlFor="last_name">Sobrenome</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field col s6">
                                        <input id="cpf" name="cpf" type="text" />
                                        <label htmlFor="cpf">CPF</label>
                                    </div>
                                    <div className="input-field col s6">
                                        <input id="birthday" name="birthday" type="text" />
                                        <label htmlFor="birthday">Data de nascimento</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col s12 offset-s10">
                                        <button className="btn-large waves-effect waves-light indigo accent-2 wihte-text">Salvar</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}