import React from 'react'

export default class NewTag extends React.Component{

    constructor(props){
        super(props);
    }

    componentDidMount(){
        $('.chips').material_chip();
    }

    render(){
        return(
            <div className="row">
                <h5>Adicione as tags da sua doação</h5>
                <small>Pressione "ENTER" para adicionar a tag</small>
                <div className="chips" id="tags"></div>
            </div>
        )
    }
}