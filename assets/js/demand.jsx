import React from 'react'
import { Link } from 'react-router-dom'

export default class Demand extends React.Component{

	constructor(props){
        super(props);
        this.saveDemand = this.saveDemand.bind(this);
    }

    saveDemand(){
    	alert('oi');
    }

    render(){
    	return(
    		<h1>OLÁ</h1>
    	)
    }
}