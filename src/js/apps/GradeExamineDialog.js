import React, { Component } from 'react';
import {
    Button, Col, Form, FormControl, FormGroup, Grid, Radio, Row
} from "react-bootstrap";
import PropTypes from 'prop-types';
import {FormStaticField} from "../components/FormField";
import $ from 'jQuery';


export default class GradeExamineDialog extends Component {
    static propTypes = {
        onSubmit:PropTypes.func,
        title:PropTypes.string,
        dialog_args:PropTypes.shape({
            teacher_name:PropTypes.string,
            course_name:PropTypes.string,
            class_name:PropTypes.string,
            academic_year:PropTypes.string,
            exam_type:PropTypes.number,
            exam_plan_id:PropTypes.number,
            grade_count:PropTypes.number,
            course_category:PropTypes.string,
            course_nature:PropTypes.string,
            course_assessment:PropTypes.string,
            credits:PropTypes.number,
        }),
        onClose:PropTypes.func
    };

    constructor(props, context) {
        super(props, context);
        this.state={
            passed:false,
            remark:"不通过"
        };
    }

    render(){
        const examTypeMap = {"0":"正常考试","1":"补考","2":"重修","3":"重考"};
        const whenRadioSelected = (e)=>{
            if(e.target && $(e.target).prop("checked")){
                this.setState({"passed":parseInt(e.target.value,10)===1},()=>{
                    if(this.state.remark==="不通过"||this.state.remark==="通过"){
                        this.setState({"remark":(this.state.passed?"通过":"不通过")});
                    }
                });
            }
        };
        const isSelected = (i)=>{
            return (this.state.passed ^ i===2) ? {"defaultChecked":"true"}:{}
        };
        return (
            <Grid>
                <Row>
                    <Col md={8} xsOffset={2}>
                        <Row>
                            <Row><FormStaticField title="学期" value={this.props.dialog_args.academic_year} /></Row>
                            <Row><FormStaticField title="教师" value={this.props.dialog_args.teacher_name} /></Row>
                            <Row><FormStaticField title="课程" value={this.props.dialog_args.course_name} /></Row>
                            <Row><FormStaticField title="班级" value={this.props.dialog_args.class_name} /></Row>
                            <Row><FormStaticField title="类别" value={examTypeMap[""+this.props.dialog_args.exam_type]} /></Row>
                            <Row><FormStaticField title="成绩数" value={this.props.dialog_args.grade_count} /></Row>
                        </Row>
                        <Row>
                            <Form horizontal><FormGroup >
                                <Radio name="radioGroup" value="1" inline {...isSelected(1)} onClick={whenRadioSelected.bind(this)}>
                                    通过
                                </Radio>{' '}
                                <Radio name="radioGroup" value="2" inline {...isSelected(2)} onClick={whenRadioSelected.bind(this)}>
                                    不通过
                                </Radio>
                            </FormGroup></Form>
                        </Row>
                        <Row>
                            <Form horizontal><FormGroup>
                                    <Col md={8}><FormControl componentClass="textarea" value={this.state.remark}
                                                             onChange={(e)=>this.setState({"remark":e.target.value})}/></Col>
                            </FormGroup></Form>
                        </Row>
                        <Row><Button onClick={this.submit.bind(this)}>确认</Button>
                            <Button onClick={this.goBack.bind(this)}>取消</Button></Row>
                    </Col>
                </Row>
            </Grid>
        );
    }

    submit(){
        this.props.onSubmit(this.props.dialog_args.exam_plan_id,this.state.passed,this.state.remark);
        this.props.onClose();
    }

    goBack(){
        this.props.onClose();
    }
}
GradeExamineDialog.defaultProps={
    onSubmit:(exam_plan_id,passed,remark)=>console.info(exam_plan_id,passed,remark),
    title:"审核",
    dialog_args:{
        teacher_name:'教师名称',
        course_name:'课程名称',
        class_name:'班级名称',
        academic_year:'2018-05-08',
        exam_type:0,
        exam_plan_id:0,
        grade_count:0,
        course_category:"课程类别",
        course_nature:"课程性质",
        course_assessment:"考核方式",
        credits:5,
    },
    onClose:()=>{}
};
