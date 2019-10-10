import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Preloader from './preloader';
import '../template/js/plugin/jquery-scrollbar/jquery.scrollbar.min.js';


const config = {
    headers: { 'Authorization': `Token ${localStorage.token}` }
};

export default class Notifications extends React.Component{

    constructor(props) {
        super(props);
        this.state = { 
            unread: 0,
        }
    }

    componentDidMount(){
        this.countUnreads();
        var notifScrollbar = $('.notif-scroll');
        if (notifScrollbar.length > 0) { notifScrollbar.scrollbar()}
    }

    countUnreads = () => {
        let contador = 0;
        if (this.props.notifications != undefined) {
            this.props.notifications.map((notification) => {
                if (notification.unread) {
                    contador++;
                }
            });
            this.setState({ unread: contador });
        }
    }

    handleClick = () => {
        let form = new FormData();
        this.props.notifications.map((notification) => {
            if (notification.unread) {
                form.append('notification', notification.pk);
                axios.put(`/api/notifications/${notification.pk}/`, form, config)
                .then((res) => {
                    this.setState({ unread: 0 });
                })
                .catch((error) => {
                    swal(error.response.data.message, {
                        icon: "error",
                        buttons: {
                            confirm: {
                                className: 'btn btn-danger'
                            }
                        },
                    })
                })
            }
        })
    }

    renderNotifications = () => {
        if (this.props.notifications != undefined) {
            return(
                this.props.notifications.map((notification) => 
                    <Link to={`${notification.type}`} key={notification.pk}>
                        <div className="notif-img">
                            <img src={notification.sender} alt="Img Profile" />
                        </div>
                        <div className="notif-content">
                            <span className="block">{ notification.message }</span>
                            <span className="time">{ notification.naturaltime }</span>
                        </div>
                    </Link>
                )
            )
        } else {
            return(
                <Preloader />
            )
        }
    }

    render(){
        return(
            <React.Fragment>
                <a className="nav-link dropdown-toggle" id="notifDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={this.handleClick}>
                    <i className="fa fa-bell"></i>
                    <span className="notification">{ this.state.unread > 10 ? <span>9+</span> : this.state.unread }</span>
                </a>
                <ul className="dropdown-menu notif-box animated fadeIn" aria-labelledby="notifDropdown" style={{ width: '480px' }}>
                    <li>
                        <div className="dropdown-title">Você possui {this.state.unread} novas notificações</div>
                    </li>
                    <li>
                        <div className="notif-scroll scrollbar-outer">
                            <div className="notif-center">
                                { this.renderNotifications() }
                            </div>
                        </div>
                    </li>
                    <li></li>
                </ul>
            </React.Fragment>
        );
    }
}