import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


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
                        <div className="loader loader-lg"></div>
                    :
                        <div className="page-inner">
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="card">
                                        <div className="card-header">
                                            <h2>{this.state.donation.name}</h2>
                                        </div>
                                        <div className="card-body">
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
                                                <div className="name">{ this.state.user.child.first_name } { this.state.user.child.last_name }</div>
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