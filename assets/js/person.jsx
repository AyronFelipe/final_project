import React from 'react'
import Footer from './footer'
import Inputmask from 'inputmask'
import Dateapicker from './dateapicker'
import Address from './address'
import { Link } from 'react-router-dom'

export default class Person extends React.Component{

    constructor(props){
        super(props);
        this.savePerson = this.savePerson.bind(this);
    }

    savePerson(){
        $("#person-form").find(":input").each(function(){
            $(this).siblings('span.error-message').html('');
        });
        $.ajax({
            url: '/api/new-person/',
            type: 'POST',
            dataType: 'json',
            data: $("#person-form").serialize(),
            success: function(data){
                $('#modal-confirmacao').modal('open');
            },
            error: function(request, status, err){
                if (err == 'Bad Request'){
                    for(const [key, value] of Object.entries(request.responseJSON)){
                        $("#person-form").find(":input").each(function(){
                            name = $(this).attr("name");
                            if(name===key){
                                $(this).siblings('span.error-message').html('<p>'+value+'</p>');
                            }
                        });
                    }
                }
            }
        });
    }

    componentDidMount(){
        Inputmask("999.999.999-99", { showMaskOnHover: false }).mask($("#cpf"))
        Inputmask("(99)9999-9999", { showMaskOnHover: false }).mask($("#phone"))
        Inputmask("(99)\\99999-9999", { showMaskOnHover: false }).mask($("#cell_phone"))
        $('#modal-confirmacao').modal({
            dismissible: false,
        });
    }

    render(){
        return(
            <div className="white purple-text">
                <div className="modal" id="modal-confirmacao">
                    <div className="modal-content">
                        <h4>Cadastro realizado com sucesso!</h4>
                        <blockquote>Enviamos para o e-mail informado a confirmação do seu cadastro. Por favor verifique seu e-mail antes de realizar login.</blockquote>
                    </div>
                    <div className="modal-footer">
                        <Link to="/">
                            <button className="modal-action modal-close btn waves-effect waves-light indigo accent-2 wihte-text">Tudo bem!</button>
                        </Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col s12">
                        <div className="col s10 push-s1">
                            <h4 className="center-align">E aí, tranquilo? Põe as suas informações aí embaixo para gente poder cadastrar você!</h4>
                        </div>
                        <div className="container">
                            <div className="red-text" id="error-message"></div>
                            <form id="person-form">
                                <h5>Informações de Login</h5>
                                <div className="row">
                                    <div className="input-field col s6">
                                        <input id="email" name="email" type="text" className="validate" />
                                        <label htmlFor="email">Email</label>
                                        <span className="error-message red-text"></span>
                                    </div>
                                    <div className="input-field col s6">
                                        <input id="password" name="password" type="password" />
                                        <label htmlFor="email">Senha</label>
                                        <span className="error-message red-text"></span>
                                    </div> 
                                </div>
                                <h5>Informações pessoais</h5>
                                <div className="row">
                                    <div className="input-field col s6">
                                        <input id="first_name" name="first_name" type="text" />
                                        <label htmlFor="first_name">Nome</label>
                                        <span className="error-message red-text"></span>
                                    </div>
                                    <div className="input-field col s6">
                                        <input id="last_name" name="last_name" type="text" />
                                        <label htmlFor="last_name">Sobrenome</label>
                                        <span className="error-message red-text"></span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field col s6">
                                        <input id="cpf" name="cpf" type="text" />
                                        <label htmlFor="cpf">CPF</label>
                                        <span className="error-message red-text"></span>
                                    </div>
                                    <Dateapicker name="birthday" />
                                </div>
                                <h5>Contato</h5>
                                <div className="row">
                                    <div className="input-field col s6">
                                        <input id="phone" name="phone" type="text"/>
                                        <label htmlFor="phone">Telefone residencial</label>
                                        <span className="error-message red-text"></span>
                                    </div>
                                    <div className="input-field col s6">
                                        <input id="cell_phone" name="cell_phone" type="text"/>
                                        <label htmlFor="cell_phone">Telefone celular</label>
                                        <span className="error-message red-text"></span>
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