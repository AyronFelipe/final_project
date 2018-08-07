import React from 'react'
import Address from './address'
import 'dropify'
import 'dropify/dist/css/dropify.min.css'
import { storageToken } from './auth'
import { Link } from 'react-router-dom'
import autocomplete from 'jquery-ui/ui/widgets/autocomplete'

export default class Donation extends React.Component{

    constructor(props){
        super(props);
        this.saveDonation = this.saveDonation.bind(this);
        this.loadAutoComplete = this.loadAutoComplete.bind(this);
    }

    saveDonation(){
        $("#donation-form").find("input, textarea").each(function(){
            $(this).siblings('span.error-message').html('');
        })
        let form = new FormData($("#donation-form").get(0));
        let chipsObjectValue = $("#tags").material_chip('data');
        $.each(chipsObjectValue, function(key, value){
            form.append('tags', value.tag)
        })
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
                    for(const [key, value] of Object.entries(request.responseJSON)){
                        $("#donation-form").find(":input").each(function(){
                            name = $(this).attr("name");
                            if(name===key){
                                $(this).siblings('span.error-message').html('<p>'+value+'</p>');
                            }
                        });
                    }
                }
            }
        })
    }

    loadAutoComplete(){
        $('.chips input').autocomplete({
            minLength: 2,
            source: function(request, response){
                $.ajax({
                    url: '/api/tags/',
                    dataType: 'json',
                    type: 'GET',
                    data: {
                        term: request.term
                    },
                    success: function(data){
                        response(data);
                    }
                })
            },
            focus: function(event, ui){
                $(".chips .input").val(ui.item.name);
                for(const [key, value] of Object.entries(event.currentTarget.children)){
                    if(value.id == 'tag-id-'+ui.item.pk){
                        $("#"+value.id).addClass('active');
                    }else{
                        $("#"+value.id).removeClass('active');
                    }
                }
                return false;
            },
            select: function(event, ui){
                return false;
            }
        }).autocomplete("instance")._renderItem = function(ul, item) {
            ul.addClass("collection col s12");
            return $("<li class='collection-item' id='tag-id-"+item.pk+"'>").append( "<div>" + item.name + "</div>" ).appendTo( ul );
        };
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

        $('.chips').material_chip();
        
        this.loadAutoComplete();
    }

    render(){
        

        return(
            <div>
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
                                        <label htmlFor="name">Nome</label>
                                        <span className="error-message red-text"></span>
                                    </div>
                                    <div className="input-field col m3 s12">
                                        <input id="validity" name="validity" type="text" className="datepicker" />
                                        <label htmlFor="validity">Disponível até o dia</label>
                                        <span className="error-message red-text"></span>
                                    </div>
                                    <div className="input-field col m3 s12">
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
                                <div className="row">
                                    <h5>Adicione as tags da sua doação</h5>
                                    <div className="chips" id="tags"></div>
                                </div>
                                <Address legend="Endereço de coleta da doação" />
                                <div className="row">
                                    <h5>Coloque a foto principal de sua doação</h5>
                                    <input id="photo" name="main_photo" type="file" className="dropify" />
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