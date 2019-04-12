import React from 'react'
import Footer from './footer'
import { storageToken, isAuthenticated } from './auth'
import NameProject from './nameproject'
import { Link } from 'react-router-dom'
import DjangoCSRFToken from './djangocsrftoken'

export default class Login extends React.Component{

    constructor(props){
        super(props);
        this.login = this.login.bind(this);
    }

    componentDidMount(){
        $("#email").keyup(function(e){
            if(e.keyCode == 13){
                $("#password").focus();
            }
        })

        $("#password").keyup(function(e){
            if(e.keyCode == 13){
                $("#login-button").click();
            }
        })
    }

    login(){
        $.gritter.add({
            title: 'Aguarde!',
            text: 'Enviando dados...',
            sticky: true,
            class_name: 'black white-text',
        });
        $.ajax({
            url: '/login/',
            type: 'POST',
            dataType: 'json',
            data: $('#login-form').serialize(),
            success: function(data){
                storageToken(data.token);
                if(isAuthenticated()===true){
                    window.location.href = "/donations/";
                }
            },
            error: function(request, status, err){
                $("#error-message").html("<p>" + request.responseJSON.message +"</p>");
            }
        }).always(function(){
            $.gritter.removeAll();
        });
    }

    render(){
        return(
            <div className="deep-purple darken-2">
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
                <div className="valign-wrapper row">
                    <div className="col card hoverable s10 pull-s1 m6 pull-m3 l4 pull-l4 deep-purple white-text">
                        <form id="login-form">
                            <DjangoCSRFToken />
                            <div className="card-content">
                                <div className="white-text center-align"><h3><NameProject /></h3></div>
                                <span className="card-title">Digite seus dados</span>
                                <div id="error-message" className="red-text"></div>
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
                                <button type="button" id="login-button" className="btn waves-effect waves-light indigo accent-2 white-text" onClick={ this.login }>Entrar</button>
                            </div>
                        </form>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}