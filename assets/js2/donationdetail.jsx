import React from 'react'
import { Link } from 'react-router-dom'
import Carousel from './carousel'
import * as moment from 'moment';
import 'moment/locale/pt-br';
import Tags from './tags'
import Preloader from './preloader'

export default class DonationDetail extends React.Component{

    constructor(props){
        super(props);
        this.state = { donation: [], user: [], value: '', logged_user: [] };
        this.saveSolicitation = this.saveSolicitation.bind(this);
        this.handleSolicitationRender = this.handleSolicitationRender.bind(this);
    }

    saveSolicitation(){
        $('#solicitation-form').find('input').each(function(){
            $(this).siblings('span.error-message').html('');
        });
        $.gritter.add({
            title: 'Aguarde!',
            text: 'Enviando dados...',
            sticky: true,
            class_name: 'black white-text',
        });
        $.ajax({
            url: '/api/new-solicitation/',
            type: 'POST',
            data: $('#solicitation-form').serialize(),
            dataType: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(data){
                window.location.href = '/donations/my-solicitations/';
            },
            error: function(request, status, err){
                if (err == 'Bad Request'){
                    for(const [key, value] of Object.entries(request.responseJSON)){
                        $("#solicitation-form").find(":input").each(function(){
                            name = $(this).attr("name");
                            if(name===key){
                                $(this).siblings('span.error-message').html('<p>'+value+'</p>');
                            }
                        });
                    }
                }
            }
        }).always(function(){
            $.gritter.removeAll();
        });
    }

    handleSolicitationRender(logged_user_id, donation_owner_id){
        let button
        if(logged_user_id != donation_owner_id){
            button = <button className="btn-large waves-effect waves-light indigo accent-2 white-text modal-trigger" data-target="modal-solicitation" style={{width: '100%'}}>Solicitar esta doação</button>
        } else {
            button = ''
        }
        return button
    }

    componentDidMount(){
        
        let pathname = window.location.pathname;
        
        let slug = pathname.split('/')[3];
        
        $.ajax({
            url: '/api/donations/'+slug.split('-')[2].split('.')[1]+'/',
            dataType: 'json',
            type: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(data){
                this.setState({ donation: data, value: data.pk })
            }.bind(this),
            error: function(request, status, err){
                console.log(request, status, err);
            }
        });

        $.ajax({
            url: '/api/users/'+slug.split('-')[2].split('.')[2]+'/',
            dataType: 'json',
            type: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(data){
                this.setState({ user: data })
            }.bind(this),
            error: function(request, status, err){
                console.log(request, status, err);
            }
        });

        $.ajax({
            url: '/api/logged-user/',
            dataType: 'json',
            type: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(data){
                this.setState({ logged_user: data })
            }.bind(this),
            error: function(request, status, err){
                console.log(request, status, err);
            }
        });

       
    }

    render(){

         $('.modal').modal();
        
        const API_KEY = "AIzaSyCq-XgDdK7Ewn_BWMxXpiDVn04y_BHB4yY";

        let date = new Date(this.state.donation.validity + ' ' + this.state.donation.validity_hour)
        let local_date = moment(this.state.donation.validity).format("DD/MM/YYYY")
        let now_major_date = moment().isAfter(date)

        $("#bg").css({
            "background-image": 'url("'+this.state.donation.main_photo+'")',
            "background-repeat": 'no-repeat',
            "background-size": '100% 100%',
            "position": 'fixed',
            "z-index": '-1',
            "width": "100%",
            "height": "100%",
            "top": '0',
            "filter": 'blur(5px)',
            "opacity": '0.8',
        })

        if (now_major_date && this.state.donation.status == 'Ativa' || this.state.donation.status == 'Inválida') {
            return(
                <div id="content">
                    <nav className="nav-extended deep-purple darken-2 white-text">
                        <div className="row">
                            <div className="col s12">
                                <div className="col s10 offset-s1">
                                    <div className="nav-content">
                                        <span className="nav-title">Detalhe da Doação { this.state.donation.name }</span>
                                        <Link to="/donations/">
                                            <button className="btn-floating btn-large halfway-fab waves-effect waves-light indigo accent-2 white-text">
                                                <i className="material-icons">home</i>
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                    <div id="bg"></div>
                    <br/><br/>
                    <div className="row">
                        <div className="col s12">
                            <div className="col s10 offset-s1">
                                <div className="card grey lighten-2">
                                    <div className="card-content">
                                        <div className="row purple-text">
                                            <div className="col l5 m12 s12">
                                                <img className="responsive-img" src={ this.state.donation.main_photo } />
                                            </div>
                                            <div className="col l7 m12 s12">
                                                <h3>{ this.state.donation.name }</h3>
                                                <br/>
                                                <p>
                                                    <span>{ this.state.donation.description }</span>
                                                </p>
                                                <br/>
                                                <p><strong>Validade: </strong>Você só pode solicitar essa doação até o dia <span className="red-text">{ local_date }</span>  até às <span className="red-text">{ this.state.donation.validity_hour }</span></p>
                                                <br/>
                                                <h2 className="red-text">Esta doação perdeu a validade!</h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else if (this.state.donation.status == 'Em Espera') {
            return(
                <div id="content">
                    <nav className="nav-extended deep-purple darken-2 white-text">
                        <div className="row">
                            <div className="col s12">
                                <div className="col s10 offset-s1">
                                    <div className="nav-content">
                                        <span className="nav-title">Detalhe da Doação { this.state.donation.name }</span>
                                        <Link to="/donations/">
                                            <button className="btn-floating btn-large halfway-fab waves-effect waves-light indigo accent-2 white-text">
                                                <i className="material-icons">home</i>
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                    <div id="bg"></div>
                    <br/><br/>
                    <div className="row">
                        <div className="col s12">
                            <div className="col s10 offset-s1">
                                <div className="card grey lighten-2">
                                    <div className="card-content">
                                        <div className="row purple-text">
                                            <div className="col l5 m12 s12">
                                                <img className="responsive-img" src={ this.state.donation.main_photo } />
                                            </div>
                                            <div className="col l7 m12 s12">
                                                <h3>{ this.state.donation.name }</h3>
                                                <br/>
                                                <p>
                                                    <span>{ this.state.donation.description }</span>
                                                </p>
                                                <br/>
                                                <p><strong>Validade: </strong>Você só pode solicitar essa doação até o dia <span className="red-text">{ local_date }</span>  até às <span className="red-text">{ this.state.donation.validity_hour }</span></p>
                                                <br/>
                                                <h2 className="teal-text">Esta doação não pode ser solicitada!</h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else if (this.state.donation.status == 'Finalizada') {
            return(
                <div id="content">
                    <nav className="nav-extended deep-purple darken-2 white-text">
                        <div className="row">
                            <div className="col s12">
                                <div className="col s10 offset-s1">
                                    <div className="nav-content">
                                        <span className="nav-title">Detalhe da Doação { this.state.donation.name }</span>
                                        <Link to="/donations/">
                                            <button className="btn-floating btn-large halfway-fab waves-effect waves-light indigo accent-2 white-text">
                                                <i className="material-icons">home</i>
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                    <div id="bg"></div>
                    <br/><br/>
                    <div className="row">
                        <div className="col s12">
                            <div className="col s10 offset-s1">
                                <div className="card grey lighten-2">
                                    <div className="card-content">
                                        <div className="row purple-text">
                                            <div className="col l5 m12 s12">
                                                <img className="responsive-img" src={ this.state.donation.main_photo } />
                                            </div>
                                            <div className="col l7 m12 s12">
                                                <h3>{ this.state.donation.name }</h3>
                                                <br/>
                                                <p>
                                                    <span>{ this.state.donation.description }</span>
                                                </p>
                                                <br/>
                                                <p><strong>Validade: </strong>Você só pode solicitar essa doação até o dia <span className="red-text">{ local_date }</span>  até às <span className="red-text">{ this.state.donation.validity_hour }</span></p>
                                                <br/>
                                                <h2 className="teal-text">Esta doação está finalizada</h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        return(
            <div id="content">
                <nav className="nav-extended deep-purple darken-2 white-text">
                    <div className="row">
                        <div className="col s12">
                            <div className="col s10 offset-s1">
                                <div className="nav-content">
                                    <span className="nav-title">Detalhe da Doação { this.state.donation.name }</span>
                                    <Link to="/donations/">
                                        <button className="btn-floating btn-large halfway-fab waves-effect waves-light indigo accent-2 white-text">
                                            <i className="material-icons">home</i>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
                <div id="bg"></div>
                <br/><br/>
                <div className="row">
                    <div className="col s12">
                        <div className="col s10 offset-s1">
                            <div className="card">
                                <div className="card-content">
                                    <div className="row purple-text">
                                        <div className="col l5 m12 s12">
                                            <img className="responsive-img" src={ this.state.donation.main_photo } />
                                            <br/><br/>
                                            <Link to={ '/accounts/profile/'+this.state.user.pk+'/' }>
                                                <span>Doação realizada por: <div className="chip"><img src={ this.state.user.photo } alt="Contact Person" /> { this.state.donation.donator }</div></span>
                                            </Link>
                                            <br />
                                            <br />
                                            <Tags tags={ this.state.donation.tags } />
                                            <h4>Ponto de Encontro</h4>
                                            <div className="video-container">
                                                <iframe width="450" height="350" frameBorder="0" style={{border:0}} src={`https://www.google.com/maps/embed/v1/place?q=${this.state.donation.cep},${this.state.donation.neighborhood},${this.state.donation.street},${this.state.donation.number},+Brasil&key=${API_KEY}`} allowFullScreen></iframe>
                                            </div>
                                        </div>
                                        <div className="col l7 m12 s12">
                                            <h3>{ this.state.donation.name }</h3>
                                            <br/>
                                            <p>
                                                <span>{ this.state.donation.description }</span>
                                            </p>
                                            <br/>
                                            <p><strong>Validade: </strong>Você só pode solicitar essa doação até o dia <span className="red-text">{ local_date }</span>  até às <span className="red-text">{ this.state.donation.validity_hour }</span></p>
                                            <br/>
                                            <Carousel list={ this.state.donation.photos } />
                                            <br/><br/><br/>
                                            { this.handleSolicitationRender(this.state.user.pk, this.state.logged_user.pk) }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="modal-solicitation" className="modal">
                    <div className="modal-content">
                        <form id="solicitation-form">
                            <div className="row">
                                <h4>Você deseja solicitar essa doação?</h4>
                                <div className="col s12">
                                    <div className="card purple darken-4">
                                        <div className="card-content white-text">
                                            <p>Ao clicar em sim, você entrará na lista dos solicitantes dessa doação. Você receberá e-mails com as atualizações do status de sua solicitação. Aguarde a resposta do dono da doação.</p>
                                        </div>
                                    </div>
                                    <br/>
                                    <div className="input-field">
                                        <textarea name="comment" id="comment" className="materialize-textarea"></textarea>
                                        <label htmlFor="comment">Comentário sobre sua solicitação (opcional)</label>
                                    </div>
                                </div>
                                <input type="hidden" name="donation" value={ this.state.value } />
                            </div>
                            <br/><br/>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button className="modal-action modal-close waves-effect waves-green btn-flat">Não</button>
                        <button className="btn-large waves-effect waves-light indigo accent-2 white-text" onClick={ this.saveSolicitation }>Sim</button>
                    </div>
                    <br/>
                </div>
            </div>
        )
    }
}