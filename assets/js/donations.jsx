import React from 'react'
import 'materialize-css'
import 'materialize-css/dist/css/materialize.min.css'
import '../css/main.css'
import { Link } from 'react-router-dom'
import { storageToken } from './auth'
import DonationDetail from './donationdetail'
import * as moment from 'moment';
import 'moment/locale/pt-br';
import Tags from './tags'

export default class Donations extends React.Component{

    constructor(props){
        super(props);
        this.state = { donations: [], tags: [] };
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
        
        $.ajax({
            url: '/api/tags/',
            dataType: 'json',
            type: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(data){
                this.setState({ tags: data })
            }.bind(this),
            error: function(request, status, err){
                console.log(request, status, err);
            }
        });

        $('ul.tabs').tabs();
        
        $('.indicator').css('background-color', '#512da8');
    }

    render(){
        if(this.state.donations.length){
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
                                let date = moment(donation.validity).format("DD/MM/YYYY")
                                return(
                                    <div className="row" key={ donation.pk }>
                                        <div className="col l6 offset-l3 m10 push-m1 s12">
                                            <Link to={ '/donations/donation/'+donation.slug+'/' }>
                                                <div className="card hoverable">
                                                    <div className="card-image">
                                                        <img src={ donation.main_photo } />
                                                        <button className="btn-floating halfway-fab waves-effect waves-light indigo accent-2"><i className="material-icons">menu</i></button>
                                                    </div>
                                                    <div className="card-content">
                                                        <span className="card-title">{ donation.name }</span>
                                                        <p>{ donation.description }</p>
                                                        <br/>
                                                        <div className="divider"></div>
                                                        <br/>
                                                        <p><strong>Validade: </strong>{ date } até às { donation.validity_hour }</p>
                                                        <p><strong>Doada por: </strong>{ donation.donator }</p>
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
                        <div className="row">
                            <div className="col s12 center-align">
                                <br/><br/><br/>
                                <div className="preloader-wrapper big active">
                                    <div className="spinner-layer spinner-blue-only">
                                        <div className="circle-clipper left">
                                            <div className="circle"></div>
                                        </div>
                                        <div className="gap-patch">
                                            <div className="circle"></div>
                                        </div>
                                        <div className="circle-clipper right">
                                            <div className="circle"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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