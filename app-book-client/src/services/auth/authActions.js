import * as AT from "./authTypes";
import axios from "axios";

// Login qilish funksiyasi
export const authenticateUser = (email, password) => {
    const credentials = {
        email: email,
        password: password
    };
    return dispatch => {
        dispatch({
            type: AT.LOGIN_REQUEST
        });
        axios.post("http://localhost:8086/rest/user/authenticate", credentials)
            .then(response => {
                let token = response.data.token;
                localStorage.setItem("jwtToken", token);
                dispatch(success(true));
            })
            .catch(error => {
                dispatch(failure());
            })
    };
};

// Logout qilish funksiyasi
export const logoutUser = () => {
    return dispatch => {
        dispatch({
            type: AT.LOGOUT_REQUEST
        });
        localStorage.removeItem("jwtToken")
        dispatch(success(false));
    };
};

const success = (isLoggedIn) => {
    return {
        type: AT.SUCCESS,
        payload: isLoggedIn
    };
};

const failure = () => {
    return {
        type: AT.FAILURE,
        payload: false
    };
};