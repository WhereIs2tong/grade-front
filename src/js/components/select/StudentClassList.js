import $ from 'jQuery';

import QueryList from './QueryList'
import PropTypes from 'prop-types';

export default class StudentClassList extends QueryList {
    static propTypes = {
        teaching_task_id:PropTypes.number
    };
    constructor(props, context) {
        super(props, context);
        this.loadOptions();
    }

    loadOptions(){
        let that = this;
        let params = {
            teaching_task_id:this.props.teaching_task_id
        };
        $.post(window.baseUrl+'app/grade/queryStudentClass',
            {context:JSON.stringify(params)},
            function (data) {
                if(data["success"]===true||data["success"]==='true'){
                    let options = data["result"];
                    that.setOptions(options);
                    // that.setState({teacherList:options});
                }
            });
    }
}

StudentClassList.defaultProps={
    label:'班级',
    teaching_task_id:0,
};


