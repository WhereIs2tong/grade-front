/**
 * Created by Wang on 2018/7/27.
 * 缺考缓考管理
 */
import React from 'react';
import ReactDOM from 'react-dom';
import '../css/index.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap-theme.min.css";
import "@blueprintjs/core/lib/css/blueprint.css"
import "@blueprintjs/table/lib/css/table.css"
import "@blueprintjs/select/lib/css/blueprint-select.css";

import ExamLack from "./apps/ExamLack";
ReactDOM.render(<ExamLack />, document.getElementById('root'));