import { LOADING, NOT_LOADING } from '../actions/loadingBar';

const INITIAL_STATE = {
    isLoading: false
};

const loadingReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOADING:
            return {
                ...state,
                isLoading: true
            };
        case NOT_LOADING:
            return {
                ...state,
                isLoading: false
            };
        default:
            return state;
    }
};

export default loadingReducer;