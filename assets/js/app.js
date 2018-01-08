var React = require('react')
var ReactDom = require('react-dom')
var CreateReactClass = require('create-react-class')

var Hello = CreateReactClass({
    render: function(){
        return (
            <h1>Hello World!</h1>
        );
    }
});

ReactDom.render(<Hello />, document.getElementById('app'));