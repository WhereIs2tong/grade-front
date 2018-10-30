import $ from 'jQuery';

import QueryList from './QueryList'
import PropTypes from 'prop-types';

export default class CourseList2 extends QueryList {
    static propTypes = {
        faculty:PropTypes.number,//开课院系
        course_name:PropTypes.string,
        teaching_research_id:PropTypes.number
    };
    constructor(props, context) {
        super(props, context);
        this.loadOptions();
    }

    loadOptions(){
        let that = this;
        let params = {
            faculty:this.props.faculty,
            course_name:this.props.course_name,
            teaching_research_id:this.props.teaching_research_id
        };
        $.post(window.baseUrl+'app/grade/queryCourses2',
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

CourseList2.defaultProps={
    label:'课程',
    faculty:0,//开课院系
    teaching_research_id:0,
    course_name:'',
};


