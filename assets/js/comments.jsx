import React from 'react'
import Preloader from './preloader'

class CardComment extends React.Component {

	render() {
		return(
			<div>
				<h1>Comentários aqui!</h1>
			</div>
		)
	}
}

export default class Comments extends React.Component {

	constructor(props) {
		super(props);
		this.state = { comments: [] };
	}

	componentDidMount() {
		$.ajax({
			url: '/api/comments/',
			dataType: 'json',
			type: 'GET',
			headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(data) {
            	if (data.length == 0) {
            		const collection =
            		`<div class="row">
                        <div class="col s12 center-align">
                            <div class="valign-wrapper row">
                                <div class="col card hoverable deep-purple white-text">
                                    <div class="card-content">
                                        <div class="white-text center-align card-title">
                                            <h3>Nenhum comentário encontrado</h3>
                                        </div>
                                    </div>
                                    <h4>
                                    	<i class="material-icons">sentiment_very_dissatisfied</i> 
                                    </h4>
                                    <p>
                                    	Nenhum usuário deixou um comentário sobre este usuário.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    $('.comments-section').html(collection);
            	} else {
            		this.setState({ comments: data });
            	}
            }.bind(this),
            error: function(request, status, err) {
            	console.log(request, status, err);
            }
		})
	}

	render() {

		if (this.state.comments.length) {
			return(
				<div className="col s12 comments-section">
					<CardComment />
				</div>
			)
		}

		return (
			<div className="center comments-section">
				<Preloader />
			</div>
		)
	}
}