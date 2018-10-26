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
                                                title="Detalhes da Doação" >
                                                    <i className="material-icons">arrow_drop_down</i>
                                                </a>
                                                <ul id={ `dropdown-details-donation-${donation.pk}` } className="dropdown-content">
                                                    <Link to={`/donations/donation/${donation.slug}/solicitations/`}><li><i className="material-icons">settings</i> Gerenciar solicitações</li></Link>
                                                    <Link to={`/donations/donation/${donation.slug}/`}><li><span><i className="material-icons">zoom_in</i> Ver detalhes da Doação</span></li></Link>
                                                    <li><a href={`#modal-delete-${donation.pk}`} className="modal-trigger"><i className="material-icons">delete</i> Deletar Doação</a></li>
                                                </ul>
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