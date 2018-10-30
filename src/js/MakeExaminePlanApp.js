/**
 * Created by Wang on 2018/7/27.
 * 生成考试计划
 */
import React from 'react';
import ReactDOM from 'react-dom';
import '../css/index.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap-theme.min.css";
import "@blueprintjs/core/lib/css/blueprint.css"
import "@blueprintjs/select/lib/css/blueprint-select.css";

import ExamPlan from "./apps/ExamPlan";
ReactDOM.render(<ExamPlan />, document.getElementById('root'));
