import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export default class Carousel extends React.Component{

    render(){

        var settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 0,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        infinite: true,
                        dots: true
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        initialSlide: 2
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        };

        if(this.props.list == undefined){
            return(
                <div className="row purple-text">
                    <div className="col s12">
                        <div className="center-align">
                            <h4>Galeria de Imagens da Doação</h4>
                            <p>Não foram encontradas imagens para esta Doação</p>
                        </div>
                    </div>
                </div>
            )
        }
        return(
            <div className="row purple-text">
                <div className="col s12">
                    <div className="center-align">
                        <h4>Galeria de Imagens da Doação</h4>
                        <Slider {...settings}>
                            {this.props.list.map(function(item){
                                return(
                                    <img className="responsive-img" key={ item.pk } src={ item.image_file } />
                                )
                            })}
                        </Slider>
                    </div>
                </div>
            </div>
        )
    }
}
