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

    componentDidMount = () => {
        this.getDemands();
    }

    render() {
        return (
            <div className="page-inner">
                {
                    this.state.isLoading ?
                        <div className="d-flex justify-content-center mt-5">
                            <div className="loader loader-lg"></div>
                        </div>
                    :
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
                                                <Link to={`/demands/${demand.slug}/`}>
                                                    <button className="btn btn-info">Ver pedido</button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                }
            </div>
        )
    }
}