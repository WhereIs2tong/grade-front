import React from 'react';
import moment from "moment";

import {FormControl, Popover} from 'react-bootstrap'
import TextFormater from "./TextFormater";

// Custom Formatter component
export default class DateFormater extends TextFormater {
    renderShow() {
        let timestamp = this.props.value !== null ? parseInt(""+this.props.value,10) : 0;
        let date = timestamp===0?null:DateFormater.dateOfTimestamp(timestamp);
        let dateString = date !== null ? moment(date).format('YYYY/MM/DD') : '';
        return ( <FormControl.Static title={""+this.props.value}>{dateString}</FormControl.Static>);
    }

    static dateOfTimestamp(timestamp){
        let date = new Date();
        date.setTime(timestamp);
        return date;
    }
}

function datePoperOver(props) {
    let timestamp = props.value !== null ? parseInt(""+props.value,10) : 0;
    let date = timestamp===0?null:DateFormater.dateOfTimestamp(timestamp);
    let dateString = date !== null ? moment(date).format('YYYY/MM/DD') : '';
    return (<Popover id="popover-positioned-scrolling-top" title="详情">
        <strong>{dateString}</strong>
    </Popover>)
}
DateFormater.defaultProps={
    popoverFunc:datePoperOver
};
