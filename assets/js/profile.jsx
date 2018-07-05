import React from 'react'
import { storageToken } from './auth'
import { Link } from 'react-router-dom'
import 'materialize-css'
import 'materialize-css/dist/css/materialize.min.css'
import '../css/profile.css'

export default class Profile extends React.Component{

    constructor(props){
        super(props)
        this.state = { user: [] }
    }

    componentDidMount(){
        let pathname = window.location.pathname;
        $.ajax({
            url: '/api/users/'+pathname.split('/')[3]+'/',
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
        if (child == undefined) {
            return(
                <div>
                    <nav className="nav-extended deep-purple darken-2 white-text">
                        <div className="row">
                            <div className="col s12">
                                <div className="col s10 push-s1">
                                    <div className="nav-content">
                                        <span className="nav-title">
                                            Perfil do Usuário 
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
                                        </span>
                                        <Link to="/donations/">
                                            <button className="btn-floating btn-large halfway-fab waves-effect waves-light indigo accent-2 white-text">
                                                <i className="material-icons">home</i>
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                    <div className="center-align">
                        <div className="preloader-wrapper big active">
                            <div className="spinner-layer spinner-blue-only">
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
                    </div>
                </div>
            )
        }
        let date = new Date(child.birthday)
        let local_date = date.toLocaleDateString()
        return(
            <div>
                <nav className="nav-extended deep-purple darken-2 white-text">
                    <div className="row">
                        <div className="col s12">
                            <div className="col s10 push-s1">
                                <div className="nav-content">
                                    <span className="nav-title">Perfil do Usuário { child.first_name }</span>
                                    <Link to="/donations/">
                                        <button className="btn-floating btn-large halfway-fab waves-effect waves-light indigo accent-2 white-text">
                                            <i className="material-icons">home</i>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
                <br/><br/>
                <div className="row">
                    <div className="col s12">
                        <div className="col s8 push-s2">
                            <div className="card">
                                <div className="card-image">
                                    <img  src={ '/static/images/section-BG-dark.jpg' }  style={{ height: '450px' }} className="hide-on-med-and-down" />
                                    <img src={ user.photo } className="show-on-medium-and-down hide-on-med-and-up" />
                                </div>
                                <div className="card-content">
                                    <div className="row">
                                        <div className="col xl8 profile-pic">
                                            <img src={ user.photo } style={{ width: '236px', height: '236px' }} className="circle responsive-img hide-on-med-and-down" />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col m4 s12">
                                            <h4 className="card-title">{ child.first_name } { child.last_name }</h4>
                                            <p className="medium-small grey-text">Confiável</p>
                                        </div>
                                        <div className="col m4 s12 center-align">
                                            <h4 className="card-title">{ user.donations_count }</h4>
                                            <p className="medium-small grey-text">Doação(ões) cadastrada(s)</p>
                                        </div>
                                        <div className="col m4 s12 center-align">
                                            <h4 className="card-title">{ user.donations_accepted }</h4>
                                            <p className="medium-small grey-text">Doação(ões) concretizada(s)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col s8 push-s2">
                        <div className="col m12 l4">
                            <ul className="collection">
                                <li className="collection-item">
                                    <i className="material-icons">person</i> CPF: { child.cpf }
                                </li>
                                <li className="collection-item">
                                    <i className="material-icons">email</i> E-mail: { user.email }
                                </li>
                                <li className="collection-item">
                                    <i className="material-icons">call</i> Contato: { user.cell_phone } / { user.phone }
                                </li>
                                <li className="collection-item">
                                    <i className="material-icons">cake</i> Aniversário: { local_date }
                                </li>
                                <li className="collection-item">
                                    <i className="material-icons">home</i> Endereço: { user.street } Nº { user.number }, { user.cep }, { user.city } - { user.uf }
                                </li>
                            </ul>
                        </div>
                        <div className="col m12 l8"></div>
                    </div>
                </div>
            </div>
        )
    }
}