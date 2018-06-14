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

        $('ul.tabs').tabs();
        
        $('.indicator').css('background-color', '#512da8');
    }

    render(){
        return(
            <div>
                <nav className="nav-extended deep-purple darken-2 white-text">
                    <div className="row">
                        <div className="col s12">
                            <div className="col s10 push-s1">
                                <div className="nav-content">
                                    <span className="nav-title">Início</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
                <div className="row">
                    <div className="col s12">
                        <br/>
                        <ul className="tabs">
                            <li className="tab col s5 offset-s1">
                                <a className="active purple-text" href="#doacoes">Doações</a>
                            </li>
                            <li className="tab col s5">
                                <a className="purple-text" href="#pedidos">Pedidos</a>
                            </li>
                        </ul>
                    </div>
                    <div id="doacoes">
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
                    <div id="pedidos">
                        <div className="row">
                            <div className="col s12">
                                <h4>Aqui vão ficar os pedidos</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}