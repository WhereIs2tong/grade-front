import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {Button,Glyphicon} from 'react-bootstrap';

export default class Help extends Component{
    static propTypes = {
        link: PropTypes.string.isRequired,
        userDefined:PropTypes.bool,
        bsStyle:PropTypes.string
    };

    render(){
        let children = this.props.children;
        let inner;
        if(this.props.userDefined){
            inner = React.Children.map(children,x=>x);
        }else {
            inner = [<Glyphicon key="icon" glyph="question-sign" />,"帮助"]
        }

        return (<Button style={{display:"none"}} bsStyle={this.props.bsStyle} onClick={this.showHelp}>
            {inner}
        </Button>)
    }

    showHelp=()=>{
        window.open(this.props.link,"帮助");
    };
}

Help.defaultProps={
    userDefined:false,
    bsStyle:"default"
};