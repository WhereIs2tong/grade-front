/**
 * Created by Wang on 2018/7/27.
 * 成绩录入审核
 */
import React from 'react';
import ReactDOM from 'react-dom';
import '../css/index.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap-theme.min.css";
import GradeExamine from "./apps/GradeExamine";

ReactDOM.render(<GradeExamine check_stage="check1" />, document.getElementById('root'));