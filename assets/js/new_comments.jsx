import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class NewComments extends React.Component {

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
                        <div className="col-12"></div>
                    </div>
                </div>
            </div>
        );
    }
}