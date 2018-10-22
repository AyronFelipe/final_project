import React from 'react'
import { Link } from 'react-router-dom'
import * as moment from 'moment';
import 'moment/locale/pt-br';
import Preloader from './preloader'

export default class MyDonations extends React.Component{

    constructor(props){
        super(props);
        this.state = { donations: [], solicitations_of_donation: [] }
    }

    deleteDonation(pk){
        $.ajax({
            url: `/api/my-donations/${pk}/`,
            type: 'DELETE',
            dataType: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function (data) {
                location.reload()
            }.bind(this),
            error: function (request, status, err) {
                console.log(request, status, err);
            }
        })
    }

    loadSolicitations(pk){
        $.ajax({
            url: '/api/donation/'+pk+'/solicitations/',
            type: 'GET',
            dataType: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(data){
                this.setState({ solicitations_of_donation: data })
            }.bind(this),
            error: function(request, status, err){
                console.log(request, status, err);
            }
        });
    }

    acceptSolicitation(pk){
        let values = {
            pk: pk,
            validity: $('[name=validity]').val(),
            validity_hour: $('#validity-hour').val()
        }
        $.ajax({
            url: `/api/donation/accepts/${pk}/`,
            type: 'POST',
            dataType: 'json',
            data: values,
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(data) {
                location.reload();
            }.bind(this),
            error: function (request, status, err) {
                console.log(request, status, err);
            }
        });
    }

    rejectSolicitation(pk){
        let values = {
            pk: pk,
            reason_rejection: $("#reason-rejection").val() 
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

    handleClickReject(pk){
        $(`#reject-${pk}`).show().find('textarea').attr('disabled', false);
        $(`#accept-${pk}`).hide().find('input').attr('disabled', true);
    }

    handleClickAccept(pk){
        $(`#reject-${pk}`).hide().find('textarea').attr('disabled', true);
        $(`#accept-${pk}`).show().find('input').attr('disabled', false);
    }

    componentDidMount(){
        $.ajax({
            url: '/api/my-donations/',
            type: 'GET',
            dataType: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(data){
                if (data.length == 0) {
                    const collection =
                    `<h6>Você não possui doações cadastradas.<h6/>`
                    $('#table-content').html(collection);
                } else {
                    this.setState({ donations: data })
                }
            }.bind(this),
            error: function(request, status, err){
                console.log(request, status, err);
            }
        });
    }

    render(){

        const modalStyle = {
            maxHeight: '100% !important',
            overflowY: 'hidden !important'
        };

        if (this.state.donations.length == 0) {
            return(
                <div>
                    <nav className="nav-extended deep-purple darken-2 white-text">
                        <div className="row">
                            <div className="col s12">
                                <div className="col s10 push-s1">
                                    <div className="nav-content">
                                        <span className="nav-title">Minhas Doações</span>
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
                                <table className="responsive-table">
                                    <thead>
                                        <tr>
                                            <th>Doação</th>
                                            <th>Validade da Doação</th>
                                            <th>Número de Solicitações</th>
                                            <th>Status da Doação</th>
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

        $('.dropdown-button').dropdown({
            alignment: 'right'
        })

        $('.modal').modal()

        $('.collapsible').collapsible()

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
            default: 'now',
            fromnow: 0,
            twelvehour: false,
            donetext: 'OK',
            cleartext: 'Limpar',
            canceltext: 'Cancelar',
            container: undefined,
            autoclose: false,
            ampmclickable: true,
        })

        return(
            <div>
                <nav className="nav-extended deep-purple darken-2 white-text">
                    <div className="row">
                        <div className="col s12">
                            <div className="col s10 push-s1">
                                <div className="nav-content">
                                    <span className="nav-title">Minhas Doações</span>
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
                <br/><br/>
                <div className="row">
                    <div className="col s12">
                        <div className="col s10 push-s1">
                            <table className="responsive-table">
                                <thead>
                                    <tr>
                                        <th>Doação</th>
                                        <th>Validade da Doação</th>
                                        <th>Número de Solicitações</th>
                                        <th>Status da Doação</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.donations.map((donation, index) =>
                                        <tr key={donation.pk}>
                                            <td><Link to={ `/donations/donation/${donation.slug}/` }><img className="responsive-img circle" style={{ width: '20px', height: '20px' }} src={donation.main_photo} /> { donation.slug }</Link></td>
                                            <td>{ moment(donation.validity).format("DD/MM/YYYY") } até às { donation.validity_hour }</td>
                                            <td>{ donation.solicitations_count }</td>
                                            <td>{ donation.status }</td>
                                            <td>
                                                <a href="#" 
                                                className="dropdown-button btn waves-effect waves-light indigo accent-2 white-text" 
                                                data-activates={ `dropdown-details-donation-${donation.pk}` }
                                                data-constrainwidth="false" 
                                                title="Detalhes da Doação" 
                                                onClick={ this.loadSolicitations.bind(this, donation.pk) }>
                                                    <i className="material-icons">arrow_drop_down</i>
                                                </a>
                                                <ul id={ `dropdown-details-donation-${donation.pk}` } className="dropdown-content">
                                                    <li><a href={`#modal-manage-solicitation-${donation.pk}`} className="modal-trigger"><i className="material-icons">settings</i> Gerenciar solicitações</a></li>
                                                    <Link to={`/donations/donation/${donation.slug}/`}><li><span><i className="material-icons">zoom_in</i> Ver detalhes da Doação</span></li></Link>
                                                    <li><a href={`#modal-delete-${donation.pk}`} className="modal-trigger"><i className="material-icons">delete</i> Deletar Doação</a></li>
                                                    <li><a href="#" className="modal-trigger"><i className="material-icons">sentiment_dissatisfied</i> Não apareceu</a></li>
                                                </ul>
                                                <div id={`modal-manage-solicitation-${donation.pk}`} className="modal purple-text" style={ modalStyle }>
                                                    <div className="modal-content">
                                                        <div className="row">
                                                            <div className="col s12">
                                                                <h4>Solicitações da sua Doação</h4>
                                                                <ul className="collapsible popout" data-collapsible="accordion">
                                                                    {this.state.solicitations_of_donation.map((solicitation_of_donation, index) =>
                                                                        <li key={index}>
                                                                            <div className="collapsible-header">
                                                                                <p><i className="material-icons">shopping_basket</i>{solicitation_of_donation.slug} - <span className="rigth-align">{solicitation_of_donation.status}</span></p>
                                                                            </div>
                                                                            <div className="collapsible-body">
                                                                                <p>
                                                                                    <strong>Solicitante: </strong>
                                                                                    <Link target="_blank" to={ `/accounts/profile/${solicitation_of_donation.owner_pk}/` }>
                                                                                        <img className="responsive-img circle" style={{ width: '50px', height: '50px' }} src={solicitation_of_donation.owner_photo} /> 
                                                                                        { solicitation_of_donation.owner }
                                                                                    </Link>
                                                                                </p>
                                                                                <p>
                                                                                    <strong>Solicitação criada em: </strong>
                                                                                    { moment(solicitation_of_donation.created_at).format('LLL') }
                                                                                </p>
                                                                                <h5>Ações</h5>
                                                                                <hr/>
                                                                                <div className="card deep-purple">
                                                                                    <div className="card-content white-text">
                                                                                        <span className="card-title">Atenção</span>
                                                                                        <p>
                                                                                            As opções abaixo representam seu interesse nessa solicitação.<br/><br/>
                                                                                            Se você clicar em "Rejeitar essa solicitação" um campo com o motivo da rejeição aparecerá. Após preenche-lo clique em "Rejeitar" e essa solicitação não aparecerá mais.<br/><br/>
                                                                                            Agora, se você clicar em "Aceitar essa solicitação" dois campos aparecerão para você preencher a data e o horário limite que para esse solicitante ir buscar a sua doação.<br/><br/>
                                                                                            <i className="material-icons">priority_high</i> Se porventura houverem outras solicitações, ao clicar em "aceitar" as outras solicitações passarão para o estado de "Em Espera".<br/><br/>
                                                                                            <i className="material-icons">priority_high</i> Se o solicitante não aparecer até o dia e horário determinados, você possui a opção de "Não apareceu" e ao confirmar colocará essa doação novamente no estado de "Aberta" e outros usuários poderão solicitá-la novamente.<br/><br/>
                                                                                        </p>
                                                                                    </div>
                                                                                    <div className="card-action">
                                                                                        <div className="row">
                                                                                            <div className="col m6 s12">
                                                                                                <button className="btn waves-effect waves-light" type="button" onClick={() => {this.handleClickReject(solicitation_of_donation.pk)}}>
                                                                                                    <small>Rejeitar essa solicitação</small>
                                                                                                </button>
                                                                                            </div>
                                                                                            <div className="col m6 s12">
                                                                                                <button className="btn waves-effect waves-light" type="button" onClick={() => { this.handleClickAccept(solicitation_of_donation.pk)}}>
                                                                                                    <small>Aceitar essa solicitação</small>
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div id={`accept-${solicitation_of_donation.pk}`} hidden>
                                                                                    <div className="row">
                                                                                        <div className="input-field col s12">
                                                                                            <input id="validity" type="text" name="validity" className="datepicker" />
                                                                                            <label htmlFor="validity">Disponível até o dia <span className="red-text">*</span></label>
                                                                                            <span className="validity-error-message red-text error"></span>
                                                                                        </div>
                                                                                        <div className="input-field col s12">
                                                                                            <input id="validity-hour" name="validity_hour" type="text" className="timepicker" />
                                                                                            <label htmlFor="validity_hour">Disponível até às <span className="red-text">*</span></label>
                                                                                            <span className="validity_hour-error-message red-text error"></span>
                                                                                        </div>
                                                                                        <button className="btn waves-effect waves-light green" type="button" onClick={this.acceptSolicitation.bind(this, solicitation_of_donation.pk)}>
                                                                                            <i className="material-icons right">done</i> Aceitar
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                                <div id={`reject-${solicitation_of_donation.pk}`} hidden>
                                                                                    <div className="row">
                                                                                        <div className="input-field col s12">
                                                                                            <textarea id="reason-rejection" name="reason_rejection" className="materialize-textarea"></textarea>
                                                                                            <label htmlFor="reason-rejection">Motivo da Rejeição <span className="red-text">*</span></label>
                                                                                            <span className="reason_rejection-error-message red-text error"></span>
                                                                                        </div>
                                                                                        <button className="btn waves-effect waves-light red" type="button" onClick={this.rejectSolicitation.bind(this, solicitation_of_donation.pk)}>
                                                                                            <i className="material-icons right">not_interested</i> Rejeitar
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </li>
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <a href="#!" className="modal-action modal-close waves-effect waves-light btn-flat ">Fechar</a>
                                                    </div>
                                                </div>
                                                <div id={`modal-delete-${donation.pk}`} className="modal purple-text" style={ modalStyle }>
                                                    <div className="modal-content">
                                                        <div className="row">
                                                            <div className="col s12">
                                                                <h5 className="red-text">Tem certeza que deseja deletar a Doação { donation.slug }</h5>
                                                                <br />
                                                                <div className="card red darken-2">
                                                                    <div className="card-content white-text">
                                                                        <p>Ao confirmar o desejo de excluir a Doação { donation.slug }, você se declara ciente que ela não mais existirá e não pode ser recuperada.</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <div className="row">
                                                            <div className="col s12">
                                                                <button className="btn btn-large waves-effect waves-light red darken-2 white-text" onClick={this.deleteDonation.bind(this, donation.pk)}><i className="material-icons">delete</i> Eu quero excluir!</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}