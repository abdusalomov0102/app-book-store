import React, {Component} from 'react';
import {Col, Container, Navbar} from "react-bootstrap";

class Footer extends Component {

    constructor(props) {
        super(props);

        this.state = {}
    }

    render() {

        let fullYear = new Date().getFullYear();

        return (
            <>

                <Navbar fixed="bottom" bg="dark" variant="dark">
                    <Container>
                        <Col lg={12} className="text-center text-muted">
                            <div>{fullYear}-{fullYear + 1}, All Rights Reserved by Jaxongir Abdusalomov</div>
                        </Col>
                    </Container>
                </Navbar>

            </>
        );
    }
}

export default Footer;