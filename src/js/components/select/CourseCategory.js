import QueryList from "./QueryList";
import PropTypes from 'prop-types';

export default class CourseCategory extends QueryList {
    static propTypes = {
        options :PropTypes.arrayOf(PropTypes.shape({
            id:PropTypes.number,
            name:PropTypes.string
        }))
    };
    constructor(props, context) {
        super(props, context);
        this.state.options=this.props.options||[];
    }
}

CourseCategory.defaultProps={
    label:'课程种类',
    options:[
        {
            id:0,
            name:"全部"
        },
        {
            id:1,
            name:"职业基础课"
        },
        {
            id:2,
            name:"职业能力课"
        },
        {
            id:3,
            name:"职业技术课"
        },
        {
            id:4,
            name:"选修课"
        },
        {
            id:5,
            name:"专业技术课"
        },
        {
            id:6,
            name:"专业基础课"
        },
        {
            id:7,
            name:"必修课"
        },
        
    ]
};


