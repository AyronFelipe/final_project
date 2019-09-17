import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

let config = {
    headers: { 'Authorization': `Token ${localStorage.token}` }
};

export default class Profile extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            user: [],
            isLoading: true,
            logged: [],
            show_info: false,
        }
    }

    getUser = () => {
        const url = window.location.pathname;
        const pk = url.split('-');
        axios.get(`/api/users/${pk[1]}`, config)
        .then((res) => {
            this.setState({ user: res.data, isLoading: false });
            this.showInfo();
        })
        .catch((error) => {
            console.log(error.response);
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

    render(){
        return(
            <div className="content">
                <div className="panel-header bg-primary">
                    <div className="page-inner py-5">
                        <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                            <div>
                                <h2 className="text-white pb-2 fw-bold page-title">Perfil</h2>
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
                                            <span className="text-white">Perfil</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-inner">
                    <div className="row">
                        <div className="col-md-10 col-12 mx-auto">
                            {
                                this.state.show_info ?
                                <div className="d-lg-none d-xl-none mb-3 d-flex flex-row-reverse">
                                    <Link to={`/accounts/profile/edit/${this.state.user.username}/`}>
                                        <button className="btn btn-info btn-border btn-round btn-lg mr-2 mt-2">
                                            <span className="btn-label"><i className="fas fa-pen"></i></span>Editar Informações
                                        </button>
                                    </Link>
                                </div>
                                :
                                null
                            }
                            <div className="card card-profile">
                                <div className="card-header" >
                                    <div className="card-head-row">
                                        <div className="profile-picture">
                                            <img src={ this.state.user.photo } alt="..." className="avatar-img rounded-circle" style={{ width: '160px', maxWidth: '160px' }} />
                                        </div>
                                        {
                                            this.state.show_info ?
                                            <div className="card-tools" style={{ zIndex: '1000' }}>
                                                <div className="d-none d-lg-block d-xl-block">
                                                    <Link to={`/accounts/profile/edit/${this.state.user.username}/`}>
                                                        <button className="btn btn-info btn-border btn-round btn-lg mr-2 mt-2">
                                                            <span className="btn-label"><i className="fas fa-pen"></i></span>Editar Informações
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                            :
                                            null
                                        }
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="user-profile text-center">
                                        {
                                            this.state.user.child == undefined ?
                                                <div className="loader loader-lg"></div>
                                            :
                                                <React.Fragment>
                                                    {
                                                        this.state.user.child.type == 'person' ?
                                                        <React.Fragment>
                                                            <div className="name">{ this.state.user.child.first_name } { this.state.user.child.last_name }</div>
                                                            <div className="job">{ this.state.user.email }</div>
                                                            <div className="desc">{ this.state.user.cell_phone }</div>
                                                        </React.Fragment>
                                                        :
                                                        <React.Fragment>
                                                            <div className="name">{ this.state.user.child.name }</div>
                                                            <div className="job">{ this.state.user.email }</div>
                                                            <div className="desc">{ this.state.user.cell_phone }</div>
                                                        </React.Fragment>
                                                    }
                                                </React.Fragment>
                                        }
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-12 col-md-4">
                                            <div className="card card-stats card-round">
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col-5">
                                                            <div className="icon-big text-center">
                                                                <i className="fas fa-hand-holding text-info"></i>
                                                            </div>
                                                        </div>
                                                        <div className="col-7 col-stats">
                                                            <div className="numbers">
                                                                <p className="card-category">Doações Cadastradas</p>
                                                                <h4 className="card-title">{ this.state.user.donations_count }</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-4">
                                            <div className="card card-stats card-round">
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col-5">
                                                            <div className="icon-big text-center">
                                                                <i className="fas fa-hand-holding-heart text-success"></i>
                                                            </div>
                                                        </div>
                                                        <div className="col-7 col-stats">
                                                            <div className="numbers">
                                                                <p className="card-category">Doações Finalizadas</p>
                                                                <h4 className="card-title">{ this.state.user.donations_accepted }</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-4">
                                            <div className="card card-stats card-round">
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col-5">
                                                            <div className="icon-big text-center">
                                                                <i className="fas fa-grin-beam text-primary"></i>
                                                            </div>
                                                        </div>
                                                        <div className="col-7 col-stats">
                                                            <div className="numbers">
                                                                <p className="card-category">Confiabilidade</p>
                                                                <h4 className="card-title">1515515</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-12"></div>
                                        <div className="col-md-6 col-12">
                                            <div className="card full-height">
                                                <div className="card-header">
                                                    <h1>Comentários</h1>
                                                </div>
                                                <div className="card-body">
                                                    <div className="d-flex">
                                                        <div className="avatar">
                                                            <span className="avatar-title rounded-circle border border-white bg-info">P</span>
                                                        </div>
                                                        <div className="flex-1 ml-3 pt-1">
                                                            <h6 className="text-uppercase fw-bold mb-1">Nome do Cara</h6>
                                                            <span className="text-muted">Comentário do cara</span>
                                                        </div>
                                                        <div className="float-right pt-1">
                                                            <small className="text-muted">horário humanizado</small>
                                                        </div>
                                                    </div>
                                                    <div className="separator-dashed"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}