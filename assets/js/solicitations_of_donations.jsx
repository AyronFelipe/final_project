import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Preloader from './preloader';


const config = {
    headers: { 'Authorization': `Token ${localStorage.token}` }
};

export default class SolicitationsOfDonations extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            donation: [],
            isLoading: true,
        }
    }

    getDonation = () => {
        let pathname = window.location.pathname;
        let slug = pathname.split('/')[3];

        axios.get(`/api/donations/${slug.split('-')[2].split('.')[1]}/`, config)
        .then((res) => {
            this.setState({ donation: res.data, isLoading: false });
        })
        .catch((error) => {
            console.log(error.response);
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
                        <div className="page-inner">
                            <div className="row justify-content-center">
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-header">
                                            <div className="card-title">Solicitações da doação {this.state.donation.name}</div>
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