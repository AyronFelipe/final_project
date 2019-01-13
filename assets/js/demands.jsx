import React from 'react'
import { Link, Redirect, Switch, Route } from 'react-router-dom'
import Preloader from './preloader'
import * as moment from 'moment';

export default class Demands extends React.Component{

    constructor(props){
        super(props);
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
                    `<div class="row">
                        <div class="col s12 center-align">
                            <div class="valign-wrapper row">
                                <div class="col card hoverable s10 pull-s1 m6 pull-m3 l4 pull-l4 deep-purple white-text">
                                    <div class="card-content">
                                        <div class="white-text center-align card-title">
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
	
	render(){
        if (this.state.demands.length > 0) {
            return(
                <div id="card-demands-section">
                    { this.state.demands.map((demand) =>
                        <div className="row" key={ demand.pk }>
                            <div className="col s10 push-s1 purple-text">
                                <div className="card horizontal">
                                    <div className="card-image">
                                        <img src={ demand.main_photo } alt="main_photo"/>
                                    </div>
                                    <div className="card-stacked">
                                        <span class="card-title">{ demand.name }</span>
                                        <div className="card-content">
                                            <p>{ demand.description }</p>
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