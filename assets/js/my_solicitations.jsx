import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Preloader from './preloader';

let config = {
    headers: { 'Authorization': `Token ${localStorage.token}` }
};

export default class MySolicitations extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            solicitations: [],
            isLoading: true,
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
                    <div className="col-md-10 col-12">
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
                                                <th>Comentário</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.solicitations.map((solicitation) => 
                                                <tr key={solicitation.pk}>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
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