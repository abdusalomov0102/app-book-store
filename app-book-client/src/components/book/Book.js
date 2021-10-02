import React, {Component} from 'react';
import {connect} from "react-redux";
import {saveBook, fetchBook, updateBook, fetchLanguages, fetchGenres} from "../../services/indexService";
import {Card, Form, Button, Col, InputGroup, Image} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave, faPlusSquare, faUndo, faList, faEdit} from "@fortawesome/free-solid-svg-icons";
import MyToast from "../MyToast";

class Book extends Component {

    constructor(props) {
        super(props);

        this.state = this.initialState;
        this.state = {
            genres: [],
            languages: [],
            show: false
        };

        this.submitBook = this.submitBook.bind(this);
        this.bookChange = this.bookChange.bind(this);
        this.resetBook = this.resetBook.bind(this);
        this.bookList = this.bookList.bind(this);
    };

    initialState = {
        id: "", title: "", author: "", coverPhotoURL: "", isbnNumber: "", price: "", language: "", genre: ""
    };

    componentDidMount() {
        const bookId = +this.props.match.params.id;
        if (bookId) {
            this.findBookById(bookId);
        }
        this.findAllLanguages();
    };

    findAllLanguages = () => {
        this.props.fetchLanguages();
        setTimeout(() => {
            let bookLanguages = this.props.bookObject.languages
            if (bookLanguages) {
                this.setState({
                    languages: [{value: "", display: "Select Language"}]
                        .concat(bookLanguages.map(language => {
                            return {value: language, display: language}
                        }))
                });
                this.findAllGenres();
            }
        }, 100);

    };

    findAllGenres = () => {
        this.props.fetchGenres();
        setTimeout(() => {
            let bookGenres = this.props.bookObject.genres
            if (bookGenres) {
                this.setState({
                    genres: [{value: "", display: "Select Genre"}]
                        .concat(bookGenres.map(genre => {
                            return {value: genre, display: genre}
                        }))
                });
            }
        }, 100);

    };

    findBookById = (bookId) => {
        this.props.fetchBook(bookId);
        setTimeout(() => {
            let book = this.props.bookObject.book;
            if (book != null) {
                this.setState({
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    coverPhotoURL: book.coverPhotoURL,
                    isbnNumber: book.isbnNumber,
                    price: book.price,
                    language: book.language,
                    genre: book.genre
                });
            }
        }, 1000);
    };

    resetBook = () => {
        this.setState(() => this.initialState);
    };

    submitBook = (event) => {
        event.preventDefault();

        const book = {
            title: this.state.title,
            author: this.state.author,
            coverPhotoURL: this.state.coverPhotoURL,
            isbnNumber: this.state.isbnNumber,
            price: this.state.price,
            language: this.state.language,
            genre: this.state.genre
        };

        this.props.saveBook(book);
        setTimeout(() => {
            if (this.props.bookObject.book != null) {
                this.setState({"show": true, "method": "post"});
                setTimeout(() => this.setState({"show": false}), 2000);
            } else {
                this.setState({"show": false});
            }
        }, 200);
        console.log(book);

        this.setState(this.initialState);
    };

    updateBook = (event) => {
        event.preventDefault();

        const book = {
            id: this.state.id,
            title: this.state.title,
            author: this.state.author,
            coverPhotoURL: this.state.coverPhotoURL,
            isbnNumber: this.state.isbnNumber,
            price: this.state.price,
            language: this.state.language,
            genre: this.state.genre
        };

        this.props.updateBook(book);
        setTimeout(() => {
            if (this.props.bookObject.book != null) {
                this.setState({"show": true, "method": "put"});
                setTimeout(() => this.setState({"show": false}), 1000);
                setTimeout(() => this.bookList(), 1000);
            } else {
                this.setState({"show": false});
            }
        }, 100);

        this.setState(this.initialState);
    }

    bookChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    bookList = () => {
        return this.props.history.push("/bookList");
    };

    render() {

        const {title, author, coverPhotoURL, isbnNumber, price, language, genre} = this.state;

        return (
            <>

                <div style={{"display": this.state.show ? "block" : "none"}}>
                    <MyToast
                        show={this.state.show}
                        message={this.state.method === "post" ? "Book Saved Successfully!!!" : "Book Edited Successfully!!!"}
                        type={this.state.method === "post" ? "success" : "info"}
                    />
                </div>

                <Card className="border border-dark bg-dark text-white">
                    <Card.Header className="mt-2">
                        <FontAwesomeIcon icon={this.state.id ? faEdit : faPlusSquare}/>
                        {this.state.id ? " Edit Book" : " Add New Book"}
                    </Card.Header>
                    <Form onReset={this.resetBook} onSubmit={this.state.id ? this.updateBook : this.submitBook}
                          id="bookFormId">
                        {/*Card Body*/}
                        <Card.Body>
                            <Form.Row>
                                <Form.Group as={Col} controlid="formGridTitle">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        required
                                        autoComplete="off"
                                        type="test"
                                        name="title"
                                        value={title}
                                        onChange={this.bookChange}
                                        className="bg-dark text-white"
                                        placeholder="Enter Book Title"
                                    />
                                </Form.Group>
                                <Form.Group as={Col} controlid="formGridAuthor">
                                    <Form.Label>Author</Form.Label>
                                    <Form.Control
                                        required
                                        autoComplete="off"
                                        type="test"
                                        name="author"
                                        value={author}
                                        onChange={this.bookChange}
                                        className="bg-dark text-white"
                                        placeholder="Enter Book Author"
                                    />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlid="formGridCoverPhotoURL">
                                    <Form.Label>Cover Photo URL</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            required autoComplete="off"
                                            type="test" name="coverPhotoURL"
                                            value={coverPhotoURL} onChange={this.bookChange}
                                            className="bg-dark text-white"
                                            placeholder="Enter Book Cover Photo URL"
                                        />
                                        <InputGroup.Append>
                                            {
                                                this.state.coverPhotoURL !== "" &&
                                                <Image
                                                    src={this.state.coverPhotoURL} roundedright="true"
                                                    width="40" height="38"
                                                />
                                            }
                                        </InputGroup.Append>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group as={Col} controlid="formGridISBNNumber">
                                    <Form.Label>ISBN Number</Form.Label>
                                    <Form.Control
                                        required
                                        autoComplete="off"
                                        type="test"
                                        name="isbnNumber"
                                        value={isbnNumber}
                                        onChange={this.bookChange}
                                        className="bg-dark text-white"
                                        placeholder="Enter Book ISBN Number"
                                    />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlid="formGridPrice">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control
                                        required autoComplete="off"
                                        type="test" name="price"
                                        value={price} onChange={this.bookChange}
                                        className="bg-dark text-white"
                                        placeholder="Enter Book Price"
                                    />
                                </Form.Group>
                                <Form.Group as={Col} controlid="formGridLanguage">
                                    <Form.Label>Language</Form.Label>
                                    <Form.Control
                                        required as="select"
                                        custom onChange={this.bookChange}
                                        name="language" value={language}
                                        className="bg-dark text-white">
                                        {
                                            this.state.languages.map(language =>
                                                <option key={language.value} value={language.value}>
                                                    {language.display}
                                                </option>
                                            )
                                        }
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} controlid="formGridGenre">
                                    <Form.Label>Genre</Form.Label>
                                    <Form.Control
                                        required as="select"
                                        custom onChange={this.bookChange}
                                        name="genre" value={genre}
                                        className={"bg-dark text-white"}>
                                        {
                                            this.state.genres.map(genre =>
                                                <option key={genre.value} value={genre.value}>
                                                    {genre.display}
                                                </option>
                                            )
                                        }
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>
                        </Card.Body>
                        {/*Card Body*/}
                        {/*Card Footer*/}
                        <Card.Footer style={{"textAlign": "right"}}>
                            <Button size="sm" variant="success" type="submit">
                                <FontAwesomeIcon icon={faSave}/> {this.state.id ? "Edit" : "Save"}
                            </Button>{" "}
                            <Button size="sm" variant="danger" type="reset">
                                <FontAwesomeIcon icon={faUndo}/> Reset
                            </Button>{" "}
                            <Button size="sm" variant="info" type="button" onClick={this.bookList.bind()}>
                                <FontAwesomeIcon icon={faList}/> Book List
                            </Button>
                        </Card.Footer>
                        {/*Card Footer*/}
                    </Form>
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
        saveBook: (book) => dispatch(saveBook(book)),
        fetchBook: (bookId) => dispatch(fetchBook(bookId)),
        updateBook: (book) => dispatch(updateBook(book)),
        fetchLanguages: () => dispatch(fetchLanguages()),
        fetchGenres: () => dispatch(fetchGenres())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Book);


//
// import React, {Component} from 'react';
// import {connect} from "react-redux";
// import {saveBook, fetchBook, updateBook, fetchLanguages, fetchGenres} from "../../services/indexService";
// import {Card, Form, Button, Col, InputGroup, Image} from "react-bootstrap";
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// import {faSave, faPlusSquare, faUndo, faList, faEdit} from "@fortawesome/free-solid-svg-icons";
// // import axios from "axios";
// import MyToast from "../MyToast";
//
// class Book extends Component {
//
//     constructor(props) {
//         super(props);
//
//         this.state = this.initialState;
//         this.state = {
//             genres: [],
//             languages: [],
//             show: false
//         };
//
//         this.submitBook = this.submitBook.bind(this);
//         this.bookChange = this.bookChange.bind(this);
//         this.resetBook = this.resetBook.bind(this);
//         this.bookList = this.bookList.bind(this);
//     };
//
//     initialState = {
//         id: "", title: "", author: "", coverPhotoURL: "", isbnNumber: "", price: "", language: "", genre: ""
//     };
//
//     componentDidMount() {
//         const bookId = +this.props.match.params.id;
//         if (bookId) {
//             this.findBookById(bookId);
//         }
//         this.findAllLanguages();
//     };
//
//     findAllLanguages = () => {
//         this.props.fetchLanguages();
//         setTimeout(() => {
//             let bookLanguages = this.props.bookObject.languages
//             if (bookLanguages) {
//                 this.setState({
//                     languages: [{value: "", display: "Select Language"}]
//                         .concat(bookLanguages.map(language => {
//                             return {value: language, display: language}
//                         }))
//                 });
//                 this.findAllGenres();
//             }
//         }, 100);
//
//         // axios.get("http://localhost:8086/rest/books/languages")
//         //     .then(response => response.data)
//         //     .then((data) => {
//         //         this.setState({
//         //             languages: [{value: "", display: "Select Languages"}]
//         //                 .concat(data.map(language => {
//         //                     return {value: language, display: language}
//         //                 }))
//         //         });
//         //     });
//     };
//
//     findAllGenres = () => {
//         this.props.fetchGenres();
//         setTimeout(() => {
//             let bookGenres = this.props.bookObject.genres
//             if (bookGenres) {
//                 this.setState({
//                     genres: [{value: "", display: "Select Genre"}]
//                         .concat(bookGenres.map(genre => {
//                             return {value: genre, display: genre}
//                         }))
//                 });
//             }
//         }, 100);
//
//         // axios.get("http://localhost:8086/rest/books/genres")
//         //     .then(response => response.data)
//         //     .then((data) => {
//         //         this.setState({
//         //             genres: [{value: "", display: "Select Genres"}]
//         //                 .concat(data.map(genre => {
//         //                     return {value: genre, display: genre}
//         //                 }))
//         //         });
//         //     });
//     };
//
//     findBookById = (bookId) => {
//         // this.props.fetchBook(bookId);
//         // setTimeout(() => {
//         //     let book = this.props.bookObject.book;
//         //     if (book != null) {
//         //         this.setState({
//         //             id: book.id,
//         //             title: book.title,
//         //             author: book.author,
//         //             coverPhotoURL: book.coverPhotoURL,
//         //             isbnNumber: book.isbnNumber,
//         //             price: book.price,
//         //             language: book.language,
//         //             genre: book.genre
//         //         });
//         //     }
//         // }, 1000);
//
//         fetch("http://localhost:8086/rest/books/" + bookId)
//             .then(response => response.json())
//             .then((book) => {
//                 if (book != null) {
//                     this.setState({
//                         id: book.id,
//                         title: book.title,
//                         author: book.author,
//                         coverPhotoURL: book.coverPhotoURL,
//                         isbnNumber: book.isbnNumber,
//                         price: book.price,
//                         language: book.language,
//                         genre: book.genre
//                     });
//                 }
//             })
//             .catch((error) => {
//                     console.error("Error - " + error);
//                 }
//             );
//     };
//
//     resetBook = () => {
//         this.setState(() => this.initialState);
//     };
//
//     // submitBook = (event) => {
//     //     event.preventDefault();
//     //
//     //     const book = {
//     //         title: this.state.title,
//     //         author: this.state.author,
//     //         coverPhotoURL: this.state.coverPhotoURL,
//     //         isbnNumber: this.state.isbnNumber,
//     //         price: this.state.price,
//     //         language: this.state.language
//     //     };
//     //
//     //     axios
//     //         .post("http://localhost:8086/rest/books", book)
//     //         .then(response => {
//     //             if (response.data != null) {
//     //                 this.setState({"show": true});
//     //                 setTimeout(() => this.setState({"show": false}), 2000);
//     //             } else {
//     //                 this.setState({"show": false});
//     //             }
//     //             console.log(book);
//     //         });
//     //
//     //     this.setState(this.initialState);
//     // };
//     //
//     // updateBook = (event) => {
//     //     event.preventDefault();
//     //
//     //     const book = {
//     //         id: this.state.id,
//     //         title: this.state.title,
//     //         author: this.state.author,
//     //         coverPhotoURL: this.state.coverPhotoURL,
//     //         isbnNumber: this.state.isbnNumber,
//     //         price: this.state.price,
//     //         language: this.state.language
//     //     };
//     //
//     //     axios
//     //         .put("http://localhost:8086/rest/books", book)
//     //         .then(response => {
//     //             if (response.data != null) {
//     //                 this.setState({"show": true, "method": "put"});
//     //                 setTimeout(() => this.setState({"show": false}), 2000);
//     //                 setTimeout(() => this.bookList(), 2000);
//     //             } else {
//     //                 this.setState({"show": false});
//     //                 console.log(book);
//     //             }
//     //         });
//     //
//     //     this.setState(this.initialState);
//     // }
//     //
//     // findBookById = (bookId) => {
//     //     axios.get("http://localhost:8086/rest/books/" + bookId)
//     //         .then(response => {
//     //             if (response.data != null) {
//     //                 this.setState({
//     //                     id: response.data.id,
//     //                     title: response.data.title,
//     //                     author: response.data.author,
//     //                     coverPhotoURL: response.data.coverPhotoURL,
//     //                     isbnNumber: response.data.isbnNumber,
//     //                     price: response.data.price,
//     //                     language: response.data.language
//     //                 });
//     //             }
//     //         }).catch((error) => {
//     //             console.error("Error - " + error);
//     //         }
//     //     );
//     // };
//
//     submitBook = (event) => {
//         event.preventDefault();
//
//         const book = {
//             title: this.state.title,
//             author: this.state.author,
//             coverPhotoURL: this.state.coverPhotoURL,
//             isbnNumber: this.state.isbnNumber,
//             price: this.state.price,
//             language: this.state.language,
//             genre: this.state.genre
//         };
//
//         this.props.saveBook(book);
//         setTimeout(() => {
//             if (this.props.bookObject.book != null) {
//                 this.setState({"show": true, "method": "post"});
//                 setTimeout(() => this.setState({"show": false}), 2000);
//             } else {
//                 this.setState({"show": false});
//             }
//         }, 200);
//         console.log(book);
//
//         // fetch("http://localhost:8086/rest/books", {
//         //     method: "POST",
//         //     headers: {"Content-Type": "application/json"},
//         //     body: JSON.stringify(book)
//         // })
//         //     .then(response => response.json)
//         //     .then((book) => {
//         //         if (book) {
//         //             this.setState({"show": true, "method": "post"});
//         //             setTimeout(() => this.setState({"show": false}), 2000);
//         //         } else {
//         //             this.setState({"show": false});
//         //         }
//         //         console.log(book);
//         //     });
//
//         this.setState(this.initialState);
//     };
//
//     updateBook = (event) => {
//         event.preventDefault();
//
//         const book = {
//             id: this.state.id,
//             title: this.state.title,
//             author: this.state.author,
//             coverPhotoURL: this.state.coverPhotoURL,
//             isbnNumber: this.state.isbnNumber,
//             price: this.state.price,
//             language: this.state.language,
//             genre: this.state.genre
//         };
//
//         this.props.updateBook(book);
//         setTimeout(() => {
//             if (this.props.bookObject.book != null) {
//                 this.setState({"show": true, "method": "put"});
//                 setTimeout(() => this.setState({"show": false}), 1000);
//                 setTimeout(() => this.bookList(), 1000);
//             } else {
//                 this.setState({"show": false});
//                 console.log("updateBook");
//             }
//         }, 100);
//
//         // fetch("http://localhost:8086/rest/books", {
//         //     method: "PUT",
//         //     headers: {"Content-Type": "application/json"},
//         //     body: JSON.stringify(book)
//         // })
//         //     .then(response => response.json())
//         //     .then((book) => {
//         //         if (book) {
//         //             this.setState({"show": true, "method": "put"});
//         //             setTimeout(() => this.setState({"show": false}), 1000);
//         //             setTimeout(() => this.bookList(), 1000);
//         //         } else {
//         //             this.setState({"show": false});
//         //             console.log(book);
//         //         }
//         //     });
//
//         this.setState(this.initialState);
//     }
//
//     bookChange = (event) => {
//         this.setState({
//             [event.target.name]: event.target.value
//         });
//     };
//
//     bookList = () => {
//         return this.props.history.push("/bookList");
//     };
//
//     render() {
//
//         const {title, author, coverPhotoURL, isbnNumber, price, language, genre} = this.state;
//
//         return (
//             <>
//
//                 <div style={{"display": this.state.show ? "block" : "none"}}>
//                     <MyToast
//                         show={this.state.show}
//                         message={this.state.method === "post" ? "Book Saved Successfully!!!" : "Book Edited Successfully!!!"}
//                         type={this.state.method === "post" ? "success" : "info"}
//                     />
//                 </div>
//
//                 <Card className="border border-dark bg-dark text-white">
//                     <Card.Header className="mt-2">
//                         <FontAwesomeIcon icon={this.state.id ? faEdit : faPlusSquare}/>
//                         {this.state.id ? " Edit Book" : " Add New Book"}
//                     </Card.Header>
//                     <Form onReset={this.resetBook} onSubmit={this.state.id ? this.updateBook : this.submitBook}
//                           id="bookFormId">
//                         {/*Card Body*/}
//                         <Card.Body>
//                             <Form.Row>
//                                 <Form.Group as={Col} controlid="formGridTitle">
//                                     <Form.Label>Title</Form.Label>
//                                     <Form.Control
//                                         required
//                                         autoComplete="off"
//                                         type="test"
//                                         name="title"
//                                         value={title}
//                                         onChange={this.bookChange}
//                                         className="bg-dark text-white"
//                                         placeholder="Enter Book Title"
//                                     />
//                                 </Form.Group>
//                                 <Form.Group as={Col} controlid="formGridAuthor">
//                                     <Form.Label>Author</Form.Label>
//                                     <Form.Control
//                                         required
//                                         autoComplete="off"
//                                         type="test"
//                                         name="author"
//                                         value={author}
//                                         onChange={this.bookChange}
//                                         className="bg-dark text-white"
//                                         placeholder="Enter Book Author"
//                                     />
//                                 </Form.Group>
//                             </Form.Row>
//                             <Form.Row>
//                                 <Form.Group as={Col} controlid="formGridCoverPhotoURL">
//                                     <Form.Label>Cover Photo URL</Form.Label>
//                                     <InputGroup>
//                                         <Form.Control
//                                             required autoComplete="off"
//                                             type="test" name="coverPhotoURL"
//                                             value={coverPhotoURL} onChange={this.bookChange}
//                                             className="bg-dark text-white"
//                                             placeholder="Enter Book Cover Photo URL"
//                                         />
//                                         <InputGroup.Append>
//                                             {
//                                                 this.state.coverPhotoURL !== "" &&
//                                                 <Image
//                                                     src={this.state.coverPhotoURL} roundedright="true"
//                                                     width="40" height="38"
//                                                 />
//                                             }
//                                         </InputGroup.Append>
//                                     </InputGroup>
//                                 </Form.Group>
//                                 <Form.Group as={Col} controlid="formGridISBNNumber">
//                                     <Form.Label>ISBN Number</Form.Label>
//                                     <Form.Control
//                                         required
//                                         autoComplete="off"
//                                         type="test"
//                                         name="isbnNumber"
//                                         value={isbnNumber}
//                                         onChange={this.bookChange}
//                                         className="bg-dark text-white"
//                                         placeholder="Enter Book ISBN Number"
//                                     />
//                                 </Form.Group>
//                             </Form.Row>
//                             <Form.Row>
//                                 <Form.Group as={Col} controlid="formGridPrice">
//                                     <Form.Label>Price</Form.Label>
//                                     <Form.Control
//                                         required autoComplete="off"
//                                         type="test" name="price"
//                                         value={price} onChange={this.bookChange}
//                                         className="bg-dark text-white"
//                                         placeholder="Enter Book Price"
//                                     />
//                                 </Form.Group>
//                                 <Form.Group as={Col} controlid="formGridLanguage">
//                                     <Form.Label>Language</Form.Label>
//                                     <Form.Control
//                                         required as="select"
//                                         custom onChange={this.bookChange}
//                                         name="language" value={language}
//                                         className="bg-dark text-white">
//                                         {
//                                             this.state.languages.map(language =>
//                                                 <option key={language.value} value={language.value}>
//                                                     {language.display}
//                                                 </option>
//                                             )
//                                         }
//                                     </Form.Control>
//                                 </Form.Group>
//                                 <Form.Group as={Col} controlid="formGridGenre">
//                                     <Form.Label>Genre</Form.Label>
//                                     <Form.Control
//                                         required as="select"
//                                         custom onChange={this.bookChange}
//                                         name="genre" value={genre}
//                                         className={"bg-dark text-white"}>
//                                         {
//                                             this.state.genres.map(genre =>
//                                                 <option key={genre.value} value={genre.value}>
//                                                     {genre.display}
//                                                 </option>
//                                             )
//                                         }
//                                     </Form.Control>
//                                 </Form.Group>
//                             </Form.Row>
//                         </Card.Body>
//                         {/*Card Body*/}
//                         {/*Card Footer*/}
//                         <Card.Footer style={{"textAlign": "right"}}>
//                             <Button size="sm" variant="success" type="submit">
//                                 <FontAwesomeIcon icon={faSave}/> {this.state.id ? "Edit" : "Save"}
//                             </Button>{" "}
//                             <Button size="sm" variant="danger" type="reset">
//                                 <FontAwesomeIcon icon={faUndo}/> Reset
//                             </Button>{" "}
//                             <Button size="sm" variant="info" type="button" onClick={this.bookList.bind()}>
//                                 <FontAwesomeIcon icon={faList}/> Book List
//                             </Button>
//                         </Card.Footer>
//                         {/*Card Footer*/}
//                     </Form>
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
//         saveBook: (book) => dispatch(saveBook(book)),
//         fetchBook: (bookId) => dispatch(fetchBook(bookId)),
//         updateBook: (book) => dispatch(updateBook(book)),
//         fetchLanguages: () => dispatch(fetchLanguages()),
//         fetchGenres: () => dispatch(fetchGenres())
//     };
// };
//
// export default connect(mapStateToProps, mapDispatchToProps)(Book);