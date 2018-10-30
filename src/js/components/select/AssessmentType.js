import QueryList from "./QueryList";
import PropTypes from 'prop-types';

export default class AssessmentType extends QueryList {
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

AssessmentType.defaultProps={
    label:'考核方式',
    options:[
        {
            id:0,
            name:"全部"
        },
        {
            id:1,
            name:"考试"
        },
        {
            id:2,
            name:"考察"
        }
    ]
};


