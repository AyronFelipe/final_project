import React from 'react'
import 'materialize-css'
import 'materialize-css/dist/css/materialize.min.css'
import '../css/main.css'
import { Link } from 'react-router-dom'

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
                <br/><br/>
                {this.state.donations.map(function(donation){
                    return(
                        <div className="row" key={ donation.pk }>
                            <div className="col s6 offset-s3">
                                <div className="card">
                                    <div className="card-image">
                                        <img src={ donation.photo } />
                                        <a class="btn-floating halfway-fab waves-effect waves-light indigo accent-2"><i class="material-icons">menu</i></a>
                                    </div>
                                    <div className="card-content">
                                        <span className="card-title">{ donation.name }</span>
                                        <p>{ donation.description }</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )})
                }
                <div className="fixed-action-btn">
                    <Link to="/donations/new-donation/">
                        <button type="button" className="btn btn-floating btn-large waves-effect waves-light indigo accent-2 wihte-text pulse" title="Adcionar uma doação">
                            <i className="material-icons">add</i>
                        </button>
                    </Link>
                </div>
            </div>
        )
    }
}