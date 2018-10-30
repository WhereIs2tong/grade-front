import $ from 'jQuery';

import QueryList from './QueryList'

export default class TeacherTitleList extends QueryList {
    constructor(props, context) {
        super(props, context);
        this.loadOptions();
    }

    loadOptions(){
        let that = this;
        $.post(window.baseUrl+'app/grade/queryTeacherTitles',{},function (data) {
            if(data["success"]===true||data["success"]==='true'){
                let options = data["result"];
                that.setOptions(options);
            }
        });
    }
}

TeacherTitleList.defaultProps={
    label:'教师职称'
};


