import React, { Component } from 'react';
import {
    Button, Col, Form, FormControl, FormGroup, Grid, Label, Radio, Row
} from "react-bootstrap";
import PropTypes from 'prop-types';
import {FormStaticField} from "../components/FormField";
import $ from 'jQuery';
import SemesterList from "../components/select/SemesterList";
import DepartmentList from "../components/select/DepartmentList";
import MajorList from "../components/select/MajorList";
import StudentClassList from "../components/select/StudentClassList";
import QueryList from "../components/select/QueryList";


export default class GradeLackAddDialog extends QueryList {
    static propTypes = {
        onSubmit:PropTypes.func,
        title:PropTypes.string,
        dialog_args:PropTypes.shape({
            semester_id:PropTypes.number,
            department_id:PropTypes.number,
            student_major_id:PropTypes.number,
            student_class_id:PropTypes.number,
        }),
        onClose:PropTypes.func
    };

    constructor(props, context) {
        super(props, context);
        this.state={
            passed:false,
            student_name:"",
            student_id:"",
            semester_id:this.props.dialog_args.semester_id,
            student_class_id:this.props.dialog_args.student_class_id,
            department_id:this.props.dialog_args.department_id,
            student_major_id:this.props.dialog_args.student_major_id,
        };
    }

    constructor(props, context) {
        super(props, context);
        this.loadOptions();
    }

    loadOptions(){
        let that = this;
        let params = {
            department_id:this.state.department_id,
            student_major_id:this.state.student_major_id,
            student_class_id:this.state.student_class_id,
        };
        $.post(window.baseUrl+'app/grade/queryStudent',
            {context:JSON.stringify(params)},
            function (data) {
                if(data["success"]===true||data["success"]==='true'){
                    let options = data["result"];
                    that.setOptions(options);
                }
            });
    }

    render(){
        return (
            <Grid>
                <Row>
                    <Col md={8} xsOffset={2}>
                        <Row>
                            <Row>
                                <SemesterList defaultValue={this.state.semester_id} onChange={(e)=>this.setState({"semester_id":parseInt(e.target.value,10)})}/>
                            </Row>
                            <Row>
                                <DepartmentList defaultValue={this.state.department_id} onChange={(e)=>this.setState({"department_id":parseInt(e.target.value,10)})}/>
                            </Row>
                            <Row>
                                <MajorList
                                    departmentId={this.state.department_id}
                                    defaultValue={this.state.student_major_id}
                                    onChange={(e)=>this.setState({"student_major_id":parseInt(e.target.value,10)})} />
                            </Row>
                            <Row>
                                <StudentClassList defaultValue={this.state.student_class_id} onChange={(e)=>this.setState({"student_class_id":parseInt(e.target.value,10)})}  />
                            </Row>
                        </Row>
                        <Row>
                            <Form horizontal><FormGroup>
                                <Col md={2}><Label>学生</Label></Col>
                                    <Col md={8}><FormControl  value={this.state.remark}
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
GradeLackAddDialog.defaultProps={
    onSubmit:(exam_plan_id,passed,remark)=>console.info(exam_plan_id,passed,remark),
    title:"审核",
    dialog_args:{
        semester_id:0,
        department_id:0,
        student_major_id:0,
        student_class_id:0,
    },
    onClose:()=>{}
};
