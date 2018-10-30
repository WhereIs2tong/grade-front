import React from 'react';
import PropTypes from 'prop-types';

import { editors } from 'react-data-grid';
import {FormControl, FormGroup} from "react-bootstrap";

export default class TextEditor extends editors.EditorBase {
    static propTypes = {
        column: PropTypes.shape({
            key: PropTypes.string
        }),
        validatedFunc:PropTypes.func,
        data:PropTypes.func.isRequired
    };

    constructor(props, context) {
        super(props, context);

        const that = this;
        this.handleChange=(e)=>{
            that.input.value = e.target.value;
            that.props.onBlur();
        };

        this.state = {
            editorValue:this.props.value
        }
    }

    render(){
        const hiddenContext = <input key="innerValue" type="hidden" defaultValue={this.props.value} ref={(node) => this.input = node} onBlur={this.props.onBlur} />;
        return (<FormGroup validationState={this.props.validatedFunc(this.props.value)}>
            {hiddenContext}
            {this.couldUpdate()?this.renderEdit():this.renderShow()}
        </FormGroup>);
    }

    renderShow(){
        return ( <FormControl.Static title={""+this.props.value}>{this.props.value}</FormControl.Static>);
    }

    renderEdit(){
        return ((<FormControl ref={(node) => this.showInput = node}
                              autoFocus onKeyUp={this.onKeyup}
                              onBlur={this.handleChange}
                              onChange={(e)=>this.setState({"editorValue":e.target.value})}
                              className="form-control" value={this.state.editorValue} />));
    }

    onKeyup = (e) => {
        console.info(e.keyCode);
        console.info(this.showInput);
        (e.keyCode < 48 || e.keyCode>57) && this.handler()
    };

    handler = () => {
        console.info(this.showInput.value);
        this.input.value = this.showInput.value;
        this.props.onBlur();
    };


    getInputNode() {
        return this.input;
    }

    onClick() {
        this.getInputNode().focus();
    }

    couldUpdate(){
        let rowId = this.props.rowData.id - 1;
        return this.props.data()[rowId]["EDIT"];
    }

}

TextEditor.defaultProps={
    validatedFunc:(val)=>"success"
};