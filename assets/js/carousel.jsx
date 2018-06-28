import React from 'react'

export default class Carousel extends React.Component{

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
        }else{
            return(
                <div className="row purple-text">
                    <div className="col s12">
                        <div className="center-align">
                            <h4>Galeria de Imagens da Doação</h4>
                            <div className="video-container">
                                {this.props.list.map(function(item){
                                    return(
                                        <img key={ item.pk } src={ item.image_file } />
                                    )
                                })}
                                
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}
