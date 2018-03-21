import React from 'react'
import DropzoneComponent from 'react-dropzone-component'

const componentConfig = { 
    postUrl: 'no-url',
    iconFiletypes: ['.jpg', '.png',],
    showFiletypeIcon: true
}
const djsConfig = { autoProcessQueue: false}
const eventHandlers = { addedfile: (file) => console.log(file) }

export default class Dropzone extends React.Component{

    render(){
        return(
            <DropzoneComponent config={ componentConfig } eventHandlers={ eventHandlers } djsConfig={ djsConfig } />
        )
    }
}