import React from 'react';
import ReactTags from 'react-tag-autocomplete';
import axios from 'axios';


export default class NewTag extends React.Component{

    constructor(props) {
        super(props);
        this.state = { tags: [], suggestions: [] }
    }

    handleDelete = (i) => {
        const tags = this.state.tags.slice(0)
        tags.splice(i, 1)
        this.setState({ tags })
    }

    handleAddition = (tag) => {
        const tags = [].concat(this.state.tags, tag)
        this.setState({ tags })
    }

    populateSuggestions = () => {
        axios.get()
    }
}