import {combineReducers} from "redux";
import userReducer from "./user/userReducer";
import bookReducer from "./book/bookReducer";
import authReducer from "./auth/authReducer";

const rootReducer = combineReducers({
    user: userReducer,
    book: bookReducer,
    auth: authReducer
});

export default rootReducer;