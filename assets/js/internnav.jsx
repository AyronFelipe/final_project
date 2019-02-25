import React from 'react'
import 'materialize-css'
import 'materialize-css/dist/css/materialize.min.css'
import '../css/main.css'
import Logout from './logout'
import NameProject from './nameproject'
import { Link } from 'react-router-dom'
import Notifications from './notifications'
import Pusher from 'pusher-js'
import Preloader from './preloader'

class NotificationCount extends React.Component{
    
    render(){
        if (this.props.count == 1) {
            return(
                <span data-badge-caption="nova" className="new badge">{this.props.count}</span>
            )
        } else if (this.props.count > 1) {
            return(
                <span data-badge-caption="novas" className="new badge">{this.props.count}</span>
            )
        } else {
            return(
                ''
            )
        }
    }
}

export default class InternNav extends React.Component{

    constructor(props){
        super(props);
        this.state = {  user: [], notifications: [] };
        this.handleRender = this.handleRender.bind(this)
        this.loadNotifications = this.loadNotifications.bind(this)
        this.handleRenderNotifications = this.handleRenderNotifications.bind(this)
    }

    handleRender(child){
        let lol
        if (child.cpf) {
            lol = child.first_name
        } else {
            lol = child.name
        }
        return lol;
    }


    handleClickNotifications(){
        $('#dropdown-notifications').css({
            "white-space": 'normal'
        })
        let unread_notifications = this.handleRenderNotifications()
        if (unread_notifications > 0) {
            this.state.notifications.map((notification) => {
                if (notification.unread == true) {
                    $.ajax({
                        url: `/api/notifications/${notification.pk}/`,
                        dataType: `json`,
                        type: 'PUT',
                        headers: {
                            'Authorization': 'Token ' + localStorage.token  
                        },
                        success: function(data){
                           this.loadNotifications();
                        }.bind(this),
                        error: function(request, status, err){
                            console.log(request, status, err);
                        }
                    });
                }
            })
        }
    }

    loadNotifications(){

        $.ajax({
            url: '/api/notifications/',
            dataType: 'json',
            type: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.token  
            },
            success: function(data){
                this.setState({ notifications: data });
            }.bind(this),
            error: function(request, status, err){
                console.log(request, status, err);
            } 
        }); 
    }


    handleRenderNotifications(){

        let count = 0;

        this.state.notifications.map((notification) => {
            if (notification.unread == true) {
                count++;
            }
        });

        return count;
    }

    componentDidMount(){

        this.loadNotifications();

        $.ajax({
            url: '/api/logged-user/',
            dataType: 'json',
            type: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(data){
                this.setState({ user: data })
            }.bind(this),
            error: function(request, status, err){
                console.log(request, status, err);
            }
        });

        /*
        setInterval(function(){ 
            this.loadNotifications()
        }.bind(this), 60000);
        if (user.pk == data.notified) {
            { this.loadNotifications() };
            { this.handleRenderNotifications() };
            Materialize.toast("Você possui uma nova notificação", 5000).unbind();
        }
        */
    }

    render(){
        
        const background = `/static/images/background-user-details.jpg`
        const user = this.state.user
        const child = this.state.user.child

        //Pusher.logToConsole = true;

        var pusher = new Pusher('1ab67094ad1ec71707db', {
            cluster: 'us2',
            forceTLS: true
        });

        var channel = pusher.subscribe('my-channel');
        
        channel.bind('my-event', function(data){
            if (user.pk == data.notified) {
                Materialize.toast("Você possui uma nova notificação", 3000);
            }
        });

        if(child != undefined){
            return(
                <div>
                    <nav className="deep-purple darken-2 white-text">
                        <div className="row">
                            <div className="col s12">
                                <div className="nav-wrapper">
                                    <a href="#" className="brand-logo"><NameProject /></a>
                                    <a href="#" data-activates="mobile-demo" className="button-collapse"><i className="material-icons">menu</i></a>
                                    <ul id="nav-mobile">
                                        <li className="right hide-on-med-and-down">
                                            <Logout />
                                        </li>
                                        <li className="right hide-on-med-and-down">
                                            <a href="#" data-activates="dropdown-options" data-alignment="right" title="Suas opções" className="dropdown-button" data-beloworigin="true" data-constrainwidth="false" style={{ height: '63px' }}>
                                                <img className="responsive-img circle" style={{ width: '50px', height: '50px', marginTop: '6px' }} src={ user.photo } />
                                            </a>
                                        </li>
                                        <li className="right" style={{ marginTop: '19px' }}>
                                            <NotificationCount count={this.handleRenderNotifications()} />
                                        </li>
                                        <li className="right">
                                            <a href="#" onClick={() => { this.handleClickNotifications() } } data-activates="dropdown-notifications" title="Suas notificações" className="dropdown-button" data-beloworigin="true" data-constrainwidth="false">
                                                <i className="material-icons">notifications</i>
                                            </a>
                                        </li>
                                    </ul>
                                    <ul className="side-nav" id="mobile-demo">
                                        <div className="user-details" style={{ backgroundImage: `url(${background})`, backgroundSize: `cover` }}>
                                            <div className="row">
                                                <div className="col s4 m4 l4">
                                                    <img className="responsive-img circle valign" src={ user.photo } style={{ marginTop: `10px` }} />
                                                </div>
                                                <div className="col s8 m8 l8 white-text">
                                                    <a href="#" className="btn-flat waves-effect waves-light white-text">
                                                        { child.first_name }
                                                    </a>
                                                    <p style={{ marginTop: '-35px', marginLeft: '27px' }}>
                                                    { child.last_name }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="no-padding">
                                            <ul>
                                                <li><Link to="/accounts/user/edit/"><i className="material-icons">account_circle</i>Editar perfil</Link></li>
                                                <li><Link to="/donations/my-solicitations/"><i className="material-icons">shopping_basket</i>Minhas solicitações</Link></li>
                                                <li><Link to="/donations/my-donations/"><i className="material-icons">room_service</i>Minhas doações</Link></li>
                                            </ul>
                                        </div>
                                        <Logout />
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </nav>
                    <ul id="dropdown-options" className="dropdown-content">
                        <li>
                            <Link to={ '/accounts/profile/'+user.pk+'/' }>
                                <div className="valign-wrapper">
                                    <img className="responsive-img circle" style={{ width: '50px', height: '50px', }} src={ user.photo } />
                                    &nbsp;&nbsp;&nbsp;&nbsp;<p>{ this.handleRender(child) }<br/><small>{ user.email }</small></p>
                                </div>
                            </Link>
                        </li>
                        <li className="divider"></li>
                        <li><Link to="/accounts/user/edit/"><i className="material-icons">account_circle</i>Editar perfil</Link></li>
                        <li><Link to="/donations/my-solicitations/"><i className="material-icons">shopping_basket</i>Minhas solicitações</Link></li>
                        <li><Link to="/donations/my-donations/"><i className="material-icons">room_service</i>Minhas doações</Link></li>
                    </ul>
                    <ul id="dropdown-notifications" className="dropdown-content" style={{ width: '380px', overflowX: 'hidden', whiteSpace: 'normal' }}>
                        <li>
                            <h6 className="purple-text" style={{ marginLeft: '15px' }}>NOTIFICAÇÕES</h6>
                        </li>
                        <li className="divider"></li>
                        <Notifications notifications={ this.state.notifications } />
                    </ul>
                </div>
            )
        }
        return(
            <div>
                <nav className="deep-purple darken-2 white-text">
                    <div className="row">
                        <div className="col s12">
                            <div className="nav-wrapper">
                                <a href="#" className="brand-logo"><NameProject /></a>
                                <a href="#" data-activates="mobile-demo" className="button-collapse"><i className="material-icons">menu</i></a>
                                <ul id="nav-mobile" className="right hide-on-med-and-down">
                                    <Preloader />
                                    <Logout />
                                </ul>
                                <ul className="side-nav" id="mobile-demo">
                                    <Logout />
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        )

    }
}