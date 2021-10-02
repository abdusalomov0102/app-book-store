import React, {Component} from 'react';
import {connect} from "react-redux";
import {Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignInAlt, faSignOutAlt, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {logoutUser} from "../../services/indexService";

class NavigationBar extends Component {

    constructor(props) {
        super(props);

        this.state = {};
    };

    logout = () => {
        this.props.logoutUser();
    };

    render() {

        const guestLinks = (
            <>
                <div className="mr-auto"></div>
                <Nav className="navbar-right">
                    <Link to="/register" className="nav-link"><FontAwesomeIcon icon={faUserPlus}/> Register</Link>
                    <Link to="/login" className="nav-link"><FontAwesomeIcon icon={faSignInAlt}/> Login</Link>
                </Nav>
            </>
        );

        const userLinks = (
            <>
                <Nav className="mr-auto">
                    <Link to="/home" className="nav-link">Home</Link>
                    <Link to="/addBook" className="nav-link">Add Book</Link>
                    <Link to="/bookList" className="nav-link">Book List</Link>
                    <Link to="/userList" className="nav-link">User List</Link>
                </Nav>
                <Nav>
                    <Link to="/logout" className="nav-link" onClick={this.logout}><FontAwesomeIcon
                        icon={faSignOutAlt}/> Logout</Link>
                </Nav>
            </>
        );

        return (
            <>

                <Navbar bg="dark" variant="dark">
                    <Link to="" className="navbar-brand">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Book_icon_1.png"
                            height="25" width="25"
                            alt="Book Icon"/>Book Store
                    </Link>
                    {this.props.auth.isLoggedIn ? userLinks : guestLinks}
                </Navbar>

            </>
        );
    };
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        logoutUser: () => dispatch(logoutUser())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationBar);