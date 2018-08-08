import React from 'react'
import { Link } from 'react-router-dom'
import * as moment from 'moment';
import 'moment/locale/pt-br';

export default class MyDonations extends React.Component{

    constructor(props){
        super(props);
        this.state = { donations: [], solicitations_of_donation: [] }
    }

    loadSolicitations(id){
        $.ajax({
            url: '/api/donation/'+id+'/solicitations/',
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

    componentDidMount(){
        $.ajax({
            url: '/api/my-donations/',
            type: 'GET',
            dataType: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(data){
                this.setState({ donations: data })
            }.bind(this),
            error: function(request, status, err){
                console.log(request, status, err);
            }
        });
    }

    render(){
        if (this.state.donations == undefined) {
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
                    <br/><br/><br/>
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
                </div>
            )
        }
        $('.dropdown-button').dropdown({
            alignment: 'right'
        });
        $('.modal').modal();
        $('.collapsible').collapsible();
        //console.log(this.state.donations)
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
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.donations.map((donation, index) =>
                                        <tr key={donation.pk}>
                                            <td><Link to={ `/donations/donation/${donation.slug}/` }><img className="responsive-img circle" style={{ width: '20px', height: '20px' }} src={donation.main_photo} /> { donation.slug }</Link></td>
                                            <td>{ moment(donation.validity).format("DD/MM/YYYY") } até às { donation.validity_hour }</td>
                                            <td>{ donation.solicitations_count }</td>
                                            <td>
                                                <a href="#" className="dropdown-button btn waves-effect waves-light indigo accent-2 white-text" data-activates={ `dropdown-details-donation-${donation.pk}` } data-constrainwidth="false" tittle="Detalhes da Doação" onClick={this.loadSolicitations.bind(this, donation.pk)}>
                                                    <i className="material-icons">arrow_drop_down</i>
                                                </a>
                                                <ul id={ `dropdown-details-donation-${donation.pk}` } className="dropdown-content">
                                                    <li><a href={`#modal-manage-solicitation-${donation.pk}`} className="modal-trigger"><i className="material-icons">settings</i> Gerenciar solicitações</a></li>
                                                    <Link to={`/donations/donation/${donation.slug}/`}><li><span><i className="material-icons">zoom_in</i> Ver detalhes da Doação</span></li></Link>
                                                    <li><a href={`#modal-delete-${donation.pk}`} className="modal-trigger"><i className="material-icons">delete</i> Deletar Doação</a></li>
                                                    <li><a href="#" className="modal-trigger"><i className="material-icons">sentiment_dissatisfied</i> Não apareceu</a></li>
                                                </ul>
                                                <div id={`modal-manage-solicitation-${donation.pk}`} className="modal purple-text">
                                                    <div className="modal-content">
                                                        <h4>Solicitações da sua Doação</h4>
                                                        <ul className="collapsible popout" data-collapsible="accordion">
                                                            {this.state.solicitations_of_donation.map((solicitation_of_donation, index) =>
                                                                <li key={index}>
                                                                    <div className="collapsible-header"><i className="material-icons">shopping_basket</i>{solicitation_of_donation.slug}</div>
                                                                    <div className="collapsible-body">
                                                                        <p>
                                                                            <strong>Solicitante: </strong>
                                                                            <Link target="_blank"
                                                                             to={ `/accounts/profile/${solicitation_of_donation.owner_pk}/` }>
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
                                                                                        Se você clicar em "rejeitar" essa doação não aparecerá mais no gereciamento de solicitações desta doação.<br/><br/>
                                                                                        Agora, se você clicar em "aceitar" essa doação passará para o estado de aceita. Você deverá preencher os campos de data e hora para que o solicitante possa ir buscar a sua doação.<br/><br/>
                                                                                        <i class="material-icons">priority_high</i> Se porventura houverem outras solicitações, ao clicar em "aceitar" as outras solicitações passarão para o estado de "Em Espera".<br/><br/>
                                                                                        <i class="material-icons">priority_high</i> Se o solicitante não aparecer até o dia e horário determinados, você possui a opção de "Não apareceu" e ao confirmar colocará essa doação novamente no estado de "Aberta" e outros usuários poderão solicitá-la novamente.<br/><br/>
                                                                                    </p>
                                                                                </div>
                                                                                <div className="card-action">
                                                                                    <button className="btn waves-effect waves-light red" type="submit" name="action">
                                                                                        <i className="material-icons right">not_interested</i> Rejeitar
                                                                                    </button>
                                                                                    &nbsp;&nbsp;&nbsp;
                                                                                    <button className="btn waves-effect waves-light green" type="submit" name="action">
                                                                                        <i className="material-icons right">done</i> Aceitar
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                    </div>
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <a href="#!" className="modal-action modal-close waves-effect waves-light btn-flat ">Fechar</a>
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