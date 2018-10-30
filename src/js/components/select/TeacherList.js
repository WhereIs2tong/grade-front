import $ from 'jQuery';

import QueryList from './QueryList'
import PropTypes from 'prop-types';

export default class TeacherList extends QueryList {
    static propTypes = {
        departmentId:PropTypes.number,
        researchPositionId:PropTypes.number,
        teacherTitleId:PropTypes.number,
        teacherName:PropTypes.string,
        teacherNo:PropTypes.string,
        semester_id:PropTypes.number,
        // teacher_id:PropTypes.number
    };
    constructor(props, context) {
        super(props, context);
        this.loadOptions();
    }

    loadOptions(){
        let that = this;
        let params = {
            faculty:this.props.departmentId,
            teachering_office:this.props.researchPositionId,
            technical_title:this.props.teacherTitleId,
            teacher_name:this.props.teacherName,
            teacher_number:this.props.teacherNo,
            semester_id:this.props.semester_id,
            // teacher_id:this.props.teacher_id //TODO　补充　teacher_id
        };
        $.post(window.baseUrl+'app/grade/queryTeachers',
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

TeacherList.defaultProps={
    label:'教师',
    departmentId:0,
    researchPositionId:0,
    teacherTitleId:0,
    teacherName:'',
    teacherNo:'',
    semester_id:0,
    // teacher_id:0
};


