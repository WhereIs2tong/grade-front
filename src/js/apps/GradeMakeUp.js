import React, { Component } from 'react';
import update from 'immutability-helper';
import {
    Button, ButtonToolbar,Row, Col, ControlLabel, Form, FormControl, FormGroup, Glyphicon, Grid
} from 'react-bootstrap';
import ReactDataGrid from "react-data-grid";
import CourseCategory from "../components/select/CourseCategory";
import CourseType from "../components/select/CourseType";
import StudentClassList from "../components/select/StudentClassList";
import DepartmentList from "../components/select/DepartmentList";
import SemesterList from "../components/select/SemesterList";
import ChargeState from "../components/select/ChargeState";
import MajorList from "../components/select/MajorList";
import {FormField} from "../components/FormField";
export default class GradeMakeUp extends Component {
    constructor(props, context) {
        super(props, context);

        this.dataHistory = {};

        this.renderToolbar = ()=>{
            return(
                <div>
                    <Row>
                        <Col md={4}><SemesterList defaultValue={this.state.semester_id} onChange={(e)=>this.setState({"semester_id":parseInt(e.target.value,10)})}/></Col>
                        <Col md={4}><DepartmentList defaultValue={this.state.department_id} onChange={(e)=>this.setState({"department_id":parseInt(e.target.value,10)})}/></Col>
                        <Col md={4}><MajorList defaultValue={this.state.department_id} onChange={(e)=>this.setState({"department_id":parseInt(e.target.value,10)})}/></Col>
                    </Row><Row>
                        <Col md={4}><StudentClassList defaultValue={this.state.student_class_id} onChange={(e)=>this.setState({"student_class_id":parseInt(e.target.value,10)})}  /></Col>
                        <Col md={4}><CourseType defaultValue={this.course_type} onChange={(e)=>this.setState({"course_type":parseInt(e.target.value,10)})}/></Col>
                        <Col md={4}><CourseCategory defaultValue={this.course_category} onChange={(e)=>this.setState({"course_category":parseInt(e.target.value,10)})}/></Col>
                </Row><Row>
                        <Col md={4}>
                            <FormField
                                title="学生学号"
                                value={this.state.student_number}
                                onChange={(e)=>this.setState({"student_number":e.target.value})} />
                        </Col>
                        <Col md={4}>
                            <FormField title="学生姓名" value={this.state.student_name} onChange={(e)=>this.setState({"student_name":e.target.value})} />
                        </Col>
                        <Col md={4}>
                            <FormField title="课程名称" value={this.state.course_name} onChange={(e)=>this.setState({"course_name":e.target.value})} />
                        </Col>
                    </Row>
                    <Row style={{display:"none"}}>
                        <Col md={4}>
                            <ChargeState defaultValue={this.charge_state} onChange={(e)=>this.setState({"charge_state":parseInt(e.target.value,10)})}/>
                        </Col>
                        <Col md={4}><FormGroup>
                                <Col md={2}><ControlLabel>应交费用：</ControlLabel></Col>
                                <Col md={2} style={{paddingRight:0}}>
                                    <FormControl componentClass="select">
                                        <option value="1">=</option>
                                        <option value="2">&gt;</option>
                                        <option value="3">&gt;=</option>
                                        <option value="4">&lt;</option>
                                        <option value="5">&lt;=</option>
                                        <option value="6">!=</option>
                                    </FormControl>
                                </Col>
                                <Col md={2} style={{paddingLeft:0}}><FormControl></FormControl></Col>
                                <Col md={1}><FormControl.Static>且</FormControl.Static></Col>
                                <Col md={2} style={{paddingRight:0}}>
                                    <FormControl componentClass="select" >
                                        <option value="1">=</option>
                                        <option value="2">&gt;</option>
                                        <option value="3">&gt;=</option>
                                        <option value="4">&lt;</option>
                                        <option value="5">&lt;=</option>
                                        <option value="6">!=</option>
                                    </FormControl>
                                </Col>
                                <Col md={2} style={{paddingLeft:0}}><FormControl></FormControl></Col>
                            </FormGroup></Col>
                            <Col md={4}><FormGroup>
                                <Col md={2}><ControlLabel>总成绩：</ControlLabel></Col>
                                <Col md={2} style={{paddingRight:0}}>
                                    <FormControl componentClass="select">
                                        <option value="1">=</option>
                                        <option value="2">&gt;</option>
                                        <option value="3">&gt;=</option>
                                        <option value="4">&lt;</option>
                                        <option value="5">&lt;=</option>
                                        <option value="6">!=</option>
                                    </FormControl>
                                </Col>
                                <Col md={2} style={{paddingLeft:0}}><FormControl></FormControl></Col>
                                <Col md={1}><FormControl.Static>且</FormControl.Static></Col>
                                <Col md={2} style={{paddingRight:0}}>
                                    <FormControl componentClass="select" >
                                        <option value="1">=</option>
                                        <option value="2">&gt;</option>
                                        <option value="3">&gt;=</option>
                                        <option value="4">&lt;</option>
                                        <option value="5">&lt;=</option>
                                        <option value="6">!=</option>
                                    </FormControl>
                                </Col>
                                <Col md={2} style={{paddingLeft:0}}><FormControl></FormControl></Col>
                            </FormGroup></Col>
                </Row>
                    <Row style={{display:"none"}}>
                            <Col md={4}><FormGroup>
                                <Col md={2}><ControlLabel>课程人次：</ControlLabel></Col>
                                <Col md={2} style={{paddingRight:0}}>
                                    <FormControl componentClass="select">
                                        <option value="1">=</option>
                                        <option value="2">&gt;</option>
                                        <option value="3">&gt;=</option>
                                        <option value="4">&lt;</option>
                                        <option value="5">&lt;=</option>
                                        <option value="6">!=</option>
                                    </FormControl>
                                </Col>
                                <Col md={2} style={{paddingLeft:0}}><FormControl></FormControl></Col>
                                <Col md={1}><FormControl.Static>且</FormControl.Static></Col>
                                <Col md={2} style={{paddingRight:0}}>
                                    <FormControl componentClass="select" >
                                        <option value="1">=</option>
                                        <option value="2">&gt;</option>
                                        <option value="3">&gt;=</option>
                                        <option value="4">&lt;</option>
                                        <option value="5">&lt;=</option>
                                        <option value="6">!=</option>
                                    </FormControl>
                                </Col>
                                <Col md={2} style={{paddingLeft:0}}><FormControl></FormControl></Col>
                            </FormGroup></Col>
                        <Col md={4}><Form horizontal><FormGroup controlId="SubmitFlag">
                            <Col md={4}><ControlLabel>提交标志</ControlLabel></Col>
                            <Col md={8}><FormControl componentClass="select" placeholder="select">
                                <option value="all">全部</option>
                                <option value="rework">全部重修</option>
                                <option value="makeup">全部补考</option>
                                <option value="Reexamination">全部重考</option>
                                <option value="makeup">全部补考</option>
                                <option value="normal">正常考试</option>
                                <option value="makeup">全部补考</option>
                            </FormControl></Col>
                        </FormGroup></Form></Col>
                        <Col md={4}><Form horizontal><FormGroup controlId="SortOrder">
                            <Col md={4}><ControlLabel>排序方式</ControlLabel></Col>
                            <Col md={8}><FormControl componentClass="select" placeholder="select">
                                <option value="all">全部</option>
                                <option value="rework">全部重修</option>
                                <option value="makeup">全部补考</option>
                                <option value="Reexamination">全部重考</option>
                                <option value="makeup">全部补考</option>
                                <option value="normal">正常考试</option>
                                <option value="makeup">全部补考</option>
                            </FormControl></Col>
                        </FormGroup></Form></Col>
                    </Row>
                </div>
            );
        };

        this._columns = [{
            key: 'id',
            name: '序号',
            width: 80
        },{
            key:'DepartmentName',
            name:'院系名称'
        },{
            key:'PersonCount',
            name:'统计人次'
        },{
            key:'MoneyAmount',
            name:'统计金额'
        }];

        this.state = { rows: [] };
        this.loadRows();
    }

    render() {
        return (<Grid fluid={true}>
            <Row><Col md={12}>
                <ButtonToolbar>
                    <Button bsStyle="default" onClick={this.back()}><Glyphicon glyph="menu-left"/>返回</Button>
                </ButtonToolbar>
            </Col></Row>
            <Row><Col md={12}>
                {this.renderToolbar()}
            </Col></Row>
            <Row><Col md={12}>
                <ReactDataGrid
                    enableCellSelect={true}
                    columns={this._columns}
                    rowGetter={this.rowGetter}
                    rowsCount={this.state.rows.length}
                    minHeight={500}
                    onGridRowsUpdated={this.handleGridRowsUpdated}/>
            </Col></Row>
        </Grid>)
    }

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

    loadRows = () => {
        let that = this;

        const data = {
            "success": true,
            "resultCode": 1000,
            "result": [
                {
                    "DepartmentName": "司法行政管理系",
                    "PersonCount": "1",
                    "MoneyAmount": "100"
                }
            ]
        };

        if (data["success"] === true || data["success"] === 'true') {
            let rows = data["result"].map(row => {
                row["EDIT"] = false;
                return row;
            });
            console.info(rows);
            // that.setState({rows:rows });
            this.state = {rows: rows};
        }
    };

    back=()=>{

    };


}