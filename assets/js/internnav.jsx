import React from 'react';
import { logout } from './auth';
import axios from 'axios';
import Preloader from './preloader';
import Notifications from './notifications';
import { Link } from 'react-router-dom';
import Pusher from 'pusher-js';
import '../template/js/plugin/bootstrap-notify/bootstrap-notify.min.js'


let config = {
    headers: { 'Authorization': `Token ${localStorage.token}` }
};

export default class InternNav extends React.Component {

    constructor(props){
        super(props);
        this.state = { user: [], isLoading: true, notifications: [] };
        this.child = React.createRef();
    }

    log_out = () => {
        logout();
        window.location = '/accounts/login/';
    }

    getLoggedUser = () => {
        axios.get('/api/logged-user/', config)
        .then((res) => {
            this.setState({ user: res.data, isLoading: false });
            this.getNotifications();
            this.initPusher(res.data.pk)
        })
        .catch((error) => {
            console.log(error.response);
        })
    }

    initPusher = (pk) => {
        var pusher = new Pusher('1ab67094ad1ec71707db', {
            cluster: 'us2',
            forceTLS: true
        });
          
        var channel = pusher.subscribe('my-channel');
       channel.bind('my-event', (data) => {
            if (pk == data.pk) {
                $.notify({
                    icon: 'flaticon-alarm-1',
                    title: 'Nova notificação',
                    message: data.message,
                    url: `/donations/${data.type}/`,
                    target: '_blank',
                },{
                    type: 'info',
                    allow_dismiss: true,
                    newest_on_top: false,
                    showProgressbar: false,
                    placement: {
                        from: "top",
                        align: "right",
                    },
                    animate: {
                        enter: 'animated fadeInDown',
                        exit: 'animated fadeOutUp',
                    }
                });
                this.getNotifications();
            }
        });
    }

    getNotifications = () => {
        axios.get(`/api/notifications/`, config)
        .then((res) => {
            this.setState({ notifications: res.data });
            this.child.current.countUnreads();
        })
        .catch((error) => {
            console.log(error);
        })
    }

    componentDidMount = () => {
        this.getLoggedUser();

        //Pusher.logToConsole = true;
    }
    
    render(){
        return(
            <React.Fragment>
                <div className="logo-header" data-background-color="blue">
                    <a href="index.html" className="logo">
                        <img src="/static/images/logo.jpg" alt="navbar brand" className="navbar-brand" height='35px' width='108px' />
                    </a>
                    <button className="navbar-toggler sidenav-toggler ml-auto" type="button" data-toggle="collapse" data-target="collapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon">
                            <i className="icon-menu"></i>
                        </span>
                    </button>
                    <button className="topbar-toggler more"><i className="icon-options-vertical"></i></button>
                    <div className="nav-toggle">
                        <button className="btn btn-toggle sidenav-overlay-toggler">
                            <i className="icon-menu"></i>
                        </button>
                    </div>
                </div>
                <nav className="navbar navbar-header navbar-expand-lg" data-background-color="blue2">
                    <div className="container-fluid">
                        <ul className="navbar-nav topbar-nav ml-md-auto align-items-center">
                            <li className="nav-item dropdown hidden-caret">
                                {
                                    this.state.isLoading ?
                                    <Preloader />
                                    :
                                    <Notifications notifications={this.state.notifications} ref={this.child} />
                                }
                            </li>
                            <li className="nav-item dropdown hidden-caret">
                                {
                                    this.state.isLoading ?
                                    <Preloader />
                                    :
                                    <React.Fragment>
                                        <a className="dropdown-toggle profile-pic" data-toggle="dropdown" href="#" aria-expanded="false">
                                            <div className="avatar-sm">
                                                <img src={this.state.user.photo} alt="..." className="avatar-img rounded-circle" />
                                            </div>
                                        </a>
                                        <ul className="dropdown-menu dropdown-user animated fadeIn">
                                            <div className="dropdown-user-scroll scrollbar-outer">
                                                <li>
                                                    <div className="user-box">
                                                        <div className="avatar-lg">
                                                            <img src={this.state.user.photo} alt="image profile" className="avatar-img rounded" />
                                                        </div>
                                                        <div className="u-text">
                                                            {this.state.user.child != undefined ? <h4>{ this.state.user.child.type == 'person' ? <React.Fragment>{ this.state.user.child.first_name }</React.Fragment> : <React.Fragment>{ this.state.user.child.name }</React.Fragment> }</h4> : <Preloader /> }
                                                            <p className="text-muted">{this.state.user.email}</p>
                                                            <Link to={`/accounts/profile/${this.state.user.username}/`}><button className="btn btn-xs btn-secondary btn-sm">Ver Perfil</button></Link>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="dropdown-divider"></div>
                                                    <Link to={'/donations/my-donations/'} style={{ textDecoration: 'none' }}>
                                                        <span className="dropdown-item">Minhas doações</span>
                                                    </Link>
                                                    <div className="dropdown-divider"></div>
                                                    <Link to={`/donations/my-solicitations/`} style={{ textDecoration: 'none' }}>
                                                        <span className="dropdown-item">Minhas solicitações</span>
                                                    </Link>
                                                    <div className="dropdown-divider"></div>
                                                    <a className="dropdown-item" href="#">Meus gifts</a>
                                                    <div className="dropdown-divider"></div>
                                                    <a className="dropdown-item" href="#">Meus pedidos</a>
                                                    <div className="dropdown-divider"></div>
                                                    <a className="dropdown-item" onClick={this.log_out}>Sair</a>
                                                </li>
                                            </div>
                                        </ul>
                                    </React.Fragment>
                                }
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-white btn-border btn-round" onClick={this.log_out}>Sair</button>
                            </li>
                        </ul>
                    </div>
                </nav>
            </React.Fragment>
        )
    }
}