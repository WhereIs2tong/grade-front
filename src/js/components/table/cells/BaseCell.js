import * as React from "react";
import PropTypes from 'prop-types';
import assign from 'object-assign';
import {EditableText} from "@blueprintjs/core";
import classNames from "classnames";

import { Classes } from "@blueprintjs/core";
// const NS = Classes.getClassNamespace();

class BaseCell extends React.Component{
    static NS = Classes.getClassNamespace();
    static propTypes = {
        cellIndex:PropTypes.number,
        focused:PropTypes.bool,
        value:PropTypes.any,
        editable:PropTypes.bool,
        onEdit:PropTypes.func,
        onConfirm:PropTypes.func
    };
    static defaultProps = {
        cellIndex:0,
        focused:false,
        editable:true
    };
}

class UserOptionalCell extends BaseCell{
    static propTypes = assign({},BaseCell.propTypes,{
        cellRenderer:PropTypes.func.isRequired
    });
    static defaultProps = assign({},BaseCell.defaultProps);
    render(){
        return this.props.cellRenderer(this.props);
    }
}

class SimpleCell extends BaseCell{
    constructor(props,contxet){
        super(props,contxet);
        this.state={
            value:SimpleCell.valueToString(props.value)
        }
    }

    componentWillReceiveProps(nextProps) {
        const { value } = nextProps;
        if (value != null) {
            this.setState({ value: SimpleCell.valueToString(value)});
        }
    }

    static propTypes = assign({},BaseCell.propTypes);
    static defaultProps = assign({},BaseCell.defaultProps);

    static valueToString(obj){
        if(obj==null){
            return '';
        }else {
            return String(obj);
        }
    }

    render(){
        return (
            <EditableText
                isEditing={this.props.focused}
                disabled={!this.props.editable}
                className={classNames(`${BaseCell.NS}-table-editable-text`, `${BaseCell.NS}-table-editable-name`)}
                minWidth={null}
                onConfirm={this.props.onConfirm}
                onChange={this.handleChange}
                onEdit={this.props.onEdit}
                selectAllOnFocus={false}
                value={this.state.value}
            />
        );
    }

    handleChange=(val)=>{
        this.setState({"value":val});
    };

}

function handleBooleanChange(handler/*: (checked: boolean) => void*/) {
    return (event/*: React.FormEvent<HTMLElement>*/) => handler((event.target/* as HTMLInputElement*/).checked);
}
/** Event handler that exposes the target element's value as a string. */
function handleStringChange(handler/*: (value: string) => void*/) {
    return (event/*: React.FormEvent<HTMLElement>*/) => handler((event.target/* as HTMLInputElement*/).value);
}

/** Event handler that exposes the target element's value as a number. */
function handleNumberChange(handler/*: (value: number) => void*/) {
    return handleStringChange(value => handler(+value));
}

export {BaseCell,SimpleCell,UserOptionalCell,handleBooleanChange,handleStringChange,handleNumberChange}