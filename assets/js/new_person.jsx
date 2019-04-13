import React from 'react';
import Address from './address';


export default class NewPerson extends React.Component {

    handleSubmit = (e) => {
        e.preventDefault();
    }

    render(){
        return(
            <div className="signup bg-primary">
                <div className="wrapper-login">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <form id="form-pessoa-fisica" onSubmit={this.handleSubmit}>
                                    <div className="card mt-5 animated fadeIn">
                                        <div className="card-header">
                                            <h4 className="card-title">
                                                <i className="icon-user mr-1"></i> Cadastre-se no Alimentaí como Pessoa Física
                                            </h4>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="d-flex justify-content-center">
                                                        <div className="input-file input-file-image">
                                                            <img className="img-upload-preview img-circle ml-5" width="100" height="100" src="https://placehold.it/100x100" alt="preview"></img>
                                                            <input type="file" className="form-control form-control-file" id="photo" name="photo" accept="image/*" required ></input>
                                                            <label htmlFor="photo" className="btn btn-info btn-round btn-lg"><i className="fa fa-file-image"></i> Upload da sua foto</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-12 col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="email">E-mail</label>
                                                        <input type="email" name="email" id="email" className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="password">Senha</label>
                                                        <input type="password" name="password" className="form-control" id="password" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-12 col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="">Primeiro Nome</label>
                                                        <input type="text" className="form-control" name="first_name" id="first_name" />
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="last_name">Sobrenome</label>
                                                        <input type="text"className="form-control" name="last_name" id="last_name" />
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="cpf">CPF</label>
                                                        <input type="text"className="form-control" name="cpf" id="cpf" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-12 col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="birthday">Data de Nascimento</label>
                                                        <input type="date" name="birthday" id="birthday" className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="phone">Telefone</label>
                                                        <input type="text" name="phone" id="phone" className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="col-sm-12 col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="cell_phone">Celular</label>
                                                        <input type="text" name="cell_phone" id="cell_phone" className="form-control" />
                                                    </div>
                                                </div>
                                            </div>
                                            <Address />
                                            <div className="row mt-2">
                                                <div className="col-sm-12 col-md-3 offset-md-9">
                                                    <button type="submit" className="btn btn-info btn-round btn-lg btn-block">
                                                        <i className="fas fa-save mr-1"></i> Salvar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}