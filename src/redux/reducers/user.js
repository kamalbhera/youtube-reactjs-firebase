import { SET_USER, LOGOUT_USER, USER_IS_LOADING } from '../actions/user';

const INITIAL_STATE = {
    user: null,
    isLoading: true
};

const userReducer = (state = INITIAL_STATE, { type, payload }) => {
    switch (type) {
        case SET_USER:
            return {
                ...state,
                user: payload.user,
                isLoading: false
            };
        case USER_IS_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case LOGOUT_USER:
            return {
                ...state,
                user: null,
                isLoading: false
            };
        default:
            return state;
    }
};

export default userReducer;
