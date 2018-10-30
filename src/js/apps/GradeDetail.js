import React, { Component } from 'react';
import update from 'immutability-helper';
import {
    Button, ButtonToolbar, Col, FormControl, Glyphicon, Grid,Row
} from "react-bootstrap";
import ReactDataGrid from "react-data-grid";
import PropTypes from 'prop-types';
import {FormField, FormStaticField} from "../components/FormField";
import AutoFormater from "../components/formaters/AutoFormater";
import $ from 'jQuery';
import CourseType from "../components/select/CourseType";
import CourseCategory from "../components/select/CourseCategory";
import AssessmentType from "../components/select/AssessmentType";
import * as _ from "lodash";


export default class GradeDetail extends Component {
    static propTypes = {
        dialog_args:PropTypes.shape({
            teacher_name:PropTypes.string,
            course_name:PropTypes.string,
            class_name:PropTypes.string,
            academic_year:PropTypes.string,
            exam_type:PropTypes.number,
            exam_plan_id:PropTypes.number,
            course_category:PropTypes.string,
            course_nature:PropTypes.string,
            course_assessment:PropTypes.string,
            credits:PropTypes.number,
            teaching_task_id:PropTypes.number
        }),
        course_editable:PropTypes.bool,
        onClose:PropTypes.func
    };
    constructor(props, context) {
        super(props, context);

        console.info(this.props.dialog_args);

        this.dataHistory = {};
        const examTypeMap = {"0":"正常考试","1":"补考","2":"重修","3":"重考"};
        this.renderToolbar = ()=>{
            return (
                <div>
                    <Row>
                        <Col md={4}><FormStaticField title="学期" value={this.props.dialog_args.academic_year} /></Col>
                        <Col md={4}><FormStaticField title="教师" value={this.props.dialog_args.teacher_name} /></Col>
                        <Col md={4}><FormStaticField title="课程" value={this.props.dialog_args.course_name} /></Col>
                        <Col md={4}><FormStaticField title="班级" value={this.props.dialog_args.class_name} /></Col>
                        <Col md={4}><FormStaticField title="考试类别" value={examTypeMap[""+this.props.dialog_args.exam_type]} /></Col>
                        <Col md={4}>
                            {this.props.course_editable?
                                (<CourseCategory omitKeys={[0]} value={this.state.course_category} title="课程类别" onChange={(e)=>this.setState({"course_category":e.target.value})}/>):
                            (<FormStaticField title="课程类别" value={this.props.dialog_args.course_category} />)}
                        </Col>
                        <Col md={4}>
                            {this.props.course_editable?
                                (<CourseType  omitKeys={[0]} value={this.state.course_nature} title="课程性质" onChange={(e)=>this.setState({"course_nature":e.target.value})}/>):
                                (<FormStaticField title="课程性质" value={this.props.dialog_args.course_nature} />)}
                        </Col>
                        <Col md={4}>
                            {this.props.course_editable?
                                (<AssessmentType omitKeys={[0]} value={this.state.course_assessment} title="考核方式" onChange={(e)=>this.setState({"course_assessment":e.target.value})}/>):
                                (<FormStaticField title="考核方式" value={this.props.dialog_args.course_assessment} />)}</Col>
                        <Col md={4}>
                            {this.props.course_editable?
                                (<FormField value={this.state.credits} title="学分" onChange={(e)=>this.setState({"credits":e.target.value})}/>):
                                (<FormStaticField title="学分" value={this.props.dialog_args.credits} />)}</Col>
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
            name:'学期'
        },{
            key:'student_number',
            name:'学号'
        },{
            key:'stuname',
            name:'姓名'
        },{
            key:'regular_grade',
            name:'平时成绩'
        },{
            key:'midterm_grade',
            name:'期中成绩'
        },{
            key:'final_exam_grade',
            name:'期末成绩'
        },{
            key:'totel_grade',
            name:'总成绩'
        },{
            key:'exam_state',
            name:'标志',
            formatter:<AutoFormater renderAssign={this.renderExamState.bind(this)} args={null}/>
        }
        ];

        this.state = {
            rows: [],
            course_category:_.get(_.find(CourseCategory.defaultProps.options,option=>option.name===this.props.dialog_args.course_category),"id"),
            course_nature:_.get(_.find(CourseType.defaultProps.options,option=>option.name===this.props.dialog_args.course_nature),"id"),
            course_assessment:_.get(_.find(AssessmentType.defaultProps.options,option=>option.name===this.props.dialog_args.course_assessment),"id"),
            credits:this.props.dialog_args.credits,
        };
        this.loadRows();
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
                <ButtonToolbar>
                    <Button bsStyle="default" onClick={this.back.bind(this)}><Glyphicon glyph="menu-left"/>返回</Button>
                    <Button bsStyle="default" onClick={this.doPrint.bind(this)}><Glyphicon glyph="print" />打印</Button>

                    {
                        this.props.course_editable?
                            (<Button bsStyle="default" onClick={this.doUpdate.bind(this)}><Glyphicon glyph="floppy-save" />保存修改项</Button>):null
                    }
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

    componentWillUnmount() {
        if(this.xhr)
            this.xhr.abort();
    }

    loadRows = () => {
        let that = this;

        let params = {
            exam_plan_id:this.props.dialog_args.exam_plan_id
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


    back=()=>{
        this.props.onClose()
    };

    doPrint(){
        //TODO 打印成绩单

    }

    doUpdate(){
        //修改本页设置
        let params = {
            course_category:this.state.course_category,
            course_nature:this.state.course_nature,
            course_assessment:this.state.course_assessment,
            credits:this.state.credits,
            teaching_task_id:this.props.dialog_args.teaching_task_id,
        };
        this.xhr = $.post(window.baseUrl+'app/grade/modifyCourseInfo',
            {context:JSON.stringify(params)},function (data) {
                if(data["success"]===true||data["success"]==='true'){
                    alert("提交成功！");
                }
            });
    }
}
GradeDetail.defaultProps={
    dialog_args:{
        teacher_name:'教师名称',
        course_name:'课程名称',
        class_name:'班级名称',
        academic_year:'2018-05-08',
        exam_type:0,
        exam_plan_id:0,
        course_category:"课程类别",
        course_nature:"课程性质",
        course_assessment:"考核方式",
        credits:5,
        teaching_task_id:0,
    },
    course_editable:false,
    onClose:()=>{}
};