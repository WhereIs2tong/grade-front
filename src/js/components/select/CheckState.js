import QueryList from "./QueryList";
import PropTypes from 'prop-types';

export default class CheckState extends QueryList {
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

CheckState.defaultProps={
    label:'审核状态',
    options:[
        {
            id:0,
            name:"全部"
        },
        {
            id:10,
            name:"未审核"
        },
        {
            id:1,
            name:"审核已通过"
        },
        {
            id:-1,
            name:"审核未通过"
        },
        {
            id:2,
            name:"审批已通过"
        },
        {
            id:-2,
            name:"审批未通过"
        }
    ]
};


