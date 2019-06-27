import React from 'react';
import axios from 'axios';
import { WithContext as ReactTags } from 'react-tag-input';
import '../css/style.css';

const config = {
    headers: {
        'Authorization': `Token ${localStorage.token}`
    }
};

const KeyCodes = {
    comma: 188,
    enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

export default class NewTag extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = { tagsLocal: [], suggestions: [], isLoading: true, commingSuggestions: [] }
    }

    handleDelete = (i) => {
        this.setState({ tagsLocal: this.state.tagsLocal.filter((tag, index) => index !== i) });
    }

    handleAddition = (tag) => {
        this.setState(({ tagsLocal: [...this.state.tagsLocal, tag] }));
        this.props.onChange(tag);
    }

    handleDrag = (tag, currPos, newPos) => {
        const tags = [...this.state.tagsLocal];
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        this.setState({ tagsLocal: newTags });
    }

    getSuggestions = () => {
        axios.get(`/api/tags/`, config)
        .then((response) => {
            this.setState({ commingSuggestions: response.data, isLoading: false });
            this.state.commingSuggestions.map((sug) => {
                var dict = {
                    id: `${sug.pk}`,
                    text: sug.name
                }
                this.setState({ suggestions: [...this.state.suggestions, dict] });
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    componentDidMount = () => {
        this.getSuggestions();
    }

    render(){
        return(
            <React.Fragment>
                {
                    this.state.isLoading ?
                        <div className="loader loader-lg"></div>
                    :
                        <div>
                            <ReactTags tags={this.state.tagsLocal}
                                suggestions={this.state.suggestions}
                                handleDelete={this.handleDelete}
                                handleAddition={this.handleAddition}
                                handleDrag={this.handleDrag}
                                delimiters={delimiters}
                                placeholder={`Adicionar nova tag`}
                                name={this.props.name}
                                id={this.props.id}
                            />
                        </div>
                }
            </React.Fragment>
        );
    }
}