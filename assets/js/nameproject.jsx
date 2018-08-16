import React from 'react'
import ReactDom from 'react-dom'
import 'materialize-css'
import 'materialize-css/dist/css/materialize.min.css'
import '../css/main.css'

export default class NameProject extends React.Component{

    render(){
        return(
            <span className="truncate">Nome do Projeto</span>
        )
    }
}