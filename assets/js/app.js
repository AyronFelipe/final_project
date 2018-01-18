
import React from 'react'
import ReactDom from 'react-dom'
import CreateReactClass from 'create-react-class'
import $ from 'jquery'

var Hello = CreateReactClass({
    render: function(){
        return (
            <div className="card-panel teal lighten-2">
                Hello World!
            </div>
        );
    }
});

ReactDom.render(<Hello />, document.getElementById('app'));