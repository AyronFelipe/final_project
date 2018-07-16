import React from 'react'
import { Link } from 'react-router-dom'
import * as moment from 'moment';
import 'moment/locale/pt-br';

export default class MySolicitations extends React.Component{

    constructor(props){
        super(props);
        this.state = { solicitations: [] };
        this.renderEdit = this.renderEdit.bind(this);
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
                this.setState({ solicitations: data })
            }.bind(this),
            error: function(request, status, err){
                console.log(request, status, err);
            }
        });
    }

    deleteSolicitation(id){
        let form = new FormData();
        form.append('id', id);
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

    editSolicitation(id){
        alert(id);
    }

    renderEdit(status, id){
        let collection;
        if (status != 'Inválida'){
            collection = <li><a href={`#modal-edit-${id}`} className="modal-trigger"><i className="material-icons">edit</i> Editar Solicitação</a></li>
        }
        return collection;
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
                                                <div className="preloader-wrapper big active">
                                                    <div className="spinner-layer spinner-blue-only">
                                                        <div className="circle-clipper left">
                                                            <div className="circle"></div>
                                                        </div>
                                                        <div className="gap-patch">
                                                            <div className="circle"></div>
                                                        </div>
                                                        <div className="circle-clipper right">
                                                            <div className="circle"></div>
                                                        </div>
                                                    </div>
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
        $('.modal').modal({
            ready: function(modal, trigger){
                $('.input-active').focus();
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
                });
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
                    max: true,
                    showMonthsFull: true,
                    showWeekdaysShort: true,
                })
            }
        });
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
                                    {this.state.solicitations.map((solicitation, index) =>
                                        <tr key={index}>
                                            <td>{ solicitation.slug }</td>
                                            <td><Link to={ `/donations/donation/${solicitation.donation.slug}/` }><img className="responsive-img circle" style={{ width: '20px', height: '20px' }} src={solicitation.donation.main_photo} /> { solicitation.donation.slug }</Link></td>
                                            <td><Link to={ `/accounts/profile/${solicitation.donator_donation_pk}/` }><img className="responsive-img circle" style={{ width: '20px', height: '20px' }} src={solicitation.donator_donation_photo} /> { solicitation.donation.donator }</Link></td>
                                            <td>{ moment(solicitation.donation.validity).format("DD/MM/YYYY") } até às { solicitation.donation.validity_hour }</td>
                                            <td>{ moment(solicitation.validity).format("DD/MM/YYYY") } até às { solicitation.validity_hour }</td>
                                            <td>{ solicitation.status }</td>
                                            <td>
                                                <a href="#" className="dropdown-button btn waves-effect waves-light indigo accent-2 white-text" data-activates={ `dropdown-details-solicitation-${solicitation.id}` } data-constrainwidth="false" tittle="Detalhes da Solicitação">
                                                    <i className="material-icons">arrow_drop_down</i>
                                                </a>
                                                <ul id={ `dropdown-details-solicitation-${solicitation.id}` } className="dropdown-content">
                                                    <li><a href="#"><i className="material-icons">zoom_in</i> Ver detalhes da Solicitação</a></li>
                                                    { this.renderEdit(solicitation.status, solicitation.id) }
                                                    <li><a href={`#modal-delete-${solicitation.id}`} className="modal-trigger"><i className="material-icons">delete</i> Deletar Solicitação</a></li>
                                                </ul>
                                                <div id={`modal-delete-${solicitation.id}`} className="modal">
                                                    <div className="modal-content">
                                                        <div className="row">
                                                            <div className="col s12">
                                                                <h5 className="red-text">Tem certeza que deseja excluir a Solicitação { solicitation.slug }?</h5>
                                                                <br/>
                                                                <div className="card red darken-2">
                                                                    <div className="card-content white-text">
                                                                        <p>Ao confirmar o desejo de excluir a Solicitação {solicitation.slug}, você se declara ciente que ela não mais existirá e não pode ser recuperada.</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <div className="row">
                                                            <div className="col s12">
                                                                <a href="#!" className="modal-action modal-close waves-effect waves-light btn-flat ">Fechar</a>
                                                                <button className="btn btn-large waves-effect waves-light red darken-2 white-text" onClick={this.deleteSolicitation.bind(this, solicitation.id)}><i className="material-icons">delete</i> Eu quero excluir!</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div id={`modal-edit-${solicitation.id}`} className="modal">
                                                    <div className="modal-content">
                                                        <form id={`solicitation-edit-form-${solicitation.id}`}>
                                                            <div className="row">
                                                                <h5>Edição de dados da Solicitação { solicitation.slug }?</h5>                                                        
                                                                <div className="input-field col s12">
                                                                    <input id="validity" name="validity" type="text" className="datepicker input-active" defaultValue={ moment(solicitation.donation.validity).format("DD/MM/YYYY") } />
                                                                    <label htmlFor="validity">Sua solicitação vale até o dia</label>
                                                                    <span className="error-message red-text"></span>                          
                                                                </div>
                                                                <div className="input-field col s12">
                                                                    <input id="validity_hour" name="validity_hour" type="text" className="timepicker input-active" defaultValue={ solicitation.validity_hour } />
                                                                    <label htmlFor="validity_hour">Sua solicitação vale até às</label>
                                                                    <span className="error-message red-text"></span>
                                                                </div>
                                                                <input type="hidden" name="donation" defaultValue={ solicitation.donation.pk } />
                                                            </div>
                                                            <br/><br/>
                                                        </form>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <div className="row">
                                                            <div className="col s12">
                                                                <a href="#!" className="modal-action modal-close waves-effect waves-light btn-flat ">Fechar</a>
                                                                <button className="btn btn-large waves-effect waves-light indigo accent-2 white-text" onClick={this.editSolicitation.bind(this, solicitation.id)}><i className="material-icons">edit</i> Eu quero editar essas informações</button>
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