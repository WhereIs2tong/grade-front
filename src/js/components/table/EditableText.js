import classNames from "classnames";
import * as React from "react";
import PropTypes from 'prop-types';

import { AbstractPureComponent,Classes,Keys} from "@blueprintjs/core";
import {DISPLAYNAME_PREFIX} from "@blueprintjs/core";
import { Utils } from "@blueprintjs/core";
const {clamp, safeInvoke} = Utils;

const BUFFER_WIDTH_EDGE = 5;
const BUFFER_WIDTH_IE = 30;

const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
const browser = {
    isEdge: /Edge/.test(userAgent),
    isInternetExplorer: /Trident|rv:11/.test(userAgent),
    isWebkit: /AppleWebKit/.test(userAgent),
};

export const Browser = {
    isEdge: () => browser.isEdge,
    isInternetExplorer: () => browser.isInternetExplorer,
    isWebkit: () => browser.isWebkit,
};

export class EditableText extends AbstractPureComponent{
    static displayName = `${DISPLAYNAME_PREFIX}.EditableText`;
    static propTypes = {
        confirmOnEnterKey: PropTypes.bool,
        defaultValue: PropTypes.string,
        disabled: PropTypes.bool,
        isEditing: PropTypes.bool,
        maxLength: PropTypes.number,
        minWidth: PropTypes.number,
        multiline: PropTypes.bool,
        maxLines: PropTypes.number,
        minLines: PropTypes.number,
        placeholder:PropTypes.string,
        selectAllOnFocus:PropTypes.bool,
        value:PropTypes.string,
        onCancel:PropTypes.func,//onCancel?(value: string): void;
        onChange:PropTypes.func,
        onConfirm:PropTypes.func,
        onEdit:PropTypes.func,
    };
    static defaultProps = {
        confirmOnEnterKey: false,
        defaultValue: "",
        disabled: false,
        maxLines: Infinity,
        minLines: 1,
        minWidth: 80,
        multiline: false,
        placeholder: "Click to Edit",
    };

     valueElement;
     refHandlers = {
        content: (spanElement) => {
            this.valueElement = spanElement;
        },
        input: (input) => {
            if (input != null) {
                input.focus();
                const { length } = input.value;
                input.setSelectionRange(this.props.selectAllOnFocus ? 0 : length, length);
                if (!this.props.selectAllOnFocus) {
                    input.scrollLeft = input.scrollWidth;
                }
            }
        },
    };

     constructor(props, context) {
        super(props, context);

        const value = props.value == null ? props.defaultValue : props.value;
        this.state = {
            inputHeight: 0,
            inputWidth: 0,
            isEditing: props.isEditing === true && props.disabled === false,
            lastValue: value,
            value,
        };
     }

 render() {
    const { disabled, multiline } = this.props;
    const value = this.props.value == null ? this.state.value : this.props.value;
    const hasValue = value != null && value !== "";

    const classes = classNames(
        Classes.EDITABLE_TEXT,
        Classes.intentClass(this.props.intent),
        {
            [Classes.DISABLED]: disabled,
            [Classes.EDITABLE_TEXT_EDITING]: this.state.isEditing,
            [Classes.EDITABLE_TEXT_PLACEHOLDER]: !hasValue,
            [Classes.MULTILINE]: multiline,
        },
        this.props.className,
    );

    let contentStyle;
    if (multiline) {
        // set height only in multiline mode when not editing
        // otherwise we're measuring this element to determine appropriate height of text
        contentStyle = { height: !this.state.isEditing ? this.state.inputHeight : null };
    } else {
        // minWidth only applies in single line mode (multiline == width 100%)
        contentStyle = {
            height: this.state.inputHeight,
            lineHeight: this.state.inputHeight != null ? `${this.state.inputHeight}px` : null,
            minWidth: this.props.minWidth,
        };
    }

    // make enclosing div focusable when not editing, so it can still be tabbed to focus
    // (when editing, input itself is focusable so div doesn't need to be)
    const tabIndex = this.state.isEditing || disabled ? null : 0;
    return (
        <div className={classes} onFocus={this.handleFocus} tabIndex={tabIndex}>
            {this.maybeRenderInput(value)}
            <span className={Classes.EDITABLE_TEXT_CONTENT} ref={this.refHandlers.content} style={contentStyle}>
                {hasValue ? value : this.props.placeholder}
            </span>
        </div>
    );
}

 componentDidMount() {
    this.updateInputDimensions();
}

 componentDidUpdate(_, prevState) {
    if (this.state.isEditing && !prevState.isEditing) {
        safeInvoke(this.props.onEdit, this.state.value);
    }
    this.updateInputDimensions();
}

 componentWillReceiveProps(nextProps) {
    const state = {};
    if (nextProps.value != null) {
        state.value = nextProps.value;
    }
    if (nextProps.isEditing != null) {
        state.isEditing = nextProps.isEditing;
    }
    if (nextProps.disabled || (nextProps.disabled == null && this.props.disabled)) {
        state.isEditing = false;
    }
    this.setState(state);
}

 cancelEditing = () => {
    const { lastValue, value } = this.state;
    this.setState({ isEditing: false, value: lastValue });
    if (value !== lastValue) {
        safeInvoke(this.props.onChange, lastValue);
    }
    safeInvoke(this.props.onCancel, lastValue);
};

 toggleEditing = () => {
    if (this.state.isEditing) {
        const { value } = this.state;
        this.setState({ isEditing: false, lastValue: value });
        safeInvoke(this.props.onConfirm, value);
    } else if (!this.props.disabled) {
        this.setState({ isEditing: true });
    }
};

 handleFocus = () => {
    if (!this.props.disabled) {
        this.setState({ isEditing: true });
    }
};

 handleTextChange = (event) => {
    const value = (event.target).value;
    // state value should be updated only when uncontrolled
    if (this.props.value == null) {
        this.setState({ value });
    }
    safeInvoke(this.props.onChange, value);
};

 handleKeyEvent = (event) => {
    const { altKey, ctrlKey, metaKey, shiftKey, which } = event;
    if (which === Keys.ESCAPE) {
        this.cancelEditing();
        return;
    }

    const hasModifierKey = altKey || ctrlKey || metaKey || shiftKey;
    if (which === Keys.ENTER) {
        // prevent IE11 from full screening with alt + enter
        // shift + enter adds a newline by default
        if (altKey || shiftKey) {
            event.preventDefault();
        }

        if (this.props.confirmOnEnterKey && this.props.multiline) {
            if (event.target != null && hasModifierKey) {
                insertAtCaret(event.target, "\n");
                this.handleTextChange(event);
            } else {
                this.toggleEditing();
            }
        } else if (!this.props.multiline || hasModifierKey) {
            this.toggleEditing();
        }
    }
};

 maybeRenderInput(value) {
    const { maxLength, multiline, placeholder } = this.props;
    if (!this.state.isEditing) {
        return undefined;
    }
    const props= {
        className: Classes.EDITABLE_TEXT_INPUT,
        maxLength,
        onBlur: this.toggleEditing,
        onChange: this.handleTextChange,
        onKeyDown: this.handleKeyEvent,
        placeholder,
        style: {
            height: this.state.inputHeight,
            lineHeight: !multiline && this.state.inputHeight != null ? `${this.state.inputHeight}px` : null,
            width: multiline ? "100%" : this.state.inputWidth,
        },
        value,
    };
    return multiline ? (
        <textarea ref={this.refHandlers.input} {...props} />
    ) : (
        <input ref={this.refHandlers.input} type="text" {...props} />
    );
}

 updateInputDimensions() {
    if (this.valueElement != null) {
        const { maxLines, minLines, minWidth, multiline } = this.props;
        const { parentElement, textContent } = this.valueElement;
        let { scrollHeight, scrollWidth } = this.valueElement;
        const lineHeight = getLineHeight(this.valueElement);
        // add one line to computed <span> height if text ends in newline
        // because <span> collapses that trailing whitespace but <textarea> shows it
        if (multiline && this.state.isEditing && /\n$/.test(textContent)) {
            scrollHeight += lineHeight;
        }
        if (lineHeight > 0) {
            // line height could be 0 if the isNaN block from getLineHeight kicks in
            scrollHeight = clamp(scrollHeight, minLines * lineHeight, maxLines * lineHeight);
        }
        // Chrome's input caret height misaligns text so the line-height must be larger than font-size.
        // The computed scrollHeight must also account for a larger inherited line-height from the parent.
        scrollHeight = Math.max(scrollHeight, getFontSize(this.valueElement) + 1, getLineHeight(parentElement));
        // IE11 & Edge needs a small buffer so text does not shift prior to resizing
        if (Browser.isEdge()) {
            scrollWidth += BUFFER_WIDTH_EDGE;
        } else if (Browser.isInternetExplorer()) {
            scrollWidth += BUFFER_WIDTH_IE;
        }
        this.setState({
            inputHeight: scrollHeight,
            inputWidth: Math.max(scrollWidth, minWidth),
        });
        // synchronizes the ::before pseudo-element's height while editing for Chrome 53
        if (multiline && this.state.isEditing) {
            this.setTimeout(() => (parentElement.style.height = `${scrollHeight}px`));
        }
    }
}
}

function getFontSize(element) {
    const fontSize = getComputedStyle(element).fontSize;
    return fontSize === "" ? 0 : parseInt(fontSize.slice(0, -2), 10);
}

function getLineHeight(element) {
    // getComputedStyle() => 18.0001px => 18
    let lineHeight = parseInt(getComputedStyle(element).lineHeight.slice(0, -2), 10);
    // this check will be true if line-height is a keyword like "normal"
    if (isNaN(lineHeight)) {
        // @see http://stackoverflow.com/a/18430767/6342931
        const line = document.createElement("span");
        line.innerHTML = "<br>";
        element.appendChild(line);
        const singleLineHeight = element.offsetHeight;
        line.innerHTML = "<br><br>";
        const doubleLineHeight = element.offsetHeight;
        element.removeChild(line);
        // this can return 0 in edge cases
        lineHeight = doubleLineHeight - singleLineHeight;
    }
    return lineHeight;
}

function insertAtCaret(el, text) {
    const { selectionEnd, selectionStart, value } = el;
    if (selectionStart >= 0) {
        const before = value.substring(0, selectionStart);
        const after = value.substring(selectionEnd, value.length);
        const len = text.length;
        el.value = `${before}${text}${after}`;
        el.selectionStart = selectionStart + len;
        el.selectionEnd = selectionStart + len;
    }
}
