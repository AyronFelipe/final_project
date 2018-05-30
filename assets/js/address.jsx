import React from 'react'
import Inputmask from 'inputmask'

export default class Address extends React.Component{

    constructor(props){
        super(props);
        this.clearForm = this.clearForm.bind(this);
    }

    clearForm(){
        $("#uf").val("");
        $("#city").val("");
        $("#neighborhood").val();
        $("#street").val("");
    }

    componentDidMount(){

        Inputmask("99999-999", { showMaskOnHover: false }).mask($("#cep"));

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
                            this.clearForm();
                            alert("CEP não encontrado.");
                        }
                    });
                }else{
                    this.clearForm();
                    alert("CEP não encontrado.")
                }
            }else{
                this.clearForm();
                alert("CEP não encontrado.") 
            }
        });
    }

    render(){
        return(
            <div>
                <h5>{ this.props.legend }</h5>
                <div className="row">
                    <div className="input-field col s6">
                        <input type="text" name="cep" id="cep"/>
                        <label htmlFor="cep">CEP</label>
                        <span className="error-message red-text"></span>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s6">
                        <input type="text" name="uf" id="uf" placeholder="UF" readOnly/>
                        <label htmlFor="uf">UF</label>
                        <span className="error-message red-text"></span>
                    </div>
                    <div className="input-field col s6">
                        <input type="text" name="city" id="city" placeholder="Cidade" readOnly/>
                        <label htmlFor="city">Cidade</label>
                        <span className="error-message red-text"></span>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s3">
                        <input id="neighborhood" name="neighborhood" type="text" placeholder="Bairro" readOnly/>
                        <label htmlFor="neighborhood">Bairro</label>
                        <span className="error-message red-text"></span>
                    </div>
                    <div className="input-field col s3">
                        <input id="street" name="street" type="text" placeholder="Rua" readOnly/>
                        <label htmlFor="street">Logradouro</label>
                        <span className="error-message red-text"></span>
                    </div>
                    <div className="input-field col s3">
                        <input id="number" name="number" type="text" />
                        <label htmlFor="number">Número</label>
                        <span className="error-message red-text"></span>
                    </div>
                    <div className="input-field col s3">
                        <input id="complement" name="complement" type="text" />
                        <label htmlFor="complement">Complemento</label>
                        <span className="error-message red-text"></span>
                    </div>
                </div>
            </div>
        )
    }
}