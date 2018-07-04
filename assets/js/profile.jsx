import React from 'react'
import { storageToken } from './auth'
import { Link } from 'react-router-dom'

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
        console.log(child)
        if (child == undefined) {
            return(
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
            )
        }
        return(
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
        )
    }
}