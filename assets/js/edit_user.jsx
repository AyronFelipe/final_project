import React from 'react'
import { Link } from 'react-router-dom'
import Preloader from './preloader'
import EditUserInstitution from './edit_user_institution'
import EditUserPerson from './edit_user_person'

export default class EditUser extends React.Component{

    constructor(props){
        super(props)
        this.state = { user: [] };

    }

    componentDidMount(){

        $.ajax({
            url: '/api/logged-user/',
            dataType: 'json',
            type: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function (data) {
                this.setState({ user: data })
            }.bind(this),
            error: function (request, status, err) {
                console.log(request, status, err);
            }
        });

    }

    render(){
        if (this.state.user.length == 0) {
            return(
                <div>
                    <nav className="nav-extended deep-purple darken-2 white-text">
                        <div className="row">
                            <div className="col s12">
                                <div className="col s10 push-s1">
                                    <div className="nav-content">
                                        <span className="nav-title">
                                            Gerenciar suas Informações
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
                    <br/><br/>
                    <div className="row">
                        <div className="col s12 center">
                            <Preloader />
                        </div>  
                    </div>
                </div>
            )
        }
        return(
            <div>
                <nav className="nav-extended deep-purple darken-2 white-text">
                    <div className="row">
                        <div className="col s12">
                            <div className="col s10 push-s1">
                                <div className="nav-content">
                                    <span className="nav-title">
                                        Gerenciar suas Informações
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
                <br/><br/>
                <div className="row">
                    <div className="col s12 center">
                        { this.state.user.child.cpf ? <EditUserPerson /> : <EditUserInstitution /> }
                    </div>  
                </div>
            </div>
        )
    }
}
