import React, {Component} from 'react';
import {Toast} from 'react-bootstrap';

class MyToast extends Component {

    constructor(props) {
        super(props);

        this.state = {}
    };

    render() {

        const toastCss = {
            position: "fixed",
            top: "20px",
            right: "10px",
            zIndex: 999,
            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
        };

        return (
            <div style={this.props.show ? toastCss : null}>

                <Toast
                    className={`text-white ${this.props.type === "info" ? "bg-info" : this.props.type === "success" ? "bg-success" : "bg-danger"}`}
                    show={this.props.show}
                >
                    <Toast.Header
                        className={`text-white  ${this.props.type === "info" ? "bg-info" : this.props.type === "success" ? "bg-success" : "bg-danger"}`}
                        closeButton={false}
                    >
                        <strong className="mr-auto">Success</strong>
                    </Toast.Header>
                    <Toast.Body>
                        {this.props.message}
                    </Toast.Body>
                </Toast>

            </div>
        );
    }
}

export default MyToast;