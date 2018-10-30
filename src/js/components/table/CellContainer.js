import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from "classnames";
import assign from 'object-assign';

import {
    DISPLAYNAME_PREFIX,
    Utils as CoreUtils,
} from "@blueprintjs/core";
import { Classes } from "@blueprintjs/core";

import {Draggable, Cell} from "@blueprintjs/table";
import { SimpleCell} from "./cells/BaseCell";

const NS = Classes.getClassNamespace();

class CellContainer extends Component{
    static displayName = `${DISPLAYNAME_PREFIX}.EditableCell`;
    static propTypes = {
        value:PropTypes.any,
        editable:PropTypes.bool,
        cellIndex:PropTypes.number.isRequired,
        columnSize:PropTypes.number.isRequired,
        cellFocused:PropTypes.bool.isRequired,
        raiseModifyFocuse:PropTypes.func,
        contextRender:PropTypes.func,
        onConfirm:PropTypes.func
    };

    static defaultProps={
        editable:true,
        raiseModifyFocuse:(index)=>console.info("Focuse on ",index),
        contextRender:SimpleCell
    };

    cellRef;
    refHandlers = {
        cell: (ref) => {
            this.cellRef = ref;
        },
    };
    constructor(props, context) {
        super(props, context);
        this.state = {
            isEditing: props.cellFocused,
            savedValue: props.value,
        };
    }

    componentDidMount() {
        this.checkShouldFocus();
    }

    componentDidUpdate() {
        this.checkShouldFocus();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            !CoreUtils.shallowCompareKeys(this.props, nextProps, { exclude: ["style"] }) ||
            !CoreUtils.shallowCompareKeys(this.state, nextState) ||
            !CoreUtils.deepCompareKeys(this.props, nextProps, ["style"])
        );
    }

    componentWillReceiveProps(nextProps) {
        const { value,cellFocused } = nextProps;
        if (value != null) {
            this.setState({ savedValue: (value), dirtyValue: (value) });
        }
        if(cellFocused!=this.state.isEditing){
            this.setState({isEditing:cellFocused});
            if(cellFocused){
                // console.info("focused on ",this.props.cellIndex);
                this.cellRef.focus();
            }
            // else
            //     console.info("lost focused on ",this.props.cellIndex);
        }
    }

    focuseOn = ()=>{
        this.props.raiseModifyFocuse(this.props.cellIndex);
        this.checkShouldFocus();
    };

    render() {
        const {onCancel, onChange, onConfirm} = this.props;
        const spreadableProps = assign({}, this.props);
        delete spreadableProps.onCancel;
        delete spreadableProps.onChange;
        delete spreadableProps.onConfirm;


        const {isEditing, dirtyValue, savedValue} = this.state;
        const interactive = isEditing;

        let cellContents = null;
            const TextContext = this.props.contextRender;
            cellContents = (
                <TextContext
                    cellIndex={this.props.cellIndex}
                    focused={isEditing}
                    value={dirtyValue}
                    editable={this.props.editable}
                    className={classNames(`${NS}-table-editable-text`, `${NS}-table-editable-name`)}
                    onConfirm={this.handleConfirm}
                    onEdit={this.handleEdit}
                />
            );
        return (
                <Cell
                    {...spreadableProps}
                    wrapText={false}
                    truncated={false}
                    interactive={interactive}
                    cellRef={this.refHandlers.cell}
                    onKeyDown={this.handleKeyPress}
                >
                    <Draggable
                    onActivate={this.handleCellActivate}
                    onClick={this.handleCellDoubleClick}
                    onDoubleClick={this.handleCellDoubleClick}
                    preventDefault={false}
                    stopPropagation={interactive}>
                        {cellContents}
                    </Draggable>
                </Cell>
        );
    }

    checkShouldFocus() {
        if (this.props.cellFocused && !this.state.isEditing) {
            // don't focus if we're editing -- we'll lose the fact that we're editing
            this.cellRef.focus();
        }
    }

    handleKeyPress = (e) => {
        // if (!this.state.isEditing) {
        //     return;
        // }else
            {
            //对enter、tab及上下左右进行响应
            switch (e.keyCode){
                case 13://回车
                case 108://小键盘回车
                case 9://Tab
                case 39://Right Arrow
                    this.props.raiseModifyFocuse(this.props.cellIndex+1);
                    break;
                case 37://left arrow
                    this.props.raiseModifyFocuse(this.props.cellIndex-1);
                    break;
                case 38://Up
                    this.props.raiseModifyFocuse(this.props.cellIndex-this.props.columnSize);
                    break;
                case 40://Down:
                    this.props.raiseModifyFocuse(this.props.cellIndex+this.props.columnSize);
                    break;
            }
            return;
        }
        // setting dirty value to empty string because apparently the text field will pick up the key and write it in there
        this.setState({ isEditing: true, dirtyValue: "", savedValue: this.state.savedValue });
    };

    handleEdit = () => {
        // console.info("Enter to ");
        this.props.raiseModifyFocuse(this.props.cellIndex);
        this.cellRef.focus();
        this.setState({ isEditing: true, dirtyValue: this.state.savedValue });
    };

    handleCancel = (value) => {
        // don't strictly need to clear the dirtyValue, but it's better hygiene
        this.setState({ isEditing: false, dirtyValue: undefined });
        this.invokeCallback(this.props.onCancel, value);
    };

    handleChange = (value) => {
        this.setState({ dirtyValue: value });
        this.invokeCallback(this.props.onChange, value);
    };

    handleConfirm = (value) => {
        this.setState({ isEditing: false, savedValue: value, dirtyValue: undefined });
        this.invokeCallback(this.props.onConfirm, value);
    };

    invokeCallback(callback/*: (value: string, rowIndex?: number, columnIndex?: number) => void*/, value/*: string*/) {
        // pass through the row and column indices if they were provided as props by the consumer
        const { rowIndex, columnIndex } = this.props;
        CoreUtils.safeInvoke(callback, value, rowIndex, columnIndex);
    }

    handleCellActivate = (_event/*: MouseEvent*/) => {
        // this.checkShouldFocus();
        return true;
    };

    handleCellDoubleClick = (_event/*: MouseEvent*/) => {
        this.handleEdit();
    };

}

// const BaseCellExport = HotkeysTarget(CellContainer);
// export {BaseCellExport as default}
export {CellContainer as default}