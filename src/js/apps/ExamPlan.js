import React, { Component } from 'react';
import update from 'immutability-helper';
import {
    Button, ButtonToolbar, Col, FormControl, FormGroup, Grid, Popover, Row, ToggleButton, ToggleButtonGroup
} from "react-bootstrap";
import ReactDataGrid from "react-data-grid";
import {DepartmentList,SemesterList,ResearchPostionList,StudentClassList,TeacherList,CourseList2} from "../components/select";
import AutoFormater from "../components/formaters/AutoFormater";
import $ from 'jQuery';

export default class ExamPlan extends Component {
    static propTypes = {
    };
    constructor(props, context) {
        super(props, context);

        this.renderToolbar = ()=>{
            return (
                <div>
               <Row>
                   <Col md={4}><SemesterList
                       defaultValue={this.state.semester_id}
                       onChange={(e)=>this.setState({"semester_id":parseInt(e.target.value,10)})}/></Col>
                   <Col md={4}><DepartmentList
                       defaultValue={this.state.department_id}
                       onChange={(e)=>this.setState({"department_id":parseInt(e.target.value,10)})}/></Col>
                   <Col md={4}><ResearchPostionList
                       departmentId={this.state.department_id}
                       defaultValue={this.state.rp_id}
                       onChange={(e)=>this.setState({"rp_id":parseInt(e.target.value,10)})}/></Col>
               </Row><Row>
                   <Col md={4}><TeacherList
                       semester_id={this.state.semester_id} departmentId={this.state.department_id}
                       researchPositionId={this.state.rp_id} defaultValue={this.state.teacher_id}
                       onChange={(e)=>this.setState({"teacher_id":parseInt(e.target.value,10)})}  /></Col>
                   <Col md={4}>
                       <CourseList2 defaultValue={this.state.course_id}
                                    faculty={this.state.department_id}
                                    teaching_research_id={this.state.rp_id}
                                   onChange={(e)=>this.setState({"course_id":parseInt(e.target.value,10)})} />
                   </Col>
                   <Col md={4}><StudentClassList
                       defaultValue={this.state.class_id} teaching_task_id={this.state.teaching_task_id}
                       onChange={(e)=>this.setState({"class_id":parseInt(e.target.value,10)})}  /></Col>
               </Row>
                </div>
            );
        };

        this.renderInputDetails = (props,args)=>{
            let lineNo = props.rowIdx;
            let exam_plan_id = this.state.rows[lineNo]["exam_plan_id"];
            return (<FormGroup>
                {
                    !!exam_plan_id?
                        (<FormControl.Static>已创建</FormControl.Static>):
                        (<Button bsStyle="default" rowno={lineNo} onClick={this.makeExamPlan.bind(this)}>生成考试</Button>)
                }
            </FormGroup>)
        };

        this.poperOverState =(props) => {
            let lineNo = props.rowIdx;
            let exam_plan_id = this.state.rows[lineNo]["exam_plan_id"];
            return (<Popover id="popover-positioned-scrolling-top" title="状态">
                <strong>{!!exam_plan_id ? "已生成" :"未生成"}</strong>
            </Popover>)
        };

        this.InputDetails = <AutoFormater popoverFunc={this.poperOverState.bind(this)} renderAssign={this.renderInputDetails.bind(this)} args={null}/>;

        this._columns = [
            {
                key: '_id',
                name: '序号',
                width: 80
            },
            {
                key:'semester',
                name:'学期'
            },
            {
                key:'course_name',
                name:'课程'
            },
            {
                key:'major_name',
                name:'专业'
            },
            {
                key:'departments_name',
                name:'院系'
            },
            {
                key:'teaching_research_name',
                name:'教研室'
            },
            {
                key:'class_name',
                name:'班级'
            },
            {
                key:'student_count',
                name:'学生人数'
            },
            {
                key:'nature',
                name:'课程类型'
            },
            {
                key:'teacher_name',
                name:'教师'
            },
            {
                key:'exam_plan_id',
                name:'操作',
                width: 160,
                formatter:this.InputDetails
            }
        ];

        this.state = {
            rows: [],
            semester_id:0,
            exam_type:0,
            department_id:0,
            rp_id:0,//教研室
            teacher_id:0,
            course_id:0,
            class_id:0,
            queryCondition:[]
        };
        this.loadRows();
    }

    render() {
        return (<Grid fluid={true}>
            <Row><Col md={12}>
                {this.renderToolbar()}
            </Col></Row>
            <Row><Col md={12}>
                <ButtonToolbar>
                    <Button onClick={this.loadRows.bind(this)}>搜索</Button>
                    <Button onClick={this.generateAll.bind(this)}>批量生成(本页中人数不为0的所有班级)</Button>
                    <ToggleButtonGroup type="checkbox" value={this.state.queryCondition}
                        onChange={(e)=>this.setState({queryCondition:e})}
                    >
                        <ToggleButton value="class_not_empty">只显示班级人数非空的</ToggleButton>
                        <ToggleButton value="plan_maked">只显示已生成考试计划的</ToggleButton>
                    </ToggleButtonGroup>

                </ButtonToolbar>
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
            row["_id"] = i+1;
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

    loadRows(){
        let that = this;

        let params = {
            academic_year_id:this.state.semester_id,
            dict_departments_id:this.state.department_id,
            teaching_research_id:this.state.rp_id,
            class_id:this.state.class_id,
            teacher_id:this.state.teacher_id,
            course_id:this.state.course_id,
        };
        for (let st of this.state.queryCondition){
            params[st] = true;
        }
        this.xhr = $.post(window.baseUrl+'app/grade/queryTeachingTask',
            {context:JSON.stringify(params)},function (data) {
                if(data["success"]===true||data["success"]==='true'){
                    let rows = data["result"].map(row=> {row["EDIT"] = false;return row;});
                    console.info(rows);
                    that.setState({rows:rows });
                }
            });
    }

    generateAll(){
        let paramArr = this.state.rows.filter(row=>!row["exam_plan_id"] && row["student_count"]>0).map(row=>Object.assign({},{
            teaching_task_id:row["id"],
            grade_type:row["assessment_id"]
        }));
        const that = this;
        this.xhr = $.post(window.baseUrl+'app/grade/makeExamPlanBatch',
            {context:JSON.stringify(paramArr)},function (data) {
                if(data["success"]===true||data["success"]==='true'){
                    that.loadRows();
                }
            });
    }

    makeExamPlan(e){
        let rowNo = e.target.getAttribute("rowno");
        let exam_plan_id = this.state.rows[rowNo]["exam_plan_id"];
        if (!!exam_plan_id){
            alert("只能生成一次正常的考试计划！");
            return;
        }

        let params = {
            teaching_task_id:this.state.rows[rowNo]["id"],
            grade_type:this.state.rows[rowNo]["assessment_id"]
        };
        const that = this;
        this.xhr = $.post(window.baseUrl+'app/grade/makeExamPlan',
            {context:JSON.stringify(params)},function (data) {
                if(data["success"]===true||data["success"]==='true'){
                    that.loadRows();
                }
            });
    }
}