import React from 'react'
import { Link, Redirect, Switch, Route } from 'react-router-dom'
import Preloader from './preloader'
import * as moment from 'moment';

export default class Demands extends React.Component{

    constructor(props){
        super(props);
        this.ownerHandler = this.ownerHandler.bind(this);
        this.handleClickModal = this.handleClickModal.bind(this);
        this.state = { demands: [] }
    }

    componentDidMount(){
        $.ajax({
            'url': '/api/demands/',
            'type': 'GET',
            'dataType': 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(data){
                if(data.length == 0){
                    const collection = 
                    `<div className="row">
                        <div className="col s12 center-align">
                            <div className="valign-wrapper row">
                                <div className="col card hoverable s10 pull-s1 m6 pull-m3 l4 pull-l4 deep-purple white-text">
                                    <div className="card-content">
                                        <div className="white-text center-align card-title">
                                            <h3>Nenhum pedido encontrado</h3>
                                        </div>
                                    </div>
                                    <p>
                                        Nenhuma pedido válido foi encontrado em nossa base de dados. Clique no botão de adicionar abaixo para cadastrar uma pedido.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    $('#card-demands-section').html(collection);
                } else {
                    this.setState({'demands': data})
                }
            }.bind(this)
        });
        $('ul.tabs').tabs();
    }

    ownerHandler(owner){
        let collection = ''
        if (owner.child.cpf) {
            collection =
            <div>
                <p><strong>Nome: </strong>{owner.child.first_name} {owner.child.last_name}</p>
                <p><strong>E-mail: </strong>{owner.email}</p>
                <p><strong>Telefone: </strong>{owner.phone}</p>
                <p><strong>Celular: </strong>{owner.cell_phone}</p>
            </div>
        } else {
            collection = ''
        }
        return collection;
    }

    handleClickModal(modal) {
        $('.modal').modal();
        $(`#${modal}`).modal('open');
    }

    render(){
        if (this.state.demands.length > 0) {
            $('ul.tabs').tabs();
            return(
                <div id="card-demands-section">
                    { this.state.demands.map((demand) =>
                        <div className="row" key={ demand.pk }>
                            <div className="col l8 push-l2 m10 push-m1 s12">
                                <div className="card hoverable">
                                    <div className="card-image">
                                        <img className="responsive-img" src={ demand.main_photo } alt="main_photo"/>
                                        <button className="btn-floating halfway-fab waves-effect waves-light indigo accent-2"><i className="material-icons">menu</i></button>
                                    </div>
                                    <div className="card-content">
                                        <span className="card-title">{ demand.name }</span>
                                        <p>{ demand.description }</p>
                                        <br/>
                                        <div className="divider"></div>
                                        <br />
                                        <div className="row">
                                            <div className="col m6 s12">
                                                <div className="card deep-purple white-text">
                                                    <div className="card-content white-text">
                                                        <br/>
                                                        <span className="card-title">Local de Entrega</span>
                                                        <div className="divider"></div>
                                                        <br />
                                                        <p><strong>Logradouro: </strong>{ demand.owner.street }, { demand.owner.number }</p>
                                                        <p><strong>Bairro: </strong>{demand.owner.neighborhood }</p>
                                                        <p><strong>CEP: </strong>{ demand.owner.cep }</p>
                                                        <p><strong>Cidade: </strong>{ demand.owner.city } - { demand.owner.uf }</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col m6 s12">
                                                <div className="card deep-purple white-text">
                                                    <div className="card-content white-text">
                                                        <div className="row" style={{ marginBottom: '0px' }}>
                                                            <div className="col s6 left-align" style={{ paddingLeft: '0px' }}>
                                                                <br/>
                                                                <span className="card-title">{demand.identifier}</span>
                                                            </div>
                                                            <div className="col s6 right-align" style={{ paddingRight: '0px' }}>
                                                                <img className="responsive-img circle" src={ demand.owner.photo } style={{ width: '50px', height: '50px' }}/>
                                                            </div>
                                                        </div>
                                                        <div className="divider"></div>
                                                        <br />
                                                        { this.ownerHandler(demand.owner) }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-action">
                                        <div className="row">
                                            <div className="col s12">
                                                <div className="right-align">
                                                    <button onClick={() => { this.handleClickModal(`modal-intention-${demand.pk}`) }} data-target={`modal-intention-${demand.pk}`} className="right-align btn modal-trigger waves-effect waves-light waves-light indigo accent-2 white-text">Atender Pedido</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id={`modal-intention-${demand.pk}`} className="modal teal-text">
                                <div className="modal-content">
                                    <div className="row">
                                        <h4>OI</h4>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <a href="#!" className="modal-action modal-close waves-effect waves-green btn-flat">Fechar</a>
                                </div>
                            </div>
                        </div>
                    ) }
                </div>
            )
        }
		return(
			<div id="card-demands-section">
                <div className="row">
                    <div className="col s12 center-align">
                        <br /><br /><br />
                        <Preloader />
                    </div>
                </div>
            </div>
		)
	}	
}