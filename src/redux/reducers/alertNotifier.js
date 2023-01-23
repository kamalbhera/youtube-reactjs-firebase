import { ALERT_ON, ALERT_OFF } from '../actions/alertNotifier';

const INITIAL_STATE = {
    isOpen: false,
    type: '',
    message: ''
};

const alertReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ALERT_ON:
            return {
                ...state,
                isOpen: true,
                type: action.payload.alertType,
                message: action.payload.message
            };
        case ALERT_OFF:
            return {
                ...state,
                isOpen: false,
                message: ''
            };
        default:
            return state;
    }
};

export default alertReducer;