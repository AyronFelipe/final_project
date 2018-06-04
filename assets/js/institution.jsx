import React from 'react'
import Footer from './footer'
import Inputmask from 'inputmask'
import Address from './address'

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
                alert("mostrar uma mensagem estilosa dizendo que um email foi enviado para o email do cadastrante")
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
    }

    render(){
        return(
            <div>
                <div id="modal1" className="modal bottom-sheet">
                    <div className="modal-content">
                        <h4>Sucesso</h4>
                        <p>Um email de ativação foi enviado para o seu email.</p>
                    </div>
                </div>
                <div className="white purple-text">
                    <div className="row">
                        <div className="col s12">
                            <div className="col s10 push-s1">
                                <h4 className="center-align">Olá, para começar a ajudar é só colocar as suas informações abaixo</h4>
                            </div>
                            <div className="container">
                                <div className="red-text" id="error-message"></div>
                                <form id="institution-form">
                                    <h5>Informações de login</h5>
                                    <div className="row">
                                        <div className="input-field col s6">
                                            <input id="email" name="email" type="text" />
                                            <label htmlFor="email">Email</label>
                                            <span className="error-message red-text"></span>
                                        </div>
                                        <div className="input-field col s6">
                                            <input id="password" name="password" type="password" />
                                            <label htmlFor="email">Senha</label>
                                            <span className="error-message red-text"></span>
                                        </div>
                                    </div>
                                    <h5>Informações sobre a instituição</h5>
                                    <div className="row">
                                        <div className="input-field col s6">
                                            <input type="text" id="name" name="name"/>
                                            <label htmlFor="name">Nome da instituição</label>
                                            <span className="error-message red-text"></span>
                                        </div>
                                        <div className="input-field col s6">
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
                                        <div className="input-field col s6">
                                            <input id="phone" name="phone" type="text"/>
                                            <label htmlFor="phone">Telefone fixo</label>
                                            <span className="error-message red-text"></span>
                                        </div>
                                        <div className="input-field col s6">
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