import classNames from "classnames";
import * as React from "react";
import PropTypes from 'prop-types';
import assign from 'object-assign';

import {
    DISPLAYNAME_PREFIX,
    EditableText,
    Hotkey,
    Hotkeys,
    HotkeysTarget,
    Utils as CoreUtils,
} from "@blueprintjs/core";
import { Classes } from "@blueprintjs/core";

import {Draggable, Cell} from "@blueprintjs/table";

const NS = Classes.getClassNamespace();

class EditableCell extends React.Component{
    static displayName = `${DISPLAYNAME_PREFIX}.EditableCell`;
    static propTypes = assign({},{
        isFocused:PropTypes.bool,
        value: PropTypes.string,
        // onCancel?: (value: string, rowIndex?: number, columnIndex?: number) => void;
        onCancel:PropTypes.func,
        onChange:PropTypes.func,
        onConfirm:PropTypes.func,
    // onChange?: (value: string, rowIndex?: number, columnIndex?: number) => void;
    // onConfirm?: (value: string, rowIndex?: number, columnIndex?: number) => void;
    },Cell.propTypes);
    static defaultProps = {
        truncated: true,
        wrapText: false,
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
            isEditing: false,
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
        const { value } = nextProps;
        if (value != null) {
            this.setState({ savedValue: value, dirtyValue: value });
        }
    }

    render() {
        const { onCancel, onChange, onConfirm, truncated, wrapText } = this.props;
        const spreadableProps = assign({},this.props);
        delete spreadableProps.onCancel;
        delete spreadableProps.onChange;
        delete spreadableProps.onConfirm;
        delete spreadableProps.truncated;
        delete spreadableProps.wrapText;

        const { isEditing, dirtyValue, savedValue } = this.state;
        const interactive = spreadableProps.interactive || isEditing;

        let cellContents = null;
        if (isEditing) {
            cellContents = (
                <EditableText
                    isEditing={true}
                    disabled={false}
                    className={classNames(`${NS}-table-editable-text`, `${NS}-table-editable-name`)}
                    intent={spreadableProps.intent}
                    minWidth={null}
                    onCancel={this.handleCancel}
                    onChange={this.handleChange}
                    onConfirm={this.handleConfirm}
                    onEdit={this.handleEdit}
                    placeholder=""
                    selectAllOnFocus={false}
                    value={dirtyValue}
                />
            );
        } else {
            const textClasses = classNames(`${NS}-table-editable-text`, {
                [`${NS}-table-truncated-text`]: truncated,
                [`${NS}-table-no-wrap-text`]: !wrapText,
            });

            cellContents = <div className={textClasses}>{savedValue}</div>;
        }

        return (
                <Draggable
                    onActivate={this.handleCellActivate}
                    onClick={this.handleCellDoubleClick}
                    onDoubleClick={this.handleCellDoubleClick}
                    preventDefault={false}
                    stopPropagation={interactive}
                >
                    <Cell
                        {...spreadableProps}
                        wrapText={wrapText}
                        truncated={false}
                        interactive={interactive}
                        cellRef={this.refHandlers.cell}
                        onKeyPress={this.handleKeyPress}
                    >
                    {cellContents}
                    </Cell>
                </Draggable>
        );
    }

    renderHotkeys() {
        return (
            <Hotkeys>
                <Hotkey
                    key="edit-cell"
                    label="Edit the currently focused cell"
                    group="Table"
                    combo="f2"
                    onKeyPress={this.handleEdit}
                />
            </Hotkeys>
        );
    }

    checkShouldFocus() {
        if (this.props.isFocused && !this.state.isEditing) {
            // don't focus if we're editing -- we'll lose the fact that we're editing
            this.cellRef.focus();
        }
    }

    handleKeyPress = (e) => {
        if (!this.props.isFocused) {
            return;
        }
        if(this.state.isEditing){
            //对enter、tab及上下左右进行响应
            switch (e.keyCode){
                case 13://回车
                case 108://小键盘回车
                case 9://Tab


            }
            if(e.keyCode === 13 || e.keyCode === 108){
                //回车
            }else if(e.keyCode === 9){

            }
            return;
        }
        // setting dirty value to empty string because apparently the text field will pick up the key and write it in there
        this.setState({ isEditing: true, dirtyValue: "", savedValue: this.state.savedValue });
    };

    handleEdit = () => {
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

const EditableCellExport = HotkeysTarget(EditableCell);
export {EditableCellExport as default,EditableCellExport as EditableCell}
// export {EditableCell as default}