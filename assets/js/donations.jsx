import React from 'react'
import 'materialize-css'
import 'materialize-css/dist/css/materialize.min.css'
import '../css/main.css'
import { Link } from 'react-router-dom'
import { storageToken } from './auth'
import DonationDetail from './donationdetail'
import * as moment from 'moment';
import 'moment/locale/pt-br';

class CardDonation extends React.Component{

    render(){
        return(
            <div>
                {this.props.donations.map(function(donation){
                    let date = moment(donation.validity).format("DD/MM/YYYY")
                    return(
                        <div className="row" key={ donation.pk }>
                            <div className="col l10 push-l2 m10 push-m1 s12">
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
            </div>
        )
    }
}

export default class Donations extends React.Component{

    constructor(props){
        super(props);
        this.state = { donations: [], tags: [], title: ' ' };
        this.handleTagRender = this.handleTagRender.bind(this);
    }

    handleClick(id, name){
        $.ajax({
            url: '/api/donations/',
            dataType: 'json',
            type: 'GET',
            data: {
                tag_id: id
            },
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(data){
                this.setState({title: '/ Doações do Tipo ' + name});
                this.setState({ donations: data})
            }.bind(this),
            error: function(request, status, err){
                console.log(request, status, err);
            }
        });
    }

    componentDidMount(){
        //GET Donations
        $.ajax({
            url: '/api/donations/',
            dataType: 'json',
            type: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(data){
                if(data.length == 0){
                    const collection = 
                    `<div class="row">
                        <div class="col s12 center-align">
                            <div class="valign-wrapper row">
                                <div class="col card hoverable s10 pull-s1 m6 pull-m3 l4 pull-l4 deep-purple white-text">
                                    <div class="card-content">
                                        <div class="white-text center-align card-title">
                                            <h3>Nenhuma doação encontrada</h3>
                                        </div>
                                    </div>
                                    <p>
                                        Nenhuma doação válida com essa tag foi encontrada em nossa base de dados. Clique no botão de adicionar abaixo para cadastrar uma doação com essa tag.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>`
                    console.log(collection)
                    $('#card-donations-section').html(collection)
                }else{
                    this.setState({ donations: data })
                }
            }.bind(this),
            error: function(request, status, err){
                console.log(request, status, err);
            }
        });

        //Get Tags
        $.ajax({
            url: '/api/tags/',
            dataType: 'json',
            type: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(data){
                if(data.length == 0){
                    card =
                    `<div class="row">
                        <div class="col s12 center-align">
                            <div class="valign-wrapper row">
                                <div class="col card hoverable s10 pull-s1 m6 pull-m3 l4 pull-l4 deep-purple white-text">
                                    <div class="card-content">
                                        <div class="white-text center-align card-title">
                                            <h3>Nenhuma tag encontrada</h3>
                                        </div>
                                    </div>
                                    <p>
                                        Nenhuma tag foi encontrada em nossa base de dados.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>`
                }
                this.setState({ tags: data })
            }.bind(this),
            error: function(request, status, err){
                console.log(request, status, err);
            }
        });

        $('ul.tabs').tabs();
        
        $('.indicator').css('background-color', '#512da8');
    }

    handleTagRender(){
        if (this.state.tags.length) {
            return(
                <div className="row">
                    <div className="col s12">
                        <br/>
                        {this.state.tags.map((tag) => 
                            <div className="chip" key={ tag.pk } onClick={this.handleClick.bind(this, tag.pk, tag.name)}>{ tag.name }</div>
                        )}
                    </div>
                </div>
            )
        }
        return(
            <div className="row">
                <div className="col s12">
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
        )
    }

    render(){
        //Se tiver dados no state
        if(this.state.donations.length > 1){
            return(
                <div>
                    <nav className="nav-extended deep-purple darken-2 white-text hide-on-med-and-down">
                        <div className="row">
                            <div className="col s12">
                                <div className="col s10 push-s1">
                                    <div className="nav-content">
                                        <span className="nav-title">Início { this.state.title }</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                    <nav className="show-on-medium-and-down hide-on-med-and-up deep-purple darken-2 white-text">
                        <div className="nav-wrapper">
                            <form>
                                <div className="input-field">
                                    <input id="search" type="search" required />
                                    <label className="label-icon" htmlFor="search"><i className="material-icons">search</i></label>
                                    <i className="material-icons">close</i>
                                </div>
                            </form>
                        </div>
                    </nav>
                    <div className="row">
                        <div id="doacoes">
                            <div className="row">
                                <div className="col l10 m12 s12">
                                    <div id="card-donations-section">
                                        <CardDonation donations={this.state.donations} />
                                    </div>
                                </div>
                                <div className="col l2 m0 s0 hide-on-med-and-down">
                                    { this.handleTagRender() }
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
                </div>
            )
        }else{
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
                        <div id="doacoes">
                            <div className="row">
                                <div className="col l10 m12 s12 center-align">
                                    <div id="card-donations-section">
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
                                <div className="col l2 m0 s0 hide-on-med-and-down">
                                    { this.handleTagRender() }
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
                </div>
            )
        }
        //Se não tiver dados no state 
    }
}