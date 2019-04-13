import React from 'react';

export default class Footer extends React.Component{

    constructor(props){
        super(props);
        this.state = { anoAtual: new Date().getFullYear() }
    }

    render(){
        return(
            <footer className="footer">
                <div className="container">
                    <nav className="pull-left">
                        <ul className="nav">
                            <li className="nav-item">
                                <a className="nav-link" href="#">
                                    O Alimentaí
                                </a>
                            </li>
                            <li className="nav-item d-none d-sm-block d-md-block">
                                <a className="nav-link" href="#">
                                    Ajuda
                                </a>
                            </li>
                            <li className="nav-item d-none d-sm-block d-md-block">
                                <a className="nav-link" href="#">
                                    Licenças
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <div className="copyright ml-auto">
                        {this.state.anoAtual}, feito por Ayron Felipe
                    </div>
                </div>
            </footer>
        )
    }
}