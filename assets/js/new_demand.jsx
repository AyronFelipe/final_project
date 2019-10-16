import React from 'react';
import { Link } from 'react-router-dom';
import { readURL } from './utils';
import axios from 'axios';
import NewTag from './new_tag';


const config = {
    headers: {
        'Authorization': `Token ${localStorage.token}`
    }
};

export default class NewDemand extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            unities: [],
            main_photo: '',
            name: '',
            description: '',
            quantity: '',
            unit_measurement: '',
            cep: '',
            street: '',
            neighborhood: '',
            city: '',
            uf: '',
            number: '',
            aparecer: false,
        };
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

    getUnities = () => {
        axios.get(`/api/unit-measurements/`, config)
        .then((res) => {
            this.setState({ unities: res.data });
        })
        .catch((error) => {
            console.log(error);
        });
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

    handleClick = () => {
        let aparecer = $('.form-check-input').is(':checked');
        this.setState({ aparecer: aparecer });
    }

    componentDidMount = () => {
        this.getUnities();
    }

    handleSubmit = (e) => {

        e.preventDefault();

        let form = new FormData();

        form.append('main_photo', this.state.main_photo);
        form.append('name', this.state.name);
        form.append('description', this.state.description);
        form.append('quantity', this.state.quantity);
        form.append('unit_measurement', this.state.unit_measurement);
        let aparecer = $('.form-check-input').is(':checked')
        if (aparecer == true) {
            form.append('aparecer', aparecer);
            form.append('cep', this.state.cep);
            form.append('street', this.state.street);
            form.append('neighborhood', this.state.neighborhood);
            form.append('city', this.state.city);
            form.append('uf', this.state.uf);
            form.append('number', this.state.number);
        }
        this.state.tags.map((tag) => {
            form.append('tags', tag)
        });

        axios.post(`/api/demands/`, form, config)
        .then((response) => {
            swal("Pedido cadastrado com sucesso!", {
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

    render() {
        return (
            <div className="content">
                <div className="panel-header bg-primary">
                    <div className="page-inner py-5">
                        <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                            <div>
                                <h2 className="text-white pb-2 fw-bold page-title">Cadastro de Pedidos</h2>
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
                                        <Link to="/donations/new-donation/">
                                            <span className="text-white">Cadastro de Pedidos</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-inner">
                    <div className="row justify-content-center">
                        <div className="col-12">
                            <form id="form-demand" onSubmit={this.handleSubmit}>
                                <div className="card mt-5 animated fadeIn">
                                    <div className="card-header">
                                        <div className="card-title">
                                            Cadastro de Pedidos
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="d-flex justify-content-center">
                                                    <div className="input-file input-file-image">
                                                        <img className="img-upload-preview img-circle ml-5" width="100" height="100" src="https://placehold.it/100x100" alt="preview"></img>
                                                        <input type="file" className="form-control form-control-file" id="photo" name="main_photo" accept="image/*" onInput={this.changePhoto} onChange={this.handleFile}></input>
                                                        <label htmlFor="photo" className="btn btn-info btn-round btn-lg ml--5"><i className="fa fa-file-image"></i> Upload da foto principal do seu pedido</label>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="name"><span className="required-label">*</span> Nome do pedido</label>
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
                                            <div className="col-12 col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="quantity"><span className="required-label">*</span> Quantidade</label>
                                                    <input type="number" name="quantity" id="quantity" className="form-control" onChange={this.changeHandler} required />
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6">
                                                <div className="form-group">
                                                    <label htmlFor="unit_measurement"><span className="required-label">*</span> Unidade de medida</label>
                                                    <select name="unit_measurement" id="unit_measurement" className="form-control" onChange={this.changeHandler}>
                                                        { this.state.unities == undefined ?
                                                            <div className="loader loader-lg"></div>
                                                            :
                                                            <React.Fragment>
                                                                <option value="">----------</option>
                                                                { this.state.unities.map((unit) => {
                                                                    return(
                                                                        <option value={ unit.pk } key={ unit.pk }>{ unit.name }</option>
                                                                    )
                                                                }) }
                                                            </React.Fragment>
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <div className="alert alert-info">
                                                        <strong>Atenção!</strong> O local de entrega dos pedidos é definido automaticamente como o local informado no momento do cadastro de usuário.
                                                        Porém, se você desejar pode Informar um local diferente para a entrega é só selecionar a opção abaixo.
                                                        <div className="form-check">
                                                            <label className="form-check-label">
                                                                <input className="form-check-input" type="checkbox" onClick={this.handleClick} />
                                                                <span className="form-check-sign">Informar um local diferente</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        { this.state.aparecer ?
                                            <div className="row address">
                                                <div className="col-12">
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
                                                </div>
                                            </div>
                                            :
                                            null
                                        }
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
        )
    }
}