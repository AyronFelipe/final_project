import React from 'react'
import Footer from './footer'
import Inputmask from 'inputmask'
import Dateapicker from './dateapicker'
import Address from './address'
import Dropzone from './dropzone'

export default class Person extends React.Component{

    constructor(props){
        super(props);
        this.savePerson = this.savePerson.bind(this);
    }

    savePerson(){
        $.ajax({
            url: '/api/new-person/',
            type: 'POST',
            dataType: 'json',
            data: $("#person-form").serialize(),
            success: function(data){
                alert("mostrar uma mensagem estilosa dizendo que um email foi enviado para o email do cadastrante");
                alert("salvou");
            },
            error: function(request, status, err){
                console.log(request, status, err);
                $("#error-message").html("<p>"+ request.responseText +"</p>");
            }
        });
    }

    componentDidMount(){
        Inputmask("999.999.999-99", { showMaskOnHover: false }).mask($("#cpf"))
        Inputmask("(99)9999-9999", { showMaskOnHover: false }).mask($("#phone"))
        Inputmask("(99)\\99999-9999", { showMaskOnHover: false }).mask($("#cell_phone"))
    }

    render(){
        return(
            <div className="white purple-text">
                <div className="row">
                    <div className="col s12">
                        <div className="col s10 push-s1">
                            <h4 className="center-align">E aí, tranquilo? Põe as suas informações aí embaixo para gente poder cadastrar você!</h4>
                        </div>
                        <div className="container">
                            <div className="red-text" id="error-message"></div>
                            <form id="person-form">
                                <div className="row">
                                    <div className="col s6">
                                        <Dropzone />
                                    </div>
                                </div>
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
                                    <Dateapicker name="birthday" />
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
                                <Address />
                                <div className="row">
                                    <div className="col s12 right-align">
                                        <button type="button" className="btn-large waves-effect waves-light indigo accent-2 wihte-text" onClick={ this.savePerson }>Salvar</button>
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