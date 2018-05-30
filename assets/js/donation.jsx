import React from 'react'
import Dateapicker from './dateapicker'
import Address from './address'
import 'dropify'
import 'dropify/dist/css/dropify.min.css'

export default class Donation extends React.Component{

    constructor(props){
        super(props);
        this.saveDonation = this.saveDonation.bind(this);
    }

    saveDonation(){
        $("#donation-form").find("input, textarea").each(function(){
            $(this).siblings('span.error-message').html('');
        })
        $.ajax({
            url: '/api/new-donation/',
            type: 'POST',
            dataType: 'json',
            data: $("#donation-form").serialize(),
            success: function(data){
                alert('Salvou!');
            },
            error: function(request, status, err){
                console.log(request, status, err);
            }
        })
    }

    componentDidMount(){
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
            <div className="row purple-text">
                <div className="col s12">
                    <div className="col s10 push-s1">
                        <h4 className="center-align">Cadastre abaixo as informações sobre a sua doação!</h4>
                    </div>
                    <div className="container">
                        <form id="donation-form" enctype="multipart/form-data">
                            <div className="row">
                                <div className="input-field col s6">
                                    <input id="name" name="name" type="text" className="validate" />
                                    <label htmlFor="name">Nome</label>
                                    <span className="error-message red-text"></span>
                                </div>
                                <div className="input-field col s3">
                                    <input id="validity" name="validity" type="text" className="datepicker" />
                                    <label htmlFor="validity">Disponível até o dia</label>
                                    <span className="error-message red-text"></span>
                                </div>
                                <div className="input-field col s3">
                                    <input id="validity_hour" name="validity_hour" type="text" className="timepicker" />
                                    <label htmlFor="validity_hour">Disponível até às</label>
                                    <span className="error-message red-text"></span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <textarea id="description" name="description" className="materialize-textarea"></textarea>
                                    <label htmlFor="description">Uma descrição da sua doação (não seja breve)</label>
                                    <span className="error-message red-text"></span>
                                </div>
                            </div>
                            <Address legend="Endereço de coleta da doação" />
                            <div className="row">
                                <h5>Coloque uma foto de sua doação</h5>
                                <input id="photo" name="photo" type="file" className="dropify" />
                            </div>
                            <div className="row">
                                <div className="col s12 right-align">
                                    <button type="button" className="btn-large waves-effect waves-light indigo accent-2 wihte-text" onClick={ this.saveDonation }>Salvar</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}