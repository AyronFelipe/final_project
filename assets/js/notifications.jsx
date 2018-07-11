import React from 'react'

export default class Notifications extends React.Component{

    componentDidMount(){
        $('.dropdown-button').dropdown({
            alignment: 'right',
            hover: true,
        });
    }

    render(){
        if (this.props.notifications == undefined){
            return(
                <li><a className="grey-text">Nenhuma notificação encontrada</a></li>
            )
        }

        let rows = []

        let photos = []
        
        let cont = 0

        for (let notification in this.props.notifications){
            photos.push(this.props.notifications[cont].sender)
            rows.push(this.props.notifications[cont].message);
            cont++;
        }
        
        console.log(this.props.notifications)

        return(
            
            <li>
                <a>
                    <div className="row">
                        <div className="col s6">
                            <div className="col s3"><img src={ photos } className="responsive-img circle" style={{ width: '50px', height: '50px', }} /></div>
                            <div className="col s1">{ rows }</div>
                        </div>
                    </div>
                </a>
            </li>
        
        )
    }
}