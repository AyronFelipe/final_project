import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Preloader from './preloader';
import BeautyStars from 'beauty-stars';


let config = {
    headers: { 'Authorization': `Token ${localStorage.token}` }
};

export default class Profile extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            user: [],
            isLoading: true,
            isLoadingComments: true,
            logged: [],
            show_info: false,
            comments: [],
        }
    }

    getUser = () => {
        const url = window.location.pathname;
        const pk = url.split('-');
        axios.get(`/api/users/${pk[1]}`, config)
        .then((res) => {
            this.setState({ user: res.data, isLoading: false });
            this.getLoggedUser();
            this.getComments(res.data.pk);
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

    getComments = (pk) => {
        axios.get(`/api/user/${pk}/comments/`, config)
        .then((res) => {
            this.setState({ comments: res.data, isLoadingComments: false });
        })
        .catch((error) => {
            this.setState({ comments: [], isLoadingComments: false });
            console.log(error.response);
        })
    }

    showInfo = () => {
        if (this.state.user.pk == this.state.logged.pk) {
            this.setState({ show_info: true });
        }
    }

    componentDidMount(){
        this.getUser();
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
                        <div className="col-12">
                            {
                                this.state.show_info ?
                                <div className="d-lg-none d-xl-none mb-4 d-flex flex-row-reverse">
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
                                        <div className="col-md-12 col-lg-4">
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
                                        <div className="col-md-12 col-lg-4">
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
                                        <div className="col-md-12 col-lg-4">
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
                                                                <h4 className="card-title">
                                                                    <BeautyStars
                                                                        value={this.state.user.rating}
                                                                    />
                                                                </h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                this.state.isLoadingComments ?
                                <Preloader />
                                :
                                <div className="card">
                                    <div className="card-header">
                                        <h1>Comentários</h1>
                                    </div>
                                    <div className="card-body">
                                        {
                                            this.state.comments.length > 0 ?
                                            <React.Fragment>
                                            {
                                                this.state.comments.map((comment) =>
                                                    <React.Fragment key={comment.pk}>
                                                        <div className="d-flex">
                                                            <div className="avatar">
                                                                <Link to={`/accounts/profile/${comment.commenter_username}/`} target="_blank">
                                                                    <img src={comment.photo_commenter} alt="..." className="avatar-img rounded-circle" />
                                                                </Link>
                                                            </div>
                                                            <div className="flex-1 ml-3 pt-1">
                                                                <Link to={`/accounts/profile/${comment.commenter_username}/`} target="_blank">
                                                                    <h6 className="text-uppercase fw-bold mb-1">{ comment.commenter_name }</h6>
                                                                </Link>
                                                                <span className="text-muted">{ comment.content }</span>
                                                            </div>
                                                            <div className="float-right pt-1">
                                                                <small className="text-muted">{ comment.naturaltime }</small>
                                                            </div>
                                                        </div>
                                                        <div className="separator-dashed"></div>
                                                    </React.Fragment>
                                                )
                                            }
                                            </React.Fragment>
                                            :
                                            <div className="d-flex">
                                                <div className="flex-1 ml-3 pt-1">
                                                    <h6 className="text-uppercase fw-bold mb-1">Atenção</h6>
                                                    <span className="text-muted">Este usuário não possui comentários.</span>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}