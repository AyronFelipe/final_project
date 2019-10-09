import React from 'react';
import axios from 'axios';
import { truncate } from './utils.js';
import { Link } from 'react-router-dom';

export default class Donations extends React.Component{

    constructor(props){
        super(props);
        this.state = { donations: [], isLoading: true };
    }

    getDonations = () => {
        let config = {
            headers: { 'Authorization': `Token ${localStorage.token}` }
        };
        axios.get(`/api/donations/`, config)
        .then((res) => {
            this.setState({ donations: res.data, isLoading: false });
        })
        .catch((error) => {
            console.log(error.response);
        })
    }

    componentDidMount = () => {
        this.getDonations();
    }

    renderDonations = () => {
        if (this.state.isLoading) {
            return <div className="d-flex justify-content-center mt-5">
                <div className="loader loader-lg"></div>
            </div>
        } else {
            if (this.state.donations.length >= 1) {
                return(
                    <div className="row">
                        {
                            this.state.donations.map((donation) => {
                                return (
                                    <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12" key={donation.pk}>
                                        <Link to={`/donations/donation/${donation.slug}/`} style={{ textDecoration: 'none' }}>
                                            <div className="card">
                                                <img className="card-img-top" src={donation.main_photo} alt="Card image cap" height={'310px'} />
                                                <div className="card-body">
                                                    <h5 className="card-title mb-2 fw-mediumbold">{donation.name}</h5>
                                                    <p className="card-text">{truncate(donation.description)}</p>
                                                    <button className="btn btn-info btn-block">Ver doação</button>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })
                        }
                    </div>
                );
            } else {
                return <div className="d-flex align-items-center flex-column mt-5">
                    <h1 className="font-weight-bold">Nenhuma doação encontrada</h1>
                    <p className="lead">Comece a fazer parte da nossa comunidade. Clique no botão abaixo para fazer uma nova doação.</p>
                    <Link to={'/donations/new-donation/'}>
                        <button className="btn btn-info btn-lg btn-round"><i className="la flaticon-add mr-1"></i> Nova Doação</button>
                    </Link>
                </div>
            }
        }
    }

    render(){
        return(
            <div className="page-inner">
                { this.renderDonations() }
            </div>
        )
    }
}