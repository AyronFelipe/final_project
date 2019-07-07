import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Carousel from './carousel';
import { unformatDate } from './utils';


export default class DetailDonation extends React.Component{

    constructor(props) {
        super(props);
        this.state = { donation: [], isLoading: true, user: [] };
    }

    getDonation = () => {
        let pathname = window.location.pathname;
        let slug = pathname.split('/')[3];

        let config = {
            headers: {
                'Authorization': `Token ${localStorage.token}`
            }
        };

        axios.get(`/api/donations/${slug.split('-')[2].split('.')[1]}/`, config)
        .then((res) => {
            this.setState({ donation: res.data, isLoading: false });
        })
        .catch((error) => {
            console.log(error.response);
        })
    }

    getLoggedUser = () => {
        let config = {
            headers: { 'Authorization': `Token ${localStorage.token}` }
        };
        axios.get('/api/logged-user/', config)
            .then((res) => {
                this.setState({ user: res.data, isLoading: false });
            })
            .catch((error) => {
                console.log(error.response);
            })
    }

    componentDidMount = () => {
        this.getDonation();
        this.getLoggedUser();
    }

    render(){
        return(
            <div className="content">
                <div className="panel-header bg-primary">
                    <div className="page-inner py-5">
                        <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                            <div>
                                <h2 className="text-white pb-2 fw-bold page-title">
                                    Detalhe da Doação 
                                    {this.state.isLoading ? <div className="loader loader-lg"></div> : <span>{this.state.donation.name}</span> }
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
                                        <Link to="/donations/new-donation">
                                            <span className="text-white">Detalhe da Doação 
                                                {this.state.isLoading ? <div className="loader loader-lg"></div> : <span>{this.state.donation.name}</span>}
                                            </span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.state.isLoading ?
                        <div className="d-flex justify-content-center mt-5">
                            <div className="loader loader-lg"></div>
                        </div>
                    :
                        <div className="page-inner">
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="card">
                                        <div className="card-header">
                                            <h2>{this.state.donation.name}</h2>
                                        </div>
                                        <div className="card-body">
                                            <div className="row mt-3">
                                                <div className="col-md-4 info-invoice">
                                                    <h5 className="sub">Validade</h5>
                                                    {
                                                        this.state.donation.validity == undefined ?
                                                            <div className="loader loader-lg"></div>
                                                        :
                                                        <p>
                                                            {unformatDate(this.state.donation.validity)} até às {this.state.donation.validity_hour}
                                                        </p>
                                                    }
                                                </div>
                                                <div className="col-md-4 info-invoice">
                                                    <h5 className="sub">Solicitações feitas</h5>
                                                    {
                                                        this.state.donation.solicitations_count == 1 ?
                                                            <p>{ this.state.donation.solicitations_count } solicitação</p>
                                                        :
                                                            <p>{this.state.donation.solicitations_count} solicitações</p>
                                                    }
                                                </div>
                                                <div className="col-md-4 info-invoice">
                                                    <h5 className="sub">Tags</h5>
                                                    { 
                                                        this.state.donation.tags == undefined ?
                                                            <div className="loader loader-lg"></div>
                                                        :
                                                            <div>
                                                                { this.state.donation.tags.map((tag) =>
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
                                                        { this.state.donation.description }
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-12 col-sm-6">
                                                    <Carousel images={this.state.donation.photos} />
                                                </div>
                                            </div>
                                            <div className="text-right mt-3 mb-3">
                                                <button className="btn btn-info btn-block">Solicitar doação</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card card-profile">
                                        <div className="card-header" style={{ "backgroundImage": "url('/static/images/blogpost.jpg')" }}>
                                            <div className="profile-picture">
                                                <div className="avatar avatar-xl">
                                                    <img src={ this.state.user.photo } alt="..." className="avatar-img rounded-circle" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="user-profile text-center">
                                                    {
                                                        this.state.user.child == undefined ?
                                                            <div className="loader loader-lg"></div>
                                                        :
                                                            <div className="name">
                                                                { this.state.user.child.first_name } { this.state.user.child.last_name }
                                                            </div>
                                                    }
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