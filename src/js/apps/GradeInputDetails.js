import React, { Component } from 'react';
import update from 'immutability-helper';
import {
    Button, ButtonToolbar, Col, ControlLabel, Form, FormControl, FormGroup, Glyphicon, Grid, Row
} from 'react-bootstrap';
import ReactDataGrid from "react-data-grid";
import PropTypes from 'prop-types';
import ExamType from "../components/select/ExamType";
import CheckState from "../components/select/CheckState";
import CourseType from "../components/select/CourseType";
import DepartmentList from "../components/select/DepartmentList";
import ResearchPostionList from "../components/select/ResearchPostionList";
import CourseCategory from "../components/select/CourseCategory";
import MajorList from "../components/select/MajorList";
import $ from 'jQuery';
import AutoFormater from "../components/formaters/AutoFormater";
import MapperFormater from "../components/formaters/MapperFormater";
import ModalDialog from "../components/ModalDialog";

import GradeDetail from "./GradeDetail";

export default class GradeInputDetails extends Component {
    static propTypes = {
        ac_year_id:PropTypes.number,
        academic_year:PropTypes.string,
        onClose:PropTypes.func
    };
    constructor(props, context) {
        super(props, context);

        this.dataHistory = {};

        this.showInputDetails=(e)=>{
            let rowNo = e.target.getAttribute("rowno");
            let dialog_args = {
                teacher_name:this.state.rows[rowNo]["teacher_name"],
                course_name:this.state.rows[rowNo]["course_name"],
                class_name:this.state.rows[rowNo]["class_name"],
                academic_year:this.props.academic_year,
                exam_type:this.state.rows[rowNo]["exam_type"],
                exam_plan_id:this.state.rows[rowNo]["exam_plan_id"],
                course_category:this.state.rows[rowNo]["course_category"],
                course_nature:this.state.rows[rowNo]["course_nature"],
                course_assessment:this.state.rows[rowNo]["course_assessment"],
                credits:this.state.rows[rowNo]["credits"],
                //TODO 后补 学时
            };
            //弹出录入详情窗口
            this.setState({dialog_args:dialog_args,showDetails:true});
        };

        this.renderInputDetails = (props,args)=>{
            let lineNo = props.rowIdx;
            return <Button bsStyle="default" rowno={lineNo} onClick={this.showInputDetails}>详情</Button>
        };

        this.InputDetails = <AutoFormater renderAssign={this.renderInputDetails.bind(this)} args={null}/>;

        this._columns=[
            {
                key: 'id',
                name: '序号',
                width: 80
            },{
                key: 'teacher_department_name',
                name:'开课院系',
            },{
                key:'course_name',
                name:'课程名称',

            },{
                key:'teacher_name',
                name:'教师',

            },{
                key:'class_name',
                name:'上课班级',

            },{
                key:'student_department_name',
                name:'上课院系',

            },{
                key:'major_name',
                name:'上课专业',

            },{
                key:'exam_type',
                name:'考试性质',
                formatter:<MapperFormater keyMap={{"0":"正常考试","1":"补考","2":"重修","3":"重考"}} />
            },{
                key:'check_state',
                name:'审核状态',
                formatter:<MapperFormater keyMap={{"0":"未审核","1":"审核已通过","-1":"审核未通过","2":"审批已通过","-2":"审批未通过"}} />
            },{
                key:'grade_count',
                name:'成绩数',

            },{
                key:'option',
                name:'操作',
                width: 100,
                formatter:this.InputDetails
            }
        ];

        this.state = {
            rows: [],
            exam_type:0,
            check_state:0,
            sort_order:"tb.teacher_name,dc.course_name,ac.id",
            course_type:0,
            department_id:0,
            researchPositionId:0,
            course_category:0,
            student_department_id:0,
            student_major_id:0,
            dialog_args:{},
            showDetails:false
        };
    }

    render(){
        const closeDetails = () => this.setState({ showDetails: false });
        return (<Grid fluid={true}>
            <Row><Col md={12}>
                <ButtonToolbar>
                    <Button bsStyle="default" onClick={this.back.bind(this)}><Glyphicon glyph="menu-left" />返回</Button>
                    {/*<Button bsStyle="default" onClick={this.doPrint.bind(this)}><Glyphicon glyph="print" />打印</Button>*/}
                </ButtonToolbar>
            </Col></Row>
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
                    onGridRowsUpdated={this.handleGridRowsUpdated} />
            </Col></Row>
            <ModalDialog ref={ref=>this.detailDialog=ref } title="成绩录入控制--录入详情" show={this.state.showDetails} onHide={closeDetails}>
                <GradeDetail dialog_args={this.state.dialog_args} onClose={closeDetails}/>
            </ModalDialog>
        </Grid>)
    }

    renderToolbar(){
        return (
            <Grid fluid={true}><Row>
                <Col md={4}><ExamType defaultValue={this.state.exam_type} onChange={(e)=>this.setState({"exam_type":parseInt(e.target.value,10)})} /></Col>
                <Col md={4}><CheckState defaultValue={this.state.check_state} onChange={(e)=>this.setState({"check_state":parseInt(e.target.value,10)})}/></Col>
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
                <Col md={4}><CourseType defaultValue={this.state.course_type} onChange={(e)=>this.setState({"course_type":parseInt(e.target.value,10)})}/></Col>
                <Col md={4}><DepartmentList label="开课院系" defaultValue={this.state.department_id} onChange={(e)=>this.setState({"department_id":parseInt(e.target.value,10)})}/></Col>
                <Col md={4}><ResearchPostionList label="教研室" departmentId={this.state.department_id} defaultValue={this.state.researchPositionId}
                                                onChange={(e)=>this.setState({"researchPositionId":parseInt(e.target.value,10)})} /></Col>
                <Col md={4}><CourseCategory defaultValue={this.state.course_category} onChange={(e)=>this.setState({"course_category":parseInt(e.target.value,10)})}/></Col>
                <Col md={4}><DepartmentList label="上课院系" defaultValue={this.state.student_department_id} onChange={(e)=>this.setState({"student_department_id":parseInt(e.target.value,10)})}/></Col>
                <Col md={4}><MajorList departmentId={this.state.student_department_id}  defaultValue={this.state.student_major_id} onChange={(e)=>this.setState({"student_major_id":parseInt(e.target.value,10)})} /></Col>
            </Row>
            </Grid>);
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
            academic_year_id:this.props.ac_year_id,
            exam_type:this.state.exam_type,
            check_state:this.state.check_state,
            dict_departments_id:this.state.department_id,
            teaching_research_id:this.state.researchPositionId,
            sort_order:this.state.sort_order
        };
        this.xhr = $.post(window.baseUrl+'app/grade/queryCheckWithInfo',
            {context:JSON.stringify(params)},function (data) {
            if(data["success"]===true||data["success"]==='true'){
                let rows = data["result"].map(row=> {row["EDIT"] = false; return row;});
                console.info(rows);
                that.setState({rows:rows });
            }
        });
    };

    back(){
        this.props.onClose()
    }

    doPrint(){
        //TODO 补充打印
    }
}

GradeInputDetails.defaultProps={
    ac_year_id:0,
    academic_year:'',
    onClose:()=>{}
};