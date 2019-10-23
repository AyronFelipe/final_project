import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Carousel from './carousel';
import { unformatDate2 } from './utils';
import BeautyStars from 'beauty-stars';


const API_KEY = "AIzaSyCq-XgDdK7Ewn_BWMxXpiDVn04y_BHB4yY";

const config = {
    headers: { 'Authorization': `Token ${localStorage.token}` }
};

export default class DetailDonation extends React.Component{

    constructor(props) {
        super(props);
        this.state = { donation: [], isLoading: true, user: [], owner: [], comment: '' };
    }

    getDonation = () => {
        let pathname = window.location.pathname;
        let slug = pathname.split('/')[3];

        axios.get(`/api/donations/${slug.split('-')[2].split('.')[1]}/`, config)
        .then((res) => {
            this.setState({ donation: res.data, isLoading: false });
            this.getDonationOwner();
        })
        .catch((error) => {
            console.log(error.response);
        })
    }

    changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    getLoggedUser = () => {
        axios.get('/api/logged-user/', config)
        .then((res) => {
            this.setState({ user: res.data, isLoading: false });
        })
        .catch((error) => {
            console.log(error.response);
        });
    }

    getDonationOwner = () => {
        axios.get(`/api/users/${this.state.donation.donator_pk}/`, config)
        .then((res) => {
            this.setState({ owner: res.data });
        })
        .catch((error) => {
            console.log(error.response);
        });
    }

    handleSubmit = (e) => {

        e.preventDefault();

        let form = new FormData();
        form.append('comment', this.state.comment);
        form.append('donation', this.state.donation.pk)

        axios.post('/api/new-solicitation/', form, config)
        .then((res) => {
            $('.fechar').click();
            swal(res.data.message, {
                icon: "success",
                buttons: {
                    confirm: {
                        className: 'btn btn-success'
                    }
                },
            }).then(() => {
                window.location.href = '/donations/my-solicitations/';
            });
        })
        .catch((error) => {
            $('.fechar').click();
            swal(error.response.data.message, {
                icon: "error",
                buttons: {
                    confirm: {
                        className: 'btn btn-danger'
                    }
                },
            })
        })
    }

    componentDidMount = () => {
        this.getDonation();
        this.getLoggedUser();
    }

    render(){
        return(
            <div className="content">
                <div className="panel-header bg-primary">
                    <div className="page-inner py-5">
                        <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                            <div>
                                <h2 className="text-white pb-2 fw-bold page-title">
                                    Detalhe da Doação 
                                    {this.state.isLoading ? <div className="loader loader-lg"></div> : <span className="pl-1">{this.state.donation.name}</span> }
                                </h2>
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
                                        <span className="text-white">Detalhe da Doação 
                                            {this.state.isLoading ? <div className="loader loader-lg"></div> : <span className="ml-1">{this.state.donation.name}</span>}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.state.isLoading ?
                        <div className="d-flex justify-content-center mt-5">
                            <div className="loader loader-lg"></div>
                        </div>
                    :
                        <div className="page-inner">
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="card">
                                        <div className="card-header">
                                            <div className="d-flex align-items-center">
                                                <h2 className="card-title">{this.state.donation.name}</h2>
                                                { this.state.user.child != undefined ?
                                                    <React.Fragment>
                                                        { 
                                                            this.state.donation.donator_pk == this.state.user.pk ?
                                                                null
                                                            :
                                                                <React.Fragment>
                                                                    {
                                                                        this.state.donation.status == 'Ativa' ?
                                                                            <button type="button" className="btn btn-info ml-auto" data-toggle="modal" data-target="#modal-solicitation">Solicitar Doação</button>
                                                                        :
                                                                            <button type="button" className="btn btn-danger ml-auto">Doação não pode ser solicitada</button>
    
                                                                    }
                                                                </React.Fragment>
                                                        }
                                                    </React.Fragment>
                                                    :
                                                    <div className="loader loader-lg"></div>
                                                }
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="row mt-3">
                                                <div className="col-12">
                                                    <h6 className="text-uppercase mb-3 fw-bold">Foto Principal</h6>
                                                    <img src={ this.state.donation.main_photo } alt="..." className="rounded img-fluid" />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-md-4 info-invoice">
                                                    <h6 className="text-uppercase mb-3 fw-bold">Validade</h6>
                                                    {
                                                        this.state.donation.validity == undefined ?
                                                            <div className="loader loader-lg"></div>
                                                        :
                                                        <p>
                                                            {unformatDate2(this.state.donation.validity)} até às {this.state.donation.validity_hour}
                                                        </p>
                                                    }
                                                </div>
                                                <div className="col-md-4 info-invoice">
                                                    <h6 className="text-uppercase mb-3 fw-bold">Solicitações feitas</h6>
                                                    {
                                                        this.state.donation.solicitations_count == 1 ?
                                                            <p>{ this.state.donation.solicitations_count } solicitação</p>
                                                        :
                                                            <p>{this.state.donation.solicitations_count} solicitações</p>
                                                    }
                                                </div>
                                                <div className="col-md-4 info-invoice">
                                                    <h6 className="text-uppercase mb-3 fw-bold">Tags</h6>
                                                    { 
                                                        this.state.donation.tags == undefined ?
                                                            <div className="loader loader-lg"></div>
                                                        :
                                                            <div>
                                                                { this.state.donation.tags.map((tag) =>
                                                                    <span key={tag.pk} className="badge badge-info">{tag.name}</span>
                                                                ) }
                                                            </div>
                                                    }
                                                </div>
                                            </div>
                                            <div className="separator-solid"></div>
                                            <div className="row mt-3">
                                                <div className="col-12">
                                                    <h6 className="text-uppercase mb-3 fw-bold">Descrição</h6>
                                                    <p className="text-muted">
                                                        { this.state.donation.description }
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-12 col-sm-12 col-md-6">
                                                    <h6 className="text-uppercase mb-3 fw-bold">Ponto de Encontro</h6>
                                                    <iframe
                                                        width="100%"
                                                        height="288"
                                                        frameBorder="0"
                                                        style={{ border: 0 }}
                                                        src={`https://www.google.com/maps/embed/v1/place?q=${this.state.donation.cep},${this.state.donation.neighborhood},${this.state.donation.street},${this.state.donation.number},+Brasil&key=${API_KEY}`} allowFullScreen></iframe>
                                                </div>
                                                <div className="col-12 col-sm-12 col-md-6">
                                                    <h6 className="text-uppercase mb-3 fw-bold">Fotos</h6>
                                                    <Carousel images={this.state.donation.photos} />
                                                </div>
                                            </div>
                                            {this.state.user.child != undefined ?
                                                <React.Fragment>
                                                    {
                                                        this.state.donation.donator_pk == this.state.user.pk ?
                                                            null
                                                            :
                                                            this.state.donation.status == "Ativa" ?
                                                                <div className="text-right mt-3 mb-3">
                                                                    <button type="button" className="btn btn-info btn-block" data-toggle="modal" data-target="#modal-solicitation">Solicitar doação</button>
                                                                </div>
                                                            :
                                                                <div className="text-right mt-3 mb-3">
                                                                    <button type="button" className="btn btn-danger btn-block">Doação não pode ser solicitada</button>
                                                                </div>

                                                    }
                                                </React.Fragment>
                                                :
                                                <div className="loader loader-lg"></div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card card-profile">
                                        <div className="card-header" style={{ "backgroundImage": "url('/static/images/blogpost.jpg')" }}>
                                            <div className="profile-picture">
                                                <div className="avatar avatar-xl">
                                                    <img src={ this.state.owner.photo } alt="..." className="avatar-img rounded-circle" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="user-profile text-center">
                                                {
                                                    this.state.owner.child == undefined ?
                                                        <div className="loader loader-lg"></div>
                                                    :
                                                        <React.Fragment>
                                                            <div className="name">
                                                                { this.state.owner.child.first_name } { this.state.owner.child.last_name }
                                                            </div>
                                                            <div className="job">{ this.state.owner.email }</div>
                                                            <div className="desc">{ this.state.owner.cell_phone }</div>
                                                            <div className="view-profile">
                                                                <Link to={`/accounts/profile/${this.state.owner.username}/`} style={{ textDecoration: 'none' }}><button className="btn btn-info btn-block">Ver Perfil</button></Link>
                                                            </div>
                                                        </React.Fragment>
                                                }
                                            </div>
                                        </div>
                                        <div className="card-footer">
                                            <div className="row user-stats text-center">
                                                <div className="col">
                                                    <div className="number">{ this.state.owner.donations_count }</div>
                                                    <div className="title">Doações Cadastradas</div>
                                                </div>
                                                <div className="col">
                                                    <div className="number">{ this.state.owner.donations_accepted }</div>
                                                    <div className="title">Doações Finalizadas</div>
                                                </div>
                                                <div className="col">
                                                    <div className="number">
                                                        <BeautyStars value={this.state.owner.rating} />
                                                    </div>
                                                    <div className="title">Confiabilidade</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal fade" id="modal-solicitation">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <form onSubmit={this.handleSubmit} method="POST">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Solicitar esta doação</h5>
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="alert alert-info" role="alert">
                                                            Ao clicar em sim, você entrará na lista dos solicitantes dessa doação. Você receberá e-mails com as atualizações do status de sua solicitação. Aguarde a resposta do dono da doação.
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="comment">Comentário sobre sua solicitação (opcional)</label>
                                                            <textarea name="comment" id="comment" className="form-control" rows="4" onChange={this.changeHandler}></textarea>
                                                        </div>
                                                        <input type="hidden" name="donation" defaultValue={ this.state.donation.pk } />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="fechar btn btn-danger" data-dismiss="modal">Cancelar</button>
                                                <button type="submit" className="btn btn-info">Salvar solicitação</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </div>
        );
    }
}