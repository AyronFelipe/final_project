import React from 'react';


export default class MySolicitations extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            solicitations: [],
            isLoading: true,
        }
    }

    getSolicitations = () => {
        axios.get(`/api/my-solicitations/`, config)
        .then((res) => {
            this.setState({ solicitations: res.data, isLoading: false })
        })
        .catch((error) => {
            console.log(error.response);
        })
    }

    componentDidMount(){
        this.getSolicitations();
    }

    render(){
        <div className="content">
            <div className="panel-header bg-primary">
                <div className="page-inner py-5">
                    <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                        <div>
                            <h2 className="text-white pb-2 fw-bold page-title">Minhas solicitações</h2>
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
                                    <Link to={`/donations/my-solicitations/`}>
                                        <span className="text-white">Minhas solicitações</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="page-inner">
                {
                    this.state.isLoading ?
                    <Preloader />
                    :
                    <React.Fragment>
                        { this.renderMyDonations() }
                    </React.Fragment>
                }
            </div>
        </div>
    }
}