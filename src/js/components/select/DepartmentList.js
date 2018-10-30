import $ from 'jQuery';

import QueryList from './QueryList'

export default class DepartmentList extends QueryList {
    constructor(props, context) {
        super(props, context);
        this.loadOptions();
    }

    loadOptions(){
        let that = this;
        $.post(window.baseUrl+'app/grade/queryDepartment',{},function (data) {
            if(data["success"]===true||data["success"]==='true'){
                let options = data["result"];
                that.setOptions(options);
            }
        });
    }
}

DepartmentList.defaultProps={
    label:'院系名称'
};


