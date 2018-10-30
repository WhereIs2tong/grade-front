import React, { Component } from 'react';

import $ from 'jQuery';

import {Button, ButtonToolbar, Col, FormGroup, Glyphicon, Grid, Label, Row} from 'react-bootstrap';
import {Help,ModalDialog} from '../components'
import GradeInputDetails from "./GradeInputDetails";
import {Table,UserOptionalCell,SwithCell,DateInputCell,handleBooleanChange} from "../components/table"
import {Switch } from "@blueprintjs/core";

export default class GradeControl extends Component {
    constructor(props, context) {
        super(props, context);

        const that = this;

        this.renderInputDetails = (props)=>{
            let cellIndex = props.cellIndex;
            return <Button bsStyle="default" bsSize="small" onClick={that.showInputDetails(cellIndex)}>录入情况</Button>
        };
        this.InputDetails = (props)=>{
            return (<UserOptionalCell cellRenderer={that.renderInputDetails} {...props} />)
        };

        this._columns = [
            {
                key: 'academic_year',
                name: '学年学期号',
                editable: false
            },
            {
                key: 'start_date',
                name: '开始日期',
                editable: true,
                contextRender:DateInputCell
            },
            {
                key: 'end_date',
                name: '结束日期',
                editable: true,
                contextRender:DateInputCell
            },
            {
                key: 'enable_control',
                name: '开启录入控制',
                editable: true,
                contextRender:SwithCell
            },
            {
                key: 'enable_check',
                name: '开启审批',
                editable: true,
                contextRender:SwithCell
            },
            {
                key: 'enable_apply',
                name: '开启审核',
                editable: true,
                contextRender:SwithCell
            },
            {
                key: 'show',
                name: '查看',
                width: 100,
                contextRender:this.InputDetails
            }
        ];

        this.state = {
            rows: [] ,
            editable:false,//表格整体是否可修改
            dataState:0,//数据状态： 0--加载中  1--加载完毕  2--修改中，未提交  3--提交中 4--提交失败
            showDetails:false, //显示详情页面
            ac_year_id_of_detail:0, //详情页面的学期
            academic_year_of_detail:''
        };
        this.loadRows();
    }

    showInputDetails=(cellIndex)=>{
        let rowNo = Math.floor(cellIndex / this._columns.length);
        return (e)=> {
            let yearId = this.state.rows[rowNo]["ac_year_id"];
            let academic_year = this.state.rows[rowNo]["academic_year"];
            console.info(yearId);
            //弹出录入详情窗口
            this.setState({ac_year_id_of_detail: yearId, academic_year_of_detail: academic_year, showDetails: true});
        }
    };

    finishEdit = (e)=>{
        const that = this;
        that.setState({dataState:3});
        //请求后台成功后刷新状态
        let arr = [];
        for (let i=0;i<this.state.rows.length;i++){
            let params = {
                ac_year_id : that.state.rows[i]["ac_year_id"],
                start_date : that.state.rows[i]["start_date"],
                end_date : that.state.rows[i]["end_date"],
                enable_control : that.state.rows[i]["enable_control"],
                enable_check : that.state.rows[i]["enable_check"],
                enable_apply : that.state.rows[i]["enable_apply"]
            };
            arr.push(params);
        }
        $.post(window.baseUrl+'app/grade/addGradeControlBatch',
            {context:JSON.stringify(arr)},
            function (data) {
                if(data["success"]===true||data["success"]==='true'){
                    // that.loadRows();
                    that.setState({rows:that.state.rows,dataState:1});
                    // that.setState({teacherList:options});
                }else{
                    that.setState({dataState:4 });
                }
            });
    };

    static stateMap=["加载中","已同步","修改中","提交中","提交失败","加载失败"];
    render() {
        let closeDetails = () => this.setState({ showDetails: false });

        return (
            <Grid>
                <ButtonToolbar>
                    <Button bsStyle="default" style={{"backgroundColor":"transparent"}} disabled={true}><Switch checked={this.state.editable} label="是否允许修改" onChange={handleBooleanChange((bool)=>this.setState({editable:bool}))} ></Switch></Button>
                    <Button bsStyle="default" disabled={this.state.dataState!=2 && this.state.dataState!=4} onClick={this.finishEdit}>提交</Button>
                    <Button bsStyle="default" style={{"backgroundColor":"transparent"}} disabled={true}><Label bsStyle="default">{GradeControl.stateMap[this.state.dataState]}</Label></Button>
                </ButtonToolbar>
                <ModalDialog ref={ref=>this.detailDialog=ref } title="成绩录入控制--录入情况" show={this.state.showDetails} onHide={closeDetails}>
                    <GradeInputDetails academic_year={this.state.academic_year_of_detail} ac_year_id={this.state.ac_year_id_of_detail}  onClose={closeDetails}/>
                </ModalDialog>
                <Row>
                    <Col md={12}>
                        <Table editable={this.state.editable} columns={this._columns} data={this.state.rows} onDataChange={this.handleDataChange}/>
                    </Col>
                </Row>
            </Grid>
        );
    }

    handleDataChange = (rowData)=>{
        // console.info("Table data changed:",rowData);
        this.setState({"rows":rowData,dataState:2});
    };

    loadRows = () => {
        let that = this;
        $.post(window.baseUrl+'app/grade/queryGradeControl',{},function (data) {
            if(data["success"]===true||data["success"]==='true'){
                let rows = data["result"];
                console.info(rows);
                that.setState({rows:rows,dataState:1 });
                // this.state = {rows:rows };
            }else {
                that.setState({dataState:5 });
            }
        });
    };
}
