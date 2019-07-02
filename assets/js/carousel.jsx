import React, { useEffect } from 'react';
import Preloader from './preloader'
import '../template/js/plugin/owl-carousel/owl.carousel.min.js';

export default function Carousel(props) {

    useEffect(() => {
        $('.owl-carousel').owlCarousel({
            nav: true, // Show next and prev buttons
            autoplaySpeed: 300,
            navSpeed: 400,
            items: 1
        });
    })

    if (props.images == undefined) {
        return(
            <Preloader />
        )
    }
    return(
        <div className="owl-carousel owl-theme owl-img-response">
            {props.images.map((image) =>
                <div className="item" key={image.pk}><img src={image.image_file} alt="..."/></div>
            )}
        </div>
    )
}