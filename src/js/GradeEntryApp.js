/**
 * Created by Wang on 2018/7/27.
 * 成绩录入审批
 */
import React from 'react';
import ReactDOM from 'react-dom';
import '../css/index.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap-theme.min.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";

import GradeExamine from "./apps/GradeExamine";

ReactDOM.render(<GradeExamine check_stage="check2" />, document.getElementById('root'));