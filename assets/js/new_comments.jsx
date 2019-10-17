import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Preloader from './preloader';
import BeautyStars from 'beauty-stars';


const config = {
    headers: {
        'Authorization': `Token ${localStorage.token}`
    }
};

export default class NewComments extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            donations: [],
            isLoading: true,
            content: '',
            logged: [],
            value: 0,
        }
    }

    getLoggedUser = () => {
        axios.get('/api/logged-user/', config)
        .then((res) => {
            this.setState({ logged: res.data, isLoading: false });
        })
        .catch((error) => {
            console.log(error.response);
        });
    }

    getDonationsEmpty = () => {
        axios.get(`/api/donations-empty/`, config)
        .then((res) => {
            this.setState({ donations: res.data.donations, isLoading: false })
        })
        .catch((error) => {
            this.setState({ isLoading: false });
        })
    }

    changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    componentDidMount(){
        this.getDonationsEmpty();
        this.getLoggedUser();
    }

    render(){
        return(
            <div className="content">
                <div className="panel-header bg-primary">
                    <div className="page-inner py-5">
                        <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                            <div>
                                <h2 className="text-white pb-2 fw-bold page-title">Comentários</h2>
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
                                        <Link to="/comments/">
                                            <span className="text-white">Comentários</span>
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
                            {
                                this.state.isLoading ?
                                <Preloader/>
                                :
                                <React.Fragment>
                                    {
                                        this.state.donations.length > 0 ?
                                        <div className="row justify-content-center">
                                            <div className="alert alert-info col-10">
                                                <strong>Atenção!</strong> Sua opinião é muito importante para nós. Através de seu comentário e estrelas você estará ajudando outras pessoas a confiar nesse usuário. Por favor, não seja breve em seu comentário.
                                            </div>
                                            <div className="col-12">
                                                {
                                                    this.state.donations.map((donation) =>
                                                        <div className="card" key={donation.pk}>
                                                            <div className="card-header">
                                                                <div className="card-title">{ donation.name } { donation.donator == this.state.logged.pk ? <small className="text-muted">(Minha doação)</small> : null }</div>
                                                            </div>
                                                            <div className="card-body">
                                                                <div className="form-group">
                                                                    <p><strong>Doação: </strong><span className="text-primary">{ donation.name }</span> - <Link to={`/donations/donation/${donation.slug}`}>{ donation.slug }</Link> </p>
                                                                    <p><strong>Doador: </strong><Link to={`/accounts/profile/${donation.donator_username}/`}>{ donation.donator_name }</Link></p>
                                                                    <p><strong>Donatário: </strong><Link to={`/accounts/profile/${donation.receiver_username}/`}>{ donation.receiver_name }</Link></p>
                                                                </div>
                                                                <div className="form-group">
                                                                    {
                                                                        donation.donator == this.state.logged.pk ?
                                                                        <label htmlFor=""><span className="required-label">*</span> Diga-nos o que você achou de { donation.receiver_name }: </label>
                                                                        :
                                                                        <label htmlFor=""><span className="required-label">*</span> Diga-nos o que você achou de { donation.donator_name }: </label>
                                                                    }
                                                                    <textarea name="content" id="content" cols="30" rows="10" name="content" className="form-control" required onChange={this.changeHandler}></textarea>
                                                                </div>
                                                                <div className="form-group">
                                                                    {
                                                                        donation.donator == this.state.logged.pk ?
                                                                        <label htmlFor="">Quantas estrelas você dá para { donation.receiver_name }:</label>
                                                                        :
                                                                        <label htmlFor="">Quantas estrelas você dá para { donation.donator_name }:</label>
                                                                    }
                                                                    <BeautyStars
                                                                        value={this.state.value}
                                                                        onChange={value => this.setState({ value })}
                                                                        inactiveColor={'#808080'}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        :
                                        <div className="d-flex align-items-center flex-column mt-5">
                                            <h1 className="font-weight-bold">Você não possui comentários pendentes</h1>
                                            <p className="lead">Por favor clique no botão abaixo para ser redirecionado para a página principal</p>
                                            <Link to={'/donations/'}>
                                                <button className="btn btn-info btn-lg btn-round"><i className="flaticon-home text-white mr-1"></i> Página Inicial</button>
                                            </Link>
                                        </div>
                                    }
                                </React.Fragment>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}