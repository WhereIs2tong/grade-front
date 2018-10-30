import React,{Component} from 'react';
import {Button, Modal} from "react-bootstrap";
import PropTypes from 'prop-types';
import $ from 'jQuery';


export default class ModalDialog extends Component{
    static propTypes = {
        title:PropTypes.string,
        onHide:PropTypes.func,
        show:PropTypes.bool,
        showCloseButton:PropTypes.bool,
        backdrop:PropTypes.oneOf(['static', true,false])
    };

    // constructor(props, context) {
    //     super(props, context);
    // }

    render() {
        let children = this.props.children;
        let props = $.extend({},this.props);
        delete props["showCloseButton"];
        delete props["children"];
        delete props["title"];
        delete props["onHide"];

        return (<Modal
            {...props}
            onHide={()=>this.props.onHide()}
            bsSize="large"
            aria-labelledby="contained-modal-title-lg"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-lg">{this.props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {React.Children.map(children,x=>x)}
            </Modal.Body>
            {
                this.props.showCloseButton &&
                (<Modal.Footer>
                    <Button onClick={()=>this.props.onHide()}>关闭</Button>
                </Modal.Footer>)
            }
        </Modal>);
    }
}

ModalDialog.defaultProps= {
    title:"子窗口",
    show:false,
    showCloseButton:true,
    onHide:() => {},
    backdrop:"static"
};
