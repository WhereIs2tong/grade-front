import React from 'react';

import {FormControl, Popover} from 'react-bootstrap'
import TextFormater from "./TextFormater";
import PropTypes from 'prop-types';

// Custom Formatter component
export default class MapperFormater extends TextFormater {
    static propTypes = {
        keyMap:PropTypes.object,
        defaultMapValue:PropTypes.string
    };

    renderShow() {
       let showValue = this.props.keyMap[""+this.props.value] || this.props.defaultMapValue;
        return ( <FormControl.Static title={showValue}>{showValue}</FormControl.Static>);
    }
}

function mapperPoperOver(props) {
    let showValue = props.keyMap[""+props.value] || props.defaultMapValue;
    return (<Popover id="popover-positioned-scrolling-top" title="详情">
        <strong>{showValue}</strong>
    </Popover>)
}

MapperFormater.defaultProps={
    keyMap:{},
    defaultMapValue:"",
    popoverFunc:mapperPoperOver
};
