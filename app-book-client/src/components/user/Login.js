import React, {Component} from 'react';
import {connect} from "react-redux";
import {authenticateUser} from "../../services/indexService";
import {Alert, Button, Card, Col, Form, FormControl, InputGroup, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faLock, faSignInAlt, faUndo} from "@fortawesome/free-solid-svg-icons";

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = this.initialState;

        this.resetLoginForm = this.resetLoginForm.bind(this);
        this.credentialChange = this.credentialChange.bind(this);
    };

    initialState = {
        email: "", password: "", error: ""
    };

    validateUser = () => {
        this.props.authenticationUser(this.state.email, this.state.password);
        setTimeout(() => {
            if (this.props.auth.isLoggedIn) {
                return this.props.history.push("/");
            } else {
                this.resetLoginForm();
                this.setState({"error": "Invalid email and password"});
            }
        }, 500);
        console.log(this.state.error)
    };

    resetLoginForm = () => {
        this.setState(() => this.initialState);
    };

    credentialChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render() {

        const {email, password, error} = this.state;

        return (
            <>

                <Row className="justify-content-md-center">
                    <Col xs={5}>
                        {
                            error && <Alert variant={"danger"} className="text-center"><h5>{error}</h5></Alert>
                        }
                        <Card className="border border-dark bg-dark text-white">
                            <Card.Header>
                                <FontAwesomeIcon icon={faSignInAlt}/> Login
                            </Card.Header>
                            <Card.Body>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <InputGroup>
                                            <InputGroup.Prepend>
                                                <InputGroup.Text>
                                                    <FontAwesomeIcon icon={faEnvelope}/>
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <FormControl
                                                required autoComplete="off"
                                                type="text" name="email" value={email}
                                                onChange={this.credentialChange}
                                                className="bg-dark text-white"
                                                placeholder="Enter Email Address"
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <InputGroup>
                                            <InputGroup.Prepend>
                                                <InputGroup.Text>
                                                    <FontAwesomeIcon icon={faLock}/>
                                                </InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <FormControl
                                                required autoComplete="off"
                                                type="password" name="password" value={password}
                                                onChange={this.credentialChange}
                                                className="bg-dark text-white"
                                                placeholder="Enter Password"
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                </Form.Row>
                            </Card.Body>
                            <Card.Footer style={{textAlign: "right"}}>
                                <Button size="sm" type="button" variant="success" onClick={this.validateUser}
                                        disabled={this.state.email.length === 0 || this.state.password.length === 0}>
                                    <FontAwesomeIcon icon={faSignInAlt}/> Login
                                </Button>{" "}
                                <Button size="sm" type="button" variant="danger" onClick={this.resetLoginForm}
                                        disabled={this.state.email.length === 0 && this.state.password.length === 0 && this.state.error.length === 0}>
                                    <FontAwesomeIcon icon={faUndo}/> Reset
                                </Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>

            </>
        );
    }
}

const mapStateProps = (state) => {
    return {
        auth: state.auth
    };
};

const mapDispatchProps = (dispatch) => {
    return {
        authenticationUser: (email, password) => dispatch(authenticateUser(email, password))
    };
};

export default connect(mapStateProps, mapDispatchProps)(Login);