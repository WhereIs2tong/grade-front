import React, { Component } from 'react';
import update from 'immutability-helper';
import {
    Button, ButtonToolbar, Checkbox, Col, ControlLabel, Form, FormControl, FormGroup, Glyphicon, Grid, Radio,
    Row
} from 'react-bootstrap';
import ReactDataGrid from "react-data-grid";
export default class GradeAnalysis extends Component {
    constructor(props, context) {
        super(props, context);

        this.dataHistory = {};

        this.renderTop = ()=>{
            return (<Row >
                <Col md={4}>
                    <Form horizontal>
                        <FormGroup controlId="Semester">
                            <Col md={2}>
                                <ControlLabel>开课学期</ControlLabel>
                            </Col>
                            <Col md={8}>
                                <FormControl componentClass="select" placeholder="select">
                                    <option value="all">全部</option>
                                    <option value="rework">全部重修</option>
                                    <option value="makeup">全部补考</option>
                                    <option value="Reexamination">全部重考</option>
                                    <option value="makeup">全部补考</option>
                                    <option value="normal">正常考试</option>
                                    <option value="makeup">全部补考</option>
                                </FormControl>
                            </Col>
                        </FormGroup>
                    </Form>
                </Col>
                <Col md={4}><Form horizontal><FormGroup controlId="ExaminationNature">
                    <Col md={2}><ControlLabel>考试性质</ControlLabel></Col>
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


                <Col md={4}><Form horizontal><FormGroup controlId="ExaminationState">
                    <Col md={2}><ControlLabel>考试状态</ControlLabel></Col>
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
            </Row>)
        };

        this.renderMid = ()=>{
            return (<Row >

                <Col mdOffset={2} md={4}><Form horizontal><FormGroup >
                    <Radio name="radioGroup" inline>
                        按教师录入
                    </Radio>{' '}
                    <Radio name="radioGroup" inline>
                        按课程录入
                    </Radio>{' '}
                    <Radio name="radioGroup" inline>
                        按班级录入
                    </Radio>
                </FormGroup></Form></Col>
                <Col md={4}><Form horizontal><FormGroup >
                    <Checkbox inline>按合班班级合并录入</Checkbox>
                    <Checkbox inline>数据来源于开课通知单</Checkbox>
                </FormGroup></Form></Col>
            </Row>)
        };

        this.renderButtom = ()=> (<Row>
            <Col md={4}><Form horizontal><FormGroup controlId="Teacher">
                <Col md={2}><ControlLabel>教师</ControlLabel></Col>
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
            <Col md={4}><Form horizontal><FormGroup controlId="Course">
                <Col md={2}><ControlLabel>课程</ControlLabel></Col>
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
            <Col md={4}><Form horizontal><FormGroup controlId="Category">
                <Col md={2}><ControlLabel>类别</ControlLabel></Col>
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
            <Col md={4}><Form horizontal><FormGroup controlId="Type">
                <Col md={2}><ControlLabel>类型</ControlLabel></Col>
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
            <Col md={4}><Form horizontal><FormGroup controlId="Class">
                <Col md={2}><ControlLabel>班级</ControlLabel></Col>
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
            <Col md={4}><Form horizontal><FormGroup controlId="CourseCategory">
                <Col md={2}><ControlLabel>课程类别</ControlLabel></Col>
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
            <Col md={4}><Form horizontal><FormGroup controlId="CourseNature">
                <Col md={2}><ControlLabel>课程性质</ControlLabel></Col>
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
            <Col md={4}><Form horizontal><FormGroup controlId="ExamMethod">
                <Col md={2}><ControlLabel>考试方式</ControlLabel></Col>
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
            <Col md={3}><Form horizontal><FormGroup controlId="Score">
                <Col md={3}><ControlLabel>学分</ControlLabel></Col>
                <Col md={3}><FormControl  placeholder="学分"/></Col>
            </FormGroup></Form></Col>
            <Col md={3}><Form horizontal><FormGroup controlId="Period">
                <Col md={3}><ControlLabel>学时</ControlLabel></Col>
                <Col md={3}><FormControl  placeholder="学时"/></Col>
            </FormGroup></Form></Col>
        </Row>);



        this.renderTools= ()=>{
            return [(
                <Row key="top"><Col md={12}>
                    {this.renderTop()}
                </Col></Row>
            ),(
                <Row key="middle"><Col md={12}>
                    {this.renderMid()}
                </Col></Row>
            ),(
                <Row key="buttom"><Col md={12}>
                    {this.renderButtom()}
                </Col></Row>
            )];
        };

        this._columns=[{
            key: 'id',
            name: '序号',
            width: 80
        },{
            key:'ProblemID',
            name:'题数'
        },{
            key:'StudentId',
            name:'学生'
        },{
            key:'TotalScore',
            name:'总分'
        },{
            key:'Sign',
            name:'标志'
        },{
            key:'Score',
            name:'小题分数'
        }];

        this.state = { rows: [] };
        this.loadRows();
    }

    render(){
        return (<Grid fluid={true}>
            <Row><Col md={12}>
                <ButtonToolbar>
                    <Button bsStyle="default" onClick={this.back()}><Glyphicon glyph="menu-left" />返回</Button>
                </ButtonToolbar>
            </Col></Row>
            {[...this.renderTools()]}
            <Row><Col md={12}>
                <ReactDataGrid
                    enableCellSelect={true}
                    columns={this._columns}
                    rowGetter={this.rowGetter}
                    rowsCount={this.state.rows.length}
                    minHeight={500}
                    onGridRowsUpdated={this.handleGridRowsUpdated} />
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
        // let that = this;

        const data = {
            "success": true,
            "resultCode": 1000,
            "result": [
                {
                    "ProblemID": "未提交",
                    "StudentId": "17S103333",
                    "TotalScore": "老毕",
                    "Sign": "三年一班",
                    "Score": "软件工程",
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

