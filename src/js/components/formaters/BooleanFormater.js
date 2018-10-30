import React from 'react';

import {FormControl, Popover} from 'react-bootstrap'
import TextFormater from "./TextFormater";

export default class BooleanFormater extends TextFormater {
    renderShow() {
        let checked = this.props.value !== null ? this.props.value : false;
        checked = (checked===true||checked==='true')?"√":"×";
        return (
            <FormControl.Static title={""+this.props.value}>{checked}</FormControl.Static>
            );
    }
}

function booleanPoperOver(props) {
    let checked = props.value !== null ? props.value : false;
    checked = (checked===true||checked==='true')?"√":"×";
    return (<Popover id="popover-positioned-scrolling-top" title="详情">
        <strong>{checked}</strong>
    </Popover>)
}
BooleanFormater.defaultProps={
    popoverFunc:booleanPoperOver
};

