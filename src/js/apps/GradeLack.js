import React, { Component } from 'react';
import update from 'immutability-helper';
import {
    Button, ButtonToolbar, Col, FormControl, Glyphicon, Grid, Row
} from 'react-bootstrap';
import ReactDataGrid from "react-data-grid";
import SemesterList from "../components/select/SemesterList";
import GradeFlag from "../components/select/GradeFlag";
import DepartmentList from "../components/select/DepartmentList";
import CourseType from "../components/select/CourseType";
import CourseCategory from "../components/select/CourseCategory";
import StudentClassList from "../components/select/StudentClassList";
import CheckState from "../components/select/CheckState";
import MajorList from "../components/select/MajorList";
import $ from 'jQuery';
import AutoFormater from "../components/formaters/AutoFormater";


export default class GradeLack extends Component {
    constructor(props, context) {
        super(props, context);

        this.dataHistory = {};

        this.renderToolbar = ()=>{
            return(
                <div>
                    <Row>
                        <Col md={4}>
                            <SemesterList defaultValue={this.state.semester_id} onChange={(e)=>this.setState({"semester_id":parseInt(e.target.value,10)})}/>
                        </Col>
                        <Col md={4}><GradeFlag defaultValue={this.state.grade_state} onChange={(e)=>this.setState({"grade_state":parseInt(e.target.value,10)})}/></Col>
                        <Col md={4}>
                            <DepartmentList defaultValue={this.state.department_id} onChange={(e)=>this.setState({"department_id":parseInt(e.target.value,10)})}/>
                        </Col>

                        <Col md={4}>
                            <MajorList
                            departmentId={this.state.department_id}
                            defaultValue={this.state.student_major_id}
                            onChange={(e)=>this.setState({"student_major_id":parseInt(e.target.value,10)})} />
                        </Col>
                        <Col md={4}><CourseType defaultValue={this.state.course_type}
                                                onChange={(e)=>this.setState({"course_type":parseInt(e.target.value,10)})}/></Col>

                        <Col md={4}><CourseCategory defaultValue={this.state.course_category} onChange={(e)=>this.setState({"course_category":parseInt(e.target.value,10)})}/></Col>
                        <Col md={4}>
                            <StudentClassList defaultValue={this.state.student_class_id} onChange={(e)=>this.setState({"student_class_id":parseInt(e.target.value,10)})}  />
                        </Col>

                        {/*<Col md={4}><Form horizontal><FormGroup controlId="ExamCourse">*/}
                            {/*<Col md={4}><ControlLabel>考试课程</ControlLabel></Col>*/}
                            {/*<Col md={8}><FormControl  placeholder="考试课程"/></Col>*/}
                        {/*</FormGroup></Form></Col>*/}
                        {/*<Col md={4}><Form horizontal><FormGroup controlId="ExamStudent">*/}
                            {/*<Col md={4}><ControlLabel>考试学生</ControlLabel></Col>*/}
                            {/*<Col md={8}><FormControl  placeholder="考试学生"/></Col>*/}
                        {/*</FormGroup></Form></Col>*/}

                        <Col md={4}><CheckState defaultValue={this.state.check_state} onChange={(e)=>this.setState({"check_state":parseInt(e.target.value,10)})}  /></Col>

                        {/*<Col md={4}><Form horizontal><FormGroup controlId="SortOrder">*/}
                            {/*<Col md={4}><ControlLabel>排序方式</ControlLabel></Col>*/}
                            {/*<Col md={8}><FormControl componentClass="select" placeholder="select">*/}
                                {/*<option value="all">全部</option>*/}
                                {/*<option value="rework">全部重修</option>*/}
                                {/*<option value="makeup">全部补考</option>*/}
                                {/*<option value="Reexamination">全部重考</option>*/}
                                {/*<option value="makeup">全部补考</option>*/}
                                {/*<option value="normal">正常考试</option>*/}
                                {/*<option value="makeup">全部补考</option>*/}
                            {/*</FormControl></Col>*/}
                        {/*</FormGroup></Form></Col>*/}
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
                name:'学年学期'
        },{
            key:'stuname',
            name:'姓名'
        },{
            key:'course_name',
            name:'课程名称'
        },{
            key:'exam_state',
            name:'标志',
            formatter:<AutoFormater renderAssign={this.renderExamState.bind(this)} args={null}/>

        },{
            key:'class_name',
            name:'班级名称'
        },
        //     {
        //     key:'ExamNature',
        //     name:'考试性质'
        // },
            {
            key:'course_nature',
            name:'课程性质'
        },
        //     {
        //     key:'CourseCategory',
        //     name:'课程类别'
        // },
            {
            key:'credits',
            name:'学分'
        },{
            key:'total_classes',
            name:'学时'
        },
        //     {
        //     key:'ExamMethod',
        //     name:'考核方式'
        // },
            {
            key:'reason',
            name:'原因'
        },
        //     {
        //     key:'option',
        //     name:'操作'
        // }
        ];

        this.state = {
            rows: [],
            semester_id:0,
            grade_state:0,
            department_id:0,
            student_major_id:0,
            course_type:0,
            course_category:0,
            check_state:0
        };
        this.loadRows();
    }

    render() {
        return (<Grid fluid={true}>
            {/*<Row><Col md={12}>*/}
                {/*<ButtonToolbar>*/}
                    {/*<Button bsStyle="default" onClick={this.back()}><Glyphicon glyph="menu-left"/>返回</Button>*/}
                {/*</ButtonToolbar>*/}
            {/*</Col></Row>*/}
            <Row><Col md={12}>
                {this.renderToolbar()}
            </Col></Row>
            <ButtonToolbar>
                <Button bsStyle="default" onClick={this.loadRows.bind(this)}><Glyphicon glyph="menu-left"/>查询</Button>
                <Button bsStyle="default" onClick={this.addOne.bind(this)}><Glyphicon glyph="menu-left"/>新增</Button>
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
    loadRows (){
        let that = this;

        let params = {
            semester_id:this.state.semester_id,
            department_id:this.state.department_id,
            major_id:this.state.student_major_id,
            course_category:this.state.course_category,
            course_type:this.state.course_type,
            exam_state_le:3
        };
        this.xhr = $.post(window.baseUrl+'app/grade/queryStudentWithInfo',
            {context:JSON.stringify(params)},function (data) {
                if(data["success"]===true||data["success"]==='true'){
                    let rows = data["result"].map(row=> {row["EDIT"] = false; return row;});
                    console.info(rows);
                    that.setState({rows:rows });
                }
            });
    }

    addOne(){

    }
}