import React from 'react';
import { Link } from 'react-router-dom';

export default class Main extends React.Component{

    render(){
        return(
            <div className="main-panel bg-primary">
                <div className="position-relative overflow-hidden text-center animated fadeIn">
                    <h1 className="pt-5 display-3 text-white">Quer começar a ajudar?</h1>
                    <h3 className="text-white pt-3">
                        Cadastre-se clicando nos botões abaixo de acordo com o tipo de pessoa
                    </h3>
                    <div className="d-flex flex-md-row flex-sm-column flex-column justify-content-md-center pt-3">
                        <Link to="/accounts/new-person/">
                            <button className="mx-3 my-3 btn btn-info btn-lg btn-round">Pessoa Física</button>
                        </Link>
                        <Link to="accounts/new-institution/">
                            <button className="mx-3 my-3 btn btn-info btn-lg btn-round">Pessoa Jurídica</button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}