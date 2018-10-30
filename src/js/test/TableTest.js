import React, { Component } from 'react';

import Table from "../components/table/EditableTable"
import DateInputCell from "../components/table/cells/DateInputCell";
import SwithCell from "../components/table/cells/SwithCell";

export default class TableTest extends Component {
    constructor(props, context) {
        super(props, context);

        const that = this;
        this._columns = [
            {
                key: 'academic_year',
                name: '学年学期号',
                editable: false
            },
            {
                key: 'start_date',
                name: '开始日期',
                editable: true,
                contextRender:DateInputCell
            },
            {
                key: 'end_date',
                name: '结束日期',
                editable: true,
                contextRender:DateInputCell
            },
            {
                key: 'enable_control',
                name: '开启录入控制',
                editable: true,
                contextRender:SwithCell
            },
            {
                key: 'enable_check',
                name: '开启审批',
                editable: true,
                contextRender:SwithCell
            },
            {
                key: 'enable_apply',
                name: '开启审核',
                editable: true,
                contextRender:SwithCell
            },
            {
                key: 'option',
                name: '操作',
                width: 120
            },
            {
                key: 'show',
                name: '查看',
                width: 100
            }
        ];

        this.state = {
            rows: [{
                "end_date": 1527609600000,
                "academic_year": "2003-2004-1",
                "enable_check": true,
                "ac_year_id": 1,
                "enable_apply": true,
                "start_date": 1515513600000,
                "enable_control": true
            }, {
                "end_date": 1527609600000,
                "academic_year": "2005-2006-2",
                "enable_check": true,
                "ac_year_id": 5,
                "enable_apply": true,
                "start_date": 1515513600000,
                "enable_control": false
            }, {
                "end_date": 1527609600000,
                "academic_year": "2006-2007-1",
                "enable_check": true,
                "ac_year_id": 6,
                "enable_apply": true,
                "start_date": 1515513600000,
                "enable_control": false
            }, {
                "end_date": 1527609600000,
                "academic_year": "2006-2007-2",
                "enable_check": false,
                "ac_year_id": 7,
                "enable_apply": false,
                "start_date": 1515513600000,
                "enable_control": false
            }, {
                "end_date": 0,
                "academic_year": "2004-2005-1",
                "enable_check": false,
                "ac_year_id": 0,
                "enable_apply": false,
                "start_date": 0,
                "enable_control": false
            }, {
                "end_date": 0,
                "academic_year": "2004-2005-2",
                "enable_check": false,
                "ac_year_id": 0,
                "enable_apply": false,
                "start_date": 0,
                "enable_control": false
            }, {
                "end_date": 0,
                "academic_year": "2005-2006-1",
                "enable_check": false,
                "ac_year_id": 0,
                "enable_apply": false,
                "start_date": 0,
                "enable_control": false
            }, {
                "end_date": 0,
                "academic_year": "2007-2008-1",
                "enable_check": false,
                "ac_year_id": 0,
                "enable_apply": false,
                "start_date": 0,
                "enable_control": false
            }, {
                "end_date": 0,
                "academic_year": "2007-2008-2",
                "enable_check": false,
                "ac_year_id": 0,
                "enable_apply": false,
                "start_date": 0,
                "enable_control": false
            }, {
                "end_date": 0,
                "academic_year": "2008-2009-1",
                "enable_check": false,
                "ac_year_id": 0,
                "enable_apply": false,
                "start_date": 0,
                "enable_control": false
            }, {
                "end_date": 0,
                "academic_year": "2008-2009-2",
                "enable_check": false,
                "ac_year_id": 0,
                "enable_apply": false,
                "start_date": 0,
                "enable_control": false
            }, {
                "end_date": 0,
                "academic_year": "2009-2010-1",
                "enable_check": false,
                "ac_year_id": 0,
                "enable_apply": false,
                "start_date": 0,
                "enable_control": false
            }, {
                "end_date": 0,
                "academic_year": "2009-2010-2",
                "enable_check": false,
                "ac_year_id": 0,
                "enable_apply": false,
                "start_date": 0,
                "enable_control": false
            }, {
                "end_date": 0,
                "academic_year": "2016-2017-1",
                "enable_check": false,
                "ac_year_id": 0,
                "enable_apply": false,
                "start_date": 0,
                "enable_control": false
            }, {
                "end_date": 0,
                "academic_year": "2010-2011-1",
                "enable_check": false,
                "ac_year_id": 0,
                "enable_apply": false,
                "start_date": 0,
                "enable_control": false
            }, {
                "end_date": 0,
                "academic_year": "2018-2019-3",
                "enable_check": false,
                "ac_year_id": 0,
                "enable_apply": false,
                "start_date": 0,
                "enable_control": false
            }, {
                "end_date": 0,
                "academic_year": "2022-2023-1",
                "enable_check": false,
                "ac_year_id": 0,
                "enable_apply": false,
                "start_date": 0,
                "enable_control": false
            }, {
                "end_date": 0,
                "academic_year": "2024-2025-1",
                "enable_check": false,
                "ac_year_id": 0,
                "enable_apply": false,
                "start_date": 0,
                "enable_control": false
            }, {
                "end_date": 0,
                "academic_year": "1221",
                "enable_check": false,
                "ac_year_id": 0,
                "enable_apply": false,
                "start_date": 0,
                "enable_control": false
            }, {
                "end_date": 0,
                "academic_year": "2011-2012-1",
                "enable_check": false,
                "ac_year_id": 0,
                "enable_apply": false,
                "start_date": 0,
                "enable_control": false
            }, {
                "end_date": 0,
                "academic_year": "2030-2031-1",
                "enable_check": false,
                "ac_year_id": 0,
                "enable_apply": false,
                "start_date": 0,
                "enable_control": false
            }]
        };
    }

    handleDataChange = (rowData)=>{
      console.info("Table data changed:",rowData);
    };

    render() {
        return (
            <div>
                <Table columns={this._columns} data={this.state.rows} onDataChange={this.handleDataChange}/>
            </div>
        );
    }
}
