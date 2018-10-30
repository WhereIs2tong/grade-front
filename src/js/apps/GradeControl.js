import React, { Component } from 'react';
import ReactDataGrid  from 'react-data-grid';

import update from 'immutability-helper';
import $ from 'jQuery';

import {Button,ButtonToolbar,FormGroup,Glyphicon} from 'react-bootstrap';
import { Intent } from "@blueprintjs/core";
import { Column,Cell, Table } from "@blueprintjs/table";

import {EditableCell} from "../components/cell/EditableCell";


import {BooleanEditor,DateEditor,Help,BooleanFormater,DateFormater,AutoFormater,ModalDialog} from '../components'
import GradeInputDetails from "./GradeInputDetails";

const nullAsObj = (obj)=>obj == null ? {}:obj ;

export default class GradeControl extends Component {
    constructor(props, context) {
        super(props, context);

        const that = this;
        this.dataHistory = {};

        this.beginEdit = (e)=>{
            console.info(e);
            let rowNo = e.target.getAttribute("rowno");
            that.dataHistory[rowNo]=that.state.rows[rowNo];
            that.state.rows[rowNo]["EDIT"] = true;
            that.setState({rows:that.state.rows});
        };

        this.cancelEdit = (e)=>{
            let rowNo = e.target.getAttribute("rowno");
            that.state.rows[rowNo] = that.dataHistory[rowNo];
            that.state.rows[rowNo]["EDIT"] = false;
            that.setState({rows:that.state.rows});
        };

        this.finishEdit = (e)=>{
            let rowNo = e.target.getAttribute("rowno");
            that.state.rows[rowNo]["EDIT"] = false;

            //请求后台成功后刷新状态
            let params = {
                ac_year_id : that.state.rows[rowNo]["ac_year_id"],
                start_date : that.state.rows[rowNo]["start_date"],
                end_date : that.state.rows[rowNo]["end_date"],
                enable_control : that.state.rows[rowNo]["enable_control"],
                enable_check : that.state.rows[rowNo]["enable_check"],
                enable_apply : that.state.rows[rowNo]["enable_apply"]
            };
            $.post(window.baseUrl+'app/grade/addGradeControl',
                {context:JSON.stringify(params)},
                function (data) {
                    if(data["success"]===true||data["success"]==='true'){
                        // that.loadRows();
                        that.setState({rows:that.state.rows});
                        // that.setState({teacherList:options});
                    }
                });


        };

        this.renderToolbar = (props, args)=>{
            let lineNo = props.rowIdx;
            if(that.state.rows[lineNo]["EDIT"]){
                return <FormGroup>
                    <Button bsStyle="default" rowno={lineNo} onClick={that.finishEdit}>完成</Button>
                    <Button bsStyle="default" rowno={lineNo} onClick={that.cancelEdit}>取消</Button>
                </FormGroup>
            }else {
                return <Button bsStyle="default" rowno={lineNo} onClick={that.beginEdit}>修改</Button>
            }
        };
        this.OperationFormat = <AutoFormater renderAssign={this.renderToolbar} args={null}/>;

        this.showInputDetails=(e)=>{
            let rowNo = e.target.getAttribute("rowno");
            let yearId = that.state.rows[rowNo]["ac_year_id"];
            let academic_year = that.state.rows[rowNo]["academic_year"];
            console.info(yearId);
            //弹出录入详情窗口
            that.setState({ac_year_id_of_detail:yearId,academic_year_of_detail:academic_year,showDetails:true});
        };

        this.renderInputDetails = (props,args)=>{
            let lineNo = props.rowIdx;
            return <Button bsStyle="default" rowno={lineNo} onClick={that.showInputDetails}>录入情况</Button>
        };

        this.InputDetails = <AutoFormater renderAssign={this.renderInputDetails} args={null}/>;

        this._columns = [
            {
                key: 'id',
                name: '序号',
                width: 80
            },
            {
                key: 'academic_year',
                name: '学年学期号',
                editable: false
            },
            {
                key: 'start_date',
                name: '开始日期',
                editable: true,
                formatter: DateFormater,
                editor:<DateEditor data={this.getRows}/>
            },
            {
                key: 'end_date',
                name: '结束日期',
                editable: true,
                formatter: DateFormater,
                editor:<DateEditor data={this.getRows}/>
            },
            {
                key: 'enable_control',
                name: '开启录入控制',
                editable: true,
                formatter: BooleanFormater,
                editor:<BooleanEditor data={this.getRows}/>
            },
            {
                key: 'enable_check',
                name: '开启审批',
                editable: true,
                formatter: BooleanFormater,
                editor:<BooleanEditor data={this.getRows}/>
            },
            {
                key: 'enable_apply',
                name: '开启审核',
                editable: true,
                formatter: BooleanFormater,
                editor:<BooleanEditor data={this.getRows}/>
            },
            {
                key: 'option',
                name: '操作',
                width: 120,
                formatter:this.OperationFormat
            },
            {
                key: 'show',
                name: '查看',
                width: 100,
                formatter:this.InputDetails
            }
        ];

        this.state = {
            rows: [] ,
            showDetails:false, //显示详情页面
            ac_year_id_of_detail:0, //详情页面的学期
            academic_year_of_detail:'',
            validateState:{}//验证状态，二维Map  rowIndex -> colIndex -> boolean(是否通过，true--未通过)
        };
        this.loadRows();
    }

    getRows=()=>{
        return this.state.rows;
    };

    cellSetter = (rowIndex, columnIndex) => {
        const rows = this.state.rows;
        const row = this.state.rows[rowIndex];
        return (value/*: string*/) => {
            //TODO 此处根据配置验证 并验证结果加入到 validateState中
            row[this._columns[columnIndex].key] = value;
            this.setState({"rows": rows});
        };
    };

    renderCell = (rowIndex/*: number*/, columnIndex/*: number*/)=>{
        const row = this.state.rows[rowIndex];
        const cell = row[this._columns[columnIndex].key];
        // let editable = this._columns[columnIndex].editable && row["EDIT"];
        let editable = this._columns[columnIndex].editable;
        // console.info(rowIndex,columnIndex,cell);
        if(editable){
            return (
                <EditableCell
                    value={cell == null ? "" : cell}
                    interactive="true"
                    intent={(nullAsObj(this.state.validateState[rowIndex])[columnIndex]||false)?Intent.DANGER:null}
                    onCancel={this.cellSetter(rowIndex, columnIndex)}
                    onChange={this.cellSetter(rowIndex, columnIndex)}
                    onConfirm={this.cellSetter(rowIndex, columnIndex)}
                />
            );
        }else{
            return (
                <Cell intent={(nullAsObj(this.state.validateState[rowIndex])[columnIndex]||false)?Intent.DANGER:null}>{cell}</Cell>
            );
        }
    };

    render() {
        let closeDetails = () => this.setState({ showDetails: false });

        const columns = this._columns.map((col, index) => {
            return (
                <Column key={index} cellRenderer={this.renderCell} name={col.name} />
            );
        });

        return (
            <div className="GradeControl">
                <ButtonToolbar>
                    <Button bsStyle="default" onClick={this.doSetting()}><Glyphicon glyph="wrench" />设置</Button>
                    <Help link="https://www.baidu.com/"/>
                </ButtonToolbar>
                <ReactDataGrid
                    enableCellSelect={true}
                    columns={this._columns}
                    rowGetter={this.rowGetter}
                    rowsCount={this.state.rows.length}
                    minHeight={500}
                    onGridRowsUpdated={this.handleGridRowsUpdated} />
                <ModalDialog ref={ref=>this.detailDialog=ref } title="成绩录入控制--录入情况" show={this.state.showDetails} onHide={closeDetails}>
                    <GradeInputDetails academic_year={this.state.academic_year_of_detail} ac_year_id={this.state.ac_year_id_of_detail}  onClose={closeDetails}/>
                </ModalDialog>
                <Table numRows={this.state.rows.length}>
                    {columns}
                </Table>
            </div>
        );
    }

    loadRows = () => {
        let that = this;
        $.post(window.baseUrl+'app/grade/queryGradeControl',{},function (data) {
            if(data["success"]===true||data["success"]==='true'){
                let rows = data["result"].map(row=> {row["EDIT"] = false; return row;});
                console.info(rows);
                that.setState({rows:rows });
                // this.state = {rows:rows };
            }
        });
    };

    rowGetter = (i) => {
        let row = this.state.rows[i];
        row["id"] = i+1;
        return row;
    };

    handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        let rows = this.state.rows.slice();

        for (let i = fromRow; i <= toRow; i++) {
            let rowToUpdate = rows[i];
            let updatedRow = update(rowToUpdate, {$merge: updated});
            rows[i] = updatedRow;
        }

        this.setState({ rows });
    };

    doSetting=()=>{
        //TODO 弹出配置界面
    };
}
