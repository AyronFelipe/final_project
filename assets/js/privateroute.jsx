import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import Login from './login'

export default class PrivateRoute extends React.Component{

    render(){

        const {component: Component, authenticated, ...rest} = this.props;

        return(
            <div>
                <Route
                    {...rest}
                    render={props => authenticated === true 
                        ? (<Component {...props} />)
                        : (<Redirect to={{pathname: '/accounts/login/', state: {from: props.location}}} />)
                     }
                />
            </div>
        )
    }
}