import React from 'react';

export default class Footer extends React.Component{

    constructor(props){
        super(props);
        this.state = { anoAtual: new Date().getFullYear() }
    }

    render(){
        return(
            <footer className="footer mt-auto fixed-bottom">
                <div className="container">
                    <nav className="pull-left">
                        <ul className="nav">
                            <li className="nav-item">
                                <a className="nav-link" href="#">
                                    Ayron
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">
                                    Ajuda
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">
                                    Licenças
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <div className="copyright ml-auto">
                        {this.state.anoAtual}, feito com <i className="fa fa-heart heart text-danger"></i> by <a href="#">Ayron</a>
                    </div>
                </div>
            </footer>
        )
    }
}