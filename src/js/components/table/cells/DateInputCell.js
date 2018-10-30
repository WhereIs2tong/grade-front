import * as React from "react";
// import PropTypes from 'prop-types';
import assign from 'object-assign';
import {BaseCell} from "./BaseCell";

import moment from 'moment';

import { DateInput } from "@blueprintjs/datetime";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css"

import {Utils} from "@blueprintjs/core";
const {safeInvoke} = Utils;

export default class DateInputCell extends BaseCell {
    constructor(props, contxet) {
        super(props, contxet);
    }

    static propTypes = assign({}, BaseCell.propTypes);
    static defaultProps = assign({}, BaseCell.defaultProps);

    render(){
        let date = (this.props.value==null||this.props.value==0)?null: new Date(this.props.value);
        return (
            <DateInput
                disabled={!this.props.editable}
                closeOnSelection={true}
                value={date}
                reverseMonthAndYearMenus={true}
                onChange={this.handleChange}
                popoverProps={{ position: "bottom" }}
                formatDate={DateInputCell.formatDate}
                parseDate={DateInputCell.parseDate}
            />
        )
    }

    static formatDate(date){
        return moment(date).format('YYYY/MM/DD');
    }

    static parseDate(str){
        return moment(str,'YYYY/MM/DD').toDate();
    }

    handleChange=(date)=>{
        if(date!=null)
            safeInvoke(this.props.onConfirm, date.getTime());
    };
}