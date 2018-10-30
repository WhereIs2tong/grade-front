import $ from 'jQuery';

import QueryList from './QueryList'
import PropTypes from 'prop-types';

export default class CourseList extends QueryList {
    static propTypes = {
        exam_type:PropTypes.number,
        check_state:PropTypes.number,
        faculty:PropTypes.number,//开课院系
        departments:PropTypes.number,//上课院系
        majod_id:PropTypes.number,
        teacher_name:PropTypes.string,
        course_name:PropTypes.string,
        teacher_id:PropTypes.number,
        semester_id:PropTypes.number
    };
    constructor(props, context) {
        super(props, context);
        this.loadOptions();
    }

    loadOptions(){
        let that = this;
        let params = {
            exam_type:this.props.exam_type,
            check_state:this.props.check_state,
            faculty:this.props.faculty,
            departments:this.props.departments,
            majod_id:this.props.majod_id,
            teacher_name:this.props.teacher_name,
            course_name:this.props.course_name,
            teacher_id:this.props.teacher_id,
            academic_year_id:this.props.semester_id
        };
        $.post(window.baseUrl+'app/grade/queryCourses',
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

CourseList.defaultProps={
    label:'课程',
    exam_type:0,
    check_state:0,
    faculty:0,//开课院系
    departments:0,//上课院系
    majod_id:0,
    teacher_name:'',
    course_name:'',
    teacher_id:0,
    semester_id:0
};


