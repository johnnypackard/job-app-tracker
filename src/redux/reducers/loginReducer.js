import { combineReducers } from 'redux';
import { LOGIN_ACTIONS } from '../actions/loginActions';

const message = (state = '', action) => {
    switch (action.type) {
        case LOGIN_ACTIONS.CLEAR_LOGIN_ERROR:
            return '';
        case LOGIN_ACTIONS.LOGIN_FAILED: 
            return 'Your username and password didn\'t match.';
        case LOGIN_ACTIONS.LOGIN_FAILED_NO_CODE: 
            return 'Something went wrong on our end. Sorry!';
        case LOGIN_ACTIONS.INPUT_ERROR:
            return action.payload;
        default:
            return state;
    }
};

const isLoading = (state = false, action) => {
    switch (action.type) {
        case LOGIN_ACTIONS.REQUEST_START:
            return true;
        case LOGIN_ACTIONS.LOGIN_REQUEST_DONE:
            return false;
        default:
            return state;
    }
};

export default combineReducers({
    isLoading,
    message,
});