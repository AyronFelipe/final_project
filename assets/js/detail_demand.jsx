import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_KEY = "AIzaSyCq-XgDdK7Ewn_BWMxXpiDVn04y_BHB4yY";

const config = {
    headers: { 'Authorization': `Token ${localStorage.token}` }
};

class DetailDemand extends React.Component {

    constructor(props) {
        super(props);
        this.state = { demand: [], isLoading: true, }
    }

    getDemand = () => {
        let pathname = window.location.pathname;
        let slug = pathname.split('/')[3];

        axios.get(`/api/demands/${slug.split('-')[2].split('.')[1]}/`, config)
        .then((res) => {
            this.setState({ demand: res.data, isLoading: false });
        })
        .catch((error) => {
            console.log(error.response);
        });
    }

    componentDidMount = () => {
        this.getDemand();
    }

    render() {
        return(
            <div className="content">
                <div className="panel-header bg-primary">
                    <div className="page-inner py-5">
                        <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                            <div>
                                <h2 className="text-white pb-2 fw-bold page-title">
                                    Detalhe do Pedido
                                    {this.state.isLoading ? <div className="loader loader-lg"></div> : <span> {this.state.demand.name}</span>}
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
                                            {this.state.isLoading ? <div className="loader loader-lg"></div> : <span> {this.state.demand.name}</span>}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DetailDemand;