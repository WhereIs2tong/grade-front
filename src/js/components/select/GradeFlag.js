import QueryList from "./QueryList";
import PropTypes from 'prop-types';

export default class GradeFlag extends QueryList {
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

GradeFlag.defaultProps={
    label:'成绩标记',
    options:[
        {
            id:0,
            name:"全部"
        },
        {
            id:1,
            name:"舞弊"
        },
        {
            id:2,
            name:"旷考"
        },
        {
            id:3,
            name:"免修"
        },

        {
            id:4,
            name:"学分认证"
        },
        {
            id:5,
            name:"缓考"
        },
        {
            id:6,
            name:"不明"
        },



    ]
};


