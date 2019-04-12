import React from 'react';

export default class NameProject extends React.Component{

    constructor(props){
        super(props);
        this.state = { name: 'Alimentaí'}
    }

    render(){
        return(
            this.state.name
        )
    }
}