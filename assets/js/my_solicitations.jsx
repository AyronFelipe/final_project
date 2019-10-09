import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Preloader from './preloader';
import { unformatDate2 } from './utils';

let config = {
    headers: { 'Authorization': `Token ${localStorage.token}` }
};

export default class MySolicitations extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            solicitations: [],
            isLoading: true,
            owner: [],
            isLoadingOwner: true,
        }
    }

    getSolicitations = () => {
        axios.get(`/api/my-solicitations/`, config)
        .then((res) => {
            this.setState({ solicitations: res.data, isLoading: false })
        })
        .catch((error) => {
            console.log(error.response);
        })
    }

    componentDidMount(){
        this.getSolicitations();
    }

    deleteSolicitation = (pk, e) => {
        e.preventDefault();
        axios.delete(`/api/my-solicitations/${pk}`, config)
        .then((res) => {
            $('.fechar').click();
            this.setState({ solicitations: res.data.solicitations });
            swal(res.data.message, {
                icon: "success",
                buttons: {
                    confirm: {
                        className: 'btn btn-success'
                    }
                },
            });
        })
        .catch((error) => {
            $('.fechar').click();
            swal(error.response.data.message, {
                icon: "error",
                buttons: {
                    confirm: {
                        className: 'btn btn-danger'
                    }
                },
            });
        });
    }

    showDetail = (pk, e) => {
        $(`.show_modal_${pk}`).click();
        this.state.solicitations.map((solicitation) => {
            if (solicitation.pk == pk) {
                axios.get(`/api/users/${solicitation.donation.donator_pk}`, config)
                .then((res) => {
                    this.setState({ owner: res.data, isLoadingOwner: false });
                })
                .catch((error) => {
                    swal(error.reponse.data.detail, {
                        icon: "error",
                        buttons: {
                            confirm: {
                                className: 'btn btn-danger'
                            }
                        },
                    });
                })
            }
        })
    }

    changePage = (path) => {
        $('.fechar').click();
        this.props.history.push(path);
    }

    renderMySolicitations = () => {
        if (this.state.solicitations.length == 0) {
            return(
                <div className="d-flex align-items-center flex-column mt-5">
                    <h1 className="font-weight-bold">Nenhuma solicitação encontrada</h1>
                    <p className="lead">Você ainda não fez uma solicitação. Clique no botão abaixo para ser redirecionado para a página inicial.</p>
                    <Link to={'/donations/'}>
                        <button className="btn btn-info btn-lg btn-round"><i className="la flaticon-home mr-1"></i> Página Inicial</button>
                    </Link>
                </div>
            );
        } else {
            return(
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-head-row">
                                    <div className="card-title">Minhas solicitações</div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table id="my-solicitations" className="display table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Solicitação</th>
                                                <th>Doação</th>
                                                <th>Status</th>
                                                <th>Comentário</th>
                                                <th>Validade</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.solicitations.map((solicitation) => 
                                                <tr key={solicitation.pk}>
                                                    <td>{ solicitation.slug }</td>
                                                    <td>
                                                        <Link to={`/donations/donation/${solicitation.donation.slug}/`} style={{ textDecoration: 'none' }}>
                                                            <span>{ solicitation.donation.slug } - { solicitation.donation.status }</span>
                                                        </Link>
                                                    </td>
                                                    <td>{ solicitation.status }</td>
                                                    <td>
                                                        <span>{ solicitation.comment }</span>
                                                    </td>
                                                    <td>
                                                        {
                                                            solicitation.validity == null ?
                                                                <span className="text-muted">O dono da doação ainda não informou a validade</span>
                                                            :
                                                                <span>{unformatDate2(`${donation.validity}`)} até às { donation.validity_hour }</span>
                                                        }
                                                    </td>
                                                    <td>
                                                        <p className="demo mt-3">
                                                            <button className="btn btn-default ml-2 my-1 btn-block" onClick={(e) => this.showDetail(solicitation.pk)}><i className="fas fa-info-circle mr-1"></i> Detalhe</button>
                                                            <button data-toggle="modal" data-target={`#modal-detail-solicitation-${solicitation.pk}`} className={`show_modal_${solicitation.pk}`} hidden></button>
                                                            <button className="btn btn-danger ml-2 my-1 btn-block" data-toggle="modal" data-target={`#modal-delete-solicitation-${solicitation.pk}`}><i className="fas fa-trash-alt mr-1"></i> Apagar</button>
                                                        </p>
                                                        <div className="modal fade" id={`modal-delete-solicitation-${solicitation.pk}`}>
                                                            <div className="modal-dialog">
                                                                <div className="modal-content">
                                                                    <form onSubmit={this.handleSubmit} method="POST">
                                                                        <div className="modal-header">
                                                                            <h5 className="modal-title">Deletar esta solicitação</h5>
                                                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                                                <span aria-hidden="true">&times;</span>
                                                                            </button>
                                                                        </div>
                                                                        <div className="modal-body">
                                                                            <div className="row">
                                                                                <div className="col-12">
                                                                                    <div className="alert alert-danger" role="alert">
                                                                                        Ao clicar em "Apagar", você estará deletando os registros dessa solicitação de nossos servidores e esta ação é irreversível.
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="modal-footer">
                                                                            <button type="button" className="fechar btn btn-default" data-dismiss="modal">Cancelar</button>
                                                                            <button type="submit" className="btn btn-danger" onClick={(e) => this.deleteSolicitation(solicitation.pk, e)}>Apagar</button>
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="modal fade" id={`modal-detail-solicitation-${solicitation.pk}`}>
                                                            <div className="modal-dialog">
                                                                <div className="modal-content">
                                                                    <div className="modal-header">
                                                                        <h5 className="modal-title">Detalhes da solicitação { solicitation.slug }</h5>
                                                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                                            <span aria-hidden="true">&times;</span>
                                                                        </button>
                                                                    </div>
                                                                    <div className="modal-body">
                                                                        <div className="row">
                                                                            <div className="col-12">
                                                                                <h3>Solicitação</h3>
                                                                                <p className="demo-3">
                                                                                    <span><strong>Slug: </strong>{ solicitation.slug }</span><br/>
                                                                                    <span><strong>Comentário: </strong>{ solicitation.comment }</span><br/>
                                                                                    <span><strong>Status: </strong>{ solicitation.status }</span><br/>
                                                                                    <span><strong>Validade: </strong>{ solicitation.validity }</span>
                                                                                </p>
                                                                                <div className="separator-dashed"></div>
                                                                                <h3>Doação</h3>
                                                                                <p className="demo-3">
                                                                                    <span><strong>Doação: </strong>{ solicitation.donation.slug }</span><br/>
                                                                                    <span><strong>Validade: </strong>{ unformatDate2(solicitation.donation.validity) } até às { solicitation.donation.validity_hour }</span><br/>
                                                                                    <span><strong>Status: </strong>{ solicitation.donation.status }</span><br/><br/>
                                                                                    <button type="button" className="btn btn-info" onClick={() => this.changePage(`/donations/donation/${solicitation.donation.slug}/`)}>Ver doação</button>
                                                                                </p>
                                                                                <div className="separator-dashed"></div>
                                                                                <h3>Dono da Doação</h3>
                                                                                {
                                                                                    this.state.isLoadingOwner?
                                                                                        <Preloader />
                                                                                    :
                                                                                        <p className="demo-3">
                                                                                            <span><strong>Nome: </strong>{ this.state.owner.child.first_name } { this.state.owner.child.last_name } { this.state.owner.child.name }</span><br/>
                                                                                            <span><strong>Email: </strong>{ this.state.owner.email }</span><br/><br/>
                                                                                            <button type="button" className="btn btn-info" onClick={() => this.changePage(`/accounts/profile/${this.state.owner.username}/`)}>Ver perfil</button>
                                                                                        </p>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="modal-footer">
                                                                        <button type="button" className="fechar btn btn-primary" data-dismiss="modal">Fechar</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    render(){
        return(
            <div className="content">
                <div className="panel-header bg-primary">
                    <div className="page-inner py-5">
                        <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                            <div>
                                <h2 className="text-white pb-2 fw-bold page-title">Minhas solicitações</h2>
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
                                        <Link to={`/donations/my-solicitations/`}>
                                            <span className="text-white">Minhas solicitações</span>
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
                            { this.renderMySolicitations() }
                        </React.Fragment>
                    }
                </div>
            </div>
        );
    }
}