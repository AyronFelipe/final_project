import React from 'react';

export default class Address extends React.Component{

    render(){
        return(
            <React.Fragment>
                <div className="row">
                    <div className="col-sm-12 col-md-3">
                        <div className="form-group">
                            <label htmlFor="cep">CEP</label>
                            <input type="text" name="cep" id="cep" className="form-control" />
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-5">
                        <div className="form-group">
                            <label htmlFor="street">Logradouro</label>
                            <input type="text" name="street" id="street" className="form-control" />
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-4">
                        <div className="form-group">
                            <label htmlFor="neighborhood">Bairro</label>
                            <input type="text" name="neighborhood" id="neighborhood" className="form-control" />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 col-md-4">
                        <div className="form-group">
                            <label htmlFor="city">Cidade</label>
                            <input type="text" name="city" id="city" className="form-control" />
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-4">
                        <div className="form-group">
                            <label htmlFor="uf">UF</label>
                            <input type="text" name="uf" id="uf" className="form-control" />
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-4">
                        <div className="form-group">
                            <label htmlFor="number">Número</label>
                            <input type="text" name="number" id="number" className="form-control" />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}