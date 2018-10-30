import QueryList from "./QueryList";
import PropTypes from 'prop-types';

export default class ExamType extends QueryList {
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

ExamType.defaultProps={
    label:'考试性质',
    options:[
        {
            id:0,
            name:"全部"
        },
        {
            id:1,
            name:"正常考试"
        },
        {
            id:3,
            name:"重修"
        },
        {
            id:2,
            name:"补考"
        },
        {
            id:4,
            name:"重考"
        }
    ]
};


