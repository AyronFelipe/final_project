import React from 'react'
import Preloader from './preloader'
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { Link } from 'react-router-dom'

export default class SolicitationsDonation extends React.Component{

    constructor(props){
        super(props);
        this.state = { donation: [], solicitations_of_donation: [] };
        this.handleActionsRender = this.handleActionsRender.bind(this)
        this.acceptSolicitation = this.acceptSolicitation.bind(this)
        this.handleTimePicker = this.handleTimePicker.bind(this);
        this.handleDatePicker = this.handleDatePicker.bind(this);
    }

    handleClickModal(modal) {
        $('.modal').modal();
        $(`#${modal}`).modal('open');
    }

    handleActionsRender(status, pk){
        let conditional;
        if (status == 'Inválida') {
            conditional = <p className="red-text">Você não pode fazer nada em relação a essa solicitação. Pois sua doação está inválida.</p>
        } else if (status == 'Criada') {
            conditional =
            <div>
                <button onClick={() => {this.handleClickModal(`modal-accept-solicitation-${pk}`)}} data-target={`modal-accept-solicitation-${pk}`} className="btn modal-trigger waves-effect waves-light teal darken-2 white-text" title="Aceitar solicitação"><i className="material-icons">check</i></button>&nbsp;
                <button onClick={() => {this.handleClickModal(`modal-reject-solicitation-${pk}`)}} data-target={`modal-reject-solicitation-${pk}`} className="btn modal-trigger waves-effect waves-light red accent-2 white-text" title="Rejeitar solicitação"><i className="material-icons">block</i></button>
            </div>
        } else if (status == 'Rejeitada') {
            //desrejeitar??
            conditional = <p className="red-text">Você rejeitou essa solicitação.</p>
        } else if (status == 'Aceita') {
            conditional =
            <div>
                <button onClick={() => {this.handleClickModal(`modal-cancel-solicitation-${pk}`)}} data-target={`modal-cancel-solicitation-${pk}`} className="btn modal-trigger waves-effect waves-light red accent-2 white-text" title="Cancelar doação"><i className="material-icons">clear</i></button>&nbsp;
                <button onClick={() => {this.handleClickModal(`modal-not-appear-solicitation-${pk}`)}} data-target={`modal-not-appear-solicitation-${pk}`} className="btn modal-trigger waves-effect waves-light indigo accent-2 white-text" title="Solicitante não apareceu"><i className="material-icons">sentiment_dissatisfied</i></button>&nbsp;
                <button onClick={() => {this.handleClickModal(`modal-finalize-solicitation-${pk}`)}} data-target={`modal-finalize-solicitation-${pk}`} className="btn modal-trigger waves-effect waves-light teal darken-2 white-text" title="Doação finalizada"><i className="material-icons">done_all</i></button>&nbsp;
            </div>
        } else if (status == 'Em Espera') {
            conditional = <p className="grey-text">Essa solicitação está em espera</p>
        } else if (status == 'Finalizada - Doada') {
            conditional = <p className="teal-text">Esta solicitação foi atendida e concluída</p>
        } else if (status == 'Finalizada - Não doada' ) {
            conditional = <p className="teal-text">Esta solicitação foi concluída mas não atendida</p>
        }
        return conditional;
    }

    acceptSolicitation(pk) {
        $('.validity-error-message').html("");
        $('.validity_hour-error-message').html("");
        let values = {
            pk: pk,
            validity: $(`[name=validity_${pk}]`).val(),
            validity_hour: $(`#validity-hour-${pk}`).val()
        };
        $.gritter.add({
            title: 'Aguarde!',
            text: 'Enviando dados...',
            sticky: true,
            class_name: 'black white-text',
        });
        $.ajax({
            url: `/api/donation/accepts/${pk}/`,
            type: 'POST',
            dataType: 'json',
            data: values,
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function (data) {
                location.reload();
            }.bind(this),
            error: function (request, status, err) {
                if (request.status == 401) {
                    if (request.responseJSON.message_error_validity) {
                        $('.validity-error-message').html(request.responseJSON.message_error_validity)
                    }
                    if (request.responseJSON.message_error_validity_hour) {
                        $('.validity_hour-error-message').html(request.responseJSON.message_error_validity_hour)
                    }
                }
            }
        }).always(function(){
            $.gritter.removeAll();
        });
    }

    rejectSolicitation(pk) {
        $('.reason_rejection-error-message').html("")
        let values = {
            pk: pk,
            reason_rejection: $(`#reason-rejection-${pk}`).val()
        };
        $.gritter.add({
            title: 'Aguarde!',
            text: 'Enviando dados...',
            sticky: true,
            class_name: 'black white-text',
        });
        $.ajax({
            url: `/api/donation/rejects/${pk}/`,
            type: 'POST',
            dataType: 'json',
            data: values,
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function (data) {
                location.reload();
            }.bind(this),
            error: function (request, status, err) {
                if (request.status == 401) {
                    $('.reason_rejection-error-message').html(request.responseJSON.message_error)
                }
            }
        }).always(function(){
            $.gritter.removeAll();
        });
    }
    
    cancelSolicitation(pk) {
        $.gritter.add({
            title: 'Aguarde!',
            text: 'Enviando dados...',
            sticky: true,
            class_name: 'black white-text',
        });
        $.ajax({
            url: `/api/donation/cancels/${pk}/`,
            type: 'POST',
            dataType: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function (data) {
                location.reload();
            }.bind(this),
            error: function (request, status, err) {
                console.log(request, status, err);
            }
        }).always(function(){
            $.gritter.removeAll();
        });
    }
    
    notAppearSolicitation(pk) {
        $.gritter.add({
            title: 'Aguarde!',
            text: 'Enviando dados...',
            sticky: true,
            class_name: 'black white-text',
        });
        $.ajax({
            url: `/api/donation/not-appear/${pk}/`,
            type: 'POST',
            dataType: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function (data) {
                location.reload();
            }.bind(this),
            error: function (request, status, err) {
                console.log(request, status, err);
            }
        }).always(function(){
            $.gritter.removeAll();
        });
    }

    finalizeSolicitation(pk) {
        $.gritter.add({
            title: 'Aguarde!',
            text: 'Enviando dados...',
            sticky: true,
            class_name: 'black white-text',
        });
        $.ajax({
            url: `/api/donation/finalize/${pk}/`,
            type: 'POST',
            dataType: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function (data) {
                location.reload();
            }.bind(this),
            error: function (request, status, err) {
                console.log(request, status, err);
            }
        }).always(function(){
            $.gritter.removeAll();
        });
    }

    componentDidMount(){

        let pathname = window.location.pathname;
        
        let slug = pathname.split('/')[2];

        $.ajax({
            url: `/api/donations/${slug.split('.')[2]}/`,
            dataType: 'json',
            type: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(data){
                this.setState({ donation: data });
            }.bind(this),
            error: function (request, status, err){
                console.log(request, status, err);
            }
        });

        $.ajax({
            url: `/api/donation/${slug.split('.')[2]}/solicitations/`,
            type: 'GET',
            dataType: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function (data) {
                if (data.length == 0) {
                    const collection = '<h6>Sua doação não possui solicitações.</h6>';
                    $('#table-content').html(collection);
                } else {
                    this.setState({ solicitations_of_donation: data })
                }
            }.bind(this),
            error: function (request, status, err) {
                console.log(request, status, err);
            }
        });
    }

    handleDatePicker(validity){
        let date = new Date(validity);
        date.setDate(date.getDate() + 1);
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
        });
    }

    handleTimePicker(validity_hour){
        $('.timepicker').pickatime({
            default: 'now',
            fromnow: 0,
            twelvehour: false,
            donetext: 'OK',
            cleartext: 'Limpar',
            canceltext: 'Cancelar',
            container: undefined,
            autoclose: false,
            ampmclickable: true,
        });
    }

    handleValidity(validity, validity_hour){
        let conditional = ''
        if (validity == null && validity_hour == null) {
            conditional = <p>Não possui data de validade</p>;
        } else {
            let local_date = moment(validity).format("DD/MM/YYYY")
            conditional = <p>{local_date}<br/>{validity_hour}</p>;
        }
        return conditional;
    }

    render(){

        if ( this.state.solicitations_of_donation.length == 0 ) {
            return(
                <div>
                    <nav className="nav-extended deep-purple darken-2 white-text">
                        <div className="row">
                            <div className="col s12">
                                <div className="col s10 push-s1">
                                    <div className="nav-content">
                                        <span className="nav-title">Solicitações da Doação {this.state.donation.slug}</span>
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
                    <br /><br />
                    <div className="row">
                        <div className="col s12">
                            <div className="col s10 push-s1">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Solicitação</th>
                                            <th>Validade da sua doação</th>
                                            <th>Dono da Solicitação</th>
                                            <th>Validade que você deu para essa solicitação</th>
                                            <th>Status da solicitação</th>
                                            <th>Comentário do solicitante</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td colSpan="5">
                                                <div id="table-content">
                                                    <br />
                                                    <Preloader />
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
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
                                    <span className="nav-title">Solicitações da Doação { this.state.donation.slug }</span>
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
                <br /><br />
                <div className="row">
                    <div className="col s12">
                        <div className="col s10 push-s1">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Solicitação</th>
                                        <th>Dono da Solicitação</th>
                                        <th>Validade dessa solicitação</th>
                                        <th>Status da solicitação</th>
                                        <th>Comentário do solicitante</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.state.solicitations_of_donation.map((solicitation, index) =>
                                        <tr key={ solicitation.pk }>
                                            <td>{ solicitation.slug }</td>
                                            <td><Link to={`/accounts/profile/${solicitation.owner_pk}/`}><img className="responsive-img circle" style={{ width: '50px', height: '50px', marginTop: '6px' }} src={ solicitation.owner_photo } /> {solicitation.owner}</Link></td>
                                            <td>{ this.handleValidity(solicitation.validity, solicitation.validity_hour) }</td>
                                            <td><p>{ solicitation.status }</p></td>
                                            <td><p className="grey-text">{ solicitation.comment }</p></td>
                                            <td>
                                                { this.handleActionsRender( solicitation.status, solicitation.pk ) }

                                                <div id={`modal-accept-solicitation-${solicitation.pk}`} className="modal teal-text">
                                                    <div className="modal-content">
                                                        <div className="row">
                                                            <h4>Aceitar solicitação { solicitation.slug }</h4>
                                                            <div className="col s12 center-align">
                                                                <div className="valign-wrapper row">
                                                                    <div className="col card hoverable teal darken-2 white-text">
                                                                        <div className="card-content">
                                                                            <div className="white-text center-align">
                                                                                <p>Aceitar solicitação. Após aceitar essa solicitação você deve dizer se o solicitante recolheu ou não a doação.</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="input-field col s12">
                                                                <input id={`validity-${solicitation.pk}`} type="text" name={`validity_${solicitation.pk}`} onClick={() => {this.handleDatePicker(this.state.donation.validity)}} className="datepicker" />
                                                                <label htmlFor="validity">Disponível até o dia <span className="red-text">*</span></label>
                                                                <span className="validity-error-message red-text error"></span>
                                                            </div>
                                                            <div className="input-field col s12">
                                                                <input id={`validity-hour-${solicitation.pk}`} name="validity_hour" type="text" onClick={() => {this.handleTimePicker(this.state.donation.validity_hour)}} className="timepicker active" />
                                                                <label htmlFor="validity_hour">Disponível até às <span className="red-text">*</span></label>
                                                                <span className="validity_hour-error-message red-text error"></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button className="btn waves-effect waves-light teal darken-2" type="button" onClick={this.acceptSolicitation.bind(this, solicitation.pk)}>
                                                            <i className="material-icons right">done</i> Aceitar
                                                        </button>
                                                        <a href="#!" className="modal-action modal-close waves-effect waves-green btn-flat">Fechar</a>
                                                    </div>
                                                </div>

                                                <div id={`modal-reject-solicitation-${solicitation.pk}`} className="modal red-text">
                                                    <div className="modal-content">
                                                        <div className="row">
                                                            <h4>Rejeitar solicitação {solicitation.slug}</h4>
                                                            <div className="col s12 center-align">
                                                                <div className="valign-wrapper row">
                                                                    <div className="col card hoverable red accent-2 white-text">
                                                                        <div className="card-content">
                                                                            <div className="white-text center-align">
                                                                                <p>Ao rejeitar essa solicitação, você se declara ciente de que essa ação é irreversível.</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="input-field col s12">
                                                                <textarea id={`reason-rejection-${solicitation.pk}`} name="reason_rejection" className="materialize-textarea"></textarea>
                                                                <label htmlFor="reason-rejection">Motivo da Rejeição <span className="red-text">*</span></label>
                                                                <span className="reason_rejection-error-message red-text error"></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button className="btn waves-effect waves-light red accent-2" type="button" onClick={this.rejectSolicitation.bind(this, solicitation.pk)}>
                                                            <i className="material-icons right">not_interested</i> Rejeitar
                                                        </button>
                                                        <a href="#!" className="modal-action modal-close waves-effect waves-green btn-flat">Fechar</a>
                                                    </div>
                                                </div>

                                                <div id={`modal-cancel-solicitation-${solicitation.pk}`} className="modal red-text">
                                                    <div className="modal-content">
                                                        <div className="row">
                                                            <h4>Cancelar doação para a solicitação {solicitation.slug}</h4>
                                                            <div className="col s12 center-align">
                                                                <div className="valign-wrapper row">
                                                                    <div className="col card hoverable red accent-2 white-text">
                                                                        <div className="card-content">
                                                                            <div className="white-text center-align">
                                                                                <p>Ao cancelar essa solicitação todas as outras solicitações, inclusive essa, passarão para o status de criada. E então, você pode escolher outra solicitação para sua doação.</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button className="btn waves-effect waves-light red accent-2" type="button" onClick={this.cancelSolicitation.bind(this, solicitation.pk)}>
                                                            <i className="material-icons right">clear</i> Cancelar
                                                        </button>
                                                        <a href="#!" className="modal-action modal-close waves-effect waves-green btn-flat">Fechar</a>
                                                    </div>
                                                </div>

                                                <div id={`modal-not-appear-solicitation-${solicitation.pk}`} className="modal indigo-text">
                                                    <div className="modal-content">
                                                        <div className="row">
                                                            <h4>Dono da solicitação {solicitation.slug} não apareceu</h4>
                                                            <div className="col s12 center-align">
                                                                <div className="valign-wrapper row">
                                                                    <div className="col card hoverable indigo accent-2 white-text">
                                                                        <div className="card-content">
                                                                            <div className="white-text center-align">
                                                                                <p>
                                                                                    Ao clicar em "Não Apareceu" nós assumimos que o { solicitation.owner } não foi ao endereço de coleta da sua doação.
                                                                                    A solicitação será imediatamente deletada da lista de solicitações da sua doação.
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button className="btn waves-effect waves-light indigo accent-2" type="button" onClick={this.notAppearSolicitation.bind(this, solicitation.pk)}>
                                                            <i className="material-icons right">sentiment_dissatisfied</i> Não Apareceu
                                                        </button>
                                                        <a href="#!" className="modal-action modal-close waves-effect waves-green btn-flat">Fechar</a>
                                                    </div>
                                                </div>
                                                
                                                <div id={`modal-finalize-solicitation-${solicitation.pk}`} className="modal teal-text">
                                                    <div className="modal-content">
                                                        <div className="row">
                                                            <h4>Finalizar solicitação {solicitation.slug}</h4>
                                                            <div className="col s12 center-align">
                                                                <div className="valign-wrapper row">
                                                                    <div className="col card hoverable teal darken-2 white-text">
                                                                        <div className="card-content">
                                                                            <div className="white-text center-align">
                                                                                <p>
                                                                                    Ao clicar em "Finalizar" nós assumimos que tudo relacionado a essa solicitação e doação ocorreu dentro do esperado.
                                                                                    Obrigado por ajudar! :D
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button className="btn waves-effect waves-light teal darken-2" type="button" onClick={ this.finalizeSolicitation.bind(this, solicitation.pk) }>
                                                            <i className="material-icons right">done_all</i> Finalizar
                                                        </button>
                                                        <a href="#!" className="modal-action modal-close waves-effect waves-green btn-flat">Fechar</a>
                                                    </div>
                                                </div>

                                            </td>
                                        </tr>
                                    ) }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}