import React from 'react';
import {Jumbotron} from "react-bootstrap";

function Welcome(props) {

    return (
        <>

            <Jumbotron className="bg-dark text-white p-5 mb-4">
                <h1>{props.heading}</h1>
                <blockquote className="blockquote mb-0">
                    <p>{props.quote}</p>
                    <footer className="blockquote-footer mt-2">
                        {props.footer}
                    </footer>
                </blockquote>
            </Jumbotron>

        </>
    );
}

export default Welcome;