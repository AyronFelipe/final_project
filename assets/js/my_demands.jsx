import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Preloader from './preloader';


const config = {
    headers: { 'Authorization': `Token ${localStorage.token}` }
};

export default class MyDemands extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            demands: [],
            isLoading: true,
        }
    }

    getDemands = () => {
        axios.get(`/api/my-demands/`, config)
        .then((res) => {
            this.setState({ demands: res.data, isLoading: false })
        })
        .catch((error) => {
            console.log(error.response);
        })
    }

    componentDidMount(){
        this.getDemands();
    }

    renderMyDemands = () => {
        if (this.state.demands.length == 0) {
            return(
                <div className="d-flex align-items-center flex-column mt-5">
                    <h1 className="font-weight-bold">Nenhum pedido encontrado</h1>
                    <p className="lead">Você ainda não fez um pedido. Clique no botão abaixo para realizá-lo.</p>
                    <Link to={'/demands/new-demand/'}>
                        <button className="btn btn-info btn-lg btn-round"><i className="la flaticon-add mr-1"></i> Novo Pedido</button>
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
                                    <div className="card-title">Meus pedidos</div>
                                    <div className="card-tools">
                                        <Link to={`/donations/new-donation/`}>
                                            <button className="btn btn-info btn-round ml-auto"><i className="la flaticon-add mr-1"></i> Novo pedido</button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table id="my-demands-datatables" className="display table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Nome</th>
                                                <th>Quantidade</th>
                                                <th>Quantidade recebida</th>
                                                <th>Status</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { this.state.demands.map((demand) => 
                                                <tr key={demand.pk}>
                                                    <td>{demand.name}</td>
                                                    <td>{ demand.quantity } { demand.unit_measurement }s</td>
                                                    <td>{ demand.quantity_received } { demand.unit_measurement }s</td>
                                                    <td>{ demand.status }</td>
                                                    <td>
                                                        <p className="demo mt-3">
                                                            <Link to={`/demands/demand/${demand.slug}/` } style={{ textDecoration: 'none' }}>
                                                                <button className="btn btn-default ml-2 my-1 btn-block"><i className="fas fa-info-circle"></i> Detalhe</button>
                                                            </Link>
                                                        </p>
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
                                <h2 className="text-white pb-2 fw-bold page-title">Meus pedidos</h2>
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
                                        <Link to={`/demands/my-demands/`}>
                                            <span className="text-white">Meus pedidos</span>
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
                            { this.renderMyDemands() }
                        </React.Fragment>
                    }
                </div>
            </div>
        )
    }
}