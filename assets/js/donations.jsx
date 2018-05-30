import React from 'react'
import 'materialize-css'
import 'materialize-css/dist/css/materialize.min.css'
import '../css/main.css'
import { Link } from 'react-router-dom'

export default class Donations extends React.Component{

    render(){
        return(
            <div>
                <div className="fixed-action-btn">
                    <Link to="/donations/new-donation/">
                        <button type="button" className="btn btn-floating btn-large waves-effect waves-light indigo accent-2 wihte-text pulse" title="Adcionar uma doação">
                            <i className="material-icons">add</i>
                        </button>
                    </Link>
                </div>
            </div>
        )
    }
}