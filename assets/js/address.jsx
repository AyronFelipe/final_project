import React from 'react'
import Inputmask from 'inputmask'
import 'materialize-css'
import 'materialize-css/dist/css/materialize.min.css'

export default class Address extends React.Component{

    componentDidMount(){

        Inputmask("99999-999", { showMaskOnHover: false }).mask($("#cep"));

        $("#uf").focus();
        $("#city").focus();
        $("#neighborhood").focus();
        $("#street").focus();

        $("#cep").blur(function(){
            let cep = $(this).val().replace(/\D/g, '');
            if(cep != ""){
                let validacep = /^[0-9]{8}$/;
                if(validacep.test(cep)){
                    $("#uf").val("...");
                    $("#city").val("...");
                    $("#neighborhood").val("...");
                    $("#street").val("...");

                    $.getJSON("https://viacep.com.br/ws/"+ cep +"/json/?callback=?", function(data){
                        if(!("erro" in data)){
                            $("#uf").val(data.uf);
                            $("#city").val(data.localidade);
                            $("#neighborhood").val(data.bairro);
                            $("#street").val(data.logradouro);
                        }else{
                            $("#uf").val("");
                            $("#city").val("");
                            $("#neighborhood").val("");
                            $("#street").val("");
                            alert("CEP não encontrado.");
                        }
                    });
                }else{
                    $("#uf").val("");
                    $("#city").val("");
                    $("#neighborhood").val("");
                    $("#street").val("");
                    alert("CEP não encontrado.")
                }
            }else{
                $("#uf").val("");
                $("#city").val("");
                $("#neighborhood").val("");
                $("#street").val("");
                alert("CEP não encontrado.") 
            }
        });
    }

    render(){
        return(
            <div>
                <h5>{ this.props.legend }</h5>
                <div className="row">
                    <div className="input-field col m6 s12">
                        <input type="text" name="cep" id="cep"/>
                        <label htmlFor="cep">CEP <span className="red-text">*</span></label>
                        <span className="cep-error-message red-text error"></span>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col m6 s12">
                        <input type="text" name="uf" id="uf" className="active" placeholder="UF" readOnly/>
                        <label htmlFor="uf">UF</label>
                        <span className="uf-error-message red-text error"></span>
                    </div>
                    <div className="input-field col m6 s12">
                        <input type="text" name="city" id="city" className="active" placeholder="Cidade" readOnly/>
                        <label htmlFor="city">Cidade</label>
                        <span className="city-error-message red-text error"></span>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col m3 s12">
                        <input id="neighborhood" name="neighborhood" type="text" className="active" placeholder="Bairro" readOnly/>
                        <label htmlFor="neighborhood">Bairro</label>
                        <span className="neighborhood-error-message red-text error"></span>
                    </div>
                    <div className="input-field col m3 s12">
                        <input id="street" name="street" type="text" className="active" placeholder="Rua" readOnly/>
                        <label htmlFor="street">Logradouro</label>
                        <span className="street-error-message red-text error"></span>
                    </div>
                    <div className="input-field col m3 s12">
                        <input id="number" name="number" type="text" />
                        <label htmlFor="number">Número</label>
                        <span className="number-error-message red-text error"></span>
                    </div>
                    <div className="input-field col m3 s12">
                        <input id="complement" name="complement" type="text" />
                        <label htmlFor="complement">Complemento</label>
                        <span className="complement-error-message red-text error"></span>
                    </div>
                </div>
            </div>
        )
    }
}