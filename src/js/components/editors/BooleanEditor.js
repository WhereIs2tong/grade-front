import React from 'react';

import TextEditor from './TextEditor';
import {FormControl} from "react-bootstrap";

export default class BooleanEditor extends TextEditor {
    renderShow(){
        let checked = this.props.value !== null ? this.props.value : false;
        checked = (checked===true||checked==='true')?"√":"×";
        return ( <FormControl.Static title={""+this.props.value}>{checked}</FormControl.Static>);
    }

    renderEdit(){
        return (
            <FormControl componentClass="select" defaultValue={this.props.value} onBlur={this.props.onBlur} onChange={this.handleChange} placeholder="select">
                <option value="true">√</option>
                <option value="false">×</option>
            </FormControl>
        );
    }
}
BooleanEditor.defaultProps={
    validatedFunc:(val)=>"success"
};
