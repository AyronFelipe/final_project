import React from 'react';
import { Link } from 'react-router-dom';
import { readURL, formatDate } from './utils';
import '../template/js/plugin/datepicker/bootstrap-datetimepicker.min.js';
import '../template/js/plugin/dropzone/dropzone.min.js';
import Inputmask from 'inputmask';
import axios from 'axios';
import Dropzone from './dropzone';
import NewTag from './new_tag';

const config = {
    headers: { 'Authorization': `Token ${localStorage.token}` }
};

export default class EditDonation extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            donation: [], 
            isLoading: true, 
            name: '',
            description: '',
            validity: '',
            validity_hour: '',
            neighborhood: '',
            street: '',
            number: '',
            cep: '',
            uf: '',
            city: '',
            complement: '',
            main_photo: '',
            photos: [],
            tags: [],
        };
    }

    getDonation = () => {
        let pathname = window.location.pathname;
        let slug = pathname.split('/')[4];

        axios.get(`/api/donations/${slug.split('-')[2].split('.')[1]}/`, config)
        .then((res) => {
            this.setState({ donation: res.data, isLoading: false, tags: res.data.tags });
        })
        .catch((error) => {
            console.log(error.response);
        })
    }

    handleChangeTags = (tag) => {
        this.setState(({ tags: [...this.state.tags, tag.text] }));
    }

    componentDidMount = () => {
        this.getDonation();
    }

    render(){
        console.log(this.state.tags);
        return(
            <div className="content">
                <div className="panel-header bg-primary">
                    <div className="page-inner py-5">
                        <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                            <div>
                                <h2 className="text-white pb-2 fw-bold page-title">Editar Doação { this.state.donation.name }</h2>
                                <ul className="breadcrumbs text-white">
                                    <li className="nav-home">
                                        <Link to="/donations/">
                                            <i className="flaticon-home text-white"></i>
                                        </Link>
                                    </li>
                                    <li className="separator">
                                        <i className="flaticon-right-arrow"></i>
                                    </li>
                                    <li className="nav-item">
                                        <Link to={`/donations/my-donations/`}>
                                            <span className="text-white">Minhas doações</span>
                                        </Link>
                                    </li>
                                    <li className="separator">
                                        <i className="flaticon-right-arrow"></i>
                                    </li>
                                    <li className="nav-item">
                                        <Link to={``}>
                                            <span className="text-white">Editar Doação { this.state.donation.name }</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-inner">
                    <div className="row justify-content-center">
                        <div className="col-sm-10 col-12">
                            <div className="card">
                                <div className="card-header">
                                    <div className="card-title">Alterar Informações</div>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="d-flex justify-content-center">
                                                <div className="input-file input-file-image">
                                                    <img className="img-upload-preview img-circle ml-5" width="100" height="100" src={this.state.donation.main_photo} alt="preview"></img>
                                                    <input type="file" className="form-control form-control-file" id="photo" name="main_photo" accept="image/*" onInput={this.changePhoto} onChange={this.handleFile}></input>
                                                    <label htmlFor="photo" className="btn btn-info btn-round btn-lg ml--5"><i className="fa fa-file-image"></i> Clique aqui para mudar a foto principal da sua doação</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label htmlFor="name"><span className="required-label">*</span> Nome da doação</label>
                                                <input type="text" name="name" id="name" className="form-control" required onChange={this.changeHandler} defaultValue={this.state.donation.name} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="description">Descrição</label>
                                                <textarea className="form-control" id="description" rows="5" name="description" onChange={this.changeHandler} value={this.state.donation.description}></textarea>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="tags">Tags da Doação</label>
                                                {
                                                    this.state.tags.length > 0?
                                                    <NewTag name="tags" id="tags" onChange={this.handleChangeTags} tags={this.state.tags} />
                                                    :
                                                    <div className="loader loader-lg"></div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-12 col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="validity"><span className="required-label">*</span> Válida até o dia</label>
                                                <div className="input-group">
                                                    <input type="text" name="validity" id="validity" className="form-control" required onBlur={this.changeHandler} defaultValue={this.state.donation.validity} />
                                                    <div className="input-group-append">
                                                        <span className="input-group-text">
                                                            <i className="fa fa-calendar-check"></i>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="validity_hour"><span className="required-label">*</span> Válidade até</label>
                                                <div className="input-group">
                                                    <input type="text" name="validity_hour" id="validity_hour" className="form-control" required onBlur={this.changeHandler} defaultValue={this.state.donation.validity_hour} />
                                                    <div className="input-group-append">
                                                        <span className="input-group-text">
                                                            <i className="fa fa-clock"></i>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row address">
                                        <div className="col-sm-12 col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="cep"><span className="required-label">*</span> CEP</label>
                                                <input type="text" name="cep" id="cep" className="form-control" onBlur={this.loadCepInfo} onInput={this.loadMask} onChange={this.changeHandler} required defaultValue={this.state.donation.cep} />
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-5">
                                            <div className="form-group">
                                                <label htmlFor="street">Logradouro</label>
                                                <input type="text" readOnly name="street" ref={this.street} id="street" className="form-control" defaultValue={this.state.donation.street} />
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="neighborhood">Bairro</label>
                                                <input type="text" readOnly name="neighborhood" ref={this.neighborhood} id="neighborhood" className="form-control" defaultValue={this.state.donation.neighborhood} />
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="city">Cidade</label>
                                                <input type="text" readOnly name="city" ref={this.city} id="city" className="form-control" defaultValue={this.state.donation.city} />
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="uf">UF</label>
                                                <input type="text" readOnly name="uf" ref={this.uf} id="uf" className="form-control" defaultValue={this.state.donation.uf} />
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="number">Número</label>
                                                <input type="text" name="number" id="number" className="form-control" onChange={this.changeHandler} defaultValue={this.state.donation.number} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 well">
                                            <div className="form-group">
                                                <Dropzone onChange={this.chageManyPhotos} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-sm-12 col-md-3 offset-md-9">
                                            <button type="submit" className="btn btn-info btn-round btn-lg btn-block">
                                                <i className="fas fa-save mr-1"></i> Salvar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}