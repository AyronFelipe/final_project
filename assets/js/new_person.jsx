import React from 'react';
import Inputmask from 'inputmask';
import { readURL } from './utils';
import axios from 'axios';

const CEP_LENGTH = 9;

export default class NewPerson extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            photo: '',
            email: '',
            password: '',
            first_name: '',
            last_name: '',
            cpf: '',
            birthday: '',
            phone: '',
            cell_phone: '',
            cep: '',
            street: '',
            neighborhood: '',
            city: '',
            uf: '',
            number: ''
        }
        this.cep = React.createRef();
        this.street = React.createRef();
        this.neighborhood = React.createRef();
        this.city = React.createRef();
        this.uf = React.createRef();
    }

    changePhoto = (e) => {
        readURL(e.target);
    }

    handleSubmit = (e) => {

        e.preventDefault();

        let form = new FormData();
        form.append('photo', this.state.photo);
        form.append('email', this.state.email);
        form.append('password', this.state.password);
        form.append('first_name', this.state.first_name);
        form.append('last_name', this.state.last_name);
        form.append('cpf', this.state.cpf);
        form.append('birthday', this.state.birthday);
        form.append('phone', this.state.phone);
        form.append('cell_phone', this.state.cell_phone);
        form.append('cep', this.state.cep);
        form.append('street', this.state.street);
        form.append('neighborhood', this.state.neighborhood);
        form.append('city', this.state.city);
        form.append('uf', this.state.uf);
        form.append('number', this.state.number);

        axios.post(`/api/new-person/`, form)
        .then((response) => {
            swal("Seu usuário foi salvo com sucesso!", "Nós enviamos um e-mail de confirmação para você. Depois que você confirmar, pode voltar e logar no Alimentaí ;D", {
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
            let errors = [];
            for (const obj of Object.entries(error.response.data)) {
                errors.push(obj[1]);
            }
            swal("Erro!", `${ errors.map((erro) => `- ${erro}\n`).join(" ") }`, {
                icon: "error",
                buttons: {
                    confirm: {
                        className: 'btn btn-danger'
                    }
                },
            });
        });
        
    }

    handleFile = (e) => {
        let photo_file = e.target.files[0];
        this.setState({ [e.target.name]: photo_file });
    }

    changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    loadCepInfo = (e) => {
        if (e.target.value.length == CEP_LENGTH) {
            axios.get(`https://viacep.com.br/ws/${e.target.value}/json/`)
                .then((res) => {
                    if (res.data.erro) {
                        swal("Erro!", "CEP não encontrado", {
                            icon: "error",
                            buttons: {
                                confirm: {
                                    className: 'btn btn-danger'
                                }
                            },
                        });
                    } else {
                        this.street.current.value = res.data.logradouro;
                        this.neighborhood.current.value = res.data.bairro;
                        this.city.current.value = res.data.localidade;
                        this.uf.current.value = res.data.uf;
                        this.setState({ street: res.data.logradouro, neighborhood: res.data.bairro, city: res.data.localidade, uf: res.data.uf });
                    }
                })
        }
    }

    loadMask = (e) => {
        if (e.target.value.length == 8) {
            Inputmask("99999-999", { showMaskOnHover: false }).mask($("#cep"));
        }
    }

    componentDidMount = () => {
        Inputmask("999.999.999-99", { showMaskOnHover: false }).mask($("#cpf"));
        Inputmask("(99)99999-9999", { showMaskOnHover: false }).mask($("#cell_phone"));
        Inputmask("(99)9999-9999", { showMaskOnHover: false }).mask($("#phone"));
    }

    render(){
        return(
            <div className="signup bg-primary">
                <div className="wrapper-login">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <form id="form-pessoa-fisica" onSubmit={this.handleSubmit}>
                                    <div className="card mt-5 animated fadeIn">
                                        <div className="card-header">
                                            <h4 className="card-title">
                                                <i className="icon-user mr-1"></i> Cadastre-se no Alimentaí como Pessoa Física
                                            </h4>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="d-flex justify-content-center">
                                                        <div className="input-file input-file-image">
                                                            <img className="img-upload-preview img-circle ml-5" width="100" height="100" src="https://placehold.it/100x100" alt="preview"></img>
                                                            <input type="file" className="form-control form-control-file" id="photo" name="photo" accept="image/*" onInput={this.changePhoto} onChange={this.handleFile}></input>
                                                            <label htmlFor="photo" className="btn btn-info btn-round btn-lg"><i className="fa fa-file-image"></i> Upload da sua foto</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-12 col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="email"><span className="required-label">*</span> E-mail</label>
                                                        <input type="email" name="email" id="email" className="form-control" onChange={this.changeHandler} required />
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="password"><span className="required-label">*</span> Senha</label>
                                                        <input type="password" name="password" className="form-control" id="password" onChange={this.changeHandler} required />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-12 col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor=""><span className="required-label">*</span> Primeiro Nome</label>
                                                        <input type="text" className="form-control" name="first_name" id="first_name" onChange={this.changeHandler} required />
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="last_name"><span className="required-label">*</span>Sobrenome</label>
                                                        <input type="text" className="form-control" name="last_name" id="last_name" onChange={this.changeHandler} required />
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="cpf"><span className="required-label">*</span> CPF</label>
                                                        <input type="text" className="form-control" name="cpf" id="cpf" onChange={this.changeHandler} required />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-12 col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="birthday">Data de Nascimento</label>
                                                        <input type="date" name="birthday" id="birthday" className="form-control" onChange={this.changeHandler} />
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="phone">Telefone</label>
                                                        <input type="text" name="phone" id="phone" className="form-control" onChange={this.changeHandler} />
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="cell_phone">Celular</label>
                                                        <input type="text" name="cell_phone" id="cell_phone" className="form-control" onChange={this.changeHandler} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-12 col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="cep"><span className="required-label">*</span> CEP</label>
                                                        <input type="text" name="cep" id="cep" className="form-control" onBlur={this.loadCepInfo} onInput={this.loadMask} onChange={this.changeHandler} required />
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-5">
                                                    <div className="form-group">
                                                        <label htmlFor="street">Logradouro</label>
                                                        <input type="text" readOnly name="street" ref={this.street} id="street" className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="neighborhood">Bairro</label>
                                                        <input type="text" readOnly name="neighborhood" ref={this.neighborhood} id="neighborhood" className="form-control" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-12 col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="city">Cidade</label>
                                                        <input type="text" readOnly name="city" ref={this.city} id="city" className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="uf">UF</label>
                                                        <input type="text" readOnly name="uf" ref={this.uf} id="uf" className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="number">Número</label>
                                                        <input type="text" name="number" id="number" className="form-control" onChange={this.changeHandler} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-sm-12 col-md-3 offset-md-9">
                                                    <button type="submit" className="btn btn-info btn-round btn-lg btn-block">
                                                        <i className="fas fa-save mr-1"></i> Salvar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}