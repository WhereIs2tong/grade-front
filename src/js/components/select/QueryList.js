import React,{Component} from 'react';
import {Col, ControlLabel, Form, FormControl, FormGroup} from "react-bootstrap";
import PropTypes from 'prop-types';
import $ from 'jQuery';
import * as _ from "lodash";

export default class QueryList extends Component {
    static propTypes = {
        controlId:PropTypes.string,
        label:PropTypes.string,
        title:PropTypes.string,
        multiple:PropTypes.bool,
        value:PropTypes.number,
        defaultValue:PropTypes.number,
        onChange:PropTypes.func,
        srOnly:PropTypes.bool,
        cssStyle:PropTypes.object,
        omitKeys:PropTypes.array
    };

    getInputNode() {
        return this.input;
    }

    getValue(){
        return $(this.getInputNode()).val();
    }

    constructor(props, context) {
        super(props, context);

        this.state = {
            options:[
                {name:"选择...",id:0}
                ],
            idMap:{}
        };
    }

    loadOptions(){}

    componentWillReceiveProps(nextProps) {
        this.loadOptions();
    }

    setOptions(options){
        let idMap = {0:{name:"选择...",id:0}};
        options.forEach(item=>idMap[item.id]=item);
        // options = [{name:"选择...",id:0}, ...options];
        options = Object.values(idMap);
        this.setState({options:options ,idMap:idMap});
    }

    render(){
        let value = this.props.value || this.props.defaultValue;
        let options = this.state.options.filter(option=>! _.includes(this.props.omitKeys,option.id)).map(option=>(<option key={option.id} value={option.id}>{option.name}</option>));

        let label = null ;
        if(! this.props.srOnly){
            label = (<Col md={4}><ControlLabel>{this.props.title || this.props.label}</ControlLabel></Col>);
        }
        return (
            <Form horizontal>
                <FormGroup controlId={this.props.controlId}>
                    {label}
                    <Col md={8}>
                        <FormControl style={this.props.cssStyle} componentClass="select" value={this.props.multiple?[]:value} inputRef={ref => { this.input = ref; }} multiple={this.props.multiple} onChange={this.handleChange.bind(this)} >
                            {options}
                        </FormControl>
                    </Col>
                </FormGroup>
            </Form>
           );
    }

    handleChange(e){
        let key = parseInt(e.target.value,10);
        let obj = this.state.idMap[key];
        this.props.onChange(e,obj);
    };
}

QueryList.defaultProps={
    multiple:false,
    defaultValue:0,
    label:'标题',
    srOnly:false,
    cssStyle:{},
    onChange:(e)=>{},
    omitKeys:[]
};


