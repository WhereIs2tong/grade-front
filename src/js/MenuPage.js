import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../css/index.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap-theme.min.css";
import "@blueprintjs/core/lib/css/blueprint.css"
import "@blueprintjs/select/lib/css/blueprint-select.css";
import PropTypes from 'prop-types';

import {Grid, Nav, NavItem, Row} from 'react-bootstrap';

export default class MenuPage extends Component {
    static propTypes = {
        menuMap:PropTypes.object,
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            subUrl:'GradeControlApp'
        };
    }

    handleSelect(selectedKey) {
        // window.childPage = selectedKey;
        // this.subFrame.contentWindow.location.reload(true);
        this.setState({subUrl:selectedKey});
    }

    render() {
        let navs = [];
        for (let key in this.props.menuMap){
            navs.push(<NavItem eventKey={key} key={key} href="#">
                {this.props.menuMap[key]}
            </NavItem>);
        }
        return (
            <Grid>
                <Row><Nav bsStyle="pills" onSelect={this.handleSelect.bind(this)}>{navs}</Nav></Row>
                <Row>
                    <iframe title="Inner Frame" ref={ref=>this.subFrame=ref} src={'./'+this.state.subUrl+'.html'} width="100%" height="100%" style={{minHeight:"600px"}}></iframe>
                </Row>
            </Grid>
        );
    }
}

MenuPage.defaultProps={
    menuMap:{}
};

const menuMap = {
    MakeExaminePlanApp:'生成考试计划',
    GradeControlApp:'成绩控制',
    GradeInputApp:'成绩录入管理',
    GradeExamineApp:'成绩录入审核',
    GradeEntryApp:'成绩录入审批',
    ScorePoolApp:'学生成绩总库',
};


ReactDOM.render(<MenuPage menuMap={menuMap}/>, document.getElementById('root'));

