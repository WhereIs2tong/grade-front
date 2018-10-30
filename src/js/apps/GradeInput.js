import React, { Component } from 'react';
// import update from 'immutability-helper';
import {
    Button, ButtonToolbar, Checkbox, Col, Form, FormControl, FormGroup, Grid, Label, Radio, Row, Table, ToggleButton,
    ToggleButtonGroup
} from 'react-bootstrap';
// import ReactDataGrid from "react-data-grid";
import DataTable from "../components/table/EditableTable";
// import PropTypes from 'prop-types';
import {SemesterList,ExamType,TeacherList,ModalDialog,TeacherChooser,CourseForAcidList,StudentClassList} from "../components";
import $ from 'jQuery';
// import TextEditor from "../components/editors/TextEditor";
// import TextFormater from "../components/formaters/TextFormater";
import {FormField} from "../components/FormField";
import _ from 'lodash'
import CourseList2 from "../components/select/CourseList2";

export default class GradeInput extends Component {
    static propTypes = {

    };
    constructor(props, context) {
        super(props, context);

        // this.dataHistory = {};

        // const validateGrade = (val,props)=>{
        //     let value = parseFloat(val);
        //     if (isNaN(value) || value>100 || value <0){
        //         return "warning";
        //     }else if(value<60){
        //         return "error";
        //     }
        //     return "success";
        // };

        // const transferGrade = (props)=>{
        //     let lineNo = props.rowIdx;
        //     let finalGrade = GradeInput.calcTotalGrade(this.state.rows[lineNo],this.state);
        //     if(this.state.rows[lineNo]["grade_type"]===0){
        //         return finalGrade;
        //     }else {
        //         switch (Math.floor(finalGrade/10)){
        //             case 10:
        //             case 9:
        //                 return "优";
        //             case 8:
        //                 return "良";
        //             case 7:
        //                 return "中";
        //             case 6:
        //                 return "及格";
        //             default:
        //                 return "不及格";
        //         }
        //     }
        // };
        // const validateTotalGrade = (val,props)=>{
        //     let lineNo = props.rowIdx;
        //     let finalGrade = GradeInput.calcTotalGrade(this.state.rows[lineNo],this.state);
        //     // let finalGrade = props.value;
        //     if(finalGrade<60){
        //         return "error";
        //     }
        //     return "success";
        // };

        this._columns=[
            // {
            //     key: 'id',
            //     name: '序号',
            //     width: 80
            // },
            {
                key:'student_number',
                name:'学号'
            },{
                key:'stuname',
                name:'姓名'
            },{
                key:'regular_grade',
                name:'平时成绩',
                editable: true,
                // editor:<TextEditor data={()=>this.state.rows} validatedFunc={validateGrade}/>,
                // formatter:<TextFormater validatedFunc={validateGrade}/>
            },{
                key:'midterm_grade',
                name:'期中成绩',
                editable: true,
                // editor:<TextEditor data={()=>this.state.rows} validatedFunc={validateGrade}/>,
                // formatter:<TextFormater validatedFunc={validateGrade}/>
            },{
                key:'final_exam_grade',
                name:'期末成绩',
                editable: true,
                // editor:<TextEditor data={()=>this.state.rows} validatedFunc={validateGrade}/>,
                // formatter:<TextFormater validatedFunc={validateGrade} />
            },{
                key:'totel_grade',
                name:'总成绩',
                editable: false,
                // formatter:<TextFormater transferFunc={transferGrade} validatedFunc={validateTotalGrade}/>
            },
            // {
            //     key:'exam_state',
            //     name:'标志',
            //     formatter:<AutoFormater renderAssign={this.renderExamState.bind(this)} args={null}/>
            // }
            ];

        this.state = {
            rows: [],
            exam_plan_ids:[],
            exam_plan_index:0,
            row_groups:{},
            showTeacherChooserDialog:false,
            semester_id:0,
            exam_type:0,
            input_type:1,
            teacher_id:0,
            teaching_task_id:0,
            student_class_id:0,
            regular_per:20,
            medium_per:30,
            finalexam_per:50,
            forceEdit:false
        };
        // this.loadRows();
    }

    // renderExamState(props, args){
    //     const examStateMap = {
    //         "0":"未录入",
    //         "1":"",
    //         "2":"",
    //         "3":"缓考",
    //         "4":"缺考"
    //     };
    //
    //     let lineNo = props.rowIdx;
    //     let exam_state = this.state.rows[lineNo]["exam_state"];
    //     let stateString = examStateMap[""+exam_state];
    //     console.info(exam_state,stateString);
    //     return(
    //         <FormControl.Static>{stateString || ''}</FormControl.Static>
    //     );
    // };

    calaulateTotalGrade(){
        let rows = this.state.rows;
        rows = rows.map(row=>this.fit_total,this);
        this.setState({"rows":rows});
    }

    static calcTotalGrade(row,percentSetting){
        return Math.round(( row["regular_grade"] * percentSetting["regular_per"] +
            row["midterm_grade"] * percentSetting["medium_per"] +
            row["final_exam_grade"] * percentSetting["finalexam_per"] )/100);
    }

    static checkStateArray=["复核未通过","审核未通过","已提交，未审核","已审核,待复核","复核已通过","错误状态","错误状态","未提交"];

    render(){
        const whenSelectTeacher = (id,teacherObj)=>{
            this.setState({"teacher_id":id});
            if(teacherObj && teacherObj.name){
                $(this.teacherList.getInputNode()).val(id);
            }
            this.setState("showTeacherChooserDialog",false);
        };

        const checkedN = ((n)=>{
            // console.info(n);
            let oldRows = this.state.rows;
            oldRows[0] = _.assign(oldRows[0],_.pick(this.state,["regular_per","medium_per","finalexam_per"]));
            let groups = this.state.row_groups;
            groups[this.state.exam_plan_ids[this.state.exam_plan_index]] = oldRows;
            let rows = this.state.row_groups[this.state.exam_plan_ids[n]];
            this.setState({
                exam_plan_index:n,
                rows: rows,
                row_groups:groups,
                regular_per:rows[0]["regular_per"],
                medium_per:rows[0]["medium_per"],
                finalexam_per:rows[0]["finalexam_per"]
            });

        }).bind(this);


        return (<Grid fluid={true}>
            {[...this.renderTools()]}
            <ButtonToolbar>
                <Button onClick={this.loadRows.bind(this)}>搜索</Button>
                <Button bsStyle="default" onClick={this.submitGrade(1)}>暂存</Button>
                <Button bsStyle="default" onClick={this.submitGrade(2)}>提交</Button>
                {
                    this.state.exam_plan_ids.length>1?(<ToggleButtonGroup type="radio" name="options" defaultValue={0} onChange={checkedN}>
                        {
                            [...Array(this.state.exam_plan_ids.length)].map((e,i)=>(
                                i===0?
                                    (<ToggleButton key={"toggle_btn_"+i} value={0}>{this.state.row_groups[this.state.exam_plan_ids[0]][0]["course_name"]}</ToggleButton>)
                                    :
                                    (<ToggleButton key={"toggle_btn_"+i} value={i}>{this.state.row_groups[this.state.exam_plan_ids[i]][0]["course_name"]}</ToggleButton>)
                            ))
                        }
                    </ToggleButtonGroup>):null
                }
                {
                    this.state.rows.length>0?[(
                        <Button key="teacher_name" bsStyle="default" style={{"backgroundColor":"transparent"}} disabled={true}>
                            {this.state.rows[0]["teacher_name"]}
                        </Button>
                    ),(
                        <Button key="course_name" bsStyle="default" style={{"backgroundColor":"transparent"}} disabled={true}>
                            {this.state.rows[0]["course_name"]}
                        </Button>
                    ),(
                        <Button key="class_name" bsStyle="default" style={{"backgroundColor":"transparent"}} disabled={true}>
                            {this.state.rows[0]["class_name"]}
                        </Button>
                    )]:null
                }
                {
                    this.state.rows.length>0?(
                        <Button key="class_name" bsStyle="default" style={{"backgroundColor":"transparent"}} disabled={true}>
                            {GradeInput.checkStateArray[this.state.rows[0]["check_state"]+2]}
                        </Button>
                    ):null
                }
            </ButtonToolbar>
            <Row><Col md={12}>
                {/*<ReactDataGrid*/}
                    {/*enableCellSelect={true}*/}
                    {/*columns={this._columns}*/}
                    {/*rowGetter={this.rowGetter}*/}
                    {/*rowsCount={this.state.rows.length}*/}
                    {/*minHeight={500}*/}
                    {/*enableCellAutoFocus={true}*/}
                    {/*onGridRowsUpdated={this.handleGridRowsUpdated} />*/}
                <DataTable editable={true} columns={this._columns} data={this.state.rows} onDataChange={this.handleDataChange}/>
            </Col></Row>
            <ModalDialog ref={ref=>this.teacherChooserDialog=ref } title="教师选取" show={this.state.showTeacherChooserDialog}
                         onHide={()=>this.setState({"showTeacherChooserDialog":false})}>
                <TeacherChooser semester_id={this.state.semester_id} onSelect={whenSelectTeacher.bind(this)}/>
            </ModalDialog>
        </Grid>)
    }

    handleDataChange = (rowData)=>{
        // console.info("Table data changed:",rowData);
        if(this.state.forceEdit){
            this.setState({"rows":rowData.map(this.fit_total,this)});
        }else {
            if( rowData.length>0 && rowData[0]["check_state"]!=5){
                if(confirm("当前数据已提交，是否强制修改？")){
                    this.setState({"rows":rowData.map(this.fit_total,this),forceEdit:true});
                }else {
                    this.setState({"rows":this.state.rows});
                }
            }
        }
    };

    fit_total = (row)=> {
        let totalGrade = GradeInput.calcTotalGrade(row, this.state);
        if (row["grade_type"] == 2) {
            if (totalGrade >= 90)
                row["totel_grade"] = "A";
            else if (totalGrade >= 80)
                row["totel_grade"] = "B";
            else if (totalGrade >= 70)
                row["totel_grade"] = "C";
            else if (totalGrade >= 60)
                row["totel_grade"] = "D";
            else
                row["totel_grade"] = "E";
        } else {
            row["totel_grade"] = totalGrade;
        }
        row["regular_grade"] = parseFloat(row["regular_grade"]).toFixed(0);
        row["midterm_grade"] = parseFloat(row["midterm_grade"]).toFixed(0);
        row["final_exam_grade"] = parseFloat(row["final_exam_grade"]).toFixed(0);
        return row;
    };

    renderTop(){
        const whenRadioSelected = (e)=>{
            if(e.target && $(e.target).prop("checked")){
                this.setState({
                    "input_type":parseInt(e.target.value,10),
                    teacher_id:0,
                    teaching_task_id:0,
                    student_class_id:0
                })
            }
        };

        const isSelected = (i)=>{
            return this.state.input_type === i ? {"defaultChecked":"true"}:{}
        };

        return (<Row >
            <Col md={4}><SemesterList defaultValue={this.state.semester_id} onChange={(e)=>this.setState({"semester_id":parseInt(e.target.value,10)})}/></Col>
            <Col md={4}><ExamType defaultValue={this.state.exam_type} onChange={(e)=>this.setState({"exam_type":parseInt(e.target.value,10)})} /></Col>
            <Col md={4}><Form horizontal><FormGroup >
                <Radio name="radioGroup" value="1" inline {...isSelected(1)} onClick={whenRadioSelected.bind(this)}>
                    按教师录入
                </Radio>{' '}
                <Radio name="radioGroup" value="2" inline {...isSelected(2)} onClick={whenRadioSelected.bind(this)}>
                    按课程录入
                </Radio>{' '}
                <Radio name="radioGroup" value="3" inline {...isSelected(3)} onClick={whenRadioSelected.bind(this)}>
                    按班级录入
                </Radio>
            </FormGroup></Form></Col>
        </Row>)
    }

    // renderMid(){
    //     return (<Row >
    //         <Col mdOffset={2} md={4}><Form horizontal><FormGroup >
    //             <Radio name="radioGroup" inline >
    //                 按教师录入
    //             </Radio>{' '}
    //             <Radio name="radioGroup" inline>
    //                 按课程录入
    //             </Radio>{' '}
    //             <Radio name="radioGroup" inline>
    //                 按班级录入
    //             </Radio>
    //         </FormGroup></Form></Col>
    //         <Col md={4}><Form horizontal><FormGroup >
    //             <Checkbox inline>按合班班级合并录入</Checkbox>
    //             <Checkbox inline>数据来源于开课通知单</Checkbox>
    //         </FormGroup></Form></Col>
    //     </Row>)
    // }

    renderButtom (){
        // const teacherList = ( <Col key="teacherCol" md={4}>
        //     <Row><Col md={10}><TeacherList  ref={ref=>this.teacherList=ref } defaultValue={this.state.teacher_id} semester_id={this.state.semester_id}
        //                                     onChange={(e)=>this.setState({"teacher_id":parseInt(e.target.value,10)})} /></Col>
        //         <Col md={2}><Button onClick={()=>this.setState({"showTeacherChooserDialog":true})}>选择</Button></Col></Row>
        // </Col>);
        // const courseList = ( <Col key="courseCol" md={4}>
        //     <Row><Col md={12}><CourseForAcidList defaultValue={this.state.teaching_task_id} teacher_id={this.state.teacher_id} exam_type={this.state.exam_type} semester_id={this.state.semester_id}
        //                                          onChange={(e)=>this.setState({"teaching_task_id":parseInt(e.target.value,10)})} /></Col></Row>
        // </Col>);
        //
        // const studentList = ( <Col key="studentCol" md={4}>
        //     <Row><Col md={12}><StudentClassList defaultValue={this.state.student_class_id} teaching_task_id={this.state.teaching_task_id} onChange={(e)=>this.setState({"student_class_id":parseInt(e.target.value,10)})}  /></Col></Row>
        // </Col>);

        return (<Row>
            {(this.state.input_type === 1)?
                [( <Col key="teacherCol" md={4}>
                    <Row><Col md={10}><TeacherList  ref={ref=>this.teacherList=ref } defaultValue={this.state.teacher_id} semester_id={this.state.semester_id}
                                                    onChange={(e)=>this.setState({"teacher_id":parseInt(e.target.value,10)})} /></Col>
                        <Col md={2}><Button onClick={()=>this.setState({"showTeacherChooserDialog":true})}>选择</Button></Col></Row>
                </Col>),
                    ( <Col key="courseCol" md={4}>
                        <Row><Col md={12}><CourseForAcidList defaultValue={this.state.teaching_task_id} teacher_id={this.state.teacher_id} exam_type={this.state.exam_type} semester_id={this.state.semester_id}
                                                             onChange={(e)=>this.setState({"teaching_task_id":parseInt(e.target.value,10)})} /></Col></Row>
                    </Col>)
                    ,( <Col key="studentCol" md={4}>
                    <Row><Col md={12}><StudentClassList defaultValue={this.state.student_class_id} teaching_task_id={this.state.teaching_task_id} onChange={(e)=>this.setState({"student_class_id":parseInt(e.target.value,10)})}  /></Col></Row>
                </Col>)]:null}
            {(this.state.input_type === 2)?
                [( <Col key="courseCol" md={4}>
                    <Row><Col md={12}><CourseList2 defaultValue={this.state.course_id} onChange={(e)=>this.setState({"course_id":parseInt(e.target.value,10)})} /></Col></Row>
                </Col>)
                    ,( <Col key="studentCol" md={4}>
                    <Row><Col md={12}><StudentClassList defaultValue={this.state.student_class_id} course_id={this.state.course_id} onChange={(e)=>this.setState({"student_class_id":parseInt(e.target.value,10)})}  /></Col></Row>
                </Col>)]:null}
            {(this.state.input_type === 3)?
                [( <Col key="studentCol" md={4}>
                    <Row><Col md={12}><StudentClassList defaultValue={this.state.student_class_id} onChange={(e)=>this.setState({"student_class_id":parseInt(e.target.value,10)})}  /></Col></Row>
                </Col>),( <Col key="courseCol" md={4}>
                    <Row><Col md={12}><CourseList2 defaultValue={this.state.course_id} class_id={this.state.student_class_id} onChange={(e)=>this.setState({"course_id":parseInt(e.target.value,10)})} /></Col></Row>
                </Col>)]:null}
            {
                (
                    // this.state.teaching_task_id+this.state.teacher_id+this.state.student_class_id===0
                    this.state.rows.length ===0
                )?null:[
                    (<Col md={4} key="col1">
                        <Row><Col md={12}>
                            <FormField title="平时成绩占比" value={this.state.regular_per}
                                       onChange={(e)=>{
                                           if(e.target.value>100 || e.target.value<0){
                                               alert("成绩比例应在0-100之间");
                                               return;
                                           }
                                           this.setState({
                                               "regular_per":e.target.value,
                                               "rows":this.state.rows
                                           });
                                           // this.finalexam_per_input.setValue(100 - e.target.value - this.state.medium_per);
                                           this.calaulateTotalGrade();
                                         }
                                       } />
                        </Col></Row>
                    </Col>),
                    (<Col md={4} key="col2">
                        <Row><Col md={12}>
                            <FormField title="期中成绩占比" value={this.state.medium_per} onChange={(e)=>{
                                if(e.target.value>100 || e.target.value<0){
                                    alert("成绩比例应在0-100之间");
                                    return;
                                }
                                this.setState({
                                    "medium_per":e.target.value,
                                    // "finalexam_per":100 - e.target.value - this.state.regular_per,
                                    "rows":this.state.rows
                                });
                                // this.finalexam_per_input.setValue(100 - e.target.value - this.state.regular_per);
                                this.calaulateTotalGrade();
                            }} />
                        </Col></Row>
                    </Col>),
                    (<Col md={4} key="col3">
                        <Row><Col md={12}>
                            <FormField ref={ref=>this.finalexam_per_input=ref} title="期末成绩占比" value={this.state.finalexam_per} onChange={(e)=>{
                                if(e.target.value>100 || e.target.value<0){
                                    alert("成绩比例应在0-100之间");
                                    return;
                                }
                                this.setState({
                                    // "finalexam_per":100 - this.state.regular_per - this.state.medium_per,
                                    "finalexam_per":e.target.value,
                                    "rows":this.state.rows
                                });
                                // this.finalexam_per_input.setValue(100 - this.state.regular_per - this.state.medium_per);
                                this.calaulateTotalGrade();
                            }} />
                        </Col></Row>
                    </Col>),
                ]
            }
    </Row>);
    }

    renderTools(){
        return [(
            <Row key="top"><Col md={12}>
                {this.renderTop()}
            </Col></Row>
        ),
        //     (<Row key="middle"><Col md={12}>
        //         {this.renderMid()}
        //     </Col></Row>
        // ),
            (
            <Row key="buttom"><Col md={12}>
                {this.renderButtom()}
            </Col></Row>
        )];
    }

    // rowGetter = (i) => {
    //     let row = this.state.rows[i];
    //     row["id"] = i+1;
    //     return row;
    // };

    // handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    //     let rows = this.state.rows.slice();
    //
    //     for (let i = fromRow; i <= toRow; i++) {
    //         let rowToUpdate = rows[i];
    //         let updatedRow = update(rowToUpdate, {$merge: updated});
    //         rows[i] = updatedRow;
    //     }
    //
    //     this.setState({ rows });
    // };

    componentWillMount() {

    }

    // 在组件将要被移除的时候，清除 timer
    componentWillUnmount() {
        if(this.xhr)
            this.xhr.abort();
    }

    loadRows = () => {
        const that = this;
        let params = {};
        switch (this.state.input_type){
            case 1:
                params = {
                    teaching_task_id:this.state.teaching_task_id,
                    teacher_id:this.state.teacher_id,
                    class_id:this.state.student_class_id
                };
                break;
            case 2:
                params = {
                    course_id:this.state.course_id,
                    class_id:this.state.student_class_id
                };
                break;
            default:
                params = {
                    course_id:this.state.course_id,
                    class_id:this.state.student_class_id
                };
        }


        this.xhr = $.post(window.baseUrl+'app/grade/queryStudentWithInfo',
            {context:JSON.stringify(params)},function (data) {
            if(data["success"]===true||data["success"]==='true'){
                let rows = data["result"];
                if(rows && rows.length>0){
                    //group by
                    let groups = _(data["result"])
                        .chain()
                        .map(row=> {
                            row["EDIT"] = (row["exam_state"]<=3);
                            let finalGrade = GradeInput.calcTotalGrade(row,row);
                            row["totel_grade"] = finalGrade;
                            return row;
                        })
                        .groupBy(row=>row["exam_plan_id"])
                        .value();

                    let keys = _.keys(groups);
                    that.setState({
                        row_groups:groups,
                        exam_plan_ids:keys,
                        exam_plan_index:0,
                        rows:groups[keys[0]],
                        regular_per:rows[0]["regular_per"],
                        medium_per:rows[0]["medium_per"],
                        finalexam_per:rows[0]["finalexam_per"],
                        forceEdit:false
                    });
                }else {
                    that.setState({
                        row_groups:[],
                        exam_plan_ids:[],
                        exam_plan_index:0,
                        rows:rows,
                        regular_per:20,
                        medium_per:30,
                        finalexam_per:50,
                        forceEdit:false
                    });
                }
                // this.state = {rows:rows };
            }
        });
    };

    submitGrade = (toSetState)=>()=>{
        const that = this;

        let paramArr = this.state.rows.map(row=> {
            return {
                exam_plan_id:row["exam_plan_id"],
                student_id:row["student_id"],
                regular_grade:row["regular_grade"],
                midterm_grade:row["midterm_grade"],
                final_exam_grade:row["final_exam_grade"],
                totel_grade:GradeInput.calcTotalGrade(row,this.state)
            }
        });
        let params = {
            grades:paramArr,
            regular_per:this.state.regular_per,
            medium_per:this.state.medium_per,
            finalexam_per:this.state.finalexam_per,
            exam_plan_id:this.state.exam_plan_ids[this.state.exam_plan_index],
            stateTo:toSetState
        };
        this.xhr = $.post(window.baseUrl+'app/grade/addGradeStudentWithPercent',
            {context:JSON.stringify(params)},function (data) {
                if(data["success"]===true||data["success"]==='true'){
                    that.loadRows();
                    alert("提交成功！");
                }
            });
    };
}




