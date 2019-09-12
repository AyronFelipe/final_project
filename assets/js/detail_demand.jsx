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
        this.state = { demand: [], isLoading: true, owner: [] }
    }

    getDemand = () => {
        let pathname = window.location.pathname;
        let slug = pathname.split('/')[3];

        axios.get(`/api/demands/${slug.split('-')[2].split('.')[1]}/`, config)
        .then((res) => {
            this.setState({ demand: res.data, isLoading: false });
            this.getDemandOwner();
        })
        .catch((error) => {
            console.log(error.response);
        });
    }

    getDemandOwner = () => {
        axios.get(`/api/users/${this.state.demand.owner_pk}/`, config)
        .then((res) => {
            this.setState({ owner: res.data });
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
                                        <span className="text-white">Detalhe do Pedido
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
                                                <div className="col-md-3 info-invoice">
                                                    <h6 className="text-uppercase mb-3 fw-bold">Quantidade</h6>
                                                    {
                                                        this.state.demand.quantity == undefined && this.state.demand.unit_measurement == undefined ?
                                                            <div className="loader loader-lg"></div>
                                                        :
                                                            <p>
                                                                { 
                                                                    this.state.demand.quantity > 0 ?
                                                                        <span>{ this.state.demand.quantity } { this.state.demand.unit_measurement }s</span>
                                                                    :
                                                                        <span>{ this.state.demand.quantity } { this.state.demand.unit_measurement }</span>
                                                                }
                                                            </p>
                                                    }
                                                </div>
                                                <div className="col-md-3 info-invoice">
                                                    <h6 className="text-uppercase mb-3 fw-bold">Status</h6>
                                                    { this.state.demand.status == undefined ?
                                                        <div className="loader loader-lg"></div>
                                                        :
                                                        <p>{ this.state.demand.status }</p>
                                                    }
                                                </div>
                                                <div className="col-md-3 info-invoice">
                                                    <h6 className="text-uppercase mb-3 fw-bold">Quantidade Atendida</h6>
                                                    { this.state.demand.status == undefined ?
                                                        <div className="loader loader-lg"></div>
                                                        :
                                                        <p>{this.state.demand.quantity_received} {this.state.demand.unit_measurement}</p>
                                                    }
                                                </div>
                                                <div className="col-md-3 info-invoice">
                                                <h6 className="text-uppercase mb-3 fw-bold">Tags</h6>
                                                    { 
                                                        this.state.demand.tags == undefined ?
                                                            <div className="loader loader-lg"></div>
                                                        :
                                                            <div>
                                                                { this.state.demand.tags.map((tag) =>
                                                                    <span key={tag.pk} className="badge badge-info">{tag.name}</span>
                                                                ) }
                                                            </div>
                                                    }
                                                </div>
                                            </div>
                                            <div className="separator-solid"></div>
                                            <div className="row mt-3">
                                                <div className="col-12">
                                                    <h6 className="text-uppercase mb-3 fw-bold">Descrição</h6>
                                                    <p className="text-muted">
                                                        { this.state.demand.description }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card card-profile">
                                        <div className="card-header" style={{ "backgroundImage": "url('/static/images/blogpost.jpg')" }}>
                                            <div className="profile-picture">
                                                <div className="avatar avatar-xl">
                                                    <img src={ this.state.owner.photo } alt="..." className="avatar-img rounded-circle" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="user-profile text-center">
                                                {
                                                    this.state.owner.child == undefined ?
                                                        <div className="loader loader-lg"></div>
                                                    :
                                                        <React.Fragment>
                                                            <div className="name">
                                                                { this.state.owner.child.first_name } { this.state.owner.child.last_name }
                                                            </div>
                                                            <div className="job">{ this.state.owner.email }</div>
                                                            <div className="desc">{ this.state.owner.cell_phone }</div>
                                                            <div className="view-profile">
                                                                <Link to={`/accounts/profile/${this.state.owner.username}/`} style={{ textDecoration: 'none' }}><button className="btn btn-info btn-block">Ver Perfil</button></Link>
                                                            </div>
                                                        </React.Fragment>
                                                }
                                            </div>
                                        </div>
                                        <div className="card-footer">
                                            <div className="row user-stats text-center">
                                                <div className="col">
                                                    <div className="number">{ this.state.owner.donations_count }</div>
                                                    <div className="title">Doações Cadastradas</div>
                                                </div>
                                                <div className="col">
                                                    <div className="number">{ this.state.owner.donations_accepted }</div>
                                                    <div className="title">Doações Finalizadas</div>
                                                </div>
                                                <div className="col">
                                                    <div className="number"></div>
                                                    <div className="title">Confiabilidade</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </div>
        );
    }
}

export default DetailDemand;