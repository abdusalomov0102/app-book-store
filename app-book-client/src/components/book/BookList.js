import React, {Component} from 'react';
import "../../assets/style/Style.css";
import {connect} from "react-redux";
import {deleteBook} from "../../services/indexService";
import {ButtonGroup, Button, Card, Image, Table, InputGroup, FormControl} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faEdit, faTrash, faFastBackward, faStepForward,
    faFastForward, faStepBackward, faList, faSearch, faTimes
} from "@fortawesome/free-solid-svg-icons";
import MyToast from "../MyToast";
import {Link} from "react-router-dom";
import axios from "axios";

class BookList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            books: [],
            search: "",
            currentPage: 1,
            booksPerPage: 5,
            sortDir: "asc"
        };
        this.state.show = false;

        this.findAllBooks = this.findAllBooks.bind(this);
    };

    sortData = () => {
        this.state.sortDir === "asc" ? this.setState({sortDir: "desc"}) : this.setState({sortDir: "asc"});
        this.findAllBooks(this.state.currentPage);
    };

    componentDidMount() {
        this.findAllBooks(this.state.currentPage);
    };

    findAllBooks(currentPage) {
        currentPage -= 1;
        // fetch("http://localhost:8086/rest/books?pageNumber=" + currentPage
        //     + "&pageSize=" + this.state.booksPerPage + "&sortBy=price&sortDir=" + this.state.sortDir)
        //     .then(response => response.json())
        //     .then((data) => {
        //         this.setState({
        //             books: data.content,
        //             totalPages: data.totalPages,
        //             totalElements: data.totalElements,
        //             currentPage: data.number + 1
        //         });
        //     });

        axios.get("http://localhost:8086/rest/books?pageNumber=" + currentPage
            + "&pageSize=" + this.state.booksPerPage + "&sortBy=price&sortDir=" + this.state.sortDir)
            .then(response => response.data)
            .then((data) => {
                this.setState({
                    books: data.content,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements,
                    currentPage: data.number + 1
                });
            });
    };

    deleteBook = (bookId) => {
        this.props.deleteBook(bookId);
        setTimeout(() => {
            if (this.props.bookObject !== null) {
                this.setState({"show": true});
                setTimeout(() => this.setState({"show": false}), 2100);
                this.findAllBooks(this.state.currentPage);
                console.log(bookId);
            } else {
                this.setState({"show": false});
            }
        }, 100);

    };

    changePage = (event) => {
        let targetPage = parseInt(event.target.value);
        if (this.state.search) {
            this.searchData(targetPage);
        } else {
            this.findAllBooks(targetPage);
        }
        this.setState({
            [event.target.name]: targetPage
        });
    };

    firstPage = () => {
        let firstPage = 1;
        if (this.state.currentPage > 1) {
            if (this.state.search) {
                this.searchData(firstPage);
            } else {
                this.findAllBooks(firstPage);
            }
        }
    };

    prevPage = () => {
        let prevPage = 1;
        if (this.state.currentPage > prevPage) {
            if (this.state.search) {
                this.searchData(this.state.currentPage - prevPage);
            } else {
                this.findAllBooks(this.state.currentPage - prevPage);
            }
        }
    };

    lastPage = () => {
        let condition = Math.ceil(this.state.totalElements / this.state.booksPerPage);
        if (this.state.currentPage < condition) {
            if (this.state.search) {
                this.searchData(condition);
            } else {
                this.findAllBooks(condition);
            }
        }
    };

    nextPage = () => {
        if (this.state.currentPage < Math.ceil(this.state.totalElements / this.state.booksPerPage)) {
            if (this.state.search) {
                this.searchData(this.state.currentPage + 1);
            } else {
                this.findAllBooks(this.state.currentPage + 1);
            }
        }
    };

    searchChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    cancelSearch = () => {
        this.setState({"search": ""});
        this.findAllBooks(this.state.currentPage);
    };

    searchData = (currentPage) => {
        currentPage -= 1
        fetch("http://localhost:8086/rest/books/search/" +
            this.state.search + "?page=" + currentPage + "&size=" + this.state.booksPerPage)
            .then(response => response.json())
            .then((data) => {
                this.setState({
                    books: data.content,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements,
                    currentPage: data.number + 1
                });
            });
    };

    render() {

        const {books, currentPage, totalPages, search} = this.state;

        return (
            <>

                <div style={{"display": this.state.show ? "block" : "none"}}>
                    <MyToast
                        show={this.state.show}
                        message={"Book Deleted Successfully!!!"}
                        type={"danger"}
                    />
                </div>

                <Card className="border border-dark bg-dark text-white">
                    <Card.Header>
                        <div style={{"float": "left"}}>
                            <FontAwesomeIcon icon={faList}/> Book List
                        </div>
                        <div style={{"float": "right"}}>
                            <InputGroup size="sm">
                                <FormControl placeholder="Search" name="search" value={search}
                                             className={"info-border bg-dark text-white info-border"}
                                             onChange={this.searchChange}
                                />
                                <InputGroup.Append>
                                    <Button size="sm" variant="outline-info" type="button" onClick={this.searchData}>
                                        <FontAwesomeIcon icon={faSearch}/>
                                    </Button>
                                    <Button size="sm" variant="outline-danger" type="button"
                                            onClick={this.cancelSearch}>
                                        <FontAwesomeIcon icon={faTimes}/>
                                    </Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <Table bordered hover striped variant="dark">
                            <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>LSBN Number</th>
                                <th onClick={this.sortData}>
                                    Price
                                    <div
                                        className={this.state.sortDir === "asc" ? "arrow arrow-up" : "arrow arrow-down"}/>
                                </th>
                                <th>Language</th>
                                <th>Genre</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                books.length === 0 ?
                                    <tr align="center">
                                        <td colSpan="7">No Books Available.</td>
                                    </tr>
                                    :
                                    books.map((book) => (
                                        <tr key={book.id}>
                                            <td>
                                                <Image src={book.coverPhotoURL} roundedCircle width="25"
                                                       height="25"/> {book.title}
                                            </td>
                                            <td>{book.author}</td>
                                            <td>{book.isbnNumber}</td>
                                            <td>{book.price}</td>
                                            <td>{book.language}</td>
                                            <td>{book.genre}</td>
                                            <td>
                                                <ButtonGroup>
                                                    <Link
                                                        to={"editBook/" + book.id}
                                                        className="btn btn-sm btn-outline-primary">
                                                        <FontAwesomeIcon icon={faEdit}/> Edit
                                                    </Link>
                                                    {" "}
                                                    <Button style={{marginLeft: "10px"}}
                                                            size="sm" variant="outline-danger"
                                                            onClick={this.deleteBook.bind(this, book.id)}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash}/> Delete
                                                    </Button>
                                                </ButtonGroup>
                                            </td>
                                        </tr>
                                    ))
                            }
                            </tbody>
                        </Table>
                    </Card.Body>
                    {
                        books.length > 0 ?
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

            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        bookObject: state.book
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        deleteBook: (bookId) => dispatch(deleteBook(bookId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookList);


//
// import React, {Component} from 'react';
// import "../../assets/style/Style.css";
// import {connect} from "react-redux";
// import {deleteBook} from "../../services/indexService";
// import {ButtonGroup, Button, Card, Image, Table, InputGroup, FormControl} from "react-bootstrap";
// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
// import {
//     faEdit, faTrash,
//     faFastBackward, faStepForward,
//     faFastForward, faStepBackward,
//     faList, faSearch, faTimes
// } from "@fortawesome/free-solid-svg-icons";
// import MyToast from "../MyToast";
// import {Link} from "react-router-dom";
//
// class BookList extends Component {
//
//     constructor(props) {
//         super(props);
//
//         this.state = {
//             books: [],
//             search: "",
//             currentPage: 1,
//             booksPerPage: 5,
//             sortDir: "asc"
//             // sortToggle: true
//         };
//         this.state.show = false;
//
//         this.findAllBooks = this.findAllBooks.bind(this);
//     };
//
//     sortData = () => {
//         this.state.sortDir === "asc" ? this.setState({sortDir: "desc"}) : this.setState({sortDir: "asc"});
//         // this.setState(state => ({
//         //         sortToggle: !state.sortToggle
//         //     })
//         // );
//         this.findAllBooks(this.state.currentPage);
//     };
//
//     componentDidMount() {
//         this.findAllBooks(this.state.currentPage);
//     };
//
//     // findAllBooks() {
//     //     axios
//     //         .get("http://localhost:8086/rest/books")
//     //         .then(response => response.data)
//     //         .then((data) => {
//     //             this.setState({books: data});
//     //         });
//     // };
//     //
//     // deleteBook = (bookId) => {
//     //     axios
//     //         .delete("http://localhost:8086/rest/books/" + bookId)
//     //         .then(response => {
//     //             if (response.data != null) {
//     //                 this.setState({"show": true});
//     //                 setTimeout(() => this.setState({"show": false}), 2000);
//     //                 this.setState({
//     //                     books: this.state.books.filter(book => book.id !== bookId)
//     //                 });
//     //                 console.log(bookId);
//     //             } else {
//     //                 this.setState({"show": false});
//     //             }
//     //         });
//     // };
//
//     findAllBooks(currentPage) {
//         currentPage -= 1;
//         fetch("http://localhost:8086/rest/books?pageNumber=" + currentPage
//             + "&pageSize=" + this.state.booksPerPage + "&sortBy=price&sortDir=" + this.state.sortDir)
//             .then(response => response.json())
//             .then((data) => {
//                 this.setState({
//                     books: data.content,
//                     totalPages: data.totalPages,
//                     totalElements: data.totalElements,
//                     currentPage: data.number + 1
//                 });
//             });
//     };
//
//     deleteBook = (bookId) => {
//         this.props.deleteBook(bookId);
//         setTimeout(() => {
//             if (this.props.bookObject !== null) {
//                 this.setState({"show": true});
//                 setTimeout(() => this.setState({"show": false}), 2100);
//                 this.findAllBooks(this.state.currentPage);
//                 console.log(bookId);
//             } else {
//                 this.setState({"show": false});
//             }
//         }, 100);
//
//         // fetch("http://localhost:8086/rest/books/" + bookId, {
//         //     method: "DELETE",
//         // })
//         //     .then(response => response.json())
//         //     .then((book) => {
//         //         if (book) {
//         //             this.setState({"show": true});
//         //             setTimeout(() => this.setState({"show": false}), 2000);
//         //             this.setState({
//         //                 books: this.state.books.filter(book => book.id !== bookId)
//         //             });
//         //             console.log(bookId);
//         //         } else {
//         //             this.setState({"show": false});
//         //         }
//         //     });
//     };
//
//     changePage = (event) => {
//         let targetPage = parseInt(event.target.value);
//         if (this.state.search) {
//             this.searchData(targetPage);
//         } else {
//             this.findAllBooks(targetPage);
//         }
//         this.setState({
//             [event.target.name]: targetPage
//         });
//     };
//
//     firstPage = () => {
//         let firstPage = 1;
//         if (this.state.currentPage > 1) {
//             if (this.state.search) {
//                 this.searchData(firstPage);
//             } else {
//                 this.findAllBooks(firstPage);
//             }
//         }
//     };
//
//     prevPage = () => {
//         let prevPage = 1;
//         if (this.state.currentPage > prevPage) {
//             if (this.state.search) {
//                 this.searchData(this.state.currentPage - prevPage);
//             } else {
//                 this.findAllBooks(this.state.currentPage - prevPage);
//             }
//         }
//     };
//
//     lastPage = () => {
//         let condition = Math.ceil(this.state.totalElements / this.state.booksPerPage);
//         if (this.state.currentPage < condition) {
//             if (this.state.search) {
//                 this.searchData(condition);
//             } else {
//                 this.findAllBooks(condition);
//             }
//         }
//     };
//
//     nextPage = () => {
//         if (this.state.currentPage < Math.ceil(this.state.totalElements / this.state.booksPerPage)) {
//             if (this.state.search) {
//                 this.searchData(this.state.currentPage + 1);
//             } else {
//                 this.findAllBooks(this.state.currentPage + 1);
//             }
//         }
//     };
//
//     searchChange = (event) => {
//         this.setState({
//             [event.target.name]: event.target.value
//         });
//     };
//
//     cancelSearch = () => {
//         this.setState({"search": ""});
//         this.findAllBooks(this.state.currentPage);
//     };
//
//     searchData = (currentPage) => {
//         currentPage -= 1
//         fetch("http://localhost:8086/rest/books/search/" +
//             this.state.search + "?page=" + currentPage + "&size=" + this.state.booksPerPage)
//             .then(response => response.json())
//             .then((data) => {
//                 this.setState({
//                     books: data.content,
//                     totalPages: data.totalPages,
//                     totalElements: data.totalElements,
//                     currentPage: data.number + 1
//                 });
//             });
//     };
//
//     render() {
//
//         const {books, currentPage, totalPages, search} = this.state;
//
//         return (
//             <>
//
//                 <div style={{"display": this.state.show ? "block" : "none"}}>
//                     <MyToast
//                         show={this.state.show}
//                         message={"Book Deleted Successfully!!!"}
//                         type={"danger"}
//                     />
//                 </div>
//
//                 <Card className="border border-dark bg-dark text-white">
//                     <Card.Header>
//                         <div style={{"float": "left"}}>
//                             <FontAwesomeIcon icon={faList}/> Book List
//                         </div>
//                         <div style={{"float": "right"}}>
//                             <InputGroup size="sm">
//                                 <FormControl placeholder="Search" name="search" value={search}
//                                              className={"info-border bg-dark text-white info-border"}
//                                              onChange={this.searchChange}
//                                 />
//                                 <InputGroup.Append>
//                                     <Button size="sm" variant="outline-info" type="button" onClick={this.searchData}>
//                                         <FontAwesomeIcon icon={faSearch}/>
//                                     </Button>
//                                     <Button size="sm" variant="outline-danger" type="button"
//                                             onClick={this.cancelSearch}>
//                                         <FontAwesomeIcon icon={faTimes}/>
//                                     </Button>
//                                 </InputGroup.Append>
//                             </InputGroup>
//                         </div>
//                     </Card.Header>
//                     <Card.Body>
//                         <Table bordered hover striped variant="dark">
//                             <thead>
//                             <tr>
//                                 <th>Title</th>
//                                 <th>Author</th>
//                                 <th>LSBN Number</th>
//                                 <th onClick={this.sortData}>
//                                     Price
//                                     <div
//                                         className={this.state.sortDir === "asc" ? "arrow arrow-up" : "arrow arrow-down"}/>
//                                 </th>
//                                 <th>Language</th>
//                                 <th>Genre</th>
//                                 <th>Actions</th>
//                             </tr>
//                             </thead>
//                             <tbody>
//                             {
//                                 books.length === 0 ?
//                                     <tr align="center">
//                                         <td colSpan="7">No Books Available.</td>
//                                     </tr>
//                                     :
//                                     books.map((book) => (
//                                         <tr key={book.id}>
//                                             <td>
//                                                 <Image src={book.coverPhotoURL} roundedCircle width="25"
//                                                        height="25"/> {book.title}
//                                             </td>
//                                             <td>{book.author}</td>
//                                             <td>{book.isbnNumber}</td>
//                                             <td>{book.price}</td>
//                                             <td>{book.language}</td>
//                                             <td>{book.genre}</td>
//                                             <td>
//                                                 <ButtonGroup>
//                                                     <Link
//                                                         to={"editBook/" + book.id}
//                                                         className="btn btn-sm btn-outline-primary">
//                                                         <FontAwesomeIcon icon={faEdit}/> Edit
//                                                     </Link>
//                                                     {" "}
//                                                     <Button style={{marginLeft: "10px"}}
//                                                             size="sm" variant="outline-danger"
//                                                             onClick={this.deleteBook.bind(this, book.id)}
//                                                     >
//                                                         <FontAwesomeIcon icon={faTrash}/> Delete
//                                                     </Button>
//                                                 </ButtonGroup>
//                                             </td>
//                                         </tr>
//                                     ))
//                             }
//                             </tbody>
//                         </Table>
//                     </Card.Body>
//                     {
//                         books.length > 0 ?
//                             <Card.Footer>
//                                 <div style={{"float": "left"}}>
//                                     Showing Page {currentPage} of {totalPages}
//                                 </div>
//                                 <div style={{"float": "right"}}>
//                                     <InputGroup size="sm">
//                                         <InputGroup.Prepend>
//                                             <Button type="button" variant="outline-info"
//                                                     disabled={currentPage === 1 ? true : false}
//                                                     onClick={this.firstPage}>
//                                                 <FontAwesomeIcon icon={faFastBackward}/> First
//                                             </Button>
//                                             <Button type="button" variant="outline-info"
//                                                     disabled={currentPage === 1 ? true : false}
//                                                     onClick={this.prevPage}>
//                                                 <FontAwesomeIcon icon={faStepBackward}/> Prev
//                                             </Button>
//                                         </InputGroup.Prepend>
//                                         <FormControl className="bg-dark text-center page-num"
//                                                      name="currentPage"
//                                                      value={currentPage} onChange={this.changePage}
//                                         />
//                                         <InputGroup.Append>
//                                             <Button type="button" variant="outline-info"
//                                                     disabled={currentPage === totalPages ? true : false}
//                                                     onClick={this.nextPage}>
//                                                 <FontAwesomeIcon icon={faStepForward}/> Next
//                                             </Button>
//                                             <Button type="button" variant="outline-info"
//                                                     disabled={currentPage === totalPages ? true : false}
//                                                     onClick={this.lastPage}>
//                                                 <FontAwesomeIcon icon={faFastForward}/> Last
//                                             </Button>
//                                         </InputGroup.Append>
//                                     </InputGroup>
//                                 </div>
//                             </Card.Footer>
//                             : null
//                     }
//                 </Card>
//
//             </>
//         );
//     }
// }
//
// const mapStateToProps = (state) => {
//     return {
//         bookObject: state.book
//     };
// };
//
// const mapDispatchToProps = (dispatch) => {
//     return {
//         deleteBook: (bookId) => dispatch(deleteBook(bookId))
//     };
// };
//
// export default connect(mapStateToProps, mapDispatchToProps)(BookList);