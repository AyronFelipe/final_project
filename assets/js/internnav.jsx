import React from 'react'
import ReactDom from 'react-dom'
import 'materialize-css'
import 'materialize-css/dist/css/materialize.min.css'
import '../css/main.css'
import Logout from './logout'
import NameProject from './nameproject'
import { Link } from 'react-router-dom'

 export default class InternNav extends React.Component{

    constructor(props){
        super(props);
        this.state = {  user: [] };
        this.handleRender = this.handleRender.bind(this)
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

    componentDidMount(){

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

    }

    render(){
        const user = this.state.user
        const child = this.state.user.child
        if(child != undefined){
            $('.dropdown-button').dropdown({
                alignment: 'right'
            });
            return(
                <div>
                    <nav className="deep-purple darken-2 white-text">
                        <div className="row">
                            <div className="col s12">
                                <div className="nav-wrapper">
                                    <a href="#" className="brand-logo"><NameProject /></a>
                                    <a href="#" data-activates="mobile-demo" className="button-collapse"><i className="material-icons">menu</i></a>
                                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                                        <li>
                                            <a href="#" data-activates="dropdown-options" title="Suas opções" className="dropdown-button" data-beloworigin="true" data-constrainwidth="false" style={{ height: '63px' }}>
                                                <img className="responsive-img circle" style={{ width: '50px', height: '50px', marginTop: '6px' }} src={ user.photo } />
                                            </a>
                                        </li>
                                        <li><i className="material-icons">notifications</i></li>
                                        <Logout />
                                    </ul>
                                    <ul className="side-nav" id="mobile-demo">
                                        <Logout />
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </nav>
                    <ul id="dropdown-options" className="dropdown-content">
                        <li>
                            <Link to={ '/accounts/profile/'+user.id+'/' }>
                                <div className="valign-wrapper">
                                    <img className="responsive-img circle" style={{ width: '50px', height: '50px', }} src={ user.photo } />
                                    &nbsp;&nbsp;&nbsp;&nbsp;<p>{ this.handleRender(child) }<br/><small>{ user.email }</small></p>
                                </div>
                            </Link>
                        </li>
                        <li className="divider"></li>
                        <li><a><i className="material-icons">account_circle</i>Editar perfil</a></li>
                        <li><a><i className="material-icons">shopping_basket</i>Minhas solicitações</a></li>
                        <li><a><i className="material-icons">room_service</i>Minhas doações</a></li>
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
                                    <div className="preloader-wrapper small active">
                                        <div className="spinner-layer spinner-green-only">
                                            <div className="circle-clipper left">
                                                <div className="circle"></div>
                                            </div>
                                            <div className="gap-patch">
                                                <div className="circle"></div>
                                            </div>
                                            <div className="circle-clipper right">
                                                <div className="circle"></div>
                                            </div>
                                        </div>
                                    </div>
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