import React from 'react'
import { Link, Redirect, Switch, Route } from 'react-router-dom'
import Preloader from './preloader'
import * as moment from 'moment';

export default class Demands extends React.Component{

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
            	}
            }
		})
	}
	
	render(){
		return(
			<div id="card-demands-section">
            	<h1>OLÁ</h1>
            </div>
		)
	}	
}