import React from 'react'
import Preloader from './preloader'
import { Link } from 'react-router-dom'

export default class SolicitationsDonation extends React.Component{

    constructor(props){
        super(props);
        this.state = { donation: [], solicitations_of_donation: [] };
        this.handleActionsRender = this.handleActionsRender.bind(this)
        this.acceptSolicitation = this.acceptSolicitation.bind(this)
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
                <button onClick={() => {this.handleClickModal(`modal-accept-solicitation-${pk}`)}} data-target={`modal-accept-solicitation-${pk}`} className="btn modal-trigger waves-effect waves-light teal darken-2 white-text">Aceitar</button>&nbsp;
                <button onClick={() => {this.handleClickModal(`modal-reject-solicitation-${pk}`)}} data-target={`modal-reject-solicitation-${pk}`} className="btn modal-trigger waves-effect waves-light red accent-2 white-text">Rejeitar</button>
            </div>
        } else if (status == 'Rejeitada') {
            //desrejeitar??
            conditional = <p className="red-text">Você rejeitou essa solicitação.</p>
        } else if (status == 'Aceita') {
            conditional =
            <div>
                <button onClick={() => {this.handleClickModal(`modal-cancel-solicitation-${pk}`)}} data-target={`modal-cancel-solicitation-${pk}`} className="btn modal-trigger waves-effect waves-light red accent-2 white-text">Cancelar doação</button><br /><br />
                <button onClick={() => {this.handleClickModal(`modal-not-appear-solicitation-${pk}`)}} data-target={`modal-not-appear-solicitation-${pk}`} className="btn modal-trigger waves-effect waves-light indigo accent-2 white-text">Solicitante não apareceu</button><br /><br />
                <button onClick={() => {this.handleClickModal(`modal-finalize-solicitation-${pk}`)}} data-target={`modal-finalize-solicitation-${pk}`} className="btn modal-trigger waves-effect waves-light teal darken-2 white-text">Doação finalizada</button>
            </div>
        } else if (status == 'Em Espera') {
            conditional = <p className="grey-text">Essa solicitação está em espera</p>
        } else if (status == 'Finalizada') {
            conditional = <p className="teal-text">Esta solicitação foi atendida e concluída</p>
        }
        return conditional;
    }

    acceptSolicitation(pk) {
        $('.validity-error-message').html("");
        $('.validity_hour-error-message').html("");
        let values = {
            pk: pk,
            validity: $(`#validity-${pk}`).val(),
            validity_hour: $(`#validity-hour-${pk}`).val()
        }
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
        });
    }

    rejectSolicitation(pk) {
        $('.reason_rejection-error-message').html("")
        let values = {
            pk: pk,
            reason_rejection: $(`#reason-rejection-${pk}`).val()
        }
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
        })
    }
    
    cancelSolicitation(pk) {

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
        })
    }
    
    notAppearSolicitation(pk) {

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
        })
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

    render(){

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
            max: this.state.donation.validity,
            showMonthsFull: true,
            showWeekdaysShort: true,
        });

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
                                            <th>Dono da Solicitação</th>
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
                                            <td><p>{ solicitation.status }</p></td>
                                            <td><p className="grey-text">{ solicitation.comment }</p></td>
                                            <td>
                                                { this.handleActionsRender( solicitation.status, solicitation.pk ) }

                                                <div id={`modal-accept-solicitation-${solicitation.pk}`} className="modal purple-text">
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
                                                                <input id={`validity-${solicitation.pk}`} type="text" name="validity" className="datepicker" />
                                                                <label htmlFor="validity">Disponível até o dia <span className="red-text">*</span></label>
                                                                <span className="validity-error-message red-text error"></span>
                                                            </div>
                                                            <div className="input-field col s12">
                                                                <input id={`validity-hour-${solicitation.pk}`} name="validity_hour" type="text" className="timepicker" />
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
                                                            <i className="material-icons right">cancel</i> Cancelar
                                                        </button>
                                                        <a href="#!" className="modal-action modal-close waves-effect waves-green btn-flat">Fechar</a>
                                                    </div>
                                                </div>

                                                <div id={`modal-not-appear-solicitation-${solicitation.pk}`} className="modal purple-text">
                                                    <div className="modal-content">
                                                        <div className="row">
                                                            <h4>Dono da solicitação {solicitation.slug} não apareceu</h4>
                                                            <div className="col s12 center-align">
                                                                <div className="valign-wrapper row">
                                                                    <div className="col card hoverable red accent-2 white-text">
                                                                        <div className="card-content">
                                                                            <div className="white-text center-align">
                                                                                <p>
                                                                                    Ao clicar em "Não Apareceu" nós assumimos que esse usuário não foi ao endereço de coleta da sua doação.
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
                                                        <button className="btn waves-effect waves-light red accent-2" type="button" onClick={this.notAppearSolicitation.bind(this, solicitation.pk)}>
                                                            <i className="material-icons right">cancel</i> Não Apareceu
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
                                                                    <div className="col card hoverable red accent-2 white-text">
                                                                        <div className="card-content">
                                                                            <div className="white-text center-align">
                                                                                <p>
                                                                                    Ao clicar em "Não Apareceu" nós assumimos que esse usuário não foi ao endereço de coleta da sua doação.
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
                                                        <button className="btn waves-effect waves-light red accent-2" type="button">
                                                            <i className="material-icons right">cancel</i> Finalizar
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