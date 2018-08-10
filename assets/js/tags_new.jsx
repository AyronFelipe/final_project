import React from 'react'
import Select from 'react-select'
import CreatableSelect from 'react-select/lib/Creatable'

const CustomClearText = () => 'limpar tudo'

const options = []

const ClearIndicator = (props) => {
    const { children = <CustomClearText/>, getStyles, innerProps: { ref, ...restInnerProps } } = props
    return(
        <div {...restInnerProps} ref={ref} style={getStyles('clearIndicator', props)}>
            <div style={{ padding: '0px 5px' }}>
                {children}
            </div>
        </div>
    )
}

const ClearIndicatorStyles = (base, state) => ({
    ...base,
    cursor: 'pointer',
    color: state.isFocused ? 'blue' : 'black',
})

export default class NewTag extends React.Component{

    constructor(props){
        super(props);
        this.state = {tags: []}
    }

    componentDidMount(){

        $.ajax({
            url: '/api/tags/',
            dataType: 'json',
            type: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(data){
                this.setState({ tags: data })
                this.state.tags.map((tag) =>{
                    options.push({
                        'label': tag.name,
                        'value': tag.name
                    })
                })
            }.bind(this),
            error: function(request, status, err){
                console.log(request, status, err);
            }
        });
    }

    render(){
        return(
            <div className="row">
                <h5>Adicione as tags da sua doação</h5>
                <small>Pressione "ENTER" para adicionar a tag</small>
                <CreatableSelect
                    components={{ ClearIndicator }}
                    styles={{ clearIndicator: ClearIndicatorStyles }}
                    isMulti
                    options={options}
                    name="tags"
                    placeholder="Digite sua tag"
                    className="input-field col s12"
                />
            </div>
        )
    }
}