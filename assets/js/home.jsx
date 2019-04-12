import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

class Home extends React.Component{

    constructor(props){
        super(props)
    }

    render(){
        return(
            <BrowserRouter>
                <div className="wrapper"></div>
            </BrowserRouter>
        )
    }
}

ReactDom.render(
    <Home />, document.getElementById('home')
)