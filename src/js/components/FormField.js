import React, { Component } from 'react';
import {Col, ControlLabel, Form, FormControl, FormGroup} from "react-bootstrap";
import PropTypes from 'prop-types';
import $ from 'jQuery';

// function FormField({title,value,onChange}){
//     return ( <Form horizontal>
//         <FormGroup>
//             <Col md={4}>
//                 <ControlLabel>{title}</ControlLabel>
//             </Col>
//             <Col md={8}>
//                 <FormControl defaultValue={value} onChange={onChange} />
//             </Col>
//         </FormGroup>
//     </Form>);
// }

class FormField extends Component{
    render() {
        return ( <Form horizontal>
            <FormGroup>
                <Col md={this.props.labelMd}>
                    <ControlLabel>{this.props.title}</ControlLabel>
                </Col>
                <Col md={this.props.fieldMd}>
                    <FormControl ref={ref=>this.input=ref} value={this.props.value} onChange={this.props.onChange} />
                </Col>
            </FormGroup>
        </Form>);
    }

    setValue(val){
        $(this.input).val(val);
    }
}

FormField.propTypes = {
    title:PropTypes.string.isRequired,
    value:PropTypes.any.isRequired,
    onChange:PropTypes.func.isRequired,
    labelMd:PropTypes.number,
    fieldMd:PropTypes.number,
};
FormField.defaultProps = {
    labelMd:4,
    fieldMd:8
};

function FormStaticField({title,value}){
    return ( <Form horizontal>
        <FormGroup>
            <Col md={4}>
                <ControlLabel>{title}</ControlLabel>
            </Col>
            <Col md={8}>
                <FormControl.Static>{value}</FormControl.Static>
            </Col>
        </FormGroup>
    </Form>);
}

export {FormField,FormStaticField}

