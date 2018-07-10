import React from 'react'

export default class Tags extends React.Component{

    render(){
        if(this.props.tags == undefined){
            return(
                <div className="row purple-text">
                    <div className="col s12">
                        <div className="center-align">
                            <p>Não foram encontradas tags para esta Doação</p>
                        </div>
                    </div>
                </div>
            )
        }
        return(
            <div className="row purple-text">
                <div className="col s12">
                    {this.props.tags.map(function(tag){
                        return(
                            <div className="chip">{ tag.name }</div>
                        )
                    })}
                </div>
            </div>
        )
    }
}