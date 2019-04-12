import React from 'react'
import NameProject from './nameproject'

export default class Footer extends React.Component{

    getYear(){
        return new Date().getFullYear();
    }

    render(){
        return(
            <footer className="page-footer deep-purple darken-2 white-text">
                <div className="container">
                    <div className="row">
                        <div className="col l6 s12">
                            <h5 className="white-text"><NameProject /></h5>
                            {/* <p className="grey-text text-lighten-4">You can use rows and columns here to organize your footer content.</p> */}
                        </div>
                        <div className="col l4 offset-l2 s12">
                            <h5 className="white-text">Links</h5>
                            <ul className="valign-wrapper">
                              <li><a className="grey-text text-lighten-3" href="https://www.facebook.com/iron.mas.nao.e.o.man"><img style={{ width: '30px', height: '30px' }} src={ '/static/images/facebook.png' } /></a></li>
                              <li><a className="grey-text text-lighten-3" href="https://github.com/AyronFelipe"><img style={{ width: '30px', height: '30px' }} src={ '/static/images/github-box.png' } /></a></li>
                              <li><a className="grey-text text-lighten-3" href="https://plus.google.com/u/0/114763869348115382787"><img style={{ width: '30px', height: '30px' }} src={ '/static/images/google-plus.png' } /></a></li>
                              <li><a className="grey-text text-lighten-3" href="https://www.instagram.com/ayronfelipe/"><img style={{ width: '30px', height: '30px' }} src={ '/static/images/instagram.png' } /></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="footer-copyright">
                    <div className="container">
                        © {this.getYear()} Copyright
                        <a className="grey-text text-lighten-4 right" href="#!">Desenvolvido por Ayron</a>
                    </div>
                </div>
            </footer>
        )
    }
}