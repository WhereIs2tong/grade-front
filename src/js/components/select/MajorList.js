import $ from 'jQuery';
import PropTypes from 'prop-types';
import QueryList from './QueryList'

export default class MajorList extends QueryList {
    static propTypes = {
        departmentId:PropTypes.number
    };
    constructor(props, context) {
        super(props, context);
        this.loadOptions();
    }

    loadOptions(){
        let that = this;
        let params = {};
        params["department_id"] = this.props.departmentId;
        $.post(window.baseUrl+'app/grade/queryMajor',
            {context:JSON.stringify(params)},
            function (data) {
                if(data["success"]===true||data["success"]==='true'){
                    let options = data["result"];
                    that.setOptions(options);
                }
        });
    }
}

MajorList.defaultProps={
    label:'专业',
    departmentId:0
};


