import React from 'react'
import Footer from './footer'
import Inputmask from 'inputmask'
import Address from './address'
import { Link } from 'react-router-dom'
import 'dropify'
import 'dropify/dist/css/dropify.min.css'
import DjangoCSRFToken from './djangocsrftoken'

export default class Institution extends React.Component{

    constructor(props){
        super(props)
        this.saveInstitution = this.saveInstitution.bind(this)
    }

    saveInstitution(){
        $.ajax({
            url: '/api/new-institution/',
            type: 'POST',
            dataType: 'json',
            data: $("#institution-form"),
            success: function(data){
                $('#modal-confirmacao').modal('open');
            },
            error: function(request, status, err){
                if (err == 'Bad Request'){
                    for(const [key, value] of Object.entries(request.responseJSON)){
                        $("#institution-form").find(":input").each(function(){
                            name = $(this).attr("name");
                            if(name===key){
                                $(this).siblings('span.error-message').html('<p>'+value+'</p>');
                            }
                        });
                    }
                }
            }
        })
    }

    componentDidMount(){

        Inputmask("99.999.999/9999-99", { showMaskOnHover: false }).mask($("#cnpj"))
        Inputmask("(99)9999-9999", { showMaskOnHover: false }).mask($("#phone"))
        Inputmask("(99)\\99999-9999", { showMaskOnHover: false }).mask($("#cell_phone"))
        $('#modal-confirmacao').modal({
            dismissible: false,
        });
    }

    render(){
        return(
            <div>
                <div className="white purple-text">
                    <div className="modal" id="modal-confirmacao">
                        <div className="modal-content">
                            <h4>Cadastro realizado com sucesso!</h4>
                            <blockquote>Enviamos para o e-mail informado a confirmação do seu cadastro. Por favor verifique seu e-mail antes de realizar login.</blockquote>
                        </div>
                        <div className="modal-footer">
                            <Link to="/">
                                <button className="modal-action modal-close btn waves-effect waves-light indigo accent-2 white-text">Tudo bem!</button>
                            </Link>
                        </div>
                    </div>

                    <br/><br/>
                    <div className="row">
                        <div className="col s12">
                            <div className="col s10 push-s1">
                                <Link to="/">
                                    <button title="Voltar para a página inicial" className="btn-floating btn-large waves-effect waves-light indigo accent-2 white-text">
                                        <i className="material-icons">arrow_back</i>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12">
                            <div className="col s10 push-s1">
                                <h4 className="center-align">Olá, para começar a ajudar é só colocar as suas informações abaixo</h4>
                            </div>
                            <div className="container">
                                <div className="red-text" id="error-message"></div>
                                <form id="institution-form" encType="multipart/form-data">
                                    <DjangoCSRFToken />
                                    <div className="row">
                                        <div className="col s12">
                                            <h5>Coloque aqui a sua foto</h5>
                                            <input id="photo" name="photo" type="file" className="dropify" />
                                        </div>
                                    </div>
                                    <h5>Informações de login</h5>
                                    <div className="row">
                                        <div className="input-field col m6 s12">
                                            <input id="email" name="email" type="text" />
                                            <label htmlFor="email">Email</label>
                                            <span className="error-message red-text"></span>
                                        </div>
                                        <div className="input-field col m6 s12">
                                            <input id="password" name="password" type="password" />
                                            <label htmlFor="email">Senha</label>
                                            <span className="error-message red-text"></span>
                                        </div>
                                    </div>
                                    <h5>Informações sobre a instituição</h5>
                                    <div className="row">
                                        <div className="input-field col m6 s12">
                                            <input type="text" id="name" name="name"/>
                                            <label htmlFor="name">Nome da instituição</label>
                                            <span className="error-message red-text"></span>
                                        </div>
                                        <div className="input-field col m6 s12">
                                            <input type="text" id="cnpj" name="cnpj"/>
                                            <label htmlFor="name">CNPJ</label>
                                            <span className="error-message red-text"></span>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <textarea name="objectives" id="objectives" className="materialize-textarea"></textarea>
                                            <label htmlFor="objectives">Coloque os objetivos da sua instituição (não seja breve)</label>
                                            <span className="error-message red-text"></span>
                                        </div>
                                    </div>
                                    <h5>Contato</h5>
                                    <div className="row">
                                        <div className="input-field col m6 s12">
                                            <input id="phone" name="phone" type="text"/>
                                            <label htmlFor="phone">Telefone fixo</label>
                                            <span className="error-message red-text"></span>
                                        </div>
                                        <div className="input-field col m6 s12">
                                            <input id="cell_phone" name="cell_phone" type="text"/>
                                            <label htmlFor="cell_phone">Telefone celular</label>
                                            <span className="error-message red-text"></span>
                                        </div>
                                    </div>
                                    <Address legend="Endereço" />
                                    <div className="row">
                                        <div className="col s12 right-align">
                                            <button type="button" className="btn-large waves-effect waves-light indigo accent-2 white-text" onClick={ this.savePerson }>Salvar</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        )
    }
}