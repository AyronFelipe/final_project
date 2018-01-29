import React from 'react'
import { csrftoken } from './djangotoken.js'

export default class DjangoCSRFToken extends React.Component{

    render(){
        return(
            <input type="hidden" name="csrfmiddlewaretoken" value={ csrftoken } />
        )
    }
}