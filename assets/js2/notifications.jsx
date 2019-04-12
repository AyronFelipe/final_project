import React from 'react'
import * as moment from 'moment';
import 'moment/locale/pt-br';

export default class Notifications extends React.Component{

    constructor(props){
        super(props)
        this.handleRender = this.handleRender.bind(this)
    }

    componentDidMount(){
        $('.dropdown-button').dropdown({
            alignment: 'right',
        });
    }

    handleRender(notifications){
        let collection;
        let test;
        if(notifications==undefined){
            collection = <li><a>Não existem notificações.</a></li>
        }else{ 
            collection = <li><a>Não existem notificações.</a></li>
            for (const [key, value] of Object.entries(notifications)) {
                test += 
                `<li>
                    <a href="/donations/${ value.type }/">
                        <div class="row">
                            <div class="col s12">
                                <div class="col s1"><img src=${ value.sender } class="circle left" style="height:48px;width:48px;" /></div>
                                <div class="col s10" style="margin-left:10px;">
                                    <p class="left-align" style="width: 279px;margin-left: 20px;">${ value.message }</p>
                                    <span class="grey-text"><small>${ moment(value.created_at).startOf('second').fromNow() }</small><span>
                                </div>
                            </div>
                        </div>
                    </a>
                </li>`
            }
            if(test==undefined){
               return collection = <li><a>Não existem notificações.</a></li>
            }
            let lol = test.replace('[object Object]', '');
            let last = lol.replace('undefined', '');
            collection = <div dangerouslySetInnerHTML={{__html: last}}></div>
        }
        return collection;
    }   

    render(){
        return(
            this.handleRender(this.props.notifications)
        )
    }
}