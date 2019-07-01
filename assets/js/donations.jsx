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

    render(){
        return(
            <div className="page-inner">
                    {
                        this.state.isLoading ?
                            <div className="d-flex justify-content-center mt-5">
                                <div className="loader loader-lg"></div>
                            </div>
                        :
                        <div className="row">
                            {
                                this.state.donations.map((donation) =>
                                    <div className="col-sm-4 col-12" key={donation.pk}>
                                        <div className="card">
                                            <img className="card-img-top" src={ donation.main_photo } alt="Card image cap" />
                                            <div className="card-body">
                                                <h5 className="card-title mb-2 fw-mediumbold">{ donation.name }</h5>
                                                <p className="card-text">{ truncate(donation.description) }</p>
                                                <Link to={`/donations/donation/${donation.slug}/`}>
                                                    <button className="btn btn-info">Ver doação</button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    }
                </div>
        )
    }
}