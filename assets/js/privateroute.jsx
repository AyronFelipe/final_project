import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import Login from './login'

export default class PrivateRoute extends React.Component{

    render(){

        const {component: Component, authenticated, ...rest} = this.props;

        return(
            <React.Fragment>
                <Route
                    {...rest}
                    render={props => authenticated == true 
                        ? (<Component {...props} />)
                        : (
                            <Switch>
                                <Route path='/login/' component={Login} />
                                <Redirect to={{pathname: '/login/'}} />
                            </Switch>
                        )
                    }
                />
            </React.Fragment>
        )
    }
}