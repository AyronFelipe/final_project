import React from 'react'
import { Link } from 'react-router-dom'
import 'dropify'
import 'dropify/dist/css/dropify.min.css'

export default class Demand extends React.Component{

	constructor(props){
        super(props);
        this.state = { unit_measurements: [], unit_measurement_default_value: '' }
        this.saveDemand = this.saveDemand.bind(this);
        this.handleUnitMeasurementChange = this.handleUnitMeasurementChange.bind(this);
    }

    handleUnitMeasurementChange(event){
        this.setState({value: event.target.value});
    }

    componentDidMount(){
        //GET unit_measurement
        $.ajax({
            url: '/api/unit-measurements/',
            dataType: 'json',
            type: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(data) {
                this.setState({unit_measurements: data});
            }.bind(this),
            error: function (request, status, err) {
                console.log(request, status, err);
            }
        });

        $('#unit_measurement').material_select();

        $('.dropify').dropify({
            messages: {
                'default': 'Arraste um arquivo aqui ou clique.',
                'replace': 'Arraste um arquivo ou clique para substituir.',
                'remove': 'Remover',
                'error': 'Ooops, algo de errado aconteceu.'
            },
            tpl: {
                message: '<div class="dropify-message"><span class="file-icon" /> <p class="center-align">{{ default }}</p></div>',
            }
        });
    }

    saveDemand(){
        $("#demand-form").find("input, textarea").each(function () {
            $(this).siblings('span.error').html('');
        });
        $.gritter.add({
            title: 'Aguarde!',
            text: 'Enviando dados...',
            sticky: true,
            class_name: 'black white-text',
        });
        let form = new FormData($("#demand-form").get(0));
        $.ajax({
            url: '/api/demands/',
            type: 'POST',
            dataType: 'json',
            data: form,
            cache: false,
            processData: false,
            contentType: false,
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function (data) {
                window.location.href = '/donations/';
            },
            error: function (request, status, err) {
                if (request.status == 401) {
                    window.scrollTo(0, 0);
                    if (request.responseJSON.message_error_name) {
                        $('.name-error-message').html(request.responseJSON.message_error_name);
                    }
                    if (request.responseJSON.message_error_quantity) {
                        $('.quantity-error-message').html(request.responseJSON.message_error_quantity);
                    }
                    if (request.responseJSON.message_error_unit_measurement) {
                        $('.unit_measurement-error-message').html(request.responseJSON.message_error_unit_measurement);
                    }
                } else if (err == 'Internal Server Error') {
                    $('#modal-erro').modal('open');
                }
            }
        }).always(function () {
            $.gritter.removeAll();
        });
    }

    render(){


        return(
            <div>
                <nav className="nav-extended deep-purple darken-2 white-text">
                    <div className="row">
                        <div className="col s12">
                            <div className="col s10 push-s1">
                                <div className="nav-content">
                                    <span className="nav-title">Novo Pedido</span>
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
                <div className="row purple-text">
                    <div className="col s12">
                        <div className="col s10 push-s1">
                            <h4 className="center-align">Cadastre as informações abaixo do seu pedido</h4>
                        </div>
                        <div className="container">
                            <form id="demand-form" encType="multipart/form-data">
                                <div className="row">
                                    <div className="input-field col m6 s12">
                                        <input id="name" name="name" type="text" className="validate" />
                                        <label htmlFor="name">Nome <span className="red-text">*</span></label>
                                        <span className="name-error-message red-text error"></span>
                                    </div>
                                    <div className="input-field col m3 s12">
                                        <input id="quantity" name="quantity" type="number" className="datepicker" />
                                        <label htmlFor="quantity">Quantidade <span className="red-text">*</span></label>
                                        <span className="quantity-error-message red-text error"></span>
                                    </div>
                                    <div className="input-field col m3 s12">
                                        <select name="unit_measurement" id="unit_measurement" value={this.state.unit_measurement_default_value} onChange={this.handleUnitMeasurementChange}>
                                            <option value="" disabled>Escolha sua opção</option>
                                            <option value="2">Gramas</option>
                                            <option value="3">Toneladas</option>
                                            <option value="1">Quilos</option>
                                        </select>
                                        <label htmlFor="unit_measurement">Unidade de Medida <span className="red-text">*</span></label>
                                        <span className="unit_measurement-error-message red-text error"></span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field col s12">
                                        <textarea id="description" name="description" className="materialize-textarea"></textarea>
                                        <label htmlFor="description">Uma descrição de seu pedido (não seja breve)</label>
                                        <span className="description-error-message red-text error"></span>
                                    </div>
                                </div>
                                <div className="row">
                                    <h5>Coloque a foto principal de seu pedido</h5>
                                    <input id="photo" name="main_photo" type="file" className="dropify" />
                                    <span className="main_photo-error-message red-text error"></span>
                                </div>
                                <div className="row">
                                    <div className="col s12 right-align">
                                        <button type="button" className="btn-large waves-effect waves-light indigo accent-2 white-text" onClick={this.saveDemand}>Salvar</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
    	)
    }
}