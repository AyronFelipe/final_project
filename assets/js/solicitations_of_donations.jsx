import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Preloader from './preloader';
import { date } from './utils';
import '../template/js/plugin/datepicker/bootstrap-datetimepicker.min.js';
import { formatDate, unformatDate2 } from './utils';
import BeautyStars from 'beauty-stars';


const config = {
    headers: { 'Authorization': `Token ${localStorage.token}` }
};

export default class SolicitationsOfDonations extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            donation: [],
            isLoading: true,
            logged: [],
            show_info: false,
            solicitations: [],
            isLoadingSolicitations: true,
            reason_rejection: '',
            solicitation: '',
            validity: '',
            validity_hour: '',
            value: 0,
            content: '',
        }
    }

    setSolicitation = (e, solicitation) => {
        this.setState({ solicitation: solicitation })
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

    getDonation = () => {
        let pathname = window.location.pathname;
        let slug = pathname.split('/')[3];

        axios.get(`/api/donations/${slug.split('-')[2].split('.')[1]}/`, config)
        .then((res) => {
            this.setState({ donation: res.data });
            this.getLoggedUser();
            this.getSolicitationsOfDonation();
        })
        .catch((error) => {
            console.log(error);
        })
    }

    showInfo = () => {
        if (this.state.donation.donator_pk == this.state.logged.pk) {
            this.setState({ show_info: true, isLoading: false });
        } else {
            this.setState({ isLoading: false });
        }
    }

    getSolicitationsOfDonation = () => {
        axios.get(`/api/donation/${this.state.donation.pk}/solicitations/`, config)
        .then((res) => {
            this.setState({ solicitations: res.data.solicitations, isLoadingSolicitations: false });
        })
        .catch((error) => {
            console.log(error.response);
        })
    }

    changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleFocus = (e, pk) => {
        let today = new Date();
        $(`#validity-${pk}`).datetimepicker({
            format: 'DD/MM/YYYY',
            minDate: today,
            locale: 'pt-br',
        });
        $(`#validity_hour-${pk}`).datetimepicker({
            format: 'HH:mm',
            locale: 'pt-br',
        });
    }

    renderSolicitations = () => {
        if (this.state.isLoadingSolicitations) {
            return(
                <tbody>
                    <tr>
                        <td colSpan={8}>
                            <Preloader/>
                        </td>
                    </tr>
                </tbody>
            );
        } else {
            return (
                <tbody>
                    { this.state.solicitations.map((solicitation) =>
                        <tr key={solicitation.pk}>
                            <td>{ solicitation.slug }</td>
                            <td>{date(solicitation.created_at)}</td>
                            <td>{ solicitation.status }</td>
                            <td>
                                <Link to={`/accounts/profile/${solicitation.owner_username}/`}>
                                    { solicitation.owner }
                                </Link>
                            </td>
                            <td>
                                <p>{ solicitation.comment }</p>
                            </td>
                            <td>
                                <p className="demo mt-3">
                                    {
                                        solicitation.status == 'Rejeitada' || solicitation.status == 'Em Espera' || solicitation.status == 'Finalizada - Não doada' ?
                                        <span className="row justify-content-center">-</span>
                                        :
                                        <React.Fragment>
                                            {
                                                solicitation.status == 'Aceita' ?
                                                <React.Fragment>
                                                    <button className="btn btn-primary btn-block ml-2 my-1 btn-block" data-toggle="modal" data-target={`#modal-finalize-solicitation-${solicitation.pk}`} onClick={(e) => this.setSolicitation(e, solicitation.pk)} >Finalizar</button>
                                                    <button className="btn btn-default btn-block ml-2 my-1 btn-block" data-toggle="modal" data-target={`#modal-not-appear-solicitation-${solicitation.pk}`} onClick={(e) => this.setSolicitation(e, solicitation.pk)} >Não apareceu</button>
                                                    <button className="btn btn-danger btn-block ml-2 my-1 btn-block" data-toggle="modal" data-target={`#modal-cancel-solicitation-${solicitation.pk}`} onClick={(e) => this.setSolicitation(e, solicitation.pk)} >Cancelar</button>
                                                </React.Fragment>
                                                :
                                                <React.Fragment>
                                                    {
                                                        solicitation.status == 'Finalizada - Doada' ?
                                                        <strong className="row justify-content-center text-success">Solicitação aceita</strong>
                                                        :
                                                        <React.Fragment>
                                                            <button className="btn btn-primary ml-2 my-1 btn-block" data-toggle="modal" data-target={`#modal-accept-solicitation-${solicitation.pk}`} onClick={(e) => this.setSolicitation(e, solicitation.pk)}><i className="fas fa-check mr-1"></i> Aceitar</button>
                                                            <button className="btn btn-danger ml-2 my-1 btn-block" data-toggle="modal" data-target={`#modal-reject-solicitation-${solicitation.pk}`} onClick={(e) => this.setSolicitation(e, solicitation.pk)}><i className="la flaticon-cross mr-1"></i> Rejeitar</button>
                                                        </React.Fragment>
                                                    }
                                                </React.Fragment>
                                            }
                                        </React.Fragment>
                                    }
                                </p>
                                <div className="modal fade" id={`modal-reject-solicitation-${solicitation.pk}`}>
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <form onSubmit={this.handleRejectSubmit} method="POST">
                                                <div className="modal-header">
                                                    <h5 className="modal-title">Rejeitar esta solicitação</h5>
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <div className="alert alert-danger" role="alert">
                                                                Ao clicar em "Rejeitar", esta solicitação passará para o estado de rejeitada.
                                                            </div>
                                                            <input type="hidden" name="solicitation" value={solicitation.pk} />
                                                            <div className="form-group">
                                                                <label htmlFor=""><span className="required-label">*</span> Motivo da rejeição:</label>
                                                                <textarea name="reason_rejection" cols="30" rows="10" className="form-control" onChange={this.changeHandler} required></textarea>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="fechar btn btn-default" data-dismiss="modal">Cancelar</button>
                                                    <button type="submit" className="btn btn-danger">Rejeitar</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal fade" id={`modal-accept-solicitation-${solicitation.pk}`}>
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <form onSubmit={this.handleAcceptSubmit} method="POST">
                                                <div className="modal-header">
                                                    <h5 className="modal-title">Aceitar esta solicitação</h5>
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <div className="alert alert-info" role="alert">
                                                                Ao clicar em "Aceitar" esta doação passará para o staus "Em Espera", o que significa que você está esperando o solicitante ir buscar a doação no local informado.
                                                            </div>
                                                            <input type="hidden" name="solicitation" value={solicitation.pk} />
                                                            <div className="form-group">
                                                                <label htmlFor=""><span className="required-label">*</span> Validade:</label>
                                                                <div className="input-group">
                                                                    <input type="text" name="validity" id={`validity-${solicitation.pk}`} className="form-control" required onBlur={this.changeHandler} onFocus={(e) => this.handleFocus(e, solicitation.pk)} />
                                                                    <div className="input-group-append">
                                                                        <span className="input-group-text">
                                                                            <i className="fa fa-calendar-check"></i>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor=""><span className="required-label">*</span> Validade hora:</label>
                                                                <div className="input-group">
                                                                    <input type="text" name="validity_hour" id={`validity_hour-${solicitation.pk}`} className="form-control" required onBlur={this.changeHandler} onFocus={(e) => this.handleFocus(e, solicitation.pk)} />
                                                                    <div className="input-group-append">
                                                                        <span className="input-group-text">
                                                                            <i className="fa fa-clock"></i>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="fechar btn btn-default" data-dismiss="modal">Cancelar</button>
                                                    <button type="submit" className="btn btn-primary">Aceitar</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal fade" id={`modal-finalize-solicitation-${solicitation.pk}`}>
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <form onSubmit={this.handleFinalizeSubmit} method="POST">
                                                <div className="modal-header">
                                                    <h5 className="modal-title">Finalizar esta solicitação</h5>
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <div className="alert alert-primary">
                                                                Ao clicar em "Finalizar" esta doação passará para o estado de finalizada, e as solicitações não escolhidas serão finalizadas.
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="fechar btn btn-default" data-dismiss="modal">Cancelar</button>
                                                    <button type="submit" className="btn btn-primary">Finalizar</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal fade" id={`modal-not-appear-solicitation-${solicitation.pk}`}>
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <form onSubmit={this.handleNotAppearSubmit} method="POST">
                                                <div className="modal-header">
                                                    <h5 className="modal-title">Solicitante não apareceu</h5>
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <div className="alert alert-default">
                                                                Ao clicar em "Confirmar" esta solicitação passa para o estado de imcompleta e não poderá mais ser movimentada.
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="fechar btn btn-default" data-dismiss="modal">Cancelar</button>
                                                    <button type="submit" className="btn btn-primary">Confirmar</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal fade" id={`modal-cancel-solicitation-${solicitation.pk}`}>
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <form onSubmit={this.handleCancelSubmit} method="POST">
                                                <div className="modal-header">
                                                    <h5 className="modal-title">Cancelar esta solicitação</h5>
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <div className="alert alert-danger">
                                                                Ao clicar em "Cancelar" esta solicitação passará para o estado de Criada e as Solicitações que estão Em espera vão passar para o estado de Criada. 
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="fechar btn btn-default" data-dismiss="modal">Fechar</button>
                                                    <button type="submit" className="btn btn-danger">Cancelar</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ) }
                </tbody>
            );
        }
    }

    handleAcceptSubmit = (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('solicitation', this.state.solicitation);
        form.append('validity', formatDate(this.state.validity));
        form.append('validity_hour', this.state.validity_hour);
        axios.post(`/api/donation/accepts/`, form, config)
        .then((res) => {
            $('.fechar').click();
            swal(res.data.message, {
                icon: 'success',
                buttons: {
                    confirm: {
                        className: 'btn btn-success'
                    }
                }
            })
            this.setState({ solicitations: res.data.solicitations });
            this.getDonation();
        })
        .catch((error) => {
            swal(error.response.data.message, {
                icon: "error",
                buttons: {
                    confirm: {
                        className: 'btn btn-danger'
                    }
                }
            })
        })
    }

    handleRejectSubmit = (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('reason_rejection', this.state.reason_rejection);
        form.append('solicitation', this.state.solicitation);
        axios.post(`/api/donation/rejects/`, form, config)
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
            })
            this.getDonation();
        })
        .catch((error) => {
            swal(error.response.data.message, {
                icon: "error",
                buttons: {
                    confirm: {
                        className: 'btn btn-danger'
                    }
                },
            })
        })
    }

    handleFinalizeSubmit = (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('solicitation', this.state.solicitation);
        axios.post(`/api/donation/finalize/`, form, config)
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
            })
            this.getDonation();
            this.showComment();
        })
        .catch((error) => {
            swal(error.response.data.message, {
                icon: "error",
                buttons: {
                    confirm: {
                        className: 'btn btn-danger'
                    }
                },
            })
        })
    }

    handleCancelSubmit = (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('solicitation', this.state.solicitation)
        axios.post(`/api/donation/cancel/`, form, config)
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
            })
        })
        .catch((error) => {
            swal(error.response.data.message, {
                icon: "error",
                buttons: {
                    confirm: {
                        className: 'btn btn-danger'
                    }
                },
            })
        })
        this.getDonation();
    }

    handleNotAppearSubmit = (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('solicitation', this.state.solicitation);
        axios.post(`/api/donation/not-appear/`, form, config)
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
            })
            this.getDonation();
            this.showComment();
        })
        .catch((error) => {
            swal(error.response.data.message, {
                icon: "error",
                buttons: {
                    confirm: {
                        className: 'btn btn-danger'
                    }
                },
            })
        })
    }

    showComment = () => {
        $('.show').click();
    }
    
    handleSubmitComment = (e) => {
        e.preventDefault()
        const form = new FormData();
        form.append('content', this.state.content);
        form.append('rate', this.state.value);
        form.append('commenter', this.state.logged.pk);
        form.append('commented', this.state.solicitation.owner_pk);
        form.append('donation', this.state.donation.pk);
        axios.post(`/api/comment/`, form, config)
        .then((res) => {
            $('.fechar').click();
            swal(res.data.message, {
                icon: "success",
                buttons: {
                    confirm: {
                        className: 'btn btn-success'
                    }
                },
            })
        })
        .catch((error) => {
            swal(error.response.data.message, {
                icon: "error",
                buttons: {
                    confirm: {
                        className: 'btn btn-danger'
                    }
                },
            })
        })
    }

    componentDidMount(){
        this.getDonation();
    }

    render(){
        return(
            <div className="content">
                <div className="panel-header bg-primary">
                    <div className="page-inner py-5">
                        <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                            <div>
                                <h2 className="text-white pb-2 fw-bold page-title">Solicitações da doação {this.state.donation.name}</h2>
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
                                        <Link to={`/donations/my-donations/`}>
                                            <span className="text-white">Minhas doaçãoes</span>
                                        </Link>
                                    </li>
                                    <li className="separator">
                                        <i className="flaticon-right-arrow"></i>
                                    </li>
                                    <li className="nav-item">
                                        <Link to={`/donations/donation/${this.state.donation.slug}/solicitations/`}>
                                            <span className="text-white">Solicitações da doação {this.state.donation.name}</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.state.isLoading ?
                        <Preloader />
                    :
                        <React.Fragment>
                            {
                                this.state.show_info ?
                                <div className="page-inner">
                                    <div className="row justify-content-center">
                                        <div className="col-12">
                                            <div className="card">
                                                <div className="card-header">
                                                    <div className="card-head-row">
                                                        <div className="card-title">Detalhes da sua doação</div>
                                                        <div className="card-tools">
                                                            <Link to={`/donations/donation/${this.state.donation.slug}/`} className="btn btn-info btn-border btn-round btn-sm mr-2"><i className="fas fa-info-circle"></i> Detalhes</Link>
                                                            <Link to={`/donations/donation/edit/${this.state.donation.slug}/`} className="btn btn-info btn-border btn-round btn-sm"><i className="fas fa-pen mr-1"></i> Editar</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-body">
                                                    <p><strong>Nome: </strong>{ this.state.donation.name }</p>
                                                    <p><strong>Status: </strong>{ this.state.donation.status }</p>
                                                    <p><strong>Validade: </strong> {unformatDate2(this.state.donation.validity)} até às { this.state.donation.validity_hour }</p>
                                                </div>
                                            </div>
                                            <div className="card">
                                                <div className="card-header">
                                                    <div className="card-title">Solicitações da doação {this.state.donation.name}</div>
                                                </div>
                                                <div className="card-body">
                                                    <div className="table-responsive">
                                                        <table className="table">
                                                            <thead>
                                                                <tr>
                                                                    <th>Solicitação</th>
                                                                    <th>Criada em</th>
                                                                    <th>Status</th>
                                                                    <th>Solicitante</th>
                                                                    <th>Comentário</th>
                                                                    <th>Ações</th>
                                                                </tr>
                                                            </thead>
                                                            { this.renderSolicitations() }
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="show" data-toggle="modal" data-target={`#modal-comment`} hidden></button>
                                    <div className="modal fade" id={`modal-comment`}>
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <form onSubmit={this.handleSubmitComment} method="POST">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title">Realizar Comentário sobre { this.state.solicitation.owner }</h5>
                                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <div className="form-group">
                                                                    <label htmlFor=""><span className="required-label">*</span> Comentário: </label>
                                                                    <textarea name="content" id="content" cols="30" rows="10" name="content" className="form-control" required onChange={this.changeHandler}></textarea>
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="">Quantas estrelas você dá para { this.state.solicitation.owner } </label>
                                                                    <BeautyStars
                                                                        value={this.state.value}
                                                                        onChange={value => this.setState({ value })}
                                                                        inactiveColor={'#808080'}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="fechar btn btn-default" data-dismiss="modal">Cancelar</button>
                                                        <button type="submit" className="btn btn-primary">Comentar</button>
                                                    </div>
                                                </form>
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
        );
    }
}