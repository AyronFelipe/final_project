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

    handleActionsRender(status, pk){
        let conditional;
        if (status == 'Inválida') {
            conditional = <p className="red-text">Você não pode fazer nada em relação a essa solicitação. Pois sua doação está inválida.</p>
        } else if (status == 'Criada') {
            //aceitar
            //rejeitar
            conditional =
            <div>
                <a href={`#modal-accept-solicitation-${pk}`} className="btn modal-trigger waves-effect waves-light teal darken-2 white-text">Aceitar</a>&nbsp;
                <a href={`#modal-reject-solicitation-${pk}`} className="btn modal-trigger waves-effect waves-light red accent-2 white-text">Rejeitar</a>
            </div>
        } else if (status == 'Rejeitada') {
            //desrejeitar
            conditional = <p className="red-text">Você rejeitou essa solicitação</p>
        } else if (status == 'Aceita') {
            //desistir
            //não apareceu
            //finalizar
            conditional = <p className="green-text">Você aceitou essa solicitação</p>
        } else if (status == 'Em espera') {
            conditional = <p>Essa solicitação está em espera</p>
        } else if (status == 'Finalizada') {
            conditional = <p>Esta solicitação foi atendida e concluída</p>
        }
        return conditional;
    }

    acceptSolicitation(pk) {
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
            success: function (data) {
                location.reload();
            }.bind(this),
            error: function (request, status, err) {
                console.log(request, status, err);
            }
        });
    }

    rejectSolicitation(pk) {
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
                    const collection = `<h6>Sua doação não possui solicitações.</h6>`;
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

        $('.dropdown-button').dropdown();
        
        $('.modal').modal();

        if ( this.state.donation.length == 0 ) {
            return(
                <div>
                    <nav className="nav-extended deep-purple darken-2 white-text">
                        <div className="row">
                            <div className="col s12">
                                <div className="col s10 push-s1">
                                    <div className="nav-content">
                                        <span className="nav-title">Solicitações da Doação <Preloader /></span>
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