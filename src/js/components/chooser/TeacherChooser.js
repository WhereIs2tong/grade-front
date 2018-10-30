import React,{Component} from 'react';
import {Grid, Col, Row, Button} from "react-bootstrap";
import PropTypes from 'prop-types';
import {DepartmentList,ResearchPostionList,TeacherTitleList,QueryList} from "../select";
import $ from 'jQuery';
import {FormField} from "../FormField";

export default class TeacherChooser extends Component {
    static propTypes = {
        onSelect:PropTypes.func,
        semester_id:PropTypes.number
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            departmentId:0,
            researchPositionId:0,
            teacherTitleId:0,
            teacherName:"",
            teacherNo:"",
            // teacherList:[],
            teacherSelected:0,
            teacherObj:null
        };
    }

    render(){
        let departmentId = this.state.departmentId || 0;
        let researchPositionId = this.state.researchPositionId || 0;
        let teacherTitleId = this.state.teacherTitleId || 0;
        let teacherName = this.state.teacherName || "";
        let teacherNo = this.state.teacherNo || "";

        return (
            <Grid>
                <Row>
                    <Col md={6}>
                        <Row style={{height:"250px"}}>
                            <Row><DepartmentList defaultValue={departmentId}
                                               onChange={this.departmentChanged.bind(this)} /></Row>
                            <Row><ResearchPostionList departmentId={departmentId} defaultValue={researchPositionId}
                                ref={ref=>this.researchPosition=ref} onChange={this.researchPostionChanged.bind(this)} /></Row>
                            <Row><TeacherTitleList defaultValue={teacherTitleId}
                                                 onChange={this.teacherTitleChanged.bind(this)} /></Row>
                            <Row><FormField title="教师姓名" value={teacherName} onChange={this.teacherNameChanged.bind(this)}/> </Row>
                            <Row><FormField title="教师编号" value={teacherNo} onChange={this.teacherNoChanged.bind(this)}/> </Row>
                        </Row>
                        <Row><Button onClick={this.queryTeacher.bind(this)}>查询</Button></Row>
                    </Col>
                    <Col md={6}>
                        {/*<Row>{this.state.departmentId}---{this.state.researchPositionId}---{this.state.teacherTitleId}---{this.state.teacherName}---{this.state.teacherNo}---{this.state.teacherSelected}</Row>*/}
                        <Row style={{height:"250px"}}>
                            <QueryList cssStyle={{minHeight:"240px"}} ref={ref=>this.teacherSelecter=ref} label="选择一教师" srOnly={true} defaultValue={this.state.teacherSelected} multiple={true} onChange={this.teacherSelectedChanged.bind(this)}/>
                        </Row>
                        <Row><Button onClick={this.selectTeacher.bind(this)}>选择</Button></Row>
                    </Col>
                </Row>
            </Grid>
        );
    }

    departmentChanged(e){
        this.setState({departmentId:parseInt(e.target.value,10)},()=>{
            this.setState({researchPositionId:0});
            // console.info(this.state);
            this.researchPosition.loadOptions();
        });
    }

    researchPostionChanged(e){
        this.setState({researchPositionId:parseInt(e.target.value,10)});
    }

    teacherTitleChanged(e){
        this.setState({teacherTitleId:parseInt(e.target.value,10)});
    }

    teacherNameChanged(e){
        this.setState({teacherName:e.target.value});
    }

    teacherNoChanged(e){
        this.setState({teacherNo:e.target.value});
    }
    teacherSelectedChanged(e){
        this.setState({teacherSelected:parseInt(e.target.value,10)});
    }

    queryTeacher(){
        let that = this;
        let params = {
            faculty:this.state.departmentId,
            teachering_office:this.state.researchPositionId,
            technical_title:this.state.teacherTitleId,
            teacher_name:this.state.teacherName,
            teacher_number:this.state.teacherNo,
            semester_id:this.props.semester_id
        };
        $.post(window.baseUrl+'app/grade/queryTeachers',
            {context:JSON.stringify(params)},
            function (data) {
                if(data["success"]===true||data["success"]==='true'){
                    let options = data["result"];
                    that.teacherSelecter.setOptions(options);
                    // that.setState({teacherList:options});
                }
            });
    }

    selectTeacher(){
        this.props.onSelect(this.state.teacherSelected);
    }
}

TeacherChooser.defaultProps={
    onSelect:(id)=>console.info(id),
    semester_id:0
};


