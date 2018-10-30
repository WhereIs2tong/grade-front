import React, { Component } from 'react';
import update from 'immutability-helper';
import {
    Button, ButtonToolbar, Col, ControlLabel, FormControl, FormGroup, Grid, Row
} from "react-bootstrap";
import ReactDataGrid from "react-data-grid";
// import PropTypes from 'prop-types';
import {FormField} from "../components/FormField";
import AutoFormater from "../components/formaters/AutoFormater";
import $ from 'jQuery';

import SemesterList from "../components/select/SemesterList";
import DepartmentList from "../components/select/DepartmentList";
import ExamType from "../components/select/ExamType";
import StudentClassList from "../components/select/StudentClassList";
import CourseCategory from "../components/select/CourseCategory";
import CourseType from "../components/select/CourseType";
import GradeFlag from "../components/select/GradeFlag";
import MajorList from "../components/select/MajorList";
import CourseList from "../components/select/CourseList";

export default class StudentScoreBase extends Component {
    constructor(props, context) {
        super(props, context);

        this.renderToolbar = ()=>{
            return (
                <div>
                    <Row>
                        <Col md={4}><SemesterList
                            defaultValue={this.state.semester_id}
                            onChange={(e)=>this.setState({"semester_id":parseInt(e.target.value,10)})}/></Col>
                        <Col md={4}><DepartmentList label="上课院系"
                            defaultValue={this.state.department_id}
                            onChange={(e)=>this.setState({"department_id":parseInt(e.target.value,10)})}/></Col>
                        <Col md={4}><ExamType
                            defaultValue={this.state.exam_type}
                            onChange={(e)=>this.setState({"exam_type":parseInt(e.target.value,10)})} /></Col>
                        <Col md={4}>
                            <MajorList
                                departmentId={this.state.department_id}
                                defaultValue={this.state.student_major_id}
                                onChange={(e)=>this.setState({"student_major_id":parseInt(e.target.value,10)})} />
                        </Col>
                        <Col md={4}><StudentClassList teaching_task_id={this.state.teaching_task_id}
                            defaultValue={this.state.student_class_id}
                            onChange={(e)=>this.setState({"student_class_id":parseInt(e.target.value,10)})}  /></Col>
                        <Col md={4}><CourseType
                            defaultValue={this.state.course_type}
                            onChange={(e)=>this.setState({"course_type":parseInt(e.target.value,10)})}/></Col>
                        <Col md={4}><CourseCategory
                            defaultValue={this.state.course_category}
                            onChange={(e)=>this.setState({"course_category":parseInt(e.target.value,10)})}/></Col>
                        <Col md={4}>
                            <FormField
                                title="学生学号"
                                value={this.state.student_number}
                                onChange={(e)=>this.setState({"student_number":e.target.value})} />
                        </Col>
                        <Col md={4}>
                            <FormField title="课程编码" value={this.state.course_code} onChange={(e)=>this.setState({"course_code":e.target.value})} />
                        </Col>
                        <Col md={4}>
                            <FormField title="学生姓名" value={this.state.student_name} onChange={(e)=>this.setState({"student_name":e.target.value})} />
                        </Col>
                        <Col md={4}>
                            <FormField title="课程名称" value={this.state.course_name} onChange={(e)=>this.setState({"course_name":e.target.value})} />
                        </Col>
                        <Col md={4}>
                            <CourseList defaultValue={this.state.teaching_task_id}
                                        departments={this.state.department_id}
                                        majod_id={this.state.student_major_id}
                                        course_name={this.state.course_name}
                                        exam_type={this.state.exam_type} semester_id={this.state.semester_id}
                                        onChange={(e)=>this.setState({"teaching_task_id":parseInt(e.target.value,10)})} />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}><FormGroup>
                            <Col md={2}><ControlLabel>总成绩：</ControlLabel></Col>
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
                            <Col md={6} style={{paddingLeft:0}}><FormControl></FormControl></Col>
                        </FormGroup></Col>
                        <Col md={4}><FormGroup>
                            <Col md={2}><ControlLabel>学分：</ControlLabel></Col>
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
                            <Col md={6} style={{paddingLeft:0}}><FormControl></FormControl></Col>
                        </FormGroup></Col>
                        <Col md={4}><GradeFlag defaultValue={this.state.grade_flag} onChange={(e)=>this.setState({"grade_flag":parseInt(e.target.value,10)})}  /></Col>

                    </Row>
                </div>
            );
        };

        this._columns = [{
            key: 'id',
            name: '序号',
            width: 80
        },{
            key:'semester',
            name:'开课学期'
        },{
            key:'student_number',
            name:'学号'
        },{
            key:'stuname',
            name:'姓名'
        },{
            key:'course_code',
            name:'课程编码'
        },{
            key:'course_name',
            name:'课程名称'
        },{
            key:'class_name',
            name:'班级名称'
        },{
            key:'totel_grade',
            name:'总成绩'
        },{
            key:'credits',
            name:'学分'
        },{
            key:'total_classes',
            name:'学时'
        },{
            key:'course_nature',
            name:'课程性质'
        },
        //     {
        //     key:'CourseCategory',
        //     name:'课程类别'
        // },{
        //     key:'ExamNature',
        //     name:'考试性质'
        // },
            {
                key:'exam_state',
                name:'标志',
                formatter:<AutoFormater renderAssign={this.renderExamState.bind(this)} args={null}/>

            },
        //     {
        //     key:'ClassID',
        //     name:'开课序号'
        // },
            {
            key:'teacher_name' ,
            name:'任课老师'
        }
        ];

        this._columns.forEach(col=>col.resizable=true);

        this.state = {
            rows: [] ,
            semester_id:0,
            department_id:0,
            student_major_id:0,
            exam_type:0,
            student_class_id:0,
            teaching_task_id:0,
            course_category:0,
            course_type:0,
            student_number:'',
            course_code:'',
            student_name:'',
            course_name:'',
            grade_flag:0,
        };
        // this.loadRows();
    }

    renderExamState(props, args){
        const examStateMap = {
            "0":"未录入",
            "1":"及格",
            "2":"不及格",
            "3":"缓考",
            "4":"缺考"
        };

        let lineNo = props.rowIdx;
        let exam_state = this.state.rows[lineNo]["exam_state"];
        let stateString = examStateMap[""+exam_state];
        console.info(exam_state,stateString);
        return(
            <FormControl.Static>{stateString || ''}</FormControl.Static>
        );
    };

    render() {
        return (<Grid fluid={true}>
            <Row><Col md={12}>
                {this.renderToolbar()}
            </Col></Row>
            <ButtonToolbar>
                <Button onClick={this.loadRows.bind(this)}>搜索</Button>
            </ButtonToolbar>
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
    componentWillUnmount() {
        if(this.xhr)
            this.xhr.abort();
    }
    loadRows = () => {
        let that = this;

        let params = {
            semester_id:this.state.semester_id,
            department_id:this.state.department_id,
            major_id:this.state.student_major_id,
            exam_type:this.state.exam_type,
            class_id:this.state.student_class_id,
            teaching_task_id:this.state.teaching_task_id,
            course_category:this.state.course_category,
            course_type:this.state.course_type,
            student_number:this.state.student_number,
            course_code:this.state.course_code,
            student_name:this.state.student_name,
            course_name:this.state.course_name,
        };
        this.xhr = $.post(window.baseUrl+'app/grade/queryStudentWithInfo',
            {context:JSON.stringify(params)},function (data) {
                if(data["success"]===true||data["success"]==='true'){
                    let rows = data["result"].map(row=> {row["EDIT"] = false; return row;});
                    console.info(rows);
                    that.setState({rows:rows });
                }
            });
    };

}