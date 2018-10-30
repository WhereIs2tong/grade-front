import $ from 'jQuery';

import QueryList from './QueryList'

export default class SemesterList extends QueryList {
    constructor(props, context) {
        super(props, context);
        this.loadOptions();
    }

    loadOptions(){
        let that = this;
        $.post(window.baseUrl+'app/grade/querySemester',{},function (data) {
            if(data["success"]===true||data["success"]==='true'){
                let options = data["result"];
                that.setOptions(options);
            }
        });
    }
}

SemesterList.defaultProps={
    label:'学期'
};


