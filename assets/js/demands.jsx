import React from 'react'
import { Link, Redirect, Switch, Route } from 'react-router-dom'
import Preloader from './preloader'
import * as moment from 'moment';

export default class Demands extends React.Component{

    constructor(props){
        super(props);
        this.ownerHandler = this.ownerHandler.bind(this);
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
        })
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

    render(){
        if (this.state.demands.length > 0) {
            return(
                <div id="card-demands-section">
                    { this.state.demands.map((demand) =>
                        <div className="row" key={ demand.pk }>
                            <div className="col s10 push-s1 purple-text">
                                <div className="card horizontal">
                                    <div className="card-image">
                                        <img className="responsive-img" src={ demand.main_photo } alt="main_photo" style={{ height: '100%' }}/>
                                    </div>
                                    <div className="card-stacked">
                                        <div className="card-content">
                                            <div className="row">
                                                <div className="col m6 s12 left-align" style={{ marginTop: '10px' }}>
                                                    <h4>{ demand.name }</h4>
                                                </div>
                                                <div className="col m6 s12 right-align">
                                                    <img className="responsive-img circle" style={{ width: '50px', height: '50px' }} src={ demand.owner.photo } />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col m6 s12">
                                                    <div className="card deep-purple white-text">
                                                        <div className="card-content white-text">
                                                            <span className="card-title">Local de Entrega</span>
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
                                                            <span className="card-title">{demand.identifier}</span>
                                                            { this.ownerHandler(demand.owner) }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col s12 left-align">
                                                    <p>{ demand.description }</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-action"></div>
                                    </div>
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
                    <div className="col s12">
                        <br /><br /><br />
                        <Preloader />
                    </div>
                </div>
            </div>
		)
	}	
}