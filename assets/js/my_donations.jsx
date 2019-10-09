import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Preloader from './preloader';
import { unformatDate2 } from './utils';


const config = {
    headers: { 'Authorization': `Token ${localStorage.token}` }
};

export default class MyDonations extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            donations: [],
            isLoading: true,
        }
    }

    getDonations = () => {
        axios.get(`/api/my-donations/`, config)
        .then((res) => {
            this.setState({ donations: res.data, isLoading: false })
        })
        .catch((error) => {
            console.log(error.response);
        })
    }

    componentDidMount(){
        this.getDonations();
    }

    deleteDonation = (pk, e) => {
        e.preventDefault();
        axios.delete(`/api/my-donations/${pk}/`, config)
        .then((res) => {
            $('.fechar').click();
            this.setState({ donations: res.data.donations });
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
            swal(error.reponse.data.message, {
                icon: "error",
                buttons: {
                    confirm: {
                        className: 'btn btn-danger'
                    }
                },
            });
        })
    }

    renderMyDonations = () => {
        if (this.state.donations.length == 0) {
            return(
                <div className="d-flex align-items-center flex-column mt-5">
                    <h1 className="font-weight-bold">Nenhuma doação encontrada</h1>
                    <p className="lead">Você ainda não fez uma doação. Clique no botão abaixo para realiza-la.</p>
                    <Link to={'/donations/new-donation/'}>
                        <button className="btn btn-info btn-lg btn-round"><i className="la flaticon-add mr-1"></i> Nova Doação</button>
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
                                    <div className="card-title">Minhas doações</div>
                                    <div className="card-tools">
                                        <Link to={`/donations/new-donation/`}>
                                            <button className="btn btn-info btn-round ml-auto"><i className="la flaticon-add mr-1"></i> Nova doação</button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table id="my-donations-datatables" className="display table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Nome</th>
                                                <th>Número de Solicitações</th>
                                                <th>Status</th>
                                                <th>Validade</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { this.state.donations.map((donation) => 
                                                <tr key={donation.pk}>
                                                    <td>
                                                        <div className="avatar avatar-xl mr-2 my-1">
                                                            <img src={donation.main_photo} alt="" className="avatar-img rounded-circle" />
                                                        </div>
                                                        <strong>{ donation.name }</strong>
                                                    </td>
                                                    <td>{ donation.solicitations_count }</td>
                                                    <td>{ donation.status }</td>
                                                    <td>{unformatDate2(`${donation.validity}`)} até às { donation.validity_hour }</td>
                                                    <td>
                                                        <p className="demo mt-3">
                                                            <Link to={`/donations/donation/${donation.slug}/` } style={{ textDecoration: 'none' }}>
                                                                <button className="btn btn-default ml-2 my-1 btn-block"><i className="fas fa-info-circle"></i> Detalhe</button>
                                                            </Link>
                                                            <Link to={`/donations/donation/${donation.slug}/solicitations/`} style={{ textDecoration: 'none' }}>
                                                                <button className="btn btn-primary ml-2 my-1 btn-block"><i className="fas fa-handshake mr-1"></i> Solicitações</button>
                                                            </Link>
                                                            <button className="btn btn-danger ml-2 my-1 btn-block" data-toggle="modal" data-target={`#modal-delete-donation-${donation.pk}`}><i className="fas fa-trash-alt mr-1"></i> Apagar</button>
                                                            <Link to={`/donations/donation/edit/${donation.slug}/`} style={{ textDecoration: 'none' }}>
                                                                <button className="btn btn-info ml-2 my-1 btn-block"><i className="fas fa-pen mr-1"></i>Editar</button>
                                                            </Link>
                                                        </p>
                                                        <div className="modal fade" id={`modal-delete-donation-${donation.pk}`}>
                                                            <div className="modal-dialog">
                                                                <div className="modal-content">
                                                                    <form onSubmit={this.handleSubmit} method="POST">
                                                                        <div className="modal-header">
                                                                            <h5 className="modal-title">Deletar esta doação</h5>
                                                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                                                <span aria-hidden="true">&times;</span>
                                                                            </button>
                                                                        </div>
                                                                        <div className="modal-body">
                                                                            <div className="row">
                                                                                <div className="col-12">
                                                                                    <div className="alert alert-danger" role="alert">
                                                                                        Ao clicar em "Apagar", você estará deletando os registros dessa doação de nossos servidores e esta ação é irreversível.
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="modal-footer">
                                                                            <button type="button" className="fechar btn btn-default" data-dismiss="modal">Cancelar</button>
                                                                            <button type="submit" className="btn btn-danger" onClick={(e) => this.deleteDonation(donation.pk, e)}>Apagar</button>
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) }
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
                                <h2 className="text-white pb-2 fw-bold page-title">Minhas doações</h2>
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
                                            <span className="text-white">Minhas doações</span>
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
                            { this.renderMyDonations() }
                        </React.Fragment>
                    }
                </div>
            </div>
        )
    }
}