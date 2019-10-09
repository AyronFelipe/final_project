import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Preloader from './preloader';
import { date } from './utils';


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
        }
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
                                    <button className="btn btn-default ml-2 my-1 btn-block"><i className="fas fa-info-circle"></i> Detalhe</button>
                                    <button className="btn btn-primary ml-2 my-1 btn-block"><i className="fas fa-handshake mr-1"></i> Solicitações</button>
                                    <button className="btn btn-danger ml-2 my-1 btn-block" data-toggle="modal" data-target={`#modal-delete-donation-${donation.pk}`}><i className="fas fa-trash-alt mr-1"></i> Apagar</button>
                                    <button className="btn btn-info ml-2 my-1 btn-block"><i className="fas fa-pen mr-1"></i>Editar</button>
                                </p>
                            </td>
                        </tr>
                    ) }
                </tbody>
            );
        }
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
                                        <div className="col-md-10 col-12">
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