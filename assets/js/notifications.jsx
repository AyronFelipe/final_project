import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Preloader from './preloader';


const config = {
    headers: { 'Authorization': `Token ${localStorage.token}` }
};

export default class Notifications extends React.Component{

    constructor(props) {
        super(props);
        this.state = { 
            notifications: [],
            isLoading: true,
            unread: 0,
        }
    }

    getNotifications = () => {
        axios.get(`/api/notifications/`, config)
        .then((res) => {
            this.setState({ notifications: res.data, isLoading: false });
            this.countUnreads();
        })
        .catch((error) => {
            console.log(error);
        })
    }

    componentDidMount(){
        this.getNotifications();
    }

    countUnreads = () => {
        let contador = 0;
        this.state.notifications.map((notification) => {
            if (notification.unread) {
                contador++;
            }
        });
        this.setState({ unread: contador });
    }

    renderNotifications = () => {
        if (this.state.isLoading) {
            return (
                <Preloader />
            );
        } else {
            return(
                this.state.notifications.map((notification) =>{
                    return(
                        <Link to={`${notification.type}`} key={notification.pk}>
                            <div className="notif-img">
                                <img src={notification.sender} alt="Img Profile" height={'40px'} width={'40px'} />
                            </div>
                            <div className="notif-content">
                                <span className="block">{ notification.message }</span>
                                <span className="time">{ notification.naturaltime }</span>
                            </div>
                        </Link>
                    );
                })
            )
        }
    }

    handleClick = () => {
        this.state.notifications.map((notification) => {
            axios.put(`/api/notifications/${notification.pk}`, config)
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.log(error);
            })
        })
    }

    render(){
        return(
            <React.Fragment>
                <a className="nav-link dropdown-toggle" href="#" id="notifDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={this.handleClick}>
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
                </ul>
            </React.Fragment>
        );
    }
}