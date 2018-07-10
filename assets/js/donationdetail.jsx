import React from 'react'
import { Link } from 'react-router-dom'
import { storageToken } from './auth'
import * as Vibrant from 'node-vibrant'
import Carousel from './carousel'
import * as moment from 'moment';
import 'moment/locale/pt-br';
import Tags from './tags'

export default class DonationDetail extends React.Component{

    constructor(props){
        super(props);
        this.state = { donation: [], user: [], value: '' };
        this.saveSolicitation = this.saveSolicitation.bind(this);
    }

    saveSolicitation(){
        $('#solicitation-form').find('input').each(function(){
            $(this).siblings('span.error-message').html('');
        })
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
        });
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

        $('.modal').modal();

        $('.timepicker').pickatime({
            default: 'now', // Set default time: 'now', '1:30AM', '16:30'
            fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
            twelvehour: false, // Use AM/PM or 24-hour format
            donetext: 'OK', // text for done-button
            cleartext: 'Limpar', // text for clear-button
            canceltext: 'Cancelar', // Text for cancel-button,
            container: undefined, // ex. 'body' will append picker to body
            autoclose: false, // automatic close timepicker
            ampmclickable: true, // make AM PM clickable
            aftershow: function(){} //Function for after opening timepicker
        })
    }

    render(){
        
        const API_KEY = "AIzaSyCq-XgDdK7Ewn_BWMxXpiDVn04y_BHB4yY"

        if( this.state.donation.main_photo!=undefined ){
            let color = new Vibrant(this.state.donation.main_photo);
            //color.getPalette((err, palette) => $("#content").css("background-color", palette.LightVibrant.getHex()));
        }

        console.log(this.state.donation)

        let date = new Date(this.state.donation.validity)
        date.setDate(date.getDate() + 1 )
        let today = new Date()
        let local_date = moment(this.state.donation.validity).format("DD/MM/YYYY")

        $(".datepicker").pickadate({
            selectMonths: true, 
            selectYears: 50, 
            today: 'Hoje',
            clear: 'Limpar',
            close: 'Ok',
            closeOnSelect: true,
            formatSubmit: 'yyyy-mm-dd',
            monthsFull: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            weekdaysFull: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
            weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'], 
            editable: false,
            hiddenName: true,
            min: true,
            max: date,
            showMonthsFull: true,
            showWeekdaysShort: true,
        })

        if(today > date){
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
            return(
                <div id="content">
                    <nav className="nav-extended deep-purple darken-2 white-text">
                        <div className="row">
                            <div className="col s12">
                                <div className="col s10 push-s1">
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
                            <div className="col s10 push-s1">
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
        }

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
            "opacity": '0.8'
        })

        return(
            <div id="content">
                <nav className="nav-extended deep-purple darken-2 white-text">
                    <div className="row">
                        <div className="col s12">
                            <div className="col s10 push-s1">
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
                        <div className="col s10 push-s1">
                            <div className="card">
                                <div className="card-content">
                                    <div className="row purple-text">
                                        <div className="col l5 m12 s12">
                                            <img className="responsive-img" src={ this.state.donation.main_photo } />
                                            <br/><br/>
                                            <Link to={ '/accounts/profile/'+this.state.user.id+'/' }>
                                                <span>Doação realizada por: <div className="chip"><img src={ this.state.user.photo } alt="Contact Person" /> { this.state.donation.donator }</div></span>
                                            </Link>
                                            <br />
                                            <br />
                                            <Tags tags={ this.state.donation.tags } />
                                            <button className="btn-large waves-effect waves-light indigo accent-2 white-text modal-trigger" data-target="modal-solicitation" style={{width: '100%'}}>Solicitar esta doação</button>
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
                                <h4>Cadastro de Solicitação para a Doação { this.state.donation.name }</h4>
                                <div className="input-field col s12">
                                    <input id="validity" name="validity" type="text" className="datepicker" />
                                    <label htmlFor="validity">Sua solicitação vale até o dia</label>
                                    <span className="error-message red-text"></span>                          
                                </div>
                                <div className="input-field col s12">
                                    <input id="validity_hour" name="validity_hour" type="text" className="timepicker" />
                                    <label htmlFor="validity_hour">Sua solicitação vale até às</label>
                                    <span className="error-message red-text"></span>
                                </div>
                                <input type="hidden" name="donation" value={ this.state.value } />
                            </div>
                            <br/><br/>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button className="modal-action modal-close waves-effect waves-green btn-flat">Fechar</button>
                        <button className="btn-large waves-effect waves-light indigo accent-2 white-text" onClick={ this.saveSolicitation }>Salvar solicitação</button>
                    </div>
                    <br/>
                </div>
            </div>
        )
    }
}