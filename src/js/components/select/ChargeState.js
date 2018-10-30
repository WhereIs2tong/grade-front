import QueryList from "./QueryList";
import PropTypes from 'prop-types';

export default class ChargeState extends QueryList {
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

ChargeState.defaultProps={
    label:'是否缴费',
    options:[
        {
            id:0,
            name:"全部"
        },
        {
            id:1,
            name:"已交"
        },
        {
            id:2,
            name:"未交"
        }

    ]
};


