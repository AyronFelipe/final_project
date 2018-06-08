import React from 'react'
import 'materialize-css'
import 'materialize-css/dist/css/materialize.min.css'
import '../css/main.css'
import { Link } from 'react-router-dom'
import { storageToken } from './auth'
import DonationDetail from './donationdetail'

export default class Donations extends React.Component{

    constructor(props){
        super(props);
        this.state = { donations: [] };
    }

    componentDidMount(){
        $.ajax({
            url: '/api/donations/',
            dataType: 'json',
            type: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(data){
                this.setState({ donations: data })
            }.bind(this),
            error: function(request, status, err){
                console.log(request, status, err);
            }
        });
    }

    render(){
        return(
            <div>
                {this.state.donations.map(function(donation){
                    return(
                        <div className="row" key={ donation.pk }>
                            <div className="col s6 offset-s3">
                                <Link to={ '/donations/donation/'+donation.slug+'/' }>
                                    <div className="card hoverable">
                                        <div className="card-image">
                                            <img src={ donation.photo } />
                                            <button className="btn-floating halfway-fab waves-effect waves-light indigo accent-2"><i className="material-icons">menu</i></button>
                                        </div>
                                        <div className="card-content">
                                            <span className="card-title">{ donation.name }</span>
                                            <p>{ donation.description }</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    )})
                }
                <div className="fixed-action-btn">
                    <Link to="/donations/new-donation/">
                        <button type="button" className="btn btn-floating btn-large waves-effect waves-light indigo accent-2 white-text pulse" title="Adcionar uma doação">
                            <i className="material-icons">add</i>
                        </button>
                    </Link>
                </div>
            </div>
        )
    }
}