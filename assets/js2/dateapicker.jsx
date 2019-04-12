import React from 'react'

export default class Dateapicker extends React.Component{

    componentDidMount(){
        $(".datepicker").pickadate({
            selectMonths: true, 
            selectYears: 50, 
            today: 'Hoje',
            clear: 'Limpar',
            close: 'Ok',
            closeOnSelect: true,
            formatSubmit: 'yyyy-mm-dd',
            monthsFull: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            weekdaysFull: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
            weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'], 
            editable: false,
            hiddenName: true,
            max: true,
            showMonthsFull: true,
            showWeekdaysShort: true,
        })
    }
    
    render(){
        return(
            <div className="row">
                <div className="input-field col s6">
                    <input id={ this.props.name } name={ this.props.name } type="text" className="datepicker" />
                    <label htmlFor={ this.props.name }>Data de nascimento</label>
                </div>
            </div>
        )
    }
}