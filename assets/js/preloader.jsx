import React from 'react';

export default class Preloader extends React.Component{

    render(){
        return(
            <div className="d-flex justify-content-center mt-5">
                <div className="loader loader-lg"></div>
            </div>
        )
    }
}