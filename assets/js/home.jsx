import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import PrivateRoute from './privateroute';
import { isAuthenticated } from './auth';
import InternNav from './internnav';
import DonationsMain from './donations_main';
import NewDonation from './new_donation';
import DetailDonation from './detail_donation';
import NewDemand from './new_demand';
import DetailDemand from './detail_demand';
import Profile from './profile';
import ProfileEdit from './edit_profile';
import MyDonations from './my_donations';
import EditDonation from './edit_donation';
import MySolicitations from './my_solicitations';
import SolicitationsOfDonations from './solicitations_of_donations';
import NewComments from './new_comments';

class Home extends React.Component{

    constructor(props){
        super(props)
        this.state = { authenticated: isAuthenticated() }
    }

    render(){
        return(
            <BrowserRouter>
                <div className="wrapper overlay-sidebar">
                    <div className="main-header">
                        <PrivateRoute authenticated={this.state.authenticated} component={InternNav} />
                    </div>
                    <div className="main-panel">
                        <PrivateRoute exact authenticated={this.state.authenticated} path="/donations/" component={DonationsMain} />
                        <PrivateRoute exact authenticated={this.state.authenticated} path="/comments/" component={NewComments} />
                        <PrivateRoute exact authenticated={this.state.authenticated} path="/donations/new-donation/" component={NewDonation} />
                        <PrivateRoute exact authenticated={this.state.authenticated} path="/donations/donation/:slug/" component={DetailDonation} />
                        <PrivateRoute exact authenticated={this.state.authenticated} path="/donations/donation/edit/:slug/" component={EditDonation} />
                        <PrivateRoute exact authenticated={this.state.authenticated} path="/demands/new-demand/" component={NewDemand} />
                        <PrivateRoute exact authenticated={this.state.authenticated} path="/demands/demand/:slug/" component={DetailDemand} />
                        <PrivateRoute exact authenticated={this.state.authenticated} path="/accounts/profile/:username/" component={Profile} />
                        <PrivateRoute exact authenticated={this.state.authenticated} path="/accounts/profile/edit/:username/" component={ProfileEdit} />
                        <PrivateRoute exact authenticated={this.state.authenticated} path="/donations/my-donations/" component={MyDonations} />
                        <PrivateRoute exact authenticated={this.state.authenticated} path="/donations/my-solicitations/" component={MySolicitations} />
                        <PrivateRoute exact authenticated={this.state.authenticated} path="/donations/donation/:slug/solicitations" component={SolicitationsOfDonations} />
                    </div>
                </div>
            </BrowserRouter>
        )
    }
}

ReactDom.render(
    <Home />, document.getElementById('home')
)