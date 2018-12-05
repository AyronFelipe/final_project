import React from 'react'
import { Link } from 'react-router-dom'
import * as moment from 'moment';
import 'moment/locale/pt-br';
import Preloader from './preloader'
import 'materialize-css'
import 'materialize-css/dist/css/materialize.min.css'

export default class MyDonations extends React.Component{

    constructor(props){
        super(props);
        this.state = { donations: [] }
    }

    deleteDonation(pk){
        $.gritter.add({
            title: 'Aguarde!',
            text: 'Enviando dados...',
            sticky: true,
            class_name: 'black white-text',
        });
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
        }).always(function(){
            $.gritter.removeAll();
        });
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

    handleModalClick(pk){
        $('.modal').modal();
        $(`#modal-delete-${pk}`).modal('open');
    }

    render(){

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
                            <table>
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
                                                <Link to={`/donations/${donation.slug}/solicitations/`}>
                                                    <button className="btn waves-effect waves-light indigo accent-2 white-text" title="Gerenciar solicitações" type="button">
                                                        <i className="material-icons">settings</i>
                                                    </button>
                                                </Link>
                                                &nbsp;
                                                <Link to={`/donations/donation/${donation.slug}/`}>
                                                    <button className="btn waves-effect waves-light indigo accent-2 white-text" title="Ver detalhes da Doação" type="button">
                                                        <span>
                                                            <i className="material-icons">zoom_in</i>
                                                        </span>
                                                    </button>
                                                </Link>
                                                &nbsp;
                                                <button data-target={`modal-delete-${donation.pk}`} onClick={ () => this.handleModalClick(donation.pk) } className="btn waves-effect waves-light red accent-2 white-text modal-trigger" title="Deletar Doação">
                                                    <i className="material-icons">delete</i>
                                                </button>
                                                <div id={`modal-delete-${donation.pk}`} className="modal purple-text">
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