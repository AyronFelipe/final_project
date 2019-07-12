import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Preloader from './preloader';


const API_KEY = "AIzaSyCq-XgDdK7Ewn_BWMxXpiDVn04y_BHB4yY";

const config = {
    headers: { 'Authorization': `Token ${localStorage.token}` }
};

class DetailDemand extends React.Component {

    constructor(props) {
        super(props);
        this.state = { demand: [], isLoading: true, }
    }

    getDemand = () => {
        let pathname = window.location.pathname;
        let slug = pathname.split('/')[3];

        axios.get(`/api/demands/${slug.split('-')[2].split('.')[1]}/`, config)
        .then((res) => {
            this.setState({ demand: res.data, isLoading: false });
        })
        .catch((error) => {
            console.log(error.response);
        });
    }

    componentDidMount = () => {
        this.getDemand();
    }

    render() {
        return(
            <div className="content">
                <div className="panel-header bg-primary">
                    <div className="page-inner py-5">
                        <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                            <div>
                                <h2 className="text-white pb-2 fw-bold page-title">
                                    Detalhe do Pedido
                                    {this.state.isLoading ? <div className="loader loader-lg"></div> : <span> {this.state.demand.name}</span>}
                                </h2>
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
                                        <span className="text-white">Detalhe da Doação
                                            {this.state.isLoading ? <div className="loader loader-lg"></div> : <span> {this.state.demand.name}</span>}
                                        </span>
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
                        <div className="page-inner">
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="card">
                                        <div className="card-header">
                                            <div className="d-flex align-items-center">
                                                <h2 className="card-title">{ this.state.demand.name }</h2>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="row mt-3">
                                                <div className="col-12">
                                                    <h6 className="text-uppercase mb-3 fw-bold">Foto Principal</h6>
                                                    <img src={ this.state.demand.main_photo } alt="" className="rounded img-fluid" />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-md-4 info-invoice">
                                                    <h6 className="text-uppercase mb-3 fw-bold">Quantidade</h6>
                                                    {
                                                        this.state.demand.quantity == undefined && this.state.demand.unit_measurement == undefined ?
                                                            <div className="loader loader-lg"></div>
                                                        :
                                                            <p>{ this.state.demand.quantity } { this.state.demand.unit_measurement }</p>
                                                    }
                                                </div>
                                                <div className="col-md-4 info-invoice">
                                                    <h6 className="text-uppercase mb-3 fw-bold">Status</h6>
                                                    { this.state.demand.status == undefined ?
                                                        <div className="loader loader-lg"></div>
                                                        :
                                                        <p>{ this.state.demand.status }</p>
                                                    }
                                                </div>
                                                <div className="col-md-4 info-invoice">
                                                    <h6 className="text-uppercase mb-3 fw-bold">Quantidade Atendida</h6>
                                                    { this.state.demand.status == undefined ?
                                                        <div className="loader loader-lg"></div>
                                                        :
                                                        <p>{this.state.demand.quantity_received} {this.state.demand.unit_measurement}</p>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card card-profile"></div>
                                </div>
                            </div>
                        </div>
                }
            </div>
        );
    }
}

export default DetailDemand;