import React from 'react'
import ReactDom from 'react-dom'
import 'materialize-css'
import 'materialize-css/dist/css/materialize.min.css'
import '../css/main.css'
import { BrowserRouter } from 'react-router-dom'
import Donations from './donations'
import Donation from './donation'
import DonationDetail from './donationdetail'
import PrivateRoute from './privateroute'
import Profile from './profile'
import { isAuthenticated } from './auth'
import InternNav from './internnav'
import MySolicitations from './mysolicitations'
import MyDonations from './mydonations'

export default class Home extends React.Component{

    constructor(props){
        super(props)
        this.state = {authenticated: isAuthenticated()}
    }

    componentDidMount(){
        $('.button-collapse').sideNav();
        window.scrollTo(0, 0);
    }

    render(){
        return(
            <div>
                <BrowserRouter>
                    <div>
                        <header>
                            <PrivateRoute authenticated={ this.state.authenticated } component={ InternNav } />
                        </header>
                        <main>
                            <PrivateRoute exact authenticated={ this.state.authenticated } path="/donations/" component={ Donations } />
                            <PrivateRoute authenticated={ this.state.authenticated } path="/donations/new-donation/" component={ Donation } />
                            <PrivateRoute authenticated={ this.state.authenticated } path="/donations/donation/:slug/" component={ DonationDetail } />
                            <PrivateRoute authenticated={ this.state.authenticated } path="/accounts/profile/:pk/" component={ Profile } />
                            <PrivateRoute authenticated={ this.state.authenticated } path="/donations/my-solicitations/" component={ MySolicitations } />
                            <PrivateRoute authenticated={ this.state.authenticated } path="/donations/my-donations/" component={ MyDonations } />
                        </main>
                    </div>
                </BrowserRouter>
            </div>
        )
    }
}