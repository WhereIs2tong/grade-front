import * as React from "react";
import assign from 'object-assign';
import {BaseCell, handleBooleanChange} from "./BaseCell";

import {Switch } from "@blueprintjs/core";

import {Utils} from "@blueprintjs/core";
const {safeInvoke} = Utils;

export default class SwithCell extends BaseCell{
    constructor(props, contxet) {
        super(props, contxet);
        this.state={
            value:props.value
        }
    }

    componentWillReceiveProps(nextProps) {
        const { value } = nextProps;
        if (value != null) {
            this.setState({ value: value});
        }
    }

    static propTypes = assign({}, BaseCell.propTypes);
    static defaultProps = assign({}, BaseCell.defaultProps);

    render(){
        return (
            <Switch
                disabled={!this.props.editable}
                defaultChecked={this.state.value}
                label="是否开启"
                onChange={this.handleDisabledChange}/>
        )
    }

    handleDisabledChange = handleBooleanChange(bool => {
        this.setState({ value: bool});
        safeInvoke(this.props.onConfirm, bool);
    });
}
