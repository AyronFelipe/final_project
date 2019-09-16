import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Preloader from './preloader';
import Inputmask from 'inputmask';


let config = {
    headers: { 'Authorization': `Token ${localStorage.token}` }
};

export default class EditProfile extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            user: [],
            isLoading: true,
            show_info: false,
            first_name: '',
            last_name: '',
            birthday: '',
            phone: '',
            cell_phone: '',
        };
    }

    getUser = () => {
        const url = window.location.pathname;
        const pk = url.split('-');
        axios.get(`/api/users/${pk[1]}`, config)
        .then((res) => {
            this.setState({ 
                user: res.data,
                isLoading: false,
                first_name: res.data.child.first_name,
                last_name: res.data.child.last_name,
                birthday: res.data.child.birthday,
                phone: res.data.phone,
                cell_phone: res.data.cell_phone,
            });
            this.showInfo();
        })
        .catch((error) => {
            //console.log(error);
        });
    }

    getLoggedUser = () => {
        axios.get('/api/logged-user/', config)
        .then((res) => {
            this.setState({ logged: res.data });
            this.showInfo();
        })
        .catch((error) => {
            console.log(error.response);
        });
    }

    showInfo = () => {
        if (this.state.user.pk == this.state.logged.pk) {
            this.setState({ show_info: true });
        }
    }

    componentDidMount(){
        this.getUser();
        this.getLoggedUser();
    }

    changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    changeHandlerMask = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        Inputmask("(99)99999-9999", { showMaskOnHover: false }).mask($("#cell_phone"));
        Inputmask("(99)9999-9999", { showMaskOnHover: false }).mask($("#phone"));
    }

    generalSubmit = (e) => {

        e.preventDefault();

        let form = new FormData()
        form.append('first_name', this.state.first_name);
        form.append('last_name', this.state.last_name);
        form.append('birthday', this.state.birthday);
        form.append('phone', this.state.phone);
        form.append('cell_phone', this.state.cell_phone);

        axios.put(`/api/person/${this.state.user.pk}/edit/`, form, config)
        .then((res) => {
            swal("Seu usuário foi salvo com sucesso!", "Nós enviamos um e-mail de confirmação para você. Depois que você confirmar, pode voltar e logar no Alimentaí ;D", {
                icon: "success",
                buttons: {
                    confirm: {
                        className: 'btn btn-success'
                    }
                },
            })
        })
        .catch((error) => {
            console.log(error);
        })

    }

    render(){
        return(
            <div className="content">
                <div className="panel-header bg-primary">
                    <div className="page-inner py-5">
                        <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                            <div>
                                <h2 className="text-white pb-2 fw-bold page-title">Editar Informações do Perfil</h2>
                                <ul className="breadcrumbs text-white">
                                    <li className="nav-home">
                                        <Link to="/donations/">
                                            <i className="flaticon-home text-white"></i>
                                        </Link>
                                    </li>
                                    <li className="separator">
                                        <i className="flaticon-right-arrow"></i>
                                    </li>
                                    <li className="nav-item">
                                        <Link to={`/accounts/profile/${this.state.user.username}/`}>
                                            <span className="text-white">Perfil de { this.state.user.child != undefined ? this.state.user.child.first_name : <div className="loader loader-lg"></div> }</span>
                                        </Link>
                                    </li>
                                    <li className="separator">
                                        <i className="flaticon-right-arrow"></i>
                                    </li>
                                    <li className="nav-item">
                                        <Link to={`/accounts/profile/edit/${this.state.user.username}/`}>
                                            <span className="text-white">Editar Perfil</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-inner">
                    <React.Fragment>
                        
                    </React.Fragment>
                    {
                        this.state.isLoading ?
                            <Preloader />
                        :
                            <React.Fragment>
                                {
                                    this.state.show_info ?
                                    <div className="row">
                                        <div className="col-md-8">
                                            <div className="card">
                                                <div className="card-header">
                                                    <div className="card-title">Alterar Informações Gerais</div>
                                                </div>
                                                <div className="card-body">
                                                    <form id="form-general" onSubmit={this.generalSubmit}>
                                                        <div className="row">
                                                            <div className="col-sm-12 col-md-6">
                                                                <div className="form-group">
                                                                    <label htmlFor="">Primeiro Nome</label>
                                                                    <input type="text" className="form-control" name="first_name" id="first_name" maxLength={40} defaultValue={this.state.user.child.first_name} onChange={this.changeHandler} />
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-12 col-md-6">
                                                                <div className="form-group">
                                                                    <label htmlFor="last_name">Sobrenome</label>
                                                                    <input type="text" className="form-control" name="last_name" id="last_name" maxLength={40} defaultValue={this.state.user.child.last_name} onChange={this.changeHandler} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-sm-12 col-md-4">
                                                                <div className="form-group">
                                                                    <label htmlFor="birthday">Data de Nascimento</label>
                                                                    <input type="date" name="birthday" id="birthday" className="form-control" defaultValue={this.state.user.child.birthday} onChange={this.changeHandler} />
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-12 col-md-4">
                                                                <div className="form-group">
                                                                    <label htmlFor="phone">Telefone</label>
                                                                    <input type="text" name="phone" id="phone" className="form-control" defaultValue={this.state.user.phone} onChange={this.changeHandlerMask} />
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-12 col-md-4">
                                                                <div className="form-group">
                                                                    <label htmlFor="cell_phone">Celular</label>
                                                                    <input type="text" name="cell_phone" id="cell_phone" className="form-control" defaultValue={this.state.user.cell_phone} onChange={this.changeHandlerMask} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex flex-row-reverse">
                                                            <button className="btn btn-primary mr-3" type="submit"><i className="fas fa-save mr-1"></i> Salvar alterações</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                            <div className="card">
                                                <div className="card-header">
                                                    <div className="card-title"> Alterar Senha</div>
                                                </div>
                                                <div className="card-body"></div>
                                            </div>
                                            <div className="card">
                                                <div className="card-header">
                                                    <div className="card-title"> Alterar Endereço</div>
                                                </div>
                                                <div className="card-body"></div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="card card-profile">
                                                <div className="card-header" style={{ "backgroundImage": "url('/static/images/blogpost.jpg')" }}>
                                                    <div className="profile-picture">
                                                        <div className="avatar avatar-xl">
                                                            <img src={ this.state.user.photo } alt="..." className="avatar-img rounded-circle" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-body">
                                                    <div className="user-profile text-center">
                                                        {
                                                            this.state.user.child == undefined ?
                                                                <div className="loader loader-lg"></div>
                                                            :
                                                                <React.Fragment>
                                                                    <div className="name">
                                                                        { this.state.user.child.first_name } { this.state.user.child.last_name }
                                                                    </div>
                                                                    <div className="job">{ this.state.user.email }</div>
                                                                    <div className="desc">{ this.state.user.cell_phone }</div>
                                                                </React.Fragment>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="card-footer">
                                                    <div className="row user-stats text-center">
                                                        <div className="col">
                                                            <div className="number">{ this.state.user.donations_count }</div>
                                                            <div className="title">Doações Cadastradas</div>
                                                        </div>
                                                        <div className="col">
                                                            <div className="number">{ this.state.user.donations_accepted }</div>
                                                            <div className="title">Doações Finalizadas</div>
                                                        </div>
                                                        <div className="col">
                                                            <div className="number"></div>
                                                            <div className="title">Confiabilidade</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className="d-flex align-items-center flex-column mt-5">
                                        <h1 className="font-weight-bold">Entrada não autorizada</h1>
                                        <p className="lead">Você não possui autorização para acessar essa página. Por favor clique no botão abaixo para ser redirecionado para a página principal</p>
                                        <Link to={'/donations/'}>
                                            <button className="btn btn-info btn-lg btn-round"><i className="flaticon-home text-white mr-1"></i> Página Inicial</button>
                                        </Link>
                                    </div>
                                }
                            </React.Fragment>
                    }
                </div>
            </div>
        );
    }
}