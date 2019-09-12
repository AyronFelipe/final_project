import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

let config = {
    headers: { 'Authorization': `Token ${localStorage.token}` }
};

export default class Profile extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            user: [],
            isLoading: true,
        }
    }

    getUser = () => {
        const url = window.location.pathname;
        const pk = url.split('-');
        axios.get(`/api/users/${pk[1]}`, config)
        .then((res) => {
            this.setState({ user: res.data, isLoading: false });
        })
        .catch((error) => {
            console.log(error.response);
        })
    }

    componentDidMount(){
        this.getUser();
    }

    render(){
        return(
            <div className="content">
                <div className="panel-header bg-primary">
                    <div className="page-inner py-5">
                        <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                            <div>
                                <h2 className="text-white pb-2 fw-bold page-title">Perfil</h2>
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
                                        <Link to={`/accounts/profile/${this.state.user.username}/`}>
                                            <span className="text-white">Perfil</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-inner">
                    <div className="row justify-content-center"></div>
                </div>
            </div>
        )
    }
}