import PropTypes from 'prop-types';
import TextFormater from "./TextFormater";

export default class AutoFormater extends TextFormater {
    static propTypes = {
        renderAssign:PropTypes.func.isRequired,
        args:PropTypes.any
    };

    renderShow() {
        return (
            this.props.renderAssign(this.props,this.props.args)
        );
    }
}
AutoFormater.defaultProps={
    validatedFunc:(val)=>"success"
};
