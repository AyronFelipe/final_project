import React from 'react';

export default class Notifications extends React.Component{

    render(){
        return(
            <React.Fragment>
                <a className="nav-link dropdown-toggle" href="#" id="notifDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i className="fa fa-bell"></i>
                    <span className="notification">4</span>
                </a>
                <ul className="dropdown-menu notif-box animated fadeIn" aria-labelledby="notifDropdown">
                    <li>
                        <div className="dropdown-title">You have 4 new notification</div>
                    </li>
                    <li>
                        <div className="notif-scroll scrollbar-outer">
                            <div className="notif-center">
                                <a href="#">
                                    <div className="notif-icon notif-primary"> <i className="fa fa-user-plus"></i> </div>
                                    <div className="notif-content">
                                        <span className="block">New user registered</span>
                                        <span className="time">5 minutes ago</span>
                                    </div>
                                </a>
                                <a href="#">
                                    <div className="notif-icon notif-success"> <i className="fa fa-comment"></i> </div>
                                    <div className="notif-content">
                                        <span className="block">Rahmad commented on Admin</span>
                                        <span className="time">12 minutes ago</span>
                                    </div>
                                </a>
                                <a href="#">
                                    <div className="notif-img">
                                        <img src="https://via.placeholder.com/50x50" alt="Img Profile" />
                                    </div>
                                        <div className="notif-content">
                                            <span className="block">Reza send messages to you</span>
                                            <span className="time">12 minutes ago</span>
                                        </div>
                                </a>
                                <a href="#">
                                    <div className="notif-icon notif-danger"> <i className="fa fa-heart"></i> </div>
                                    <div className="notif-content">
                                        <span className="block">Farrah liked Admin</span>
                                        <span className="time">17 minutes ago</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </li>
                    <li>
                        <a className="see-all" href="#">See all notifications<i className="fa fa-angle-right"></i> </a>
                    </li>
                </ul>
            </React.Fragment>
        );
    }
}