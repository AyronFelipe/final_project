import React from 'react'
import Address from './address'
import NewTag from './tags_new'
import 'dropify'
import 'dropify/dist/css/dropify.min.css'
import { Link } from 'react-router-dom'

export default class Donation extends React.Component{

    constructor(props){
        super(props);
        this.saveDonation = this.saveDonation.bind(this);
    }

    saveDonation(){
        $("#donation-form").find("input, textarea").each(function(){
            $(this).siblings('span.error').html('');
        })
        $.gritter.add({
            title: 'Aguarde!',
            text: 'Enviando dados...',
            sticky: true
        });
        let form = new FormData($("#donation-form").get(0));
        $.ajax({
            url: '/api/new-donation/',
            type: 'POST',
            dataType: 'json',
            data: form,
            cache: false,
            processData: false,
            contentType: false,
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(data){
                window.location.href = '/donations/';
            },
            error: function(request, status, err){
                if (err == 'Bad Request'){
                    window.scrollTo(0, 0);
                    for(const [key, value] of Object.entries(request.responseJSON)){
                        $("#donation-form").find(":input").each(function(){
                            name = $(this).attr("name");
                            if(name===key){
                                $('span.'+name+'-error-message').html('<p>'+value+'</p>');
                            }
                        });
                    }
                } else if (err == 'Internal Server Error') {
                    $('#modal-erro').modal('open');
                }
            }
        }).always(function(){
            $.gritter.removeAll();
        });
    }

    componentDidMount(){

        window.scrollTo(0, 0);

        $('#modal-erro').modal({
            dismissible: false,
        });

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
            showMonthsFull: true,
            showWeekdaysShort: true,
        })

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

        $('.dropify').dropify({
            messages: {
                'default': 'Arraste um arquivo aqui ou clique.',
                'replace': 'Arraste um arquivo ou clique para substituir.',
                'remove':  'Remover',
                'error':   'Ooops, algo de errado aconteceu.'
            },
            tpl:{
                message: '<div class="dropify-message"><span class="file-icon" /> <p class="center-align">{{ default }}</p></div>',
            }
        });
    }

    render(){
        
        return(
            <div>
                <div className="modal" id="modal-erro">
                    <div className="modal-content">
                        <h4>Um erro aconteceu!</h4>
                        <blockquote>Um erro inesperado aconteceu. Um e-mail já foi enviado para a nossa equipe para consertarmos isso o quanto antes.</blockquote>
                    </div>
                    <div className="modal-footer">
                        <Link to="/donations/">
                            <button className="modal-action modal-close btn waves-effect waves-light indigo accent-2 white-text">Início</button>
                        </Link>
                    </div>
                </div>
                <nav className="nav-extended deep-purple darken-2 white-text">
                    <div className="row">
                        <div className="col s12">
                            <div className="col s10 push-s1">
                                <div className="nav-content">
                                    <span className="nav-title">Nova Doação</span>
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
                <div className="row purple-text">
                    <div className="col s12">
                        <div className="col s10 push-s1">
                            <h4 className="center-align">Cadastre abaixo as informações sobre a sua doação!</h4>
                        </div>
                        <div className="container">
                            <form id="donation-form" encType="multipart/form-data">
                                <div className="row">
                                    <div className="input-field col m6 s12">
                                        <input id="name" name="name" type="text" className="validate" />
                                        <label htmlFor="name">Nome <span className="red-text">*</span></label>
                                        <span className="name-error-message red-text error"></span>
                                    </div>
                                    <div className="input-field col m3 s12">
                                        <input id="validity" name="validity" type="text" className="datepicker" />
                                        <label htmlFor="validity">Disponível até o dia <span className="red-text">*</span></label>
                                        <span className="validity-error-message red-text error"></span>
                                    </div>
                                    <div className="input-field col m3 s12">
                                        <input id="validity_hour" name="validity_hour" type="text" className="timepicker" />
                                        <label htmlFor="validity_hour">Disponível até às <span className="red-text">*</span></label>
                                        <span className="validity_hour-error-message red-text error"></span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field col s12">
                                        <textarea id="description" name="description" className="materialize-textarea"></textarea>
                                        <label htmlFor="description">Uma descrição da sua doação (não seja breve)</label>
                                        <span className="description-error-message red-text error"></span>
                                    </div>
                                </div>
                                <NewTag />
                                <Address legend="Endereço de coleta da doação" />
                                <div className="row">
                                    <h5>Coloque a foto principal de sua doação</h5>
                                    <input id="photo" name="main_photo" type="file" className="dropify" />
                                    <span className="main_photo-error-message red-text error"></span>
                                </div>
                                <div className="row">
                                    <div className="col s12">
                                         <h5>Coloque as outras fotos de sua doação</h5>
                                         <div className="file-field input-field">
                                            <div className="btn">
                                                <span>Fotos</span>
                                                <input type="file" name="photos" multiple />
                                            </div>
                                            <div className="file-path-wrapper">
                                                <input className="file-path validate" type="text" placeholder="Coloque aqui as fotos do sua doação" />
                                            </div>
                                         </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col s12 right-align">
                                        <button type="button" className="btn-large waves-effect waves-light indigo accent-2 white-text" onClick={ this.saveDonation }>Salvar</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}