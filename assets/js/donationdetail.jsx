import React from 'react'
import { Link } from 'react-router-dom'
import { storageToken } from './auth'
import * as Vibrant from 'node-vibrant'

export default class DonationDetail extends React.Component{

     constructor(props){
        super(props);
        this.state = { donation: [] };
    }

    componentDidMount(){
        let pathname = window.location.pathname;
        let slug = pathname.split('/')[3];
        $.ajax({
            url: '/api/donations/'+slug.split('-')[2].split('.')[1]+'/',
            dataType: 'json',
            type: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(data){
                this.setState({ donation: data })
            }.bind(this),
            error: function(request, status, err){
                console.log(request, status, err);
            }
        });


    }

    render(){
        if( this.state.donation.photo!=undefined ){
            let color = new Vibrant(this.state.donation.photo);
            color.getPalette((err, palette) => $("#content").css("background-color", palette.Vibrant.getHex()));
        }
        return(
            <div id="content">
                <nav className="nav-extended deep-purple darken-2 white-text">
                    <div className="row">
                        <div className="col s12">
                            <div className="col s10 push-s1">
                                <div className="nav-content">
                                    <span className="nav-title">Detalhe da Doação { this.state.donation.name }</span>
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
                        <div className="col s10 push-s1">
                            <div className="card">
                                <div className="card-content">
                                    <div className="row">
                                        <div className="col l5 m12">
                                            <img className="responsive-img" src={ this.state.donation.photo } />
                                            <button className="btn-large waves-effect waves-light indigo accent-2 white-text" style={{width: '100%'}}>Solicitar esta doação</button>
                                        </div>
                                        <div className="col l7 m12 purple-text">
                                            <h3>{ this.state.donation.name }</h3>
                                            <br/><br/>
                                            <p>
                                                <span>{ this.state.donation.description }</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}