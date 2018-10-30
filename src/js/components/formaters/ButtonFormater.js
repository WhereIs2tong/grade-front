import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Button} from 'react-bootstrap';
// Custom Formatter component
export default class ButtonFormater extends Component {
    static propTypes = {
        title:PropTypes.oneOfType([PropTypes.string,PropTypes.func]).isRequired,
        onExcute:PropTypes.func.isRequired
    };

    render() {
        let title = this.props.title;
        if (title instanceof Function){
            title = title(this.props);
        }
        return (
            <Button bsStyle="primary" onClick={this.onClick}>{title}</Button>
        );
    }

    onClick =(e)=>{
        this.props.onExcute(this.props);
    };
}
