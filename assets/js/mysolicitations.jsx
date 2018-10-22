import React from 'react'
import { Link } from 'react-router-dom'
import * as moment from 'moment';
import 'moment/locale/pt-br';
import Preloader from './preloader'

export default class MySolicitations extends React.Component{

    constructor(props){
        super(props);
        this.state = { solicitations: [] };
    }

    componentDidMount(){
        $.ajax({
            url: '/api/my-solicitations/',
            type: 'GET',
            dataType: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(data){
                if (data.length == 0) {
                    const collection =
                    `<h6>Você não possui solicitações cadastradas.</h6>`
                    $('#table-content').html(collection);
                } else {
                    this.setState({ solicitations: data })
                }
            }.bind(this),
            error: function(request, status, err){
                console.log(request, status, err);
            }
        });
    }

    deleteSolicitation(pk){
        let form = new FormData();
        form.append('pk', pk);
        $.ajax({
            url: '/api/delete/solicitation/',
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
                if(data.is_valid){
                    location.reload();
                }
            }.bind(this),
            error: function(request, status, err){
                console.log(request, status, err);
            }
        });
    }

    handleValidity(validity, validity_hour){
        let tr;
        if (validity == null && validity_hour == null){
            tr = <p>Esperando definição do dono da solicitação</p>
        }else{
            tr = <p>{ moment({validity}).format("DD/MM/YYYY") } até às {validity_hour}</p>
        }
        return tr;
    }

    render(){
        if (this.state.solicitations.length == 0) {
            return(
                <div>
                    <nav className="nav-extended deep-purple darken-2 white-text">
                        <div className="row">
                            <div className="col s12">
                                <div className="col s10 push-s1">
                                    <div className="nav-content">
                                        <span className="nav-title">Minhas Solicitações</span>
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
                                            <th>Solicitação</th>
                                            <th>Doação</th>
                                            <th>Dono da Doação</th>
                                            <th>Validade da Doação</th>
                                            <th>Validade da Solicitação</th>
                                            <th>Status da Solicitação</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr colSpan="7">
                                            <td>
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
        });
        $('.modal').modal();
        return(
            <div>
                <nav className="nav-extended deep-purple darken-2 white-text">
                    <div className="row">
                        <div className="col s12">
                            <div className="col s10 push-s1">
                                <div className="nav-content">
                                    <span className="nav-title">Minhas Solicitações</span>
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
                            <table>
                                <thead>
                                    <tr>
                                        <th>Solicitação</th>
                                        <th>Doação</th>
                                        <th>Dono da Doação</th>
                                        <th>Validade da Doação</th>
                                        <th>Validade da Solicitação</th>
                                        <th>Status da Solicitação</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.solicitations.map((solicitation, index) =>
                                        <tr key={solicitation.pk}>
                                            <td>{ solicitation.slug }</td>
                                            <td><Link to={ `/donations/donation/${solicitation.donation.slug}/` }><img className="responsive-img circle" style={{ width: '20px', height: '20px' }} src={solicitation.donation.main_photo} /> { solicitation.donation.slug }</Link></td>
                                            <td><Link to={ `/accounts/profile/${solicitation.donator_donation_pk}/` }><img className="responsive-img circle" style={{ width: '20px', height: '20px' }} src={solicitation.donator_donation_photo} /> { solicitation.donation.donator }</Link></td>
                                            <td>{ moment(solicitation.donation.validity).format("DD/MM/YYYY") } até às { solicitation.donation.validity_hour }</td>
                                            <td>{ this.handleValidity(solicitation.validity, solicitation.validity_hour) }</td>
                                            <td>{ solicitation.status }</td>
                                            <td>
                                                <a href="#" className="dropdown-button btn waves-effect waves-light indigo accent-2 white-text" data-activates={ `dropdown-details-solicitation-${solicitation.id}` } data-constrainwidth="false" tittle="Detalhes da Solicitação">
                                                    <i className="material-icons">arrow_drop_down</i>
                                                </a>
                                                <ul id={ `dropdown-details-solicitation-${solicitation.id}` } className="dropdown-content">
                                                    <li><a href="#"><i className="material-icons">zoom_in</i> Ver detalhes da Solicitação</a></li>
                                                    <li><a href={`#modal-delete-${solicitation.id}`} className="modal-trigger"><i className="material-icons">delete</i> Deletar Solicitação</a></li>
                                                </ul>
                                                <div id={`modal-delete-${solicitation.id}`} className="modal">
                                                    <div className="modal-content">
                                                        <h5 className="red-text">Tem certeza que deseja excluir a Solicitação { solicitation.slug }?</h5>
                                                        <br/>
                                                        <div className="card red darken-2">
                                                            <div className="card-content white-text">
                                                                <p>Ao confirmar o desejo de excluir a Solicitação {solicitation.slug}, você se declara ciente que ela não mais existirá e não pode ser recuperada.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <div className="row">
                                                            <div className="col s12">
                                                                <a href="#!" className="modal-action modal-close waves-effect waves-light btn-flat ">Fechar</a>
                                                                <button className="btn btn-large waves-effect waves-light red darken-2 white-text" onClick={this.deleteSolicitation.bind(this, solicitation.pk)}><i className="material-icons">delete</i> Eu quero excluir!</button>
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