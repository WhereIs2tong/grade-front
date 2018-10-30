import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Column,Cell, Table } from "@blueprintjs/table";

import CellContainer from "./CellContainer";

import {Utils as CoreUtils} from "@blueprintjs/core";

class EditableTable extends Component{
    static propTypes = {
        editable:PropTypes.bool,
        columns: PropTypes.arrayOf(PropTypes.shape({
            key: PropTypes.string.isRequired,//数据列名
            name:PropTypes.string.isRequired,//表头
            editable:PropTypes.oneOfType([PropTypes.bool,PropTypes.func]),
            contextRender:PropTypes.func
        })).isRequired,
        data:PropTypes.arrayOf(PropTypes.object).isRequired,
        onDataChange:PropTypes.func.isRequired
    };
    static defaultProps = {
        editable:true
    };
    
    constructor(props, context) {
        super(props,context);
        
        this.state = {
            rows:this.props.data,
            validateState:[],
            focusedCell:{
                rowIndex:0,
                colIndex:0
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            !CoreUtils.shallowCompareKeys(this.props, nextProps, { exclude: ["data"] }) ||
            !CoreUtils.shallowCompareKeys(this.state, nextState, { exclude: ["focusedCell"] }) ||
            !CoreUtils.deepCompareKeys(this.props, nextProps, ["data"]) ||
            !CoreUtils.deepCompareKeys(this.state, nextState, ["focusedCell"])
        );
    }

    componentWillReceiveProps(nextProps) {
        const {data} = nextProps;
        if (data != null) {
            this.setState({rows: data});
        }
    }

    modifyFocuse = (cellIndex)=>{
        if(cellIndex<0) cellIndex = 0;
        if(cellIndex>this.state.rows.length * this.props.columns.length){
            this.setState({
                "focusedCell":{
                    rowIndex:this.state.rows.length-1,
                    colIndex:this.props.columns.length -1
                }
            });
        }else {
            this.setState({
                "focusedCell":{
                    rowIndex:Math.floor(cellIndex / this.props.columns.length),
                    colIndex:cellIndex % this.props.columns.length
                }
            });
        }
    };

    renderCell = (rowIndex/*: number*/, columnIndex/*: number*/)=>{
        const row = this.state.rows[rowIndex];
        const cell = row[this.props.columns[columnIndex].key];
        // let editable = this.props.columns[columnIndex].editable && row["EDIT"];
        let editable = this.props.columns[columnIndex].editable;
        const columnSize = this.props.columns.length;
        // console.info(rowIndex,columnIndex,cell);
        let isFocused = rowIndex==this.state.focusedCell.rowIndex && columnIndex==this.state.focusedCell.colIndex;
        // if(isFocused){
        //     console.info("Set focused:",rowIndex,columnIndex);
        // }
        return (
            <CellContainer value={cell}
                           columnSize={columnSize}
                           cellIndex={columnSize*rowIndex+columnIndex}
                           cellFocused={isFocused}
                           editable={this.props.editable && editable}
                           raiseModifyFocuse={this.modifyFocuse}
                           contextRender={this.props.columns[columnIndex].contextRender}
                           onConfirm={this.cellSetter(rowIndex,columnIndex)}
            />
        );
    };

    cellSetter = (rowIndex, columnIndex) => {
        const rows = this.state.rows;
        const row = this.state.rows[rowIndex];
        return (value/*: string*/) => {
            //TODO 此处根据配置验证 并验证结果加入到 validateState中
            row[this.props.columns[columnIndex].key] = value;
            this.setState({"rows": rows},()=>{
                CoreUtils.safeInvoke(this.props.onDataChange,rows);
            });
        };
    };

    render(){
        const columns = this.props.columns.map((col, index) => {
            return (
                <Column key={index} cellRenderer={this.renderCell} name={col.name} />
            );
        });
        return (<Table numRows={this.state.rows.length}>{columns}</Table>);
    }
}

export {EditableTable as default}