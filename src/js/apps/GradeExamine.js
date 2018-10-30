import React, { Component } from 'react';
import update from 'immutability-helper';
import {
    Button, ButtonToolbar, Col, ControlLabel, Form, FormControl, FormGroup, Grid, Popover, Row
} from "react-bootstrap";
import ReactDataGrid from "react-data-grid";
import DepartmentList from "../components/select/DepartmentList";
import ExamType from "../components/select/ExamType";
import SemesterList from "../components/select/SemesterList";
import ResearchPostionList from "../components/select/ResearchPostionList";
import StudentClassList from "../components/select/StudentClassList";
import TeacherList from "../components/select/TeacherList";
import CheckState from "../components/select/CheckState";
import AutoFormater from "../components/formaters/AutoFormater";
import ModalDialog from "../components/ModalDialog";
import GradeDetail from "./GradeDetail";
import MapperFormater from "../components/formaters/MapperFormater";
import $ from 'jQuery';
import CourseList from "../components/select/CourseList";
import GradeExamineDialog from "./GradeExamineDialog";
import PropTypes from 'prop-types';

export default class GradeExamine extends Component {
    static propTypes = {
        check_stage:PropTypes.oneOf(["check1","check2"]).isRequired
    };
    constructor(props, context) {
        super(props, context);

        this.dataHistory = {};

        this.renderToolbar = ()=>{
            return (
                <div>
               <Row>
                   <Col md={4}><SemesterList
                       defaultValue={this.state.semester_id}
                       onChange={(e)=>this.setState({"semester_id":parseInt(e.target.value,10)})}/></Col>
                   <Col md={4}><ExamType
                       defaultValue={this.state.exam_type}
                       onChange={(e)=>this.setState({"exam_type":parseInt(e.target.value,10)})} /></Col>
                   <Col md={4}><DepartmentList
                       defaultValue={this.state.department_id}
                       onChange={(e)=>this.setState({"department_id":parseInt(e.target.value,10)})}/></Col>
               </Row><Row>
                   <Col md={4}><ResearchPostionList
                       departmentId={this.state.department_id}
                       defaultValue={this.state.rp_id}
                       onChange={(e)=>this.setState({"rp_id":parseInt(e.target.value,10)})}/></Col>
                   <Col md={4}><TeacherList
                       semester_id={this.state.semester_id} departmentId={this.state.department_id}
                       researchPositionId={this.state.rp_id} defaultValue={this.state.teacher_id}
                       onChange={(e)=>this.setState({"teacher_id":parseInt(e.target.value,10)})}  /></Col>
                   <Col md={4}>
                       <CourseList defaultValue={this.state.teaching_task_id}
                                   teacher_id={this.state.teacher_id}
                                   exam_type={this.state.exam_type}
                                   semester_id={this.state.semester_id}
                                   onChange={(e)=>this.setState({"teaching_task_id":parseInt(e.target.value,10)})} />
                   </Col>
                </Row><Row>
                   <Col md={4}><StudentClassList
                       defaultValue={this.state.student_class_id} teaching_task_id={this.state.teaching_task_id}
                       onChange={(e)=>this.setState({"student_class_id":parseInt(e.target.value,10)})}  /></Col>

                        <Col md={4}><CheckState
                            defaultValue={this.state.check_state_id}
                            onChange={(e)=>this.setState({"check_state_id":parseInt(e.target.value,10)})}  /></Col>
                        <Col md={4}>
                            <Form horizontal>
                                <FormGroup controlId="sort_order">
                                    <Col md={2}><ControlLabel>排序方式</ControlLabel></Col>
                                    <Col md={8}>
                                        <FormControl componentClass="select" placeholder="select" defaultValue={this.state.sort_order}
                                                     onChange={(e)=>this.setState({"sort_order":e.target.value})}>
                                            <option value="tb.teacher_name,dc.course_name,ac.id" >按教师/课程排序</option>
                                            <option value="dc.course_name,tb.teacher_name,ac.id">按课程/教师排序</option>
                                            <option value="dc.course_name,ac.id,cg.class_name">按课程/班级排序</option>
                                            <option value="cg.class_name,dc.course_name">按班级/课程排序</option>
                                            <option value="cg.class_name,tb.teacher_name">按班级/教师排序</option>
                                            <option value="tb.teacher_name,cg.class_name">按教师/班级排序</option>
                                        </FormControl>
                                    </Col>
                                </FormGroup>
                            </Form>
                        </Col>
               </Row>
                </div>
            );
        };

        /* {
         key:'course_category',
         name:'课程类别'
         }, {
         key:'course_nature',
         name:'课程性质'
         }, {
         key:'course_assessment',
         name:'考核方式'
         }, {
         key:'credits',
         name:'学分'
         },*/
        this.showInputDetails=(e)=>{
            let rowNo = e.target.getAttribute("rowno");
            let dialog_args = {
                teacher_name:this.state.rows[rowNo]["teacher_name"],
                course_name:this.state.rows[rowNo]["course_name"],
                class_name:this.state.rows[rowNo]["class_name"],
                academic_year:this.state.rows[rowNo]["academic_year"],
                exam_type:this.state.rows[rowNo]["exam_type"],
                exam_plan_id:this.state.rows[rowNo]["exam_plan_id"],
                grade_count:this.state.rows[rowNo]["grade_count"],
                course_category:this.state.rows[rowNo]["course_category"],
                course_nature:this.state.rows[rowNo]["course_nature"],
                course_assessment:this.state.rows[rowNo]["course_assessment"],
                credits:this.state.rows[rowNo]["credits"],
                teaching_task_id:this.state.rows[rowNo]["teaching_task_id"],
                //TODO 后补 课程类别、课程性质、考试方式、学分、学时
            };
            //弹出录入详情窗口
            this.setState({dialog_args:dialog_args,showDetails:true});
        };

        this.renderInputDetails = (props,args)=>{
            let lineNo = props.rowIdx;
            return (<FormGroup>
                <Button bsStyle="default" rowno={lineNo} onClick={this.showInputDetails}>成绩</Button>
                <Button bsStyle="default" rowno={lineNo} onClick={this.checkGrade.bind(this)}>{this.props.check_stage === "check1"? '审核':'审批'}</Button>
            </FormGroup>)
        };

        this.poperOverGradePercent =(props) => {
            let lineNo = props.rowIdx;
            let regular_per = this.state.rows[lineNo]["regular_per"];
            let medium_per = this.state.rows[lineNo]["medium_per"];
            let finalexam_per = this.state.rows[lineNo]["finalexam_per"];
            let info = "平时："+ (regular_per).toFixed(0) + "%," +
                "期中："+ (medium_per).toFixed(0) + "%," +
                "期末："+ (finalexam_per).toFixed(0) + "%";
            return (<Popover id="popover-positioned-scrolling-top" title="成绩比例">
                <strong>{info}</strong>
            </Popover>)
        };

        this.InputDetails = <AutoFormater popoverFunc={this.poperOverGradePercent.bind(this)} renderAssign={this.renderInputDetails.bind(this)} args={null}/>;

        this._columns = [{
                key: 'id',
                name: '序号',
                width: 80
            },{
            key:'teacher_name',
            name:'授课老师'
        },{
            key:'course_name',
            name:'课程'
        }, {
            key:'course_category',
            name:'课程类别'
        }, {
            key:'course_nature',
            name:'课程性质'
        }, {
            key:'course_assessment',
            name:'考核方式'
        }, {
            key:'credits',
            name:'学分'
        },
            {
            key:'class_name',
            name:'上课班级'
        },{
            key:'exam_type',
            name:'考试性质',
            formatter:<MapperFormater keyMap={{"0":"正常考试","1":"补考","2":"重修","3":"重考"}}   />
        },{
            key:'check_state',
            name:'审核标志',
            formatter:<MapperFormater keyMap={{"0":"未审核","1":"已通过","-1":"未通过","2":"已通过","-2":"已通过"}}
                                      popoverFunc={this.poperOverRemark1.bind(this)} />
        },{
            key:'check_state_2',
            name:'审批标志',
            formatter:<MapperFormater keyMap={{"0":"","1":"","-1":"","2":"已通过","-2":"未通过"}}
                                      popoverFunc={this.poperOverRemark2.bind(this)} />
        },{
            key:'grade_count',
            name:'学生成绩数'
        },{
            key:'option',
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
            teaching_task_id:0,
            student_class_id:0,
            check_state_id:0,
            sort_order:"tb.teacher_name,dc.course_name,ac.id",
            dialog_args:{},
            showDetails:false,
            showCheckDialog:false
        };
        this.loadRows();
    }

    poperOverRemark1(props) {
        let lineNo = props.rowIdx;
        return (<Popover id="popover-positioned-scrolling-top" title="详情">
            <strong>{this.state.rows[lineNo]["remark1"]}</strong>
        </Popover>)
    }

    poperOverRemark2(props) {
        let lineNo = props.rowIdx;
        return (<Popover id="popover-positioned-scrolling-top" title="详情">
            <strong>{this.state.rows[lineNo]["remark2"]}</strong>
        </Popover>)
    }

    render() {
        const closeDetails = () => this.setState({ showDetails: false });
        const closeDialog = () => this.setState({ showCheckDialog: false });

        const checkTitle = this.props.check_stage === "check1"? '审核':'审批';

        return (<Grid fluid={true}>
            <Row><Col md={12}>
                {this.renderToolbar()}
            </Col></Row>
            <Row><Col md={12}>
                <ButtonToolbar>
                    <Button onClick={this.loadRows.bind(this)}>搜索</Button>
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
            <ModalDialog ref={ref=>this.detailDialog=ref } title="成绩详情" show={this.state.showDetails} onHide={closeDetails}>
                <GradeDetail dialog_args={this.state.dialog_args} course_editable={true} onClose={closeDetails}/>
            </ModalDialog>
            <ModalDialog title={checkTitle} show={this.state.showCheckDialog} onHide={closeDialog} showCloseButton={false}>
                <GradeExamineDialog title={checkTitle} dialog_args={this.state.dialog_args}
                                    onSubmit={this.submitCheckGrade.bind(this)} onClose={closeDialog}></GradeExamineDialog>
            </ModalDialog>
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

    loadRows(){
        let that = this;

        let params = {
            academic_year_id:this.state.semester_id,
            exam_type:this.state.exam_type,
            check_state:this.state.check_state_id,
            dict_departments_id:this.state.department_id,
            teaching_research_id:this.state.rp_id,
            sort_order:this.state.sort_order
        };
        this.xhr = $.post(window.baseUrl+'app/grade/queryCheckWithInfo',
            {context:JSON.stringify(params)},function (data) {
                if(data["success"]===true||data["success"]==='true'){
                    let rows = data["result"].map(row=> {row["EDIT"] = false;row["check_state_2"]=row["check_state"]; return row;});
                    console.info(rows);
                    that.setState({rows:rows });
                }
            });
    }

    checkGrade(e){
        let rowNo = e.target.getAttribute("rowno");
        let check_state = this.state.rows[rowNo]["check_state"];
        if(this.props.check_stage === "check1"){
            if (check_state>0){
                alert("不允许重复审核！");
                return;
            }
        }else {//审批
            if (check_state>1){
                alert("不允许重复审批！");
                return;
            }
            if (check_state!==1 && check_state!==-2){
                alert("需先完成审核步骤！");
                return;
            }
        }

        let dialog_args = {
            teacher_name:this.state.rows[rowNo]["teacher_name"],
            course_name:this.state.rows[rowNo]["course_name"],
            class_name:this.state.rows[rowNo]["class_name"],
            academic_year:this.state.rows[rowNo]["academic_year"],
            exam_type:this.state.rows[rowNo]["exam_type"],
            exam_plan_id:this.state.rows[rowNo]["exam_plan_id"],
            grade_count:this.state.rows[rowNo]["grade_count"],
            //TODO 后补 课程类别、课程性质、考试方式、学分、学时
        };
        //弹出审批窗口
        this.setState({dialog_args:dialog_args,showCheckDialog:true});
    }

    submitCheckGrade(exam_plan_id,passed,remark){
        const that = this;
        const checkStage = this.props.check_stage === "check1"? '':'2';
        let params = {
            exam_plan_id:exam_plan_id,
            passed:passed,
            remark:remark
        };
        this.xhr = $.post(window.baseUrl+'app/grade/checkGradeByCourse'+checkStage,
            {context:JSON.stringify(params)},function (data) {
                if(data["success"]===true||data["success"]==='true'){
                    that.loadRows();
                }
            });
    }
}