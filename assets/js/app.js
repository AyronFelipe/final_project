
import React from 'react'
import ReactDom from 'react-dom'
import CreateReactClass from 'create-react-class'
import $ from 'jquery'

var Hello = CreateReactClass({
    render: function(){
        return (
            <h1>Hello World!</h1>
        );
    }
});

ReactDom.render(<Hello />, document.getElementById('app'));