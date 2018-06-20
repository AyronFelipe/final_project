import React from 'react'
import 'materialize-css'
import 'materialize-css/dist/css/materialize.min.css'

export default class Carousel extends React.Component{

    componentDidMount(){
        $(".carousel").carousel();
    }

    render(){
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
                        <div className="carousel">
                            {this.props.list.map(function(item){
                                return(
                                    <div key={ item.pk }>
                                        <a className="carousel-item" href="#one!"><img src={item.image_file}/></a>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
