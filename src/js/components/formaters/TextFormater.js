import React, { Component } from 'react';

import {FormControl, FormGroup, OverlayTrigger, Popover} from 'react-bootstrap'
import PropTypes from 'prop-types';

export default class TextFormater extends Component {
    static propTypes = {
        validatedFunc:PropTypes.func,
        popoverFunc:PropTypes.func,
        transferFunc:PropTypes.func
    };
    render() {
        const popoverHoverFocus = this.props.popoverFunc || defaultPoperOver.bind(this);
        const validatedFunc = this.props.validatedFunc || defaultValidateFunc;
        const transferFunc = this.props.transferFunc || defaultTransferFunc;

        const value = transferFunc(this.props);
        const validate_state = validatedFunc(this.props.value,this.props);
        return ( <FormGroup validationState={validate_state}>
            <OverlayTrigger trigger={['hover']} placement="top" overlay={popoverHoverFocus(this.props,value)}>
            {this.renderShow(value)}
            </OverlayTrigger>
        </FormGroup>);
    }

    renderShow(value){
        return (<FormControl.Static title={""+value}>{value}</FormControl.Static>);
    }
}

function defaultPoperOver(props,value) {
    // let lineNo = props.rowIdx;
    return (<Popover id="popover-positioned-scrolling-top" title="详情">
        <strong>{value}</strong>
    </Popover>)
}

function defaultValidateFunc(val,props){
    return "success";
}

function defaultTransferFunc(props) {
    return props.value;
}
TextFormater.defaultProps={
    validatedFunc:defaultValidateFunc,
    transferFunc:defaultTransferFunc
};