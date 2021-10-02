import React from "react";
import "./App.css";
import {Col, Container, Row} from "react-bootstrap";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import NavigationBar from "./components/menu/NavigationBar";
import Welcome from "./components/Welcome";
import Footer from "./components/menu/Footer";
import Book from "./components/book/Book";
import BookList from "./components/book/BookList";
import Home from "./components/Home";
import UserList from "./components/user/UserList";
import Register from "./components/user/Register";
import Login from "./components/user/Login";

function App() {

    const heading = "Welcome to Book Store";
    const quote = "This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.";
    const name = "Jaxongir Abdusalomov";

    return (

        <Router>
            <NavigationBar/>
            <Container className="margin-tops">
                <Row>
                    <Col lg={12}>
                        <Switch>
                            <Route path="/" exact
                                   component={() => <Welcome heading={heading} quote={quote} footer={name}/>}
                            />
                            <Route path="/home" exact component={Home}/>
                            <Route path="/addBook" exact component={Book}/>
                            <Route path="/editBook/:id" exact component={Book}/>
                            <Route path="/bookList" exact component={BookList}/>
                            <Route path="/userList" exact component={UserList}/>
                            <Route path="/register" exact component={Register}/>
                            <Route path="/login" exact component={Login}/>
                            <Route path="/logout" exact component={Login}/>
                        </Switch>
                    </Col>
                </Row>
            </Container>
            <Footer/>
        </Router>
    );
}

export default App;
