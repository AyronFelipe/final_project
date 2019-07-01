import React from 'react';
import { Link } from 'react-router-dom';
import { readURL, formatDate } from './utils';
import '../template/js/plugin/datepicker/bootstrap-datetimepicker.min.js';
import '../template/js/plugin/dropzone/dropzone.min.js';
import Inputmask from 'inputmask';
import axios from 'axios';
import Dropzone from './dropzone';
import NewTag from './new_tag';

const CEP_LENGTH = 9;

export default class NewDonation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
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
        }
        this.cep = React.createRef();
        this.street = React.createRef();
        this.neighborhood = React.createRef();
        this.city = React.createRef();
        this.uf = React.createRef();
    }

    changePhoto = (e) => {
        readURL(e.target);
    }

    handleFile = (e) => {
        let main_photo = e.target.files[0];
        this.setState({ [e.target.name]: main_photo });
    }

    changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = (e) => {
        e.preventDefault();

        let form = new FormData();
        form.append('name', this.state.name);
        form.append('description', this.state.description);
        this.state.tags.map((tag) => {
            form.append('tags', tag)
        });
        form.append('validity', formatDate(this.state.validity));
        form.append('validity_hour', this.state.validity_hour);
        form.append('neighborhood', this.state.neighborhood);
        form.append('street', this.state.street);
        form.append('number', this.state.number);
        form.append('cep', this.state.cep);
        form.append('uf', this.state.uf);
        form.append('city', this.state.city);
        form.append('complement', this.state.complement);
        form.append('main_photo', this.state.main_photo);
        this.state.photos.map((photo) => {
            form.append('photos', photo);
        })

        let config = {
            headers: {
                'Authorization': `Token ${localStorage.token}`
            }
        };

        axios.post(`/api/new-donation/`, form, config)
        .then((response) => {
            swal("Doação cadastrada com sucesso!", {
                icon: "success",
                buttons: {
                    confirm: {
                        className: 'btn btn-success'
                    }
                },
            }).then(() => {
                window.location.href = "/donations/";
            });
        })
        .catch((error) => {
            console.log(error.response);
        })
    }

    componentDidMount = () => {

        let today = new Date();

        $('#validity').datetimepicker({
            format: 'DD/MM/YYYY',
            minDate: today,
            locale: 'pt-br',
        });

        $('#validity_hour').datetimepicker({
            format: 'HH:mm',
            locale: 'pt-br',
        });

        $('.bootstrap-tagsinput').addClass('form-control');
    }

    loadMask = (e) => {
        if (e.target.value.length == 8) {
            Inputmask("99999-999", { showMaskOnHover: false }).mask($("#cep"));
        }
    }

    loadCepInfo = (e) => {
        if (e.target.value.length == CEP_LENGTH) {
            axios.get(`https://viacep.com.br/ws/${e.target.value}/json/`)
                .then((res) => {
                    if (res.data.erro) {
                        swal("Erro!", "CEP não encontrado", {
                            icon: "error",
                            buttons: {
                                confirm: {
                                    className: 'btn btn-danger'
                                }
                            },
                        });
                    } else {
                        this.street.current.value = res.data.logradouro;
                        this.neighborhood.current.value = res.data.bairro;
                        this.city.current.value = res.data.localidade;
                        this.uf.current.value = res.data.uf;
                        this.setState({
                            street: res.data.logradouro,
                            neighborhood: res.data.bairro,
                            city: res.data.localidade,
                            uf: res.data.uf
                        });
                    }
                })
        }
    }

    chageManyPhotos = () => {
        this.setState({ photos: [] });
        for (let i = 0; i < $('#dropzone-alimentai')[0].files.length; i++) {
            this.setState({ photos: [...this.state.photos, $('#dropzone-alimentai')[0].files[i]] })
        }
    }

    handleChangeTags = (tag) => {
        this.setState(({ tags: [...this.state.tags, tag.text] }));
    }

    render() {
        return (
            <div className="content">
                <div className="panel-header bg-primary">
                    <div className="page-inner py-5">
                        <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                            <div>
                                <h2 className="text-white pb-2 fw-bold page-title">Cadastro de Doações</h2>
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
                                        <Link to="/donations/new-donation">
                                            <span className="text-white">Cadastro de Doações</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-inner">
                    <div className="row">
                        <div className="col-12">
                            <form id="form-donation" onSubmit={this.handleSubmit} method="/api/new-donation/">
                                <div className="card mt-5 animated fadeIn">
                                    <div className="card-header">
                                        <h4 className="card-title">
                                            <i className="fas fa-hands-helping"></i> Cadastro de Doação
                                        </h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="d-flex justify-content-center">
                                                    <div className="input-file input-file-image">
                                                        <img className="img-upload-preview img-circle ml-5" width="100" height="100" src="https://placehold.it/100x100" alt="preview"></img>
                                                        <input type="file" className="form-control form-control-file" id="photo" name="main_photo" accept="image/*" onInput={this.changePhoto} onChange={this.handleFile}></input>
                                                        <label htmlFor="photo" className="btn btn-info btn-round btn-lg ml--5"><i className="fa fa-file-image"></i> Upload da foto principal da sua doação</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <label htmlFor="name"><span className="required-label">*</span> Nome da doação</label>
                                                    <input type="text" name="name" id="name" className="form-control" required onChange={this.changeHandler} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="description">Descrição</label>
                                                    <textarea className="form-control" id="description" rows="5" name="description" onChange={this.changeHandler}></textarea>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="tags">Tags da Doação</label>
                                                    <NewTag name="tags" id="tags" onChange={this.handleChangeTags} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12 col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="validity"><span className="required-label">*</span> Válida até o dia</label>
                                                    <div className="input-group">
                                                        <input type="text" name="validity" id="validity" className="form-control" required onBlur={this.changeHandler} />
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
                                                        <input type="text" name="validity_hour" id="validity_hour" className="form-control" required onBlur={this.changeHandler} />
                                                        <div className="input-group-append">
                                                            <span className="input-group-text">
                                                                <i className="fa fa-clock"></i>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12 col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="cep"><span className="required-label">*</span> CEP</label>
                                                    <input type="text" name="cep" id="cep" className="form-control" onBlur={this.loadCepInfo} onInput={this.loadMask} onChange={this.changeHandler} required />
                                                </div>
                                            </div>
                                            <div className="col-sm-12 col-md-5">
                                                <div className="form-group">
                                                    <label htmlFor="street">Logradouro</label>
                                                    <input type="text" readOnly name="street" ref={this.street} id="street" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-sm-12 col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="neighborhood">Bairro</label>
                                                    <input type="text" readOnly name="neighborhood" ref={this.neighborhood} id="neighborhood" className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12 col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="city">Cidade</label>
                                                    <input type="text" readOnly name="city" ref={this.city} id="city" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-sm-12 col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="uf">UF</label>
                                                    <input type="text" readOnly name="uf" ref={this.uf} id="uf" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-sm-12 col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="number">Número</label>
                                                    <input type="text" name="number" id="number" className="form-control" onChange={this.changeHandler} />
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
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}