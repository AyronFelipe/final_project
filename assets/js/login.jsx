import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import { storageToken, isAuthenticated } from './auth'

export default class Login extends React.Component{

    constructor(props){
        super(props);
        this.state = { type: 'password', icon: 'far fa-eye', email: '', password: ''};
        this.password = React.createRef();
    }

    handleForgetPassword = (e) => {
        swal({
            title: "Digite seu e-mail",
            html: '',
            content: {
                element: "input",
                attributes: {
                    placeholder: "E-mail",
                    type: "email",
                    id: "forget-email",
                    className: "form-control",
                    name: "forget_email"
                },
            },
            buttons: {
                confirm: {
                    className: 'btn btn-success',
                    closeModal: true,
                }
            }
        }).then((email) => {
            if (!email) {
                throw null;
            } else {
                let form = new FormData();
                form.append('forget_email', email);
                form.append('type_forget', 'E');
                axios.post('/forget-password/', form)
                .then((response) => {
                    swal("Muito bem!", "Enviamos um e-mail para você sobre como proceder. Muito obrigado por usar o Alimentaí!", {
                        icon: "success",
                        buttons: {
                            confirm: {
                                className: 'btn btn-success'
                            }
                        },
                    }).then(() => {
                        window.location = "/";
                    });
                })
                .catch((error) => {
                    swal("Erro!", `${error.response.data.message}`, {
                        icon: "error",
                        buttons: {
                            confirm: {
                                className: 'btn btn-danger'
                            }
                        },
                    });
                });
            }
        });
    }

    changePasswordType = (e) => {
        return this.password.current.type == 'password' ? this.setState({ type: 'text', icon: 'far fa-eye-slash' }) : this.setState({ type: 'password', icon: 'far fa-eye' });
    }

    changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let body = {
            email: this.state.email,
            password: this.state.password
        }
        axios.post('/login/', qs.stringify(body))
        .then((response) => {
            storageToken(response.data.token);
            if (isAuthenticated()) {
                console.log('pode passar!');
            }
        })
        .catch((error) => {
            swal("Erro!", `${error.response.data.message}`, {
                icon: "error",
                buttons: {
                    confirm: {
                        className: 'btn btn-danger'
                    }
                },
            });
        });
    }

    render(){
        return(
            <div className="login bg-primary">
                <div className="wrapper wrapper-login">
                    <div className="container container-login animated fadeIn">
                        <h3 className="text-center">Entrar no Alimentaí</h3>
                        <div className="login-form">
                            <form onSubmit={this.handleSubmit} id="form-login">
                                <div className="form-group">
                                    <label htmlFor="email" className="placeholder"><span className="required-label">*</span> <b>E-mail</b></label>
                                    <input id="email" name="email" type="email" className="form-control" required onChange={this.changeHandler}></input>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password" className="placeholder"><span className="required-label">*</span> <b>Senha</b></label>
                                    <a href="#" className="link float-right" onClick={this.handleForgetPassword}>Esqueceu sua senha?</a>
                                    <div className="position-relative">
                                        <input id="password" ref={this.password} name="password" type={this.state.type} className="form-control" required onChange={this.changeHandler} />
                                        <div className="show-password" onClick={this.changePasswordType}>
                                            <i className={this.state.icon}></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group form-action-d-flex mb-3">
                                    <div className="custom-control custom-checkbox">
                                        <input type="checkbox" className="custom-control-input" id="rememberme" />
                                        <label className="custom-control-label m-0" htmlFor="rememberme">Lembrar-me</label>
                                    </div>
                                    <button type="submit" className="btn btn-info btn-round col-md-5 float-right mt-3 mt-sm-0 fw-bold"><i className="icon-login mr-1"></i> Entrar</button>
                                </div>
                            </form>
                            <div className="login-account">
                                <span className="msg">Não possui conta ainda e é pessoa física? </span>
                                <Link to="/accounts/new-person/">
                                    <span className="link">Clique aqui</span>
                                </Link>
                            </div>
                            <div className="login-account">
                                <span className="msg">Não possui conta ainda e é pessoa jurídica? </span>
                                <Link to="/accounts/new-institution/">
                                    <span className="link">Clique aqui</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}