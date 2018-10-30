import React,{Component} from 'react';
import {Col, ControlLabel, Form, FormControl, FormGroup} from "react-bootstrap";
import PropTypes from 'prop-types';
import $ from 'jQuery';
import * as _ from "lodash";
import { Button, MenuItem } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";

function escapeRegExpChars(text) {
    return text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function highlightText(text, query) {
    let lastIndex = 0;
    const words = query
        .split(/\s+/)
        .filter(word => word.length > 0)
        .map(escapeRegExpChars);
    if (words.length === 0) {
        return [text];
    }
    const regexp = new RegExp(words.join("|"), "gi");
    const tokens = [];
    while (true) {
        const match = regexp.exec(text);
        if (!match) {
            break;
        }
        const length = match[0].length;
        const before = text.slice(lastIndex, regexp.lastIndex - length);
        if (before.length > 0) {
            tokens.push(before);
        }
        lastIndex = regexp.lastIndex;
        tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
    }
    const rest = text.slice(lastIndex);
    if (rest.length > 0) {
        tokens.push(rest);
    }
    return tokens;
}

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

    static dataFilter = (query, option) => {
        return `${option.id}. ${option.name.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0;
    };

    static dataRenderer = (option,props)=>{
        const { handleClick, modifiers, query } = props;
        if (!modifiers.matchesPredicate) {
            return null;
        }
        const text = `${option.id}. ${option.name}`;
        return (
            <MenuItem
                active={modifiers.active}
                disabled={modifiers.disabled}
                label={option.name}
                key={option.id}
                onClick={handleClick}
                text={highlightText(text, query)}
            />
        );
    };

    render(){
        let value = this.props.value || this.props.defaultValue;
        let options = this.state.options.filter(option=>! _.includes(this.props.omitKeys,option.id)).map(option=>(<option key={option.id} value={option.id}>{option.name}</option>));

        let label = null ;
        if(! this.props.srOnly){
            label = (<Col md={4}><ControlLabel>{this.props.title || this.props.label}</ControlLabel></Col>);
        }

        const selectedOption = this.state.value;
        return (
            <Form horizontal>
                <FormGroup controlId={this.props.controlId}>
                    {label}
                    <Col md={8}>
                        <FormControl.Static componentClass="div">
                            <Select
                                itemPredicate={QueryList.dataFilter}
                                itemRenderer={QueryList.dataRenderer}
                                items={this.state.options}
                                filterable={true}
                                resetOnQuery={true}
                                noResults={<MenuItem disabled={true} text="没有可选项." />}
                                onItemSelect={this.handleValueChange}
                            >
                                <Button
                                    rightIcon="caret-down"
                                    text={selectedOption ? `${selectedOption.name}` : "(未选择)"}
                                />
                            </Select>
                        </FormControl.Static>
                        {/*<FormControl style={this.props.cssStyle} componentClass="select" value={this.props.multiple?[]:value} inputRef={ref => { this.input = ref; }} multiple={this.props.multiple} onChange={this.handleChange.bind(this)} >*/}
                            {/*{options}*/}
                        {/*</FormControl>*/}
                    </Col>
                </FormGroup>
            </Form>
           );
    }

    handleValueChange = (option)=>{
        this.setState({ value:option });
        this.props.onChange({
            target:{
                value:option.id
            }
        },option);
    };

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


