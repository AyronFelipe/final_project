import React from 'react';
import axios from 'axios';
import Preloader from './preloader';
import Donations from './donations';
import Demands from './demands';
import { Link } from 'react-router-dom';

const config = {
    headers: { 'Authorization': `Token ${localStorage.token}` }
};


export default class DonationsMain extends React.Component{

    constructor(props){
        super(props)
        this.state = { user: [], isLoading: true, buttonMessage: 'Nova Doação', link: '/donations/new-donation/' };
    }

    handleClickTab = () => {
        if (this.state.buttonMessage == 'Nova Doação') {
            this.setState({ buttonMessage: 'Novo Pedido', link: '/demands/new-demand/' });
        }else{
            this.setState({ buttonMessage: 'Nova Doação', link: '/donations/new-donation/' });
        }
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

    getCommentsEmpty = () => {
        axios.get('/api/comments-empty/', config)
        .then((res) => {
            swal(res.data.message, {
                icon: 'warning',
                buttons: {
                    confirm: {
                        className: 'btn btn-warning'
                    }
                }
            })
            .then(() => {
                window.location.href = '/comments/';
            })
        })
        .catch((error) => {
            console.log(error);
        })
    }

    componentDidMount = () => {
        this.getLoggedUser();
        this.getCommentsEmpty();
    }

    render(){
        return(
            <div className="content">
                <div className="panel-header bg-primary">
                    <div className="page-inner py-5">
                        <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                            <div>
                                <h2 className="text-white pb-2 fw-bold">
                                    Bem-vindo, { this.state.isLoading ? <Preloader /> : <React.Fragment>{ this.state.user.child.type == 'person' ? <React.Fragment>{this.state.user.child.first_name}</React.Fragment> : <React.Fragment>{this.state.user.child.name}</React.Fragment> }</React.Fragment> }</h2>
                            </div>
                            <div className="ml-md-auto py-2 py-md-0">
                                <Link to={this.state.link}>
                                    <button className="btn btn-info btn-round"><i className="la flaticon-add mr-1"></i> {this.state.buttonMessage}</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-navs bg-white">
                    <div className="nav-scroller">
                        <div className="nav nav-tabs nav-line nav-color-secondary justify-content-center">
                            <a href="#donations" id="donations-tab" className="nav-link active show mr-5 ml-5" data-toggle="tab" onClick={this.handleClickTab}>Doações</a>
                            <a href="#demands" id="demands-tab" className="nav-link mr-5 ml-5" data-toggle="tab" onClick={this.handleClickTab}>Pedidos</a>
                        </div>
                    </div>
                </div>
                <div className="tab-content">
                    <div className="tab-pane active" id="donations" role="tabpanel">
                        <Donations />
                    </div>
                    <div className="tab-pane" id="demands" role="tabpanel">
                        <Demands />
                    </div>
                </div>
            </div>
        );
    }
}