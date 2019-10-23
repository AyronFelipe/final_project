import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Preloader from './preloader';
import Inputmask from 'inputmask';
import BeautyStars from 'beauty-stars';


let config = {
    headers: { 'Authorization': `Token ${localStorage.token}` }
};

const CEP_LENGTH = 9;

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
            cep: '',
            street: '',
            neighborhood: '',
            city: '',
            uf: '',
            number: '',
            old_password: '',
            old_password2: '',
            new_password: '',
            name: '',
        };
        this.cep = React.createRef();
        this.street = React.createRef();
        this.neighborhood = React.createRef();
        this.city = React.createRef();
        this.uf = React.createRef();
    }

    getUser = () => {
        const url = window.location.pathname;
        const pk = url.split('-');
        axios.get(`/api/users/${pk[1]}`, config)
        .then((res) => {
            this.setState({ 
                user: res.data,
                first_name: res.data.child.first_name,
                last_name: res.data.child.last_name,
                birthday: res.data.child.birthday,
                phone: res.data.phone,
                cell_phone: res.data.cell_phone,
                cep: res.data.cep,
                street: res.data.street,
                neighborhood: res.data.neighborhood,
                city: res.data.city,
                uf: res.data.uf,
                number: res.data.number,
                name: res.data.child.name,
            });
            this.getLoggedUser();
        })
        .catch((error) => {
            //console.log(error);
        });
    }

    getLoggedUser = () => {
        axios.get('/api/logged-user/', config)
        .then((res) => {
            this.setState({ logged: res.data, });
            this.showInfo();
        })
        .catch((error) => {
            console.log(error.response);
        });
    }

    showInfo = () => {
        if (this.state.user.pk == this.state.logged.pk) {
            this.setState({ show_info: true, isLoading: false });
        } else {
            this.setState({ isLoading: false });
        }
    }

    componentDidMount(){
        this.getUser();
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
        if (this.state.user.child.type == 'person') {
            form.append('first_name', this.state.first_name);
            form.append('last_name', this.state.last_name);
            form.append('birthday', this.state.birthday);
            form.append('phone', this.state.phone);
            form.append('cell_phone', this.state.cell_phone);
        } else {
            form.append('phone', this.state.phone);
            form.append('cell_phone', this.state.cell_phone);
            form.append('name', this.state.name);
        }

        axios.put(`/api/person/${this.state.user.pk}/edit/`, form, config)
        .then((res) => {
            swal("Alterações feitas com sucesso", res.data.message, {
                icon: "error",
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

    addressSubmit = (e) => {

        e.preventDefault();

        let form = new FormData();
        form.append('cep', this.state.cep);
        form.append('street', this.state.street);
        form.append('neighborhood', this.state.neighborhood);
        form.append('city', this.state.city);
        form.append('uf', this.state.uf);
        form.append('number', this.state.number);

        axios.put(`/api/person/${this.state.user.pk}/address/edit/`, form, config)
        .then((res) => {
            swal("Endereço alterado com sucesso", res.data.message, {
                icon: "success",
                buttons: {
                    confirm: {
                        className: 'btn btn-success'
                    }
                },
            })
        })
        .catch((error) => {
            swal("Ooops! Algo aconteceu", error.response.data.message, {
                icon: "error",
                buttons: {
                    confirm: {
                        className: 'btn btn-danger'
                    }
                },
            })
        })
    }

    passwordSumit = (e) => {

        e.preventDefault();

        let form = new FormData();
        form.append('old_password', this.state.old_password);
        form.append('old_password2', this.state.old_password2);
        form.append('new_password', this.state.new_password);

        axios.put(`/api/person/${this.state.user.pk}/password/edit/`, form, config)
        .then((res) => {
            swal("Senha alterada com sucesso", res.data.message, {
                icon: "success",
                buttons: {
                    confirm: {
                        className: 'btn btn-success'
                    }
                },
            })
        })
        .catch((error) => {
            swal("Ooops! Algo aconteceu", error.response.data.message, {
                icon: "error",
                buttons: {
                    confirm: {
                        className: 'btn btn-danger'
                    }
                },
            })
        })

    }

    loadMask = (e) => {
        if (e.target.value.length == 8) {
            Inputmask("99999-999", { showMaskOnHover: false }).mask($("#cep"));
        }
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
                                            <span className="text-white">
                                                Perfil de { this.state.user.child != undefined ? <React.Fragment>{ this.state.user.child.first_name || this.state.user.child.name}</React.Fragment> : <div className="loader loader-lg"></div> }</span>
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
                                                        {
                                                            this.state.user.child.type == 'person' ?
                                                            <React.Fragment>
                                                                <div className="row">
                                                                    <div className="col-sm-12 col-md-6">
                                                                        <div className="form-group">
                                                                            <label htmlFor=""> <span className="required-label">*</span> Primeiro Nome</label>
                                                                            <input type="text" className="form-control" name="first_name" id="first_name" maxLength={40} defaultValue={this.state.user.child.first_name} onChange={this.changeHandler} required />
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-12 col-md-6">
                                                                        <div className="form-group">
                                                                            <label htmlFor="last_name"> <span className="required-label">*</span> Sobrenome</label>
                                                                            <input type="text" className="form-control" name="last_name" id="last_name" maxLength={40} defaultValue={this.state.user.child.last_name} onChange={this.changeHandler} required />
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
                                                            </React.Fragment>
                                                            :
                                                            <React.Fragment>
                                                                <div className="row">
                                                                    <div className="col-sm-12 col-md-4">
                                                                        <div className="form-group">
                                                                            <label htmlFor="phone"><span className="required-label">*</span> Nome</label>
                                                                            <input type="text" name="name" id="name" className="form-control" defaultValue={this.state.user.child.name} onChange={this.changeHandler} required />
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
                                                            </React.Fragment>
                                                        }
                                                        <div className="d-flex flex-row-reverse">
                                                            <button className="btn btn-primary mr-3" type="submit"><i className="fas fa-save mr-1"></i> Salvar alterações</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                            <div className="card">
                                                <div className="card-header">
                                                    <div className="card-title"> Alterar Endereço</div>
                                                </div>
                                                <div className="card-body">
                                                    <form method="post" id="form-address" onSubmit={this.addressSubmit}>
                                                        <div className="row">
                                                            <div className="col-sm-12 col-md-3">
                                                                <div className="form-group">
                                                                    <label htmlFor="cep"><span className="required-label">*</span> CEP</label>
                                                                    <input type="text" name="cep" id="cep" className="form-control" onBlur={this.loadCepInfo} onInput={this.loadMask} onChange={this.changeHandler} defaultValue={this.state.user.cep} required />
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-12 col-md-5">
                                                                <div className="form-group">
                                                                    <label htmlFor="street">Logradouro</label>
                                                                    <input type="text" readOnly name="street" ref={this.street} id="street" className="form-control" defaultValue={this.state.user.street} />
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-12 col-md-4">
                                                                <div className="form-group">
                                                                    <label htmlFor="neighborhood">Bairro</label>
                                                                    <input type="text" readOnly name="neighborhood" ref={this.neighborhood} id="neighborhood" className="form-control" defaultValue={this.state.user.neighborhood} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-sm-12 col-md-4">
                                                                <div className="form-group">
                                                                    <label htmlFor="city">Cidade</label>
                                                                    <input type="text" readOnly name="city" ref={this.city} id="city" className="form-control" defaultValue={this.state.user.city} />
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-12 col-md-4">
                                                                <div className="form-group">
                                                                    <label htmlFor="uf">UF</label>
                                                                    <input type="text" readOnly name="uf" ref={this.uf} id="uf" className="form-control" defaultValue={this.state.user.uf} />
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-12 col-md-4">
                                                                <div className="form-group">
                                                                    <label htmlFor="number">Número</label>
                                                                    <input type="text" name="number" id="number" className="form-control" onChange={this.changeHandler} defaultValue={this.state.user.number} />
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
                                                <div className="card-body">
                                                    <form method="post" id="form-password" onSubmit={this.passwordSumit}>
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <div className="form-group">
                                                                    <label htmlFor=""><span className="required-label">*</span> Senha Antiga</label>
                                                                    <input type="password" className="form-control" name="old_password" id="old_password" required onChange={this.changeHandler} />
                                                                </div>
                                                            </div>
                                                            <div className="col-12">
                                                                <div className="form-group">
                                                                    <label htmlFor=""><span className="required-label">*</span> Confirmação de Senha Antiga</label>
                                                                    <input type="password" className="form-control" name="old_password2" id="old_password2" required onChange={this.changeHandler} />
                                                                </div>
                                                            </div>
                                                            <div className="col-12">
                                                                <div className="form-group">
                                                                    <label htmlFor=""><span className="required-label">*</span> Senha Nova</label>
                                                                    <input type="password" className="form-control" name="new_password" id="new_password" required onChange={this.changeHandler} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex flex-row-reverse">
                                                            <button className="btn btn-primary mr-3" type="submit"><i className="fas fa-save mr-1"></i> Salvar alterações</button>
                                                        </div>
                                                    </form>
                                                </div>
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
                                                                        { <React.Fragment>{ this.state.user.child.first_name } { this.state.user.child.last_name } {this.state.user.child.name}</React.Fragment> }
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
                                                            <div className="number">
                                                                <BeautyStars value={this.state.user.rating} />
                                                            </div>
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