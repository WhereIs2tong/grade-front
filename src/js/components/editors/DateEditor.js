import React from 'react';

import {DatePicker} from "../index" ;
import {FormControl} from 'react-bootstrap'

import TextEditor from './TextEditor';
import moment from "moment";
import {DateFormater} from "../formaters/index";

export default class DateEditor extends TextEditor {
    constructor(props, context) {
        super(props, context);
        const that = this;

        this.handleChange=(value, formattedValue)=> {
            that.input.value = Date.parse(value);
            that.props.onBlur();
        };
    }

    renderShow(){
        let timestamp = this.props.value !== null ? parseInt(""+this.props.value,10) : 0;
        let date = timestamp===0?null:DateFormater.dateOfTimestamp(timestamp);
        let dateString = date !== null ? moment(date).format('YYYY/MM/DD') : '';
        return ( <FormControl.Static title={""+this.props.value}>{dateString}</FormControl.Static>);
    }

    renderEdit(){
        let timestamp = this.props.value !== null ? parseInt(""+this.props.value,10) : 0;
        let date = timestamp===0?null:DateFormater.dateOfTimestamp(timestamp);
        return (
            <DatePicker key="innerDatepicker" id="innerDatepicker" dateFormat="YYYY/MM/DD" defaultValue={date===null?'':date.toISOString()} onChange={this.handleChange} onBlur={this.props.onBlur} />
        )
    }

    static fromDateToLong(date){
        if(date===null||date===''){
            return 0;
        }
        return date.getTime();
    }
}
DateEditor.defaultProps={
    validatedFunc:(val)=>"success"
};