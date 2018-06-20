import React from 'react'
import { Link } from 'react-router-dom'
import { storageToken } from './auth'
import * as Vibrant from 'node-vibrant'
import Carousel from './carousel'

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
        
        $("#bg").css({
            "background-image": 'url("'+this.state.donation.main_photo+'")',
            "background-repeat": 'no-repeat',
            "background-size": '100% 100%',
            "position": 'fixed',
            "z-index": '-1',
            "width": "100%",
            "height": "100%",
            "top": '0',
            "filter": 'blur(5px)',
            "opacity": '0.8'
        })
        const API_KEY = "AIzaSyCq-XgDdK7Ewn_BWMxXpiDVn04y_BHB4yY"

        if( this.state.donation.main_photo!=undefined ){
            let color = new Vibrant(this.state.donation.main_photo);
            //color.getPalette((err, palette) => $("#content").css("background-color", palette.LightVibrant.getHex()));
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
                <div id="bg">aljdfhdhsdljfj</div>
                <br/><br/>
                <div className="row">
                    <div className="col s12">
                        <div className="col s10 push-s1">
                            <div className="card">
                                <div className="card-content">
                                    <div className="row purple-text">
                                        <div className="col l5 m12 s12">
                                            <img className="responsive-img" src={ this.state.donation.main_photo } />
                                            <br/><br/>
                                            <span>Doação realizada por: <div className="chip">{ this.state.donation.donator }</div></span>
                                            <button className="btn-large waves-effect waves-light indigo accent-2 white-text" style={{width: '100%'}}>Solicitar esta doação</button>
                                            <h4>Ponto de Encontro</h4>
                                            <div className="video-container">
                                                <iframe width="450" height="350" frameBorder="0" style={{border:0}} src={`https://www.google.com/maps/embed/v1/place?q=${this.state.donation.cep},${this.state.donation.neighborhood},${this.state.donation.street},${this.state.donation.number},+Brasil&key=${API_KEY}`} allowFullScreen></iframe>
                                            </div>
                                        </div>
                                        <div className="col l7 m12 s12">
                                            <h3>{ this.state.donation.name }</h3>
                                            <br/>
                                            <p>
                                                <span>{ this.state.donation.description }</span>
                                            </p>
                                            <br/>
                                            <h4>Histórico da Doação</h4>
                                        </div>
                                    </div>
                                    <Carousel list={ this.state.donation.photos } />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}