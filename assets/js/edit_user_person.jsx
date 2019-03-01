import React from 'react'

export default class EditUserPerson extends React.Component {

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col s12">
                        <img src={ this.props.user.photo } className="responsive circle" />
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col m6 s12">
                        <input id="first_name" name="first_name" type="text" defaultValue={ this.props.user.child.first_name } />
                        <label className="active" htmlFor="first_name">Nome</label>                        
                    </div>
                    <div className="input-field col m6 s12">
                        <input id="last_name" name="last_name" type="text" defaultValue={this.props.user.child.last_name} />
                        <label className="active" htmlFor="last_name">Sobrenome</label>                        
                    </div>
                </div>
            </div>
        )
    }
}