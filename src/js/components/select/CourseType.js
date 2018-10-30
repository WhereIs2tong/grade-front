import QueryList from "./QueryList";
import PropTypes from 'prop-types';

export default class CourseType extends QueryList {
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

CourseType.defaultProps={
    label:'课程性质',
    options:[
        {
            id:0,
            name:"全部"
        },
        {
            id:1,
            name:"必修"
        },
        {
            id:2,
            name:"限选"
        },
        {
            id:3,
            name:"任选"
        },

    ]
};


