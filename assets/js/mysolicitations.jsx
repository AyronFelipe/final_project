import React from 'react'
import { Link } from 'react-router-dom'
import * as moment from 'moment';
import 'moment/locale/pt-br';

export default class MySolicitations extends React.Component{

    constructor(props){
        super(props);
        this.state = { solicitations: [] }
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

    render(){
        if (this.state.solicitations == undefined) {
            return(
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
            )
        }
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
                            <table className="centered">
                                <thead>
                                    <tr>
                                        <th>Solicitação</th>
                                        <th>Doação</th>
                                        <th>Dono da Doação</th>
                                        <th>Validade da Doação</th>
                                        <th>Status da Solicitação</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.solicitations.map(function(solicitation){
                                        return(
                                            <tr key={ solicitation.id }>
                                                <td>{ solicitation.slug }</td>
                                                <td><Link to={ `/donations/donation/${solicitation.donation.slug}/` }><img className="responsive-img circle" style={{ width: '20px', height: '20px' }} src={solicitation.donation.main_photo} /> { solicitation.donation.slug }</Link></td>
                                                <td>{ solicitation.donation.donator }</td>
                                                <td>{ moment(solicitation.validity).format("DD/MM/YYYY") } até às { solicitation.validity_hour }</td>
                                                <td>{ solicitation.status }</td>
                                                <td>Em Implementação</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}