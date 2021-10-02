import React, {Component} from 'react';
import {connect} from "react-redux";
import {fetchUsers} from "../../services/indexService";
import "../../assets/style/Style.css";
import {Card, FormControl, InputGroup, Table, Button, Alert} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUsers, faFastBackward, faFastForward, faStepBackward, faStepForward} from "@fortawesome/free-solid-svg-icons";

class UserList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            users: [],
            currentPage: 1,
            usersPerPage: 5
        }

        this.changePage = this.changePage.bind(this);
        this.firstPage = this.firstPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.lastPage = this.lastPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
    };

    componentDidMount() {
        this.props.fetchUsers();
    };

    changePage = (event) => {
        this.setState({
            [event.target.name]: parseInt(event.target.value)
        });
    };

    firstPage = () => {
        if (this.state.currentPage > 1) {
            this.setState({
                currentPage: 1
            });
        }
    };

    prevPage = () => {
        if (this.state.currentPage > 1) {
            this.setState({
                currentPage: this.state.currentPage - 1
            });
        }
    };

    lastPage = () => {
        let usersLength = this.props.userData.users.length;
        if (this.state.currentPage < Math.ceil(usersLength / this.state.usersPerPage)) {
            this.setState({
                currentPage: Math.ceil(usersLength / this.state.usersPerPage)
            });
        }
    };

    nextPage = () => {
        if (this.state.currentPage < Math.ceil(this.props.userData.users.length / this.state.usersPerPage)) {
            this.setState({
                currentPage: this.state.currentPage + 1
            });
        }
    };

    render() {

        const {currentPage, usersPerPage} = this.state;
        const lastIndex = currentPage * usersPerPage;
        const firstIndex = lastIndex - usersPerPage;

        const userData = this.props.userData;
        const users = userData.users;
        const currentUsers = users.slice(firstIndex, lastIndex);
        const totalPages = users.length / usersPerPage;

        return (
            <>

                {
                    userData.error ?
                        <Alert variant="light" className="bg-dark text-center m-2 p-5">
                            <h3>{userData.error} ...</h3>
                        </Alert>
                        :
                        <Card className="border border-dark bg-dark text-white">
                            <Card.Header><FontAwesomeIcon icon={faUsers}/> Users List</Card.Header>
                            <Card.Body>
                                <Table bordered hover striped variant="dark">
                                    <thead>
                                    <tr>
                                        <td>Name</td>
                                        <td>Email</td>
                                        <td>Address</td>
                                        <td>Created</td>
                                        <td>Balance</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        users.length === 0 ?
                                            <tr align="center">
                                                <td colSpan="6">No Users Available!!!</td>
                                            </tr>
                                            :
                                            currentUsers.map((user, index) => (
                                                <tr key={index}>
                                                    <td>{user.first}{" "}{user.last}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.address}</td>
                                                    <td>{user.created}</td>
                                                    <td>{user.balance}</td>
                                                </tr>
                                            ))
                                    }
                                    </tbody>
                                </Table>
                            </Card.Body>
                            {
                                users.length > 0 ?
                                    <Card.Footer>
                                        <div style={{"float": "left"}}>
                                            Showing Page {currentPage} of {totalPages}
                                        </div>
                                        <div style={{"float": "right"}}>
                                            <InputGroup size="sm">
                                                <InputGroup.Prepend>
                                                    <Button type="button" variant="outline-info"
                                                            disabled={currentPage === 1 ? true : false}
                                                            onClick={this.firstPage}>
                                                        <FontAwesomeIcon icon={faFastBackward}/> First
                                                    </Button>
                                                    <Button type="button" variant="outline-info"
                                                            disabled={currentPage === 1 ? true : false}
                                                            onClick={this.prevPage}>
                                                        <FontAwesomeIcon icon={faStepBackward}/> Prev
                                                    </Button>
                                                </InputGroup.Prepend>
                                                <FormControl className="bg-dark text-center page-num"
                                                             name="currentPage"
                                                             value={currentPage} onChange={this.changePage}
                                                />
                                                <InputGroup.Append>
                                                    <Button type="button" variant="outline-info"
                                                            disabled={currentPage === totalPages ? true : false}
                                                            onClick={this.nextPage}>
                                                        <FontAwesomeIcon icon={faStepForward}/> Next
                                                    </Button>
                                                    <Button type="button" variant="outline-info"
                                                            disabled={currentPage === totalPages ? true : false}
                                                            onClick={this.lastPage}>
                                                        <FontAwesomeIcon icon={faFastForward}/> Last
                                                    </Button>
                                                </InputGroup.Append>
                                            </InputGroup>
                                        </div>
                                    </Card.Footer>
                                    : null
                            }
                        </Card>
                }

            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userData: state.user
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUsers: () => dispatch(fetchUsers())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(UserList);


//
// import React, {Component} from 'react';
// import {connect} from "react-redux";
// import {fetchUsers} from "../../services/indexService";
// import "../../assets/style/Style.css";
// import {Card, FormControl, InputGroup, Table, Button, Alert} from "react-bootstrap";
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// import {faUsers, faFastBackward, faFastForward, faStepBackward, faStepForward} from "@fortawesome/free-solid-svg-icons";
//
// class UserList extends Component {
//
//     constructor(props) {
//         super(props);
//
//         this.state = {
//             users: [],
//             currentPage: 1,
//             usersPerPage: 5
//         }
//
//         this.changePage = this.changePage.bind(this);
//         this.firstPage = this.firstPage.bind(this);
//         this.prevPage = this.prevPage.bind(this);
//         this.lastPage = this.lastPage.bind(this);
//         this.nextPage = this.nextPage.bind(this);
//     };
//
//     componentDidMount() {
//         // this.findAllRandomUsers();
//         this.props.fetchUsers();
//     };
//
//     // findAllRandomUsers() {
//     //     fetch("https://randomapi.com/api/6de6abfedb24f889e0b5f675edc50deb?fmt=raw&sole")
//     //         .then(response => response.json())
//     //         .then((data) => {
//     //             this.setState({users: data});
//     //         });
//     // };
//     //
//     // findAllRandomUsers() {
//     //     axios.get("https://randomapi.com/api/6de6abfedb24f889e0b5f675edc50deb?fmt=raw&sole")
//     //         .then(response => response.data)
//     //         .then((data) => {
//     //             this.setState({users: data});
//     //         });
//     // };
//
//     changePage = (event) => {
//         this.setState({
//             [event.target.name]: parseInt(event.target.value)
//         });
//     };
//
//     firstPage = () => {
//         if (this.state.currentPage > 1) {
//             this.setState({
//                 currentPage: 1
//             });
//         }
//     };
//
//     prevPage = () => {
//         if (this.state.currentPage > 1) {
//             this.setState({
//                 currentPage: this.state.currentPage - 1
//             });
//         }
//     };
//
//     lastPage = () => {
//         let usersLength = this.props.userData.users.length;
//         if (this.state.currentPage < Math.ceil(usersLength / this.state.usersPerPage)) {
//             this.setState({
//                 currentPage: Math.ceil(usersLength / this.state.usersPerPage)
//             });
//         }
//     };
//
//     nextPage = () => {
//         if (this.state.currentPage < Math.ceil(this.props.userData.users.length / this.state.usersPerPage)) {
//             this.setState({
//                 currentPage: this.state.currentPage + 1
//             });
//         }
//     };
//
//     render() {
//
//         const {currentPage, usersPerPage} = this.state;
//         const lastIndex = currentPage * usersPerPage;
//         const firstIndex = lastIndex - usersPerPage;
//
//         const userData = this.props.userData;
//         const users = userData.users;
//         const currentUsers = users.slice(firstIndex, lastIndex);
//         const totalPages = users.length / usersPerPage;
//
//         return (
//             <>
//
//                 {
//                     userData.error ?
//                         <Alert variant="light" className="bg-dark text-center m-2 p-5">
//                             <h3>{userData.error} ...</h3>
//                         </Alert>
//                         :
//                         <Card className="border border-dark bg-dark text-white">
//                             <Card.Header><FontAwesomeIcon icon={faUsers}/> Users List</Card.Header>
//                             <Card.Body>
//                                 <Table bordered hover striped variant="dark">
//                                     <thead>
//                                     <tr>
//                                         <td>Name</td>
//                                         <td>Email</td>
//                                         <td>Address</td>
//                                         <td>Created</td>
//                                         <td>Balance</td>
//                                     </tr>
//                                     </thead>
//                                     <tbody>
//                                     {
//                                         users.length === 0 ?
//                                             <tr align="center">
//                                                 <td colSpan="6">No Users Available!!!</td>
//                                             </tr>
//                                             :
//                                             currentUsers.map((user, index) => (
//                                                 <tr key={index}>
//                                                     <td>{user.first}{" "}{user.last}</td>
//                                                     <td>{user.email}</td>
//                                                     <td>{user.address}</td>
//                                                     <td>{user.created}</td>
//                                                     <td>{user.balance}</td>
//                                                 </tr>
//                                             ))
//                                     }
//                                     </tbody>
//                                 </Table>
//                             </Card.Body>
//                             {
//                                 users.length > 0 ?
//                                     <Card.Footer>
//                                         <div style={{"float": "left"}}>
//                                             Showing Page {currentPage} of {totalPages}
//                                         </div>
//                                         <div style={{"float": "right"}}>
//                                             <InputGroup size="sm">
//                                                 <InputGroup.Prepend>
//                                                     <Button type="button" variant="outline-info"
//                                                             disabled={currentPage === 1 ? true : false}
//                                                             onClick={this.firstPage}>
//                                                         <FontAwesomeIcon icon={faFastBackward}/> First
//                                                     </Button>
//                                                     <Button type="button" variant="outline-info"
//                                                             disabled={currentPage === 1 ? true : false}
//                                                             onClick={this.prevPage}>
//                                                         <FontAwesomeIcon icon={faStepBackward}/> Prev
//                                                     </Button>
//                                                 </InputGroup.Prepend>
//                                                 <FormControl className="bg-dark text-center page-num"
//                                                              name="currentPage"
//                                                              value={currentPage} onChange={this.changePage}
//                                                 />
//                                                 <InputGroup.Append>
//                                                     <Button type="button" variant="outline-info"
//                                                             disabled={currentPage === totalPages ? true : false}
//                                                             onClick={this.nextPage}>
//                                                         <FontAwesomeIcon icon={faStepForward}/> Next
//                                                     </Button>
//                                                     <Button type="button" variant="outline-info"
//                                                             disabled={currentPage === totalPages ? true : false}
//                                                             onClick={this.lastPage}>
//                                                         <FontAwesomeIcon icon={faFastForward}/> Last
//                                                     </Button>
//                                                 </InputGroup.Append>
//                                             </InputGroup>
//                                         </div>
//                                     </Card.Footer>
//                                     : null
//                             }
//                         </Card>
//                 }
//
//             </>
//         );
//     }
// }
//
// const mapStateToProps = (state) => {
//     return {
//         userData: state.user
//     }
// };
//
// const mapDispatchToProps = (dispatch) => {
//     return {
//         fetchUsers: () => dispatch(fetchUsers())
//     }
// };
//
// export default connect(mapStateToProps, mapDispatchToProps)(UserList);