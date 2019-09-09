import React from 'react';
import axios from 'axios';
import { truncate } from './utils';
import { Link } from 'react-router-dom';

let config = {
    headers: { 'Authorization': `Token ${localStorage.token}` }
};

export default class Demands extends React.Component {

    constructor(props) {
        super(props);
        this.state = { demands: [], isLoading: true };
    }

    getDemands = () => {
        axios.get(`/api/demands/`, config)
        .then((res) => {
            this.setState({ demands: res.data, isLoading: false });
        })
        .catch((error) => {
            console.log(error.response);
        });
    }

    renderDemands = () => {
        if (this.state.isLoading) {
            return <div className="d-flex justify-content-center mt-5">
                <div className="loader loader-lg"></div>
            </div>
        } else {
            if (this.state.demands.length >= 1) {
                return(
                    <div className="row">
                        {
                            this.state.demands.map((demand) => {
                                return (
                                    <div className="col-sm-4 col-12" key={demand.pk}>
                                        <div className="card">
                                            <img className="card-img-top" src={demand.main_photo} alt="Card image cap" />
                                            <div className="card-body">
                                                <h5 className="card-title mb-2 fw-mediumbold">{demand.name}</h5>
                                                <p className="card-text">{truncate(demand.description)}</p>
                                                <Link to={`/demands/demand/${demand.slug}/`}>
                                                    <button className="btn btn-info">Ver pedido</button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                );
            } else {
                return <div className="d-flex align-items-center flex-column mt-5">
                    <h1 className="font-weight-bold">Nenhum pedido encontrado</h1>
                    <p className="lead">Comece a fazer parte da nossa comunidade. Clique no botão abaixo para fazer um novo pedido.</p>
                    <Link to={'/demands/new-demand/'}>
                        <button class="btn btn-info btn-lg btn-round"><i class="la flaticon-add mr-1"></i> Novo Pedido</button>
                    </Link>
                </div>
            }
        }
    }

    componentDidMount = () => {
        this.getDemands();
    }

    render() {
        return (
            <div className="page-inner">
                { this.renderDemands() }
            </div>
        )
    }
}