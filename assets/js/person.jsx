import React from 'react'
import Footer from './footer'
import Inputmask from 'inputmask'

export default class Person extends React.Component{

    componentDidMount(){
        Inputmask("999.999.999-99", { showMaskOnHover: false }).mask($("#cpf"))
        Inputmask("99/99/9999", { showMaskOnHover: false }).mask($("#birthday"))
        Inputmask("(99)9999-9999", { showMaskOnHover: false }).mask($("#phone"))
        Inputmask("(99)\\99999-9999", { showMaskOnHover: false }).mask($("#cell_phone"))
    }

    render(){
        return(
            <div className="deep-purple white-text">
                <div className="row">
                    <div className="col s10 push-s1">
                        <h4 className="center-align">E aí, tranquilo? Põe as suas informações aí embaixo para gente poder cadastrar você!</h4>
                    </div>
                </div>
                <div className="row">
                    <div className="container">
                        <div className="col s12">
                            <form id="form-person">
                                <h5>Informações de Login</h5>
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
                                <h5>Informações pessoais</h5>
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
                                <h5>Contato</h5>
                                <div className="row">
                                    <div className="input-field col s6">
                                        <input id="phone" name="phone" type="text"/>
                                        <label htmlFor="phone">Telefone residêncial</label>
                                    </div>
                                    <div className="input-field col s6">
                                        <input id="cell_phone" name="cell_phone" type="text"/>
                                        <label htmlFor="cell_phone">Telefone celular</label>
                                    </div>
                                </div>
                                <h5>Residência</h5>
                                <div className="row">
                                    <div className="input-field col s4">
                                        <input id="neighborhood" name="neighborhood" type="text" />
                                        <label htmlFor="neighborhood">Bairro</label>
                                    </div>
                                    <div className="input-field col s4">
                                        <input id="street" name="street" type="text" />
                                        <label htmlFor="street">Rua</label>
                                    </div>
                                    <div className="input-field col s4">
                                        <input id="number" name="number" type="text" />
                                        <label htmlFor="number">Número</label>
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