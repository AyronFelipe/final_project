import React from 'react';
import { Link } from 'react-router-dom';

export default class DonationsMain extends React.Component{

    constructor(props){
        super(props)
        this.state = { donations: [], demands: [] }
    }

    getDonations = () => {
        return true;
    }

    getDemands = () => {
        return true;
    }

    render(){
        return(
            <div className="content">
                <div className="panel-header bg-primary">
                    <div className="page-inner py-5">
                        <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                            <div>
                                <h2 className="text-white pb-2 fw-bold">Dashboard</h2>
                                <h5 className="text-white op-7 mb-2">Premium Bootstrap 4 Admin Dashboard</h5>
                            </div>
                            <div className="ml-md-auto py-2 py-md-0">
                                <a href="#" className="btn btn-white btn-border btn-round mr-2">Manage</a>
                                <a href="#" className="btn btn-secondary btn-round">Add Customer</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-navs bg-white">
                    <div className="nav-scroller">
                        <div className="nav nav-tabs nav-line nav-color-secondary justify-content-center">
                            <a href="#tab1" className="nav-link active show mr-5 ml-5" data-toggle="tab">Doações</a>
                            <a href="#tab2" class="nav-link mr-5 ml-5" data-toggle="tab">Pedidos</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}