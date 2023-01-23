import { SET_LIGHT_THEME, SET_DARK_THEME } from '../actions/theme';

const INITIAL_STATE = {
    theme: 'dark'
};

const themeReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_LIGHT_THEME:
            return {
                ...state,
                theme: 'light'
            }
        case SET_DARK_THEME:
            return {
                ...state,
                theme: 'dark'
            }
        default:
            return state;
    }
};

export default themeReducer;