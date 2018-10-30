/**
 * Created by Wang on 2018/7/27.
 * 成绩录入控制
 */
import React from 'react';
import ReactDOM from 'react-dom';
import '../css/index.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap-theme.min.css";
import "@blueprintjs/core/lib/css/blueprint.css"
import "@blueprintjs/table/lib/css/table.css"
import "@blueprintjs/select/lib/css/blueprint-select.css";

// import TableTest from './test/TableTest';
// ReactDOM.render(<TableTest />, document.getElementById('root'));

// import GradeControl from "./apps/GradeControl";
// ReactDOM.render(<GradeControl />, document.getElementById('root'));

import GradeInput from "./apps/GradeInput";
ReactDOM.render(<GradeInput />, document.getElementById('root'));

// import ExamPlan from "./apps/ExamPlan";
// ReactDOM.render(<ExamPlan />, document.getElementById('root'));

// import ScorePool from "./apps/ScorePool";
// ReactDOM.render(<ScorePool />, document.getElementById('root'));