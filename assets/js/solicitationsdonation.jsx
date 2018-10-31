import React from 'react'
import Preloader from './preloader'
import { Link } from 'react-router-dom'
import { relative } from 'path';

export default class SolicitationsDonation extends React.Component{

    constructor(props){
        super(props);
        this.state = { donation: [], solicitations_of_donation: [] };
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

    handleClickReject(pk) {
        $(`#reject-${pk}`).show().find('textarea').attr('disabled', false);
        $(`#accept-${pk}`).hide().find('input').attr('disabled', true);
    }

    handleClickAccept(pk) {
        $(`#reject-${pk}`).hide().find('textarea').attr('disabled', true);
        $(`#accept-${pk}`).show().find('input').attr('disabled', false);
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
                                        <th>Comentário do solicitante</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.state.solicitations_of_donation.map((solicitation, index) =>
                                        <tr key={ solicitation.pk }>
                                            <td>{ solicitation.slug }</td>
                                            <td><Link to={`/accounts/profile/${solicitation.owner_pk}/`}><img className="responsive-img circle" style={{ width: '50px', height: '50px', marginTop: '6px' }} src={ solicitation.owner_photo } /> {solicitation.owner}</Link></td>
                                            <td><p className="grey-text">{ solicitation.comment }</p></td>
                                            <td>
                                                <a href="#"
                                                className="btn-large waves-effect waves-light indigo accent-2 white-text dropdown-button" 
                                                data-activates="solicitations-menu"
                                                data-constrainwidth="false">
                                                    <i className="material-icons">menu</i>
                                                </a>
                                                <ul id="solicitations-menu" className="dropdown-content">
                                                    <li><a href="#!">one</a></li>
                                                    <li><a href="#!">two</a></li>
                                                    <li class="divider"></li>
                                                    <li><a href="#!">three</a></li>
                                                    <li><a href="#!"><i class="material-icons">view_module</i>four</a></li>
                                                    <li><a href="#!"><i class="material-icons">cloud</i>five</a></li>
                                                </ul>
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